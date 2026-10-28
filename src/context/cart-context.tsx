"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { Product } from "@/lib/product-types";

export type CartLine = {
  product: Product;
  quantity: number;
};

type CartActions = {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  syncProductPrices: (catalog: Product[]) => void;
};

type CartContextValue = CartActions & {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  /** False until this consumer has taken the client cart snapshot */
  ready: boolean;
};

const CartActionsContext = createContext<CartActions | null>(null);

const STORAGE_KEY = "yasbeauty-cart-v1";
const EMPTY: CartLine[] = [];

type CartStore = {
  lines: CartLine[];
  hydrated: boolean;
};

const SERVER_SNAPSHOT: CartStore = { lines: EMPTY, hydrated: false };
let store: CartStore = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function readStoredCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    return EMPTY;
  }
}

function persist(lines: CartLine[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* ignore quota / private mode */
  }
}

function ensureHydrated() {
  if (store.hydrated || typeof window === "undefined") return;
  const lines = readStoredCart();
  store = {
    lines: lines.length === 0 ? EMPTY : lines,
    hydrated: true,
  };
}

function setStoreLines(next: CartLine[] | ((prev: CartLine[]) => CartLine[])) {
  ensureHydrated();
  const lines = typeof next === "function" ? next(store.lines) : next;
  const normalized = lines.length === 0 ? EMPTY : lines;
  store = { lines: normalized, hydrated: true };
  persist(normalized);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getClientSnapshot(): CartStore {
  ensureHydrated();
  return store;
}

function getServerSnapshot(): CartStore {
  return SERVER_SNAPSHOT;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const addItem = useCallback((product: Product, quantity = 1) => {
    const stock = Math.max(0, Math.floor(product.stock ?? 0));
    if (stock <= 0) return;

    setStoreLines((prev) => {
      const existing = prev.find((l) => l.product.id === product.id);
      if (existing) {
        return prev.map((l) =>
          l.product.id === product.id
            ? {
                ...l,
                product,
                quantity: Math.min(l.quantity + quantity, stock),
              }
            : l,
        );
      }
      return [
        ...prev,
        { product, quantity: Math.min(Math.max(quantity, 1), stock) },
      ];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setStoreLines((prev) => prev.filter((l) => l.product.id !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    setStoreLines((prev) =>
      prev.map((l) => {
        if (l.product.id !== productId) return l;
        const stock = Math.max(0, Math.floor(l.product.stock ?? 0));
        const capped =
          stock > 0 ? Math.min(quantity, stock) : Math.max(quantity, 1);
        return { ...l, quantity: capped };
      }),
    );
  }, []);

  const clearCart = useCallback(() => setStoreLines(EMPTY), []);

  const syncProductPrices = useCallback((catalog: Product[]) => {
    const byId = new Map(catalog.map((p) => [p.id, p]));
    setStoreLines((prev) => {
      let changed = false;
      const next: CartLine[] = [];
      for (const line of prev) {
        const latest = byId.get(line.product.id);
        if (!latest) {
          changed = true;
          continue;
        }
        const stock = Math.max(0, Math.floor(latest.stock ?? 0));
        if (stock <= 0) {
          changed = true;
          continue;
        }
        const quantity = Math.min(line.quantity, stock);
        if (
          latest.price !== line.product.price ||
          latest.stock !== line.product.stock ||
          quantity !== line.quantity
        ) {
          changed = true;
          next.push({ product: latest, quantity });
        } else {
          next.push(line);
        }
      }
      return changed ? next : prev;
    });
  }, []);

  const actions = useMemo(
    () => ({
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      syncProductPrices,
    }),
    [addItem, removeItem, setQuantity, clearCart, syncProductPrices],
  );

  return (
    <CartActionsContext.Provider value={actions}>
      {children}
    </CartActionsContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const actions = useContext(CartActionsContext);
  if (!actions) throw new Error("useCart must be used within CartProvider");

  // Subscribe per consumer so selective hydration always matches SSR
  // (empty cart) until this component finishes hydrating.
  const snapshot = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const itemCount = useMemo(
    () => snapshot.lines.reduce((sum, l) => sum + l.quantity, 0),
    [snapshot.lines],
  );

  const subtotal = useMemo(
    () =>
      snapshot.lines.reduce(
        (sum, l) => sum + l.product.price * l.quantity,
        0,
      ),
    [snapshot.lines],
  );

  return {
    ...actions,
    lines: snapshot.lines,
    itemCount,
    subtotal,
    ready: snapshot.hydrated,
  };
}
