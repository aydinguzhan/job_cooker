import { Collection, Db } from 'mongodb';
import { ProfileEntity } from './profile.entity';
import { getEnv } from '../config/env';
import { Database } from '../config/database';

export default class ProfileRepository {
  private readonly collectionName: string;

  constructor(
    private db: Db,
    private readonly postgresDb: Database
  ) {
    this.collectionName = getEnv('MONGO_COLLECTION_NAME');
  }

  private async getCollection(): Promise<Collection<ProfileEntity>> {
    return this.db.collection<ProfileEntity>(this.collectionName);
  }

  async createProfile(payload: ProfileEntity) {
    const collection = await this.getCollection();
    try {
      const { rows } = await this.postgresDb.query(
        'SELECT first_name, last_name, email FROM users WHERE id = $1',
        [payload.userId]
      );
      if (rows.length === 0) {
        throw new Error(`User with id ${payload.userId} does not exist`);
      }
      const now = new Date();
      const profile: ProfileEntity = {
        userId: payload.userId,
        email: payload.email ?? rows[0].email ?? '',
        firstName: payload.firstName ?? rows[0].first_name ?? '',
        lastName: payload.lastName ?? rows[0].last_name ?? '',
        title: payload.title ?? '',
        description: payload.description ?? '',
        profileImage: payload.profileImage,
        skills: payload.skills ?? [],
        experiences: payload.experiences ?? [],
        references: payload.references ?? [],
        createdAt: now,
        updatedAt: now,
      };
      await collection.insertOne(profile);
      return profile;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getUserProfileWithUserId(userId: string) {
    const collection = await this.getCollection();
    return collection.findOne<ProfileEntity>({ userId });
  }

  async updateProfileWithUserId(userId: string, payload: Partial<ProfileEntity>) {
    const collection = await this.getCollection();

    return collection.updateOne(
      { userId },
      {
        $set: {
          ...payload,
          updatedAt: new Date(),
        },
      }
    );
  }

  async upsertProfileWithUserId(userId: string, payload: Partial<ProfileEntity>) {
    const collection = await this.getCollection();

    const now = new Date();

    return collection.updateOne(
      { userId },
      {
        $set: {
          ...payload,
          userId,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true }
    );
  }

  async deleteProfileWithUserId(userId: string) {
    const collection = await this.getCollection();

    return collection.deleteOne({ userId });
  }
}
