import { IPost } from "../posts/posts.entity";
import { IGetFeeds } from "./dashboard.entitiy";
import { DashboardRepository } from "./dashboard.repository";

export class DashboardService {
    constructor(private readonly dashboardRepository: DashboardRepository) {}

    async getFeeds(payload: IGetFeeds): Promise<IPost[]> {
        return this.dashboardRepository.get(payload);
    }
}