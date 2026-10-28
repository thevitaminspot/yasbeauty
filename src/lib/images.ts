import "server-only";
import { createHash } from "node:crypto";

function cloudinaryConfig() {
  const raw = process.env.CLOUDINARY_URL;
  if (!raw) return null;
  const match = raw.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!match) return null;
  return {
    apiKey: decodeURIComponent(match[1]),
    apiSecret: decodeURIComponent(match[2]),
    cloudName: match[3],
  };
}

export async function uploadImage(file: File, folder = "yasbeauty") {
  const config = cloudinaryConfig();
  if (!config) {
    return {
      error: "Image uploads aren't available right now. Try again later.",
    };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "That file is not an image." };
  }
  if (file.size > 8_000_000) {
    return { error: "Image must be under 8MB." };
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${config.apiSecret}`)
    .digest("hex");

  const body = new FormData();
  body.append("file", file, file.name || "image.jpg");
  body.append("api_key", config.apiKey);
  body.append("timestamp", String(timestamp));
  body.append("signature", signature);
  body.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    { method: "POST", body },
  );

  const payload = (await response.json()) as {
    secure_url?: string;
    error?: { message?: string };
  };

  if (!response.ok || !payload.secure_url) {
    return {
      error:
        payload.error?.message ??
        "Couldn't upload that image. Try another file.",
    };
  }

  return { url: payload.secure_url };
}
