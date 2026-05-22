import type { Request, Response } from "express";
import type { FileService } from "./file.service";

export class FileController {
  constructor(private readonly fileService: FileService) {}

  async uploadProfileImage(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({
        message: "Image file is required",
      });
    }

    const result = await this.fileService.uploadImage({
      ownerType: "profile",
      ownerId: req.params.userId as string,
      file: req.file,
    });

    return res.status(201).json({
      message: "Profile image uploaded successfully",
      data: result,
    });
  }

  async uploadPostImage(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({
        message: "Image file is required",
      });
    }

    const result = await this.fileService.uploadImage({
      ownerType: "post",
      ownerId: req.params.postId as string,
      file: req.file,
    });

    return res.status(201).json({
      message: "Post image uploaded successfully",
      data: result,
    });
  }

  async getImage(req: Request, res: Response) {
    try {
      const { stream, mimeType } = await this.fileService.getImage(
        req.params.fileId as string
      );

      res.setHeader("Content-Type", mimeType);

      stream.on("error", () => {
        return res.status(404).json({
          message: "Image not found",
        });
      });

      stream.pipe(res);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Image could not be loaded";
      const statusCode = message === "Invalid file id" ? 400 : 404;

      return res.status(statusCode).json({ message });
    }
  }
}
