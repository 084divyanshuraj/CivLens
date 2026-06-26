import { getCollection, dateToTimestamp, timestampToDate } from '../lib/firebase/helpers';
import { COLLECTION_NAMES } from '../constants';
import { User } from '../types';

export class UserService {
  private static collection = getCollection(COLLECTION_NAMES.USERS);

  static async createUser(uid: string, userData: Omit<User, 'uid' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date();
    const newUser: User = {
      uid,
      ...userData,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = this.collection.doc(uid);
    await docRef.set({
      ...newUser,
      createdAt: dateToTimestamp(newUser.createdAt),
      updatedAt: dateToTimestamp(newUser.updatedAt),
    });

    return newUser;
  }

  static async getUser(uid: string): Promise<User | null> {
    const doc = await this.collection.doc(uid).get();
    if (!doc.exists) return null;

    const data = doc.data();
    if (!data) return null;

    return {
      uid: doc.id,
      email: data.email,
      displayName: data.displayName,
      role: data.role,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as User;
  }

  static async updateUser(uid: string, updateData: Partial<Omit<User, 'uid' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const docRef = this.collection.doc(uid);
    await docRef.update({
      ...updateData,
      updatedAt: dateToTimestamp(new Date()),
    });
  }

  static async deleteUser(uid: string): Promise<void> {
    await this.collection.doc(uid).delete();
  }
}
