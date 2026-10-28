/** Paystack InlineJS (Popup v2) helpers — load once, resume with server access_code. */

const PAYSTACK_INLINE_SRC = "https://js.paystack.co/v2/inline.js";

type PaystackCallbacks = {
  onSuccess?: (transaction: { reference: string; message?: string }) => void;
  onCancel?: () => void;
  onError?: (error: { message: string }) => void;
  onLoad?: (response: unknown) => void;
};

type PaystackPopInstance = {
  resumeTransaction: (
    accessCode: string,
    callbacks?: PaystackCallbacks,
  ) => void;
};

type PaystackPopConstructor = new () => PaystackPopInstance;

declare global {
  interface Window {
    PaystackPop?: PaystackPopConstructor;
  }
}

let scriptPromise: Promise<PaystackPopConstructor> | null = null;

function loadPaystackPop(): Promise<PaystackPopConstructor> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Paystack can only run in the browser."));
  }
  if (window.PaystackPop) {
    return Promise.resolve(window.PaystackPop);
  }
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${PAYSTACK_INLINE_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => {
        if (window.PaystackPop) resolve(window.PaystackPop);
        else reject(new Error("Paystack failed to load."));
      });
      existing.addEventListener("error", () =>
        reject(new Error("Paystack failed to load.")),
      );
      if (window.PaystackPop) resolve(window.PaystackPop);
      return;
    }

    const script = document.createElement("script");
    script.src = PAYSTACK_INLINE_SRC;
    script.async = true;
    script.onload = () => {
      if (window.PaystackPop) resolve(window.PaystackPop);
      else reject(new Error("Paystack failed to load."));
    };
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Paystack failed to load."));
    };
    document.body.appendChild(script);
  });

  return scriptPromise;
}

/** Open Paystack checkout for a server-initialized transaction. */
export async function openPaystackCheckout(
  accessCode: string,
  callbacks: PaystackCallbacks,
): Promise<void> {
  const PaystackPop = await loadPaystackPop();
  const popup = new PaystackPop();
  popup.resumeTransaction(accessCode, callbacks);
}
