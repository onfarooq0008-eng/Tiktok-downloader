function triggerDownload(blob: Blob, name: string) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 4000);
}

async function blobFrom(url: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("The file host refused the download.");
  const type = response.headers.get("content-type") || "";
  if (type.includes("text/html") || type.includes("application/json")) {
    throw new Error("The file host refused the download.");
  }
  return response.blob();
}

export async function saveRemoteFile(url: string, name: string) {
  try {
    triggerDownload(await blobFrom(url), name);
    return;
  } catch {
    // Direct CDN fetches fail from some networks. Fall back to our proxy.
  }
  const proxied = `/api/media?${new URLSearchParams({ src: url, name })}`;
  const response = await fetch(proxied);
  if (!response.ok) {
    let message = "Couldn’t save that file. Try again.";
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // keep the default
    }
    throw new Error(message);
  }
  triggerDownload(await response.blob(), name);
}
