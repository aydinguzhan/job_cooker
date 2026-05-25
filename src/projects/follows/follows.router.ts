import express from "express";
import { followsController } from "./follows.module";
import { authMiddleware } from "../../middleware/auth.middeware";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/suggestions",
  followsController.getSuggestions.bind(followsController)
);

router.get(
  "/followers",
  followsController.getFollowers.bind(followsController)
);

router.get(
  "/followings",
  followsController.getFollowings.bind(followsController)
);

router.post(
  "/:followingId",
  followsController.follow.bind(followsController)
);

router.delete(
  "/:followingId",
  followsController.unfollow.bind(followsController)
);

export default router;