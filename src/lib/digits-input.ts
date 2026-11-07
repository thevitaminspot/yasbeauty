/** Keep only digits — for money / stock fields while typing. */
export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}
