import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware';
import userRouter from './projects/user/user.router';
import authRouter from './projects/auth/auth.router';
import profileRouter from './projects/profile/profile.router';
import postsRouter from './projects/posts/posts.router';
import refDataRouter from './projects/lookup/refdatas/refdata.router';
import notificationRouter from './projects/notifications/notification.router';
import './server';
import morgan from 'morgan';
import fileRouter from './projects/file/file.router';
import followsRouter from './projects/follows/follows.router';
import dashboardRouter from './projects/dashboard/dahsboard.router';
import navigationRouter from './projects/navigations/navigation.router'
import { messageRouter } from './projects/messages/message.module';

const app = express();

app.use(morgan('dev'));
app.use(
  cors({
    // origin: ['http://localhost:5173', "0.0.0.0", "http://192.168.1.9"],
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());
app.use('/auth', authRouter);
app.use('/files', fileRouter);
app.use('/refdatas', refDataRouter);
app.use('/notification', notificationRouter);
app.use('/users', userRouter);
app.use('/profile', profileRouter);
app.use("/follows", followsRouter);
app.use('/dashboard', dashboardRouter);
app.use('/posts', postsRouter);
app.use('/navigation', navigationRouter)
app.use('/messages', messageRouter);
app.use(errorHandler);

app.listen(8080, "0.0.0.0", () => {
  console.log('Server listening  port ');
});
