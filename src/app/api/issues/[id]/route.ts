import { NextResponse } from 'next/server';
import { IssueService } from '@/services/IssueService';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const issue = await IssueService.getIssue(id);
    
    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: issue }, { status: 200 });
  } catch (error) {
    console.error('Get Issue Error:', error);
    return NextResponse.json({ error: 'Failed to fetch issue' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    // Using updateIssue for partial updates (e.g. status changes from dashboard)
    await IssueService.updateIssue(id, body);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Update Issue Error:', error);
    return NextResponse.json({ error: 'Failed to update issue' }, { status: 500 });
  }
}
