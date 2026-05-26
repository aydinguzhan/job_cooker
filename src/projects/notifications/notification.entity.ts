export type INotificationPayload = {
    receiver_id: string;
    actor_id: string;
    type: IType;
    entity_type: string;
    entity_id: string;
    title?: string;
    message: string;
    created_at?: string;
  }

  export type IType = "like" | "comment" | "follow" | "mention" |"post_created";
