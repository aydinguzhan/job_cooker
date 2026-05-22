import { Db, GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "node:stream";
import type { FileMetadata } from "./file.entitiy";

export class FileRepository {
  private bucket: GridFSBucket;

  constructor(private readonly db: Db) {
    this.bucket = new GridFSBucket(db, {
      bucketName: "uploads",
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    metadata: FileMetadata
  ): Promise<ObjectId> {
    const readable = Readable.from(file.buffer);

    return new Promise<ObjectId>((resolve, reject) => {
      const uploadStream = this.bucket.openUploadStream(file.originalname, {
        metadata,
      });

      readable
        .pipe(uploadStream)
        .on("error", reject)
        .on("finish", () => {
          resolve(uploadStream.id as ObjectId);
        });
    });
  }

  async openDownloadStream(fileId: string) {
    return this.bucket.openDownloadStream(new ObjectId(fileId));
  }

  async getFileMetadata(fileId: string) {
    return this.db.collection("uploads.files").findOne<{
      _id: ObjectId;
      metadata?: FileMetadata;
    }>({
      _id: new ObjectId(fileId),
    });
  }
}
