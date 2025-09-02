import { promises as fs } from "fs";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";
import { getObject } from "./getObject";

const streamPipeline = promisify(pipeline);

export async function downloadFile(
  userEmail: string,
  keyOrFileName: string,
  downloadDir: string,
): Promise<string> {
  const { body, s3Key } = await getObject(userEmail, keyOrFileName);

  if (!body || typeof (body as any).pipe !== "function") {
    throw new Error(`Unexpected Body type for key: ${s3Key}`);
  }

  await fs.mkdir(downloadDir, { recursive: true });
  const outputFilePath = path.join(downloadDir, path.basename(s3Key));

  const nodeFs = await import("fs");
  await streamPipeline(body as any, nodeFs.createWriteStream(outputFilePath));

  return outputFilePath;
}
