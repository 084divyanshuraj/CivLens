import { NextResponse } from 'next/server';
import { IssueService } from '@/services/IssueService';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await IssueService.upvoteIssue(id);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Upvote Error:', error);
    return NextResponse.json({ error: 'Failed to upvote issue' }, { status: 500 });
  }
}
