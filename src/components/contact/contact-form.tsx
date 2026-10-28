"use client";

import { useState, useTransition, type FormEvent } from "react";
import { submitContact } from "@/actions/contact";
import { site, whatsappHref } from "@/lib/site";
import { ui } from "@/lib/ui";

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setError("");

    startTransition(async () => {
      const result = await submitContact({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        message: String(data.get("message") ?? ""),
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      form.reset();
      setSent(true);
    });
  }

  return (
    <section className={`${ui.panel}`}>
      <h2 className={`${ui.sectionTitle} text-[clamp(1.75rem,3vw,2.25rem)]`}>
        Send a note
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
        Orders, wholesale, or studio questions. We reply by email — WhatsApp is
        faster if you need us today.
      </p>

      {sent ? (
        <div className="mt-8 border border-neutral-200 bg-neutral-50 px-5 py-10 text-center">
          <p className={`${ui.sectionTitle} text-[clamp(1.75rem,3vw,2.25rem)]`}>
            Received
          </p>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-neutral-600">
            We’ll reply to the email you left. For same-day help, message
            WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappHref(
                "Hi Yas Beauty Allure — following up on my note.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={`${ui.btnPrimary}`}
            >
              WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setSent(false)}
              className={`${ui.btnSecondary}`}
            >
              Send another
            </button>
          </div>
        </div>
      ) : (
        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={`${ui.fieldLabel}`}>
              Name
              <input
                name="name"
                required
                autoComplete="name"
                placeholder="Your name"
                className={`${ui.fieldInput}`}
              />
            </label>
            <label className={`${ui.fieldLabel}`}>
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@email.com"
                className={`${ui.fieldInput}`}
              />
            </label>
          </div>
          <label className={`${ui.fieldLabel}`}>
            Phone{" "}
            <span className="normal-case tracking-normal text-neutral-400">
              (optional)
            </span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder={site.phone}
              className={`${ui.fieldInput}`}
            />
          </label>
          <label className={`${ui.fieldLabel}`}>
            Message
            <textarea
              name="message"
              required
              minLength={12}
              rows={5}
              placeholder="An order, a booking question, or the day you want to visit."
              className={`${ui.fieldInput} resize-y`}
            />
          </label>

          {error ? (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={pending} className={`${ui.btnPrimary} w-full`}>
            {pending ? "Sending…" : "Send note"}
          </button>
        </form>
      )}
    </section>
  );
}