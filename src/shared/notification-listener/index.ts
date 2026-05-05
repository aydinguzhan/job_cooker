// notification.events.ts
import notifcationController from "../../notifications/notification.module";
import { eventBus } from "../notifications/index";


eventBus.on("create.post", async (data) => {
    
  await notifcationController.createNewNotification({
    receiverId: data.receiver_id,
    actorId: data.actor_id,
    type: "COMMENT_CREATED",
    entityType: "post",
    entityId: data.entity_id,
    message: "Someone commented on your post.",
  });
});