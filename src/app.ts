import express from 'express';
import cors from "cors";
import { errorHandler } from './middleware/error.middleware';
import userRouter from './projects/user/user.router';
import authRouter from './projects/auth/auth.router';
import profileRouter from './projects/profile/profile.router';
import postsRouter from './projects/posts/posts.router';
import refDataRouter from './projects/lookup/refdatas/refdata.router'
import notificationRouter from './projects/notifications/notification.router'
import "./server"
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
app.use('/auth', authRouter);

app.use("/refdata",refDataRouter)
app.use("/notification",notificationRouter)
app.use('/users', userRouter);
app.use('/profile', profileRouter);
app.use('/posts', postsRouter);

app.listen(8080, () => {
  console.log('Server listening for 8080 port ');
});
