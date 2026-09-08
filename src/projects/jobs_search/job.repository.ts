import { Database } from "../config/database";
import { IJob } from "./job.entitiy";


export class JobRepository {
    constructor(private readonly db: Database) { }
    private async companyControl(company_id: string) {
        const companyQuery = `
        SELECT
        id
        FROM
        companies
        WHERE
        id = $1 
        AND
        status = TRUE
        `
        const { rows, rowCount } = await this.db.query(companyQuery, [company_id]);
        if (rowCount && rowCount > 0) return rows[0].id
        return false
    }
    async searchJob(page: string, size: string) {
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
        WHERE j.status = true
        ORDER BY j.created_at DESC
        LIMIT $1 OFFSET $2;
    `

        const { rows } = await this.db.query(jobQuery, [size, offset])
        if (rows.length === 0) {
            return {
                data: [],
                pagination: {
                    total: 0,
                    page: pageNum,
                    size: limitNum,
                    totalPages: 0,
                },
            };
        }
        const total = parseInt(rows[0].total_count, 10).toString();

        return { rows, total, page, size }
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
        console.log(company_id)
        // const jobCreateQuery = `
        // INSERT INTO jobs (
        // title, 
        // company_id, 
        // suitability_rate, 
        // advertiser_id, 
        // description
        // )
        // VALUES 
        // (
        //     $1,
        //     $2,
        //     $3,
        //     $4,
        //     $5
        // )
        // RETURNING title

        // `
        // const { rows } = await this.db.query(jobCreateQuery, [payload.title, company_id, payload.suitability_rate.toString(), payload.advertiser_id, payload.description])
        // return rows

        //(SELECT id FROM companies LIMIT 1 -2
        // (SELECT id FROM users LIMIT 1),     -- <--- BURASI: Mevcut kullanıcının ID'si

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