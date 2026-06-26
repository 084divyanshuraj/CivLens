import { adminDb } from './admin';
import { Timestamp } from 'firebase-admin/firestore';

export const dateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

export const timestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

export const getCollection = (collectionName: string) => {
  return adminDb.collection(collectionName);
};
