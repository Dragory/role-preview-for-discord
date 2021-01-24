export async function htmlToImage(element: HTMLElement): Promise<string> {
  const htmlToImage = await import("html-to-image");
  return htmlToImage.toPng(element, {
    backgroundColor: "transparent",
  });
}
