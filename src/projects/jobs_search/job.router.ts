import express, { Request, Response } from "express";
import { authMiddleware } from "../../middleware/auth.middeware";
import { cookerAuthMiddleware } from "../../middleware/cooker-auth.middleware";
import { jobController } from "./job.module";
const jobRouter = express.Router();

jobRouter.post(
    "/create-bulk",
    cookerAuthMiddleware,
    jobController.jobBulkCreate.bind(jobController),
);

jobRouter.use(authMiddleware);

jobRouter.get("/search", jobController.searchJob.bind(jobController));
jobRouter.get("/job-detail/:jobId", jobController.jobDetail.bind(jobController));
jobRouter.post("/create", jobController.jobCreate.bind(jobController));

jobRouter.put("/update", (req: Request, res: Response) => res.send({ job: "update" }));
jobRouter.delete("/delete", (req: Request, res: Response) => res.send({ job: "update" }));


export default jobRouter;
