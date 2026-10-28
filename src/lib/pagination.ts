export const PAGE_SIZE = 10;

export function totalPages(count: number, pageSize = PAGE_SIZE) {
  return Math.max(1, Math.ceil(count / pageSize));
}

export function clampPage(page: number, pages: number) {
  return Math.min(Math.max(1, page), pages);
}

export function pageRange(page: number, pageSize = PAGE_SIZE, total: number) {
  if (total === 0) return { from: 0, to: 0 };
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return { from, to };
}
