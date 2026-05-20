import { getMongoDb } from "../config/mongo-db";
import { FileController } from "./file.controller";
import { FileRepository } from "./file.repository";
import { FileService } from "./file.service";

export async function createFileController() {
  const db = await getMongoDb();

  const fileRepository = new FileRepository(db);
  const fileService = new FileService(fileRepository);
  const fileController = new FileController(fileService);

  return fileController;
}