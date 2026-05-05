import express from 'express';
import cors from "cors";
import { errorHandler } from './middleware/error.middleware';
import userRouter from './user/user.router';
import authRouter from './auth/auth.router';
import profileRouter from './profile/profile.router';
import postsRouter from './posts/posts.router';
import refDataRouter from './lookup/refdatas/refdata.router'
import notificationRoter from './notifications/notification.router'
import { checkDbConnection } from './config/db-check';
import './shared/notification-listener/index'
(async () => await checkDbConnection())();
const app = express();

app.use(errorHandler);
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/refdata",refDataRouter)
app.use("/notification",notificationRoter)
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/posts', postsRouter);

app.listen(8080, () => {
  console.log('Server listening for 8080 port ');
});
