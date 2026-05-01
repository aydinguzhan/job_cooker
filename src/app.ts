import express from 'express';
import { errorHandler } from './middleware/error.middleware';
import userRouter from './user/user.router';
import authRouter from './auth/auth.router';
import profileRouter from './profile/profile.router';
import { checkDbConnection } from './config/db-check';
import postsRouter from './posts/posts.router';
(async () => await checkDbConnection())();
const app = express();

app.use(errorHandler);
app.use(express.json());

app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/posts', postsRouter);

app.listen(8080, () => {
  console.log('Server listening for 8080 port ');
});
