import type { FileRepository } from "./file.repository";
import type { UploadImageParams } from "./file.entitiy";
import { ObjectId } from "mongodb";

export class FileService {
  constructor(private readonly fileRepository: FileRepository) {}

  async uploadImage(params: UploadImageParams) {
    const { file, ownerType, ownerId } = params;

    if (!file.mimetype.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    const fileId = await this.fileRepository.uploadFile(file, {
      ownerType,
      ownerId,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      createdAt: new Date(),
    });

    return {
      fileId: fileId.toString(),
      url: `/files/${fileId.toString()}`,
    };
  }

  async getImage(fileId: string) {
    if (!ObjectId.isValid(fileId)) {
      throw new Error("Invalid file id");
    }

    const file = await this.fileRepository.getFileMetadata(fileId);

    if (!file) {
      throw new Error("Image not found");
    }

    return {
      stream: await this.fileRepository.openDownloadStream(fileId),
      mimeType: file.metadata?.mimeType ?? "application/octet-stream",
    };
  }
}
