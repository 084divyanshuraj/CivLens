import { NextResponse } from 'next/server';
import { IssueService } from '@/services/IssueService';

export async function GET() {
  try {
    const issues = await IssueService.getAllIssues();
    return NextResponse.json({ success: true, data: issues }, { status: 200 });
  } catch (error: any) {
    console.error('Get All Issues Error:', error);
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
  }
}
