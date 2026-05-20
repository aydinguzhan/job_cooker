export type FileOwnerType = "profile" | "post";

export type UploadImageParams = {
  ownerType: FileOwnerType;
  ownerId: string;
  file: Express.Multer.File;
};

export type FileMetadata = {
  ownerType: FileOwnerType;
  ownerId: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: Date;
};