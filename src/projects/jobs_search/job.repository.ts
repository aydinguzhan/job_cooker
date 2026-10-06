import { Database } from "../config/database";
import { IJob, ScrapedJob } from "./job.entitiy";
import { getEnv } from "../config/env";

export class JobRepository {
    constructor(private readonly db: Database) { }
    private async companyControl(company_id: string) {
        const queryString = `SELECT id FROM companies WHERE id = $1`;
        const { rowCount, rows } = await this.db.query(queryString, [company_id]);

        if (!rowCount) return false;
        return rows
    }
    async searchJob(page: string, size: string, keyword = "") {
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.max(1, parseInt(size, 10) || 10);
        const offset = (pageNum - 1) * limitNum;
        const jobQuery = `
        SELECT
        j.id,
        j.title,
        j.suitability_rate,
        j.description,
        j.created_at,
        j.updated_at,
        j.status,
        j.url,
        json_build_object(
            'id', c.id,
            'name', c.name,
            'email', c.email,
            'address', c.address,
            'status', c.status
        ) AS company,

        json_build_object(
            'id', u.id,
            'first_name', u.first_name,
            'last_name', u.last_name,
            'email', u.email
        ) AS advertiser,

        COUNT(*) OVER() AS total_count
        FROM jobs j
        LEFT JOIN companies c ON j.company_id = c.id
        LEFT JOIN users u ON j.advertiser_id = u.id
        WHERE (
            $3::text IS NULL
            OR j.title ILIKE '%' || $3 || '%'
            OR COALESCE(j.description, '') ILIKE '%' || $3 || '%'
            OR c.name ILIKE '%' || $3 || '%'
        )
        ORDER BY j.created_at DESC
        LIMIT $1 OFFSET $2;
    `

        const normalizedKeyword = keyword.trim() || null;
        const { rows } = await this.db.query(jobQuery, [limitNum, offset, normalizedKeyword])
        if (rows.length === 0) {
            return {
                rows: [],
                total: 0,
                page: pageNum,
                size: limitNum,
            };
        }
        const total = parseInt(rows[0].total_count, 10).toString();

        return { rows, total, page: pageNum, size: limitNum }
    }

    async jobDetail(jobId: string) {
        const jobDetailQuery = `
        SELECT 
        id,
        title,
        company_id,
        suitability_rate,
        advertiser_id,
        description,
        url,
        created_at,
        updated_at
        FROM
        jobs
        WHERE 
        id = $1
        `
        const { rows } = await this.db.query(jobDetailQuery, [jobId])
        return rows[0]
    }



    async jobCreate(payload: IJob) {
        const company_id = await this.companyControl(payload.company_id);
        if (!company_id) throw new Error("Company not found!")
        const jobCreateQuery = `
        INSERT INTO jobs (
        title, 
        company_id, 
        suitability_rate, 
        advertiser_id, 
        description,
        url
        )
        VALUES 
        (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
        )
        RETURNING title

        `
        const { rows } = await this.db.query(jobCreateQuery, [payload.title, company_id, payload.suitability_rate.toString(), payload.advertiser_id, payload.description, payload?.url])
        return rows

    }

    async jobBulkCreate(payload: ScrapedJob[]) {
        if (!payload || payload.length === 0) return [];

        // Veritabanı bağlantısı havuzundan (Pool) bir client alıyoruz
        const client = await this.db.connect();

        try {
            // TRANSACTION BAŞLATIYORUZ
            await client.query('BEGIN');


            const companyId = getEnv("COOKER_COMPANY_ID");
            const advertiserId = getEnv("COOKER_ADVERTISER_ID");
            const preparedPayload = payload.map(item => ({
                title: item.title,
                company_id: companyId,
                suitability_rate: item.suitability_rate ?? null,
                advertiser_id: advertiserId,
                description: item.description ?? "",
                url: item.url,
            }));

            // 3. Toplu İlan Ekleme (Sorgu 2)
            const jobCreateQuery = `
                    INSERT INTO jobs (title, company_id, suitability_rate, advertiser_id, description,url)
                    SELECT title, company_id, suitability_rate, advertiser_id, description,url
                    FROM json_to_recordset($1::json) AS x(
                        title varchar(100), 
                        company_id uuid, 
                        suitability_rate int,   
                        advertiser_id uuid,     
                        description text,
                        url  varchar(150)
                    )
                    ON CONFLICT (url) WHERE url IS NOT NULL DO NOTHING
                    RETURNING id, title, url;
`;

            const { rows } = await client.query(jobCreateQuery, [JSON.stringify(preparedPayload)]);

            // İŞLEM BAŞARILI -> Tümü Veritabanına Yazılsın
            await client.query('COMMIT');

            return {
                created: rows.length,
                skipped: payload.length - rows.length,
                jobs: rows,
            };
        } catch (error) {
            // HATA OLUŞTU -> Yapılan her şeyi geri al! (Şirketler dahil)
            await client.query('ROLLBACK');
            throw error;
        } finally {
            // Client'ı havuza geri bırakıyoruz
            client.release();
        }
    }

    async jobFilterNameAndCompany(searchKey: string, size: string) {
        const searchKeyUpper = searchKey.toLocaleUpperCase()

        const query = `
          SELECT
            j.id,
            j.title,
            j.created_at,
            j.status,
            c.id AS company_id,
            c.name AS company_name,
            COUNT(*) OVER() AS total_count
            FROM jobs j
            LEFT JOIN companies c ON j.company_id = c.id
            WHERE j.status = true 
            AND c.status = true
            AND ($2::text IS NULL OR j.title ILIKE '%' || $2 || '%' OR c.name ILIKE '%' || $2 || '%')
            ORDER BY j.created_at DESC
            LIMIT $1 ;
        `
        const { rows } = await this.db.query(query, [size, searchKeyUpper])


        return { rows, size }
    }
}
