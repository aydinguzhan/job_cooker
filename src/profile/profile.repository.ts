import { Collection } from 'mongodb';
import { ProfileEntity } from './profile.entity';
import { getMongoDb } from '../config/mongo-db';
import { getEnv } from '../config/env';

export default class ProfileRepository {
  private readonly collectionName: string;

  constructor() {
    this.collectionName = getEnv('MONGO_COLLECTION_NAME');
  }

  private async getCollection(): Promise<Collection<ProfileEntity>> {
    const db = await getMongoDb();
    return db.collection<ProfileEntity>(this.collectionName);
  }

  async createProfile(userId: string, payload: Partial<ProfileEntity>) {
    const collection = await this.getCollection();

    const now = new Date();

    const profile: ProfileEntity = {
      userId : userId,
      firstName: payload.firstName ?? '',
      lastName: payload.lastName ?? '',
      title: payload.title ?? '',
      description: payload.description ?? '',
      profileImage: payload.profileImage,
      skills: payload.skills ?? [],
      experiences: payload.experiences ?? [],
      references: payload.references ?? [],
      createdAt: now,
      updatedAt: now,
    };

    return collection.insertOne(profile);
  }

  async getUserProfileWithUserId(userId: string) {
    const collection = await this.getCollection();

    return collection.findOne({ userId });
  }

  async updateProfileWithUserId(
    userId: string,
    payload: Partial<ProfileEntity>,
  ) {
    const collection = await this.getCollection();

    return collection.updateOne(
      { userId },
      {
        $set: {
          ...payload,
          updatedAt: new Date(),
        },
      },
    );
  }

  async upsertProfileWithUserId(
    userId: string,
    payload: Partial<ProfileEntity>,
  ) {
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
      { upsert: true },
    );
  }

  async deleteProfileWithUserId(userId: string) {
    const collection = await this.getCollection();

    return collection.deleteOne({ userId });
  }
}