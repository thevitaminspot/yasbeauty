export type DeliveryZone = "abuja" | "nigeria" | "international";

export type FulfillmentStatus =
  | "confirmed"
  | "packed"
  | "sent"
  | "delivered";

export type AbujaArea = {
  id: string;
  name: string;
  /** Delivery fee in Naira */
  price: number;
};

export type DeliverySettings = {
  abujaAreas: AbujaArea[];
  /** Delivery fee outside Abuja (still in Nigeria), Naira */
  outOfAbujaPrice: number;
  /** International delivery fee, Naira */
  internationalPrice: number;
};

export type OrderDelivery = {
  zone: DeliveryZone;
  areaId?: string;
  areaName: string;
  fee: number;
};

export const fulfillmentStatuses: {
  value: FulfillmentStatus;
  label: string;
}[] = [
  { value: "confirmed", label: "Confirmed" },
  { value: "packed", label: "Packed" },
  { value: "sent", label: "Sent for delivery" },
  { value: "delivered", label: "Delivered" },
];

/** Major FCT / Abuja delivery locations with suggested fees (₦). */
export const majorAbujaAreas: AbujaArea[] = [
  // Central / Phase 1–2
  { id: "asokoro", name: "Asokoro", price: 3000 },
  { id: "maitama", name: "Maitama", price: 3000 },
  { id: "guzape", name: "Guzape", price: 3000 },
  { id: "wuse", name: "Wuse", price: 2500 },
  { id: "wuse-2", name: "Wuse 2", price: 2500 },
  { id: "garki", name: "Garki", price: 2500 },
  { id: "garki-2", name: "Garki 2", price: 2500 },
  { id: "cbd", name: "Central Business District", price: 2500 },
  { id: "three-arms-zone", name: "Three Arms Zone", price: 3000 },
  { id: "utako", name: "Utako", price: 2500 },
  { id: "jabi", name: "Jabi", price: 2500 },
  { id: "wuye", name: "Wuye", price: 2500 },
  { id: "durumi", name: "Durumi", price: 2800 },
  { id: "mabushi", name: "Mabushi", price: 3000 },
  { id: "katampe", name: "Katampe", price: 3200 },
  { id: "katampe-extension", name: "Katampe Extension", price: 3200 },
  { id: "jahi", name: "Jahi", price: 3200 },
  { id: "kado", name: "Kado", price: 3000 },
  { id: "lifecamp", name: "Life Camp", price: 3200 },
  { id: "gwarinpa", name: "Gwarinpa", price: 3500 },
  { id: "dakibiyu", name: "Dakibiyu", price: 3200 },
  { id: "mbora", name: "Mbora", price: 3500 },
  { id: "kaura", name: "Kaura", price: 3200 },
  { id: "duboyi", name: "Duboyi", price: 3200 },
  { id: "apo", name: "Apo", price: 3500 },
  { id: "apo-legislative", name: "Apo Legislative Quarters", price: 3500 },
  { id: "gaduwa", name: "Gaduwa", price: 3800 },
  { id: "lokogoma", name: "Lokogoma", price: 4000 },
  { id: "galadimawa", name: "Galadimawa", price: 4000 },
  { id: "games-village", name: "Games Village", price: 3500 },
  { id: "wumba", name: "Wumba", price: 3800 },
  { id: "pyakasa", name: "Pyakasa", price: 4000 },
  { id: "airport-road", name: "Airport Road", price: 4000 },
  { id: "lugbe", name: "Lugbe", price: 4000 },
  { id: "sauka", name: "Sauka", price: 4200 },
  { id: "idu", name: "Idu", price: 4000 },
  { id: "karsana", name: "Karsana", price: 4000 },
  { id: "dawaki", name: "Dawaki", price: 3800 },
  { id: "kubwa", name: "Kubwa", price: 4000 },
  { id: "bwari", name: "Bwari", price: 4500 },
  { id: "dutse", name: "Dutse", price: 4500 },
  { id: "mpape", name: "Mpape", price: 4500 },
  { id: "dei-dei", name: "Dei-Dei", price: 4500 },
  { id: "zuba", name: "Zuba", price: 5000 },
  { id: "gwagwalada", name: "Gwagwalada", price: 5500 },
  { id: "kuje", name: "Kuje", price: 5500 },
  { id: "kwali", name: "Kwali", price: 6000 },
  { id: "abaji", name: "Abaji", price: 6500 },
  { id: "nyanya", name: "Nyanya", price: 4500 },
  { id: "karu", name: "Karu", price: 4500 },
  { id: "mararaba", name: "Mararaba", price: 5000 },
  { id: "orozo", name: "Orozo", price: 5000 },
  { id: "karshi", name: "Karshi", price: 5000 },
  { id: "jiwa", name: "Jiwa", price: 4200 },
  { id: "sabon-lugbe", name: "Sabon Lugbe", price: 4200 },
  { id: "other-abuja", name: "Other Abuja area", price: 3500 },
];

export const defaultDeliverySettings: DeliverySettings = {
  abujaAreas: majorAbujaAreas,
  outOfAbujaPrice: 6500,
  internationalPrice: 45000,
};

function areaKey(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, " ");
}

/** Add any major areas missing from the current list (keeps existing fees). */
export function mergeMajorAbujaAreas(areas: AbujaArea[]): AbujaArea[] {
  const byId = new Map(areas.map((a) => [a.id, a]));
  const byName = new Set(areas.map((a) => areaKey(a.name)));

  const merged = [...areas];
  for (const major of majorAbujaAreas) {
    if (byId.has(major.id) || byName.has(areaKey(major.name))) continue;
    merged.push(major);
    byId.set(major.id, major);
    byName.add(areaKey(major.name));
  }

  return merged.sort((a, b) => a.name.localeCompare(b.name, "en"));
}

export function fulfillmentLabel(status: string): string {
  return (
    fulfillmentStatuses.find((s) => s.value === status)?.label ?? status
  );
}

export function normalizeFulfillmentStatus(
  status: string | null | undefined,
): FulfillmentStatus {
  if (
    status === "confirmed" ||
    status === "packed" ||
    status === "sent" ||
    status === "delivered"
  ) {
    return status;
  }
  // Legacy Paystack payment statuses → first workflow step
  if (
    status === "success" ||
    status === "paid" ||
    status === "SUCCESS" ||
    status === "PAID"
  ) {
    return "confirmed";
  }
  return "confirmed";
}

export function newAbujaArea(name: string, price: number): AbujaArea {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return {
    id: `${base || "area"}-${Math.random().toString(36).slice(2, 6)}`,
    name: name.trim(),
    price: Math.max(0, Math.round(price)),
  };
}
