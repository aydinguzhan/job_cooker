import PostsService  from "./posts.service";
import PostsRepository from "./posts.repository";
import { db } from '../config/database';
import  PostsController  from "./posts.controller";

const postsRepository = new PostsRepository(db);
const postsService = new PostsService(postsRepository);
const postsController = new PostsController(postsService);

export { postsController };