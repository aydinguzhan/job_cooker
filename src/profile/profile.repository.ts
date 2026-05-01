import { IUserProfile } from './profile.entity';
import { getMongoDb } from '../config/mongo-db';
import { getEnv } from '../config/env';
export default class ProfileRepository {
  private mongo_collection_name: string;
  constructor() {
    this.mongo_collection_name = getEnv('MONGO_COLLECTON_NAME');
  }

  async createProfile(userId: string, payload: IUserProfile) {
    const mongoConnect = await getMongoDb();
    const profileCollection = mongoConnect.collection(this.mongo_collection_name);
    const createdUser = await profileCollection.insertOne(payload);
    return createdUser;
  }
  async getUserProfileWithuerId(userId: string) {
    const mongoConnect = await getMongoDb();
    const profileInfoCollection = mongoConnect.collection(this.mongo_collection_name);
    const profileDetail = await profileInfoCollection.findOne({ user_id: userId });
    return profileDetail;
  }
  async updatedProfileWithuserId(userId: string, payload: Partial<IUserProfile>) {
    const mongoConnect = await getMongoDb();

    const profileInfoCollection = mongoConnect.collection(this.mongo_collection_name);

  

    const updateUserProfile = await profileInfoCollection.updateOne({ user_id: userId }, {
       $set:{
        ...payload
      }
    });
    return updateUserProfile;
  }
}
