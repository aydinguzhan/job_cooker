export type IJob = {
    title: string,
    company_id: string,
    suitability_rate: string,
    advertiser_id: string,
    description: string,
    url?: string

}

export type ScrapedJob = {
    title: string,
    suitability_rate?: number,
    description?: string,
    url: string,
}
