// Mirrors backend YouTubeLink: the video id from the usual YouTube addresses, or null
const HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
  "www.youtu.be",
]);

const ID = /^[A-Za-z0-9_-]{11}$/;

export const getYouTubeId = (link: string | null | undefined): string | null => {
  if (!link?.trim()) return null;

  let url: URL;
  try {
    url = new URL(link.trim());
  } catch {
    return null;
  }
  if (!["https:", "http:"].includes(url.protocol) || !HOSTS.has(url.hostname.toLowerCase())) return null;

  const segments = url.pathname.split("/").filter(Boolean);
  const id = url.hostname.toLowerCase().endsWith("youtu.be")
    ? segments[0]
    : segments[0] === "watch"
      ? url.searchParams.get("v")
      : ["shorts", "embed", "live", "v"].includes(segments[0] ?? "")
        ? segments[1]
        : null;

  return id && ID.test(id) ? id : null;
};
