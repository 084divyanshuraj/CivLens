import { NextResponse } from 'next/server';
import { IssueService } from '@/services/IssueService';
import { Location } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageUrl, base64Image, mimeType, location } = body;

    if (!imageUrl || !base64Image || !mimeType || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const typedLocation = location as Location;

    // Thin API route! The orchestration is entirely in IssueService.
    const newIssue = await IssueService.analyzeIssue(imageUrl, base64Image, mimeType, typedLocation);

    return NextResponse.json({ success: true, data: newIssue }, { status: 200 });
  } catch (error) {
    console.error('Analyze Error:', error);
    return NextResponse.json({ error: 'Failed to analyze issue' }, { status: 500 });
  }
}
