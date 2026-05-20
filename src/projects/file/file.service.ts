import type { FileRepository } from "./file.repository";
import type { UploadImageParams } from "./file.entitiy";

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

  getImageStream(fileId: string) {
    return this.fileRepository.openDownloadStream(fileId);
  }
}