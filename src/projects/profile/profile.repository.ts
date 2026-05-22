import {
  CreateProfilePayload,
  UserProfilesInfo,
  UpdateProfileSkillsPayload,
  UpdateProfileReferencesPayload,
  UpdateProfileExperiencesPayload,
} from './profile.entity';
import { getEnv } from '../config/env';
import { Database } from '../config/database';
import { Pool } from 'pg';

export default class ProfileRepository {
  constructor(private readonly db: Database) {}

  async createProfile(payload: CreateProfilePayload) {
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      // 1. profile insert
      const profileResult = await client.query(
        `
        INSERT INTO user_profiles (
          user_id,
          title,
          bio_description,
          profile_image_path
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [
          payload.user_id,
          payload.title,
          payload.bio_description ?? null,
          payload.profile_image_path ?? null,
        ]
      );

      const profile = profileResult.rows[0];

      // 2. skills insert
      for (const skill of payload.skills) {
        await client.query(
          `
          INSERT INTO user_profile_skills (
            profile_id,
            skill_id,
            level
          )
          VALUES ($1, $2, $3)
          `,
          [profile.id, skill.skill_id, skill.level]
        );
      }

      // 3. experiences insert
      for (const experience of payload.experiences) {
        await client.query(
          `
          INSERT INTO user_profile_experiences (
            profile_id,
            company_name,
            company_location,
            position_title,
            start_date,
            end_date,
            is_current,
            description
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `,
          [
            profile.id,
            experience.company_name,
            experience.company_location ?? null,
            experience.position_title,
            experience.start_date,
            experience.end_date ?? null,
            experience.is_current,
            experience.description ?? null,
          ]
        );
      }

      // 4. references insert
      for (const reference of payload.references) {
        await client.query(
          `
          INSERT INTO user_profile_references (
            profile_id,
            first_name,
            last_name,
            email,
            phone,
            company_name,
            position_title
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          `,
          [
            profile.id,
            reference.first_name,
            reference.last_name,
            reference.email ?? null,
            reference.phone ?? null,
            reference.company_name ?? null,
            reference.position_title ?? null,
          ]
        );
      }

      await client.query('COMMIT');

      return profile;
    } catch (error) {
      await client.query('ROLLBACK');

      throw error;
    } finally {
      client.release();
    }
  }

  async getProfileByUserId(userId: string) {
    const profileResult = await this.db.query(
      `
    SELECT *
    FROM user_profiles
    WHERE user_id = $1
      AND deleted_at IS NULL
    LIMIT 1
    `,
      [userId]
    );

    const profile = profileResult.rows[0];

    if (!profile) {
      return null;
    }

    const skillsResult = await this.db.query(
      `
    SELECT 
      s.id,
      s.name,
      s.short_key,
      ups.level,
      ups.status
    FROM user_profile_skills ups
    JOIN skills s ON s.id = ups.skill_id
    WHERE ups.profile_id = $1
      AND ups.deleted_at IS NULL
      AND s.deleted_at IS NULL
    ORDER BY s.name ASC
    `,
      [profile.id]
    );

    const experiencesResult = await this.db.query(
      `
    SELECT
      id,
      company_name,
      company_location,
      position_title,
      start_date,
      end_date,
      is_current,
      description,
      status
    FROM user_profile_experiences
    WHERE profile_id = $1
      AND deleted_at IS NULL
    ORDER BY start_date DESC
    `,
      [profile.id]
    );

    const referencesResult = await this.db.query(
      `
    SELECT
      id,
      first_name,
      last_name,
      email,
      phone,
      company_name,
      position_title,
      status
    FROM user_profile_references
    WHERE profile_id = $1
      AND deleted_at IS NULL
    ORDER BY created_at DESC
    `,
      [profile.id]
    );

    return {
      ...profile,
      skills: skillsResult.rows,
      experiences: experiencesResult.rows,
      references: referencesResult.rows,
    };
  }

  async updatedUserInfo(payload: UserProfilesInfo) {
    const query = `
      UPDATE user_profiles 
      SET
        title = $1,
        bio_description = $2,
        profile_image_path = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $4
      RETURNING title, bio_description, profile_image_path
`;

    await this.db.query(query, [
      payload.title,
      payload.bio_description,
      payload.profile_image_path ?? null,
      payload.user_id,
    ]);

    return this.getProfileByUserId(payload.user_id);
  }
  async updateProfileSkills(payload: UpdateProfileSkillsPayload) {
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      const profileResult = await client.query(
        `
      SELECT id
      FROM user_profiles
      WHERE user_id = $1
        AND deleted_at IS NULL
      LIMIT 1
      `,
        [payload.user_id]
      );

      const profile = profileResult.rows[0];

      if (!profile) {
        throw new Error('Profile not found');
      }

      await client.query(
        `
      UPDATE user_profile_skills
      SET
        deleted_at = CURRENT_TIMESTAMP,
        status = 'deleted'
      WHERE profile_id = $1
        AND deleted_at IS NULL
      `,
        [profile.id]
      );

      for (const skill of payload.skills) {
        await client.query(
          `
        INSERT INTO user_profile_skills (
          profile_id,
          skill_id,
          level,
          status,
          deleted_at
        )
        VALUES ($1, $2, $3, 'active', NULL)
        ON CONFLICT (profile_id, skill_id)
        DO UPDATE SET
          level = EXCLUDED.level,
          status = 'active',
          deleted_at = NULL,
          updated_at = CURRENT_TIMESTAMP
        `,
          [profile.id, skill.skill_id, skill.level]
        );
      }

      await client.query('COMMIT');

      return this.getProfileByUserId(payload.user_id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  async updateProfileReferences(payload: UpdateProfileReferencesPayload) {
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      const profileResult = await client.query(
        `
      SELECT id
      FROM user_profiles
      WHERE user_id = $1
        AND deleted_at IS NULL
      LIMIT 1
      `,
        [payload.user_id]
      );

      const profile = profileResult.rows[0];

      if (!profile) {
        throw new Error('Profile not found');
      }

      await client.query(
        `
      UPDATE user_profile_references
      SET
        deleted_at = CURRENT_TIMESTAMP,
        status = 'deleted',
        updated_at = CURRENT_TIMESTAMP
      WHERE profile_id = $1
        AND deleted_at IS NULL
      `,
        [profile.id]
      );

      for (const reference of payload.references) {
        await client.query(
          `
        INSERT INTO user_profile_references (
          profile_id,
          first_name,
          last_name,
          email,
          phone,
          company_name,
          position_title,
          status,
          deleted_at
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          'active',
          NULL
        )
        `,
          [
            profile.id,
            reference.first_name,
            reference.last_name,
            reference.email ?? null,
            reference.phone ?? null,
            reference.company_name ?? null,
            reference.position_title ?? null,
          ]
        );
      }

      await client.query('COMMIT');

      return this.getProfileByUserId(payload.user_id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  async updateProfileExperiences(payload: UpdateProfileExperiencesPayload) {
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      const profileResult = await client.query(
        `
      SELECT id
      FROM user_profiles
      WHERE user_id = $1
        AND deleted_at IS NULL
      LIMIT 1
      `,
        [payload.user_id]
      );

      const profile = profileResult.rows[0];

      if (!profile) {
        throw new Error('Profile not found');
      }

      await client.query(
        `
      UPDATE user_profile_experiences
      SET
        deleted_at = CURRENT_TIMESTAMP,
        status = 'deleted',
        updated_at = CURRENT_TIMESTAMP
      WHERE profile_id = $1
        AND deleted_at IS NULL
      `,
        [profile.id]
      );

      for (const experience of payload.experiences) {
        await client.query(
          `
        INSERT INTO user_profile_experiences (
          profile_id,
          company_name,
          company_location,
          position_title,
          start_date,
          end_date,
          is_current,
          description,
          status,
          deleted_at
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, 'active', NULL
        )
        `,
          [
            profile.id,
            experience.company_name,
            experience.company_location ?? null,
            experience.position_title,
            experience.start_date,
            experience.is_current ? null : (experience.end_date ?? null),
            experience.is_current,
            experience.description ?? null,
          ]
        );
      }

      await client.query('COMMIT');

      return this.getProfileByUserId(payload.user_id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
