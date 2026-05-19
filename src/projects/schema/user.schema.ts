import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    first_name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
    last_name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
    email: z.string().email('Geçerli email giriniz'),
    password: z.string().min(8, 'Şifre en az 8 karakter olmalıdır'),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
