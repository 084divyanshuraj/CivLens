import { getCollection, dateToTimestamp, timestampToDate } from '../lib/firebase/helpers';
import { COLLECTION_NAMES } from '../constants';
import { Issue } from '../types';

export class IssueService {
  private static collection = getCollection(COLLECTION_NAMES.ISSUES);

  private static mapToIssue(docId: string, data: FirebaseFirestore.DocumentData): Issue {
    return {
      id: docId,
      imageUrl: data.imageUrl,
      location: data.location,
      status: data.status,
      upvotes: data.upvotes || 0,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
      vision: data.vision,
      context: data.context,
      priority: data.priority,
      recommendation: data.recommendation,
      executiveSummary: data.executiveSummary,
      duplicateDetection: data.duplicateDetection,
    } as Issue;
  }

  static async createIssue(issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>): Promise<Issue> {
    const now = new Date();
    
    // Default upvotes for a new issue
    const issueToCreate = {
      ...issueData,
      upvotes: issueData.upvotes || 0,
      createdAt: dateToTimestamp(now),
      updatedAt: dateToTimestamp(now),
    };

    const docRef = await this.collection.add(issueToCreate);

    return {
      id: docRef.id,
      ...issueData,
      upvotes: issueToCreate.upvotes,
      createdAt: now,
      updatedAt: now,
    };
  }

  static async getIssue(id: string): Promise<Issue | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data();
    if (!data) return null;

    return this.mapToIssue(doc.id, data);
  }

  static async getAllIssues(): Promise<Issue[]> {
    const snapshot = await this.collection.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => this.mapToIssue(doc.id, doc.data()));
  }

  static async updateIssue(id: string, updateData: Partial<Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const docRef = this.collection.doc(id);
    await docRef.update({
      ...updateData,
      updatedAt: dateToTimestamp(new Date()),
    });
  }

  static async deleteIssue(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}
