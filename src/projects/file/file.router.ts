import { Router } from "express";
import { createFileController } from "./file.module";
import { uploadImage } from "../../middleware/fileUpload.middleware";

const fileRouter = Router();

let fileController: Awaited<ReturnType<typeof createFileController>>;

(async () => {
  fileController = await createFileController();

  fileRouter.post(
    "/profile/:userId/image",
    uploadImage.single("image"),
    fileController.uploadProfileImage.bind(fileController)
  );

  fileRouter.post(
    "/posts/:postId/image",
    uploadImage.single("image"),
    fileController.uploadPostImage.bind(fileController)
  );

  fileRouter.get(
    "/:fileId",
    fileController.getImage.bind(fileController)
  );
})();

export default fileRouter;