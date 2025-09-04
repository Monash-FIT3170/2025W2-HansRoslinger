import type { FileObject } from "../http/fileInterface";
import type { Uploads } from "types/application";
import { ACCEPTED_FILE_TYPES, FILE_TYPE_PNG } from "constants/application";


function getFileType(key: string): (typeof ACCEPTED_FILE_TYPES)[number] {
  if (key.endsWith(".png")) return "image/png";
  if (key.endsWith(".json")) return "application/json"; 
  return "application/octet-stream"; // fallback
}

function extractFileName(key: string): string {
  const parts = key.split("/");
  return parts[parts.length - 1];
}

export function transformS3FilesToUploads(files: FileObject[], baseUrl: string): Uploads {
  const uploads: Uploads = {};

  for (const file of files) {
    const fileType = getFileType(file.key);
    const assetId = file.key;

    uploads[assetId] = {
      name: extractFileName(file.key),
      type: fileType,
      src: `${baseUrl}/${file.key}`, 
      thumbnailSrc: fileType === FILE_TYPE_PNG
        ? `${baseUrl}/${file.key}`
        : undefined, 
    };
  }

  return uploads;
}
