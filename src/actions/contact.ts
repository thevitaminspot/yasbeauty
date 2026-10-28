"use server";

import { appendMessage } from "@/lib/messages-store";

export async function submitContact(input: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const phone = input.phone?.trim() ?? "";
  const message = input.message?.trim() ?? "";

  if (name.length < 2) {
    return { error: "Enter your name." };
  }
  if (!email.includes("@")) {
    return { error: "Enter a valid email." };
  }
  if (message.length < 12) {
    return { error: "Write a little more so we know how to help." };
  }

  await appendMessage({ name, email, phone, message });
  return { ok: true as const };
}
