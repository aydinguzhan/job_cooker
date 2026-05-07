import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Başlık en az 2 karakter olmalıdır'),
    constent: z.string().min(2, 'İçerik en az 2 karakter olmalıdır'),
    user_id: z.string(),
  }),
});

export type ICreatePost = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
  title: z.string().min(2, 'Başlık en az 2 karakter olmalıdır'),
  constent: z.string().min(2, 'İçerik en az 2 karakter olmalıdır'),
});
