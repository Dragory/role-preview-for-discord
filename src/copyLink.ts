export async function copyLink(link: string) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Role Preview for Discord",
        url: link,
      });
    } catch (e) {}
    return;
  }

  const copy = (await import("copy-to-clipboard")).default;
  copy(link);
}
