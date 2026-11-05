import { ILibraryItem, ILibraryItemSummary, ILibraryPage } from "../model";

const API = process.env.NEXT_PUBLIC_API_HTTP;
const REVALIDATE_SECONDS = 300;
const TIMEOUT_MS = 5_000;
// The most the API gives per page
const SITEMAP_PAGE_SIZE = 48;

// For the first HTML, the same for everyone: anonymous and cached, what is personal the browser
// asks for itself. A slow or failed API only means the browser loads the content on its own
const load = async <T>(path: string): Promise<{ status: number; data: T | null }> => {
  try {
    const res = await fetch(`${API}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    return { status: res.status, data: res.ok ? ((await res.json()) as T) : null };
  } catch {
    return { status: 0, data: null };
  }
};

export const fetchLibraryPage = async (page: number, pageSize: number) =>
  (await load<ILibraryPage>(`/library?page=${page}&pageSize=${pageSize}`)).data;

export const fetchLibraryItem = (itemId: string) => load<ILibraryItem>(`/library/${encodeURIComponent(itemId)}`);

// Every published material, for the sitemap
export const fetchAllLibraryItems = async () => {
  const items: ILibraryItemSummary[] = [];

  for (let page = 1; ; page++) {
    const result = await fetchLibraryPage(page, SITEMAP_PAGE_SIZE);
    if (!result) return items;

    items.push(...result.items);
    if (result.items.length === 0 || items.length >= result.total) return items;
  }
};
