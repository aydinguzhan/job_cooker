export type NotificationQueueJob = {
  type: 'like' | 'comment' | 'follow' | 'mention' | 'post_created';
  receiver_id: string;
  actor_id: string;
  entity_type: 'post' | 'comment';
  entity_id: string;
  message: string;
  title?:string
};

export type EmailNotificationJob = {
  type: 'POST_CREATED' | 'COMMENT_CREATED' | 'POST_LIKED';
  receiver_id: string;
  actor_id: string;
  entity_type: 'post' | 'comment';
  entity_id: string;
  message: string;
  title?: string;
};
