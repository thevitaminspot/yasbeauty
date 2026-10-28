"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { deleteProduct, saveProduct } from "@/actions/admin";
import {
  adminField,
  adminGhostBtn,
  adminLabel,
  adminPrimaryBtn,
} from "@/components/admin/form-styles";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { PaginatedTableWrap } from "@/components/admin/paginated-table-wrap";
import { AdminEmptyState, AdminPanel } from "@/components/admin/ui";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Modal } from "@/components/ui/modal";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import { formatNaira } from "@/lib/format";
import type { Product, ProductCategory } from "@/lib/product-types";

const categories: { value: ProductCategory; label: string }[] = [
  { value: "lip-pigments", label: "Lip pigments" },
  { value: "brow-pigments", label: "Brow pigments" },
  { value: "aftercare", label: "Aftercare" },
];

type Draft = {
  id?: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: string;
  volume: string;
  stock: string;
  tagline: string;
  description: string;
  image: string;
  shade: string;
  ingredients: string;
  usage: string;
  cautionsText: string;
  featured: boolean;
  bestseller: boolean;
};

function emptyDraft(): Draft {
  return {
    name: "",
    slug: "",
    category: "lip-pigments",
    price: "18500",
    volume: "10ml",
    stock: "24",
    tagline: "",
    description: "",
    image: "",
    shade: "",
    ingredients: "",
    usage: "",
    cautionsText: "For professional use only.",
    featured: false,
    bestseller: false,
  };
}

function fromProduct(product: Product): Draft {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    price: String(product.price),
    volume: product.volume,
    stock: String(product.stock ?? 0),
    tagline: product.tagline,
    description: product.description,
    image: product.image,
    shade: product.shade ?? "",
    ingredients: product.ingredients,
    usage: product.usage,
    cautionsText: product.cautions.join("\n"),
    featured: Boolean(product.featured),
    bestseller: Boolean(product.bestseller),
  };
}

function stockLabel(stock: number) {
  if (stock <= 0) return "Out of stock";
  if (stock === 1) return "1 left";
  return `${stock} left`;
}

export function ProductsManager({ products }: { products: Product[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      `${p.name} ${p.slug} ${p.category} ${p.tagline}`.toLowerCase().includes(q),
    );
  }, [products, query]);

  const pagination = usePaginatedList(filtered, query);

  function openCreate() {
    setMessage("");
    setFormError("");
    setDraft(emptyDraft());
  }

  function openEdit(product: Product) {
    setMessage("");
    setFormError("");
    setDraft(fromProduct(product));
  }

  function closeDraft() {
    if (pending) return;
    setFormError("");
    setDraft(null);
  }

  function save() {
    if (!draft) return;
    if (!draft.image.trim()) {
      setFormError("Upload a product image before saving.");
      return;
    }
    setFormError("");
    start(async () => {
      const result = await saveProduct({
        id: draft.id,
        name: draft.name,
        slug: draft.slug,
        category: draft.category,
        price: Number(draft.price),
        volume: draft.volume,
        stock: Number(draft.stock),
        tagline: draft.tagline,
        description: draft.description,
        image: draft.image,
        shade: draft.shade,
        ingredients: draft.ingredients,
        usage: draft.usage,
        cautionsText: draft.cautionsText,
        featured: draft.featured,
        bestseller: draft.bestseller,
      });
      if (!result.ok) {
        setFormError(result.error);
        return;
      }
      setMessage(draft.id ? "Product updated." : "Product added.");
      setDraft(null);
      router.refresh();
    });
  }

  function remove(product: Product) {
    setMessage("");
    setDeleteError("");
    start(async () => {
      const result = await deleteProduct(product.id);
      if (!result.ok) {
        setDeleteError(result.error);
        return;
      }
      if (draft?.id === product.id) setDraft(null);
      setDeleteTarget(null);
      setMessage(`${product.name} deleted.`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full max-w-sm border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-black"
        />
        <button type="button" onClick={openCreate} className={adminPrimaryBtn}>
          Add product
        </button>
      </div>

      {message ? <p className="text-sm text-neutral-700">{message}</p> : null}

      <Modal
        open={Boolean(draft)}
        onClose={closeDraft}
        title={draft?.id ? "Edit product" : "New product"}
        size="xl"
        footer={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              className={adminGhostBtn}
              disabled={pending}
              onClick={closeDraft}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={pending || !draft}
              onClick={save}
              className={adminPrimaryBtn}
            >
              {pending ? "Saving…" : "Save product"}
            </button>
          </div>
        }
      >
        {draft ? (
          <div className="grid gap-4 md:grid-cols-2">
            <ImageUploadField
              value={draft.image}
              onChange={(image) => setDraft({ ...draft, image })}
            />
            <label className={adminLabel}>
              Name
              <input
                className={adminField}
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label className={adminLabel}>
              Slug
              <input
                className={adminField}
                value={draft.slug}
                placeholder="auto from name"
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              />
            </label>
            <label className={adminLabel}>
              Category
              <select
                className={adminField}
                value={draft.category}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    category: e.target.value as ProductCategory,
                  })
                }
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={adminLabel}>
              Price (₦)
              <input
                type="number"
                min={100}
                step={100}
                className={adminField}
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: e.target.value })}
              />
            </label>
            <label className={adminLabel}>
              Volume
              <input
                className={adminField}
                value={draft.volume}
                onChange={(e) => setDraft({ ...draft, volume: e.target.value })}
              />
            </label>
            <label className={adminLabel}>
              Units remaining
              <input
                type="number"
                min={0}
                step={1}
                className={adminField}
                value={draft.stock}
                onChange={(e) => setDraft({ ...draft, stock: e.target.value })}
              />
            </label>
            <label className={adminLabel}>
              Shade
              <input
                className={adminField}
                value={draft.shade}
                onChange={(e) => setDraft({ ...draft, shade: e.target.value })}
              />
            </label>
            <label className={`${adminLabel} md:col-span-2`}>
              Tagline
              <input
                className={adminField}
                value={draft.tagline}
                onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
              />
            </label>
            <label className={`${adminLabel} md:col-span-2`}>
              Description
              <textarea
                rows={3}
                className={adminField}
                value={draft.description}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
              />
            </label>
            <label className={`${adminLabel} md:col-span-2`}>
              Ingredients
              <textarea
                rows={2}
                className={adminField}
                value={draft.ingredients}
                onChange={(e) =>
                  setDraft({ ...draft, ingredients: e.target.value })
                }
              />
            </label>
            <label className={`${adminLabel} md:col-span-2`}>
              Usage
              <textarea
                rows={2}
                className={adminField}
                value={draft.usage}
                onChange={(e) => setDraft({ ...draft, usage: e.target.value })}
              />
            </label>
            <label className={`${adminLabel} md:col-span-2`}>
              Cautions (one per line)
              <textarea
                rows={3}
                className={adminField}
                value={draft.cautionsText}
                onChange={(e) =>
                  setDraft({ ...draft, cautionsText: e.target.value })
                }
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) =>
                  setDraft({ ...draft, featured: e.target.checked })
                }
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={draft.bestseller}
                onChange={(e) =>
                  setDraft({ ...draft, bestseller: e.target.checked })
                }
              />
              Bestseller
            </label>
            {formError ? (
              <p className="md:col-span-2 text-sm text-red-600" role="alert">
                {formError}
              </p>
            ) : null}
          </div>
        ) : null}
      </Modal>

      {filtered.length === 0 ? (
        <AdminPanel>
          <AdminEmptyState>No products match.</AdminEmptyState>
        </AdminPanel>
      ) : (
        <PaginatedTableWrap pagination={pagination.tablePaginationProps("products")}>
          <ul className="divide-y divide-neutral-100">
            {pagination.visible.map((product) => (
              <li
                key={product.id}
                className="flex flex-wrap items-center gap-4 px-5 py-4"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-neutral-100">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="mt-0.5 text-sm text-neutral-500">
                    {product.category} · {formatNaira(product.price)}
                  </p>
                </div>
                <p
                  className={`shrink-0 text-sm tabular-nums ${
                    product.stock <= 0
                      ? "text-red-600"
                      : product.stock <= 5
                        ? "text-amber-700"
                        : "text-neutral-700"
                  }`}
                >
                  {stockLabel(product.stock)}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={pending}
                    className={adminGhostBtn}
                    onClick={() => openEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    className={adminGhostBtn}
                    onClick={() => {
                      setDeleteError("");
                      setDeleteTarget(product);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </PaginatedTableWrap>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => {
          if (pending) return;
          setDeleteError("");
          setDeleteTarget(null);
        }}
        onConfirm={() => {
          if (deleteTarget) remove(deleteTarget);
        }}
        title="Delete this product?"
        detail={
          deleteTarget ? (
            <>
              <p className="font-medium text-black">{deleteTarget.name}</p>
              <p className="mt-1 text-neutral-500">
                {formatNaira(deleteTarget.price)} · {deleteTarget.category}
              </p>
            </>
          ) : null
        }
        description={
          <>
            This permanently removes <strong>{deleteTarget?.name}</strong> from
            the catalogue. This cannot be undone.
          </>
        }
        confirmLabel="Delete product"
        cancelLabel="Keep product"
        pending={pending}
        pendingLabel="Deleting…"
        error={deleteError || undefined}
      />
    </div>
  );
}
