import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import * as admin from 'firebase-admin';

export async function POST(req: Request) {
  try {
    const { uid, points } = await req.json();
    
    if (!uid || !points) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const userRef = adminDb.collection('users').doc(uid);
    await userRef.update({
      civicScore: admin.firestore.FieldValue.increment(points)
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Score update error:', error);
    return NextResponse.json({ error: 'Failed to update score' }, { status: 500 });
  }
}
