type Tone = "neutral" | "progress" | "success" | "danger";

const tones: Record<Tone, string> = {
  neutral: "border-neutral-300 bg-neutral-50 text-neutral-700",
  progress: "border-neutral-800 bg-neutral-900 text-white",
  success: "border-emerald-700/30 bg-emerald-50 text-emerald-900",
  danger: "border-red-300 bg-red-50 text-red-800",
};

export function StatusPill({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${tones[tone]}`}
    >
      {label}
    </span>
  );
}

export function fulfillmentTone(
  status: string,
): Tone {
  if (status === "delivered") return "success";
  if (status === "sent" || status === "packed") return "progress";
  return "neutral";
}

export function bookingTone(
  status: string,
): Tone {
  if (status === "cancelled") return "danger";
  if (status === "completed") return "success";
  if (status === "confirmed") return "progress";
  return "neutral";
}
