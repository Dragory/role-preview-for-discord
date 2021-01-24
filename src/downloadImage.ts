export async function downloadImage(dataUrl: string) {
  const filename = `roles-${Date.now()}.png`;

  // Native share
  if ((navigator as any).share) {
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], filename, { type: blob.type });
    const shareData = {
      files: [file],
    };

    if (!(navigator as any).canShare || (navigator as any).canShare(shareData)) {
      (navigator as any).share(shareData).catch(() => {});
      return;
    }
  }

  // Serve download
  const temp = document.createElement("a");
  temp.download = filename;
  temp.href = dataUrl;
  temp.click();
}
