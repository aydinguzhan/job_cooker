import { Database } from "../config/database";

export class JobRepository {
    constructor(private readonly db: Database) { }

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
<<<<<<< Updated upstream
        
=======
        j.status,
        j.url,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======


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

    async jobBulkCreate(payload: IJob[]) {
        if (!payload || payload.length === 0) return [];

        // Veritabanı bağlantısı havuzundan (Pool) bir client alıyoruz
        const client = await this.db.connect();

        try {
            // TRANSACTION BAŞLATIYORUZ
            await client.query('BEGIN');


            const preparedPayload = payload.map(item => ({
                title: item.title,
                company_id: "d67bfcb8-dee7-40a4-b45b-9e690c80cb13",
                suitability_rate: item.suitability_rate ?? null,
                advertiser_id: item.advertiser_id ?? "ac66124c-2eaa-4717-99e5-b14275701032",
                description: item.description ?? ""
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
                        description text
                        url  varchar(150)
                    )
                    RETURNING title;
`;

            const { rows } = await client.query(jobCreateQuery, [JSON.stringify(preparedPayload)]);

            // İŞLEM BAŞARILI -> Tümü Veritabanına Yazılsın
            await client.query('COMMIT');

            return rows;
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
>>>>>>> Stashed changes
}