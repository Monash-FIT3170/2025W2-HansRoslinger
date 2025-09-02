export interface FileUpload {
  path: string;
}
export interface UploadResult {
  fileName: string;
  s3Key?: string;
  success: boolean;
  etag?: string;
  location?: string;
  size?: number;
  error?: string;
}
export interface FileObject {
  key: string;
  size: number;
  lastModified: Date;
  etag: string;
  url: string;
}
