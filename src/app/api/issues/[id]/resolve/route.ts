import { NextResponse } from 'next/server';
import { IssueService } from '@/services/IssueService';
import { ISSUE_STATUS } from '@/constants';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Issue ID is required' }, { status: 400 });
    }

    // Update status to resolved
    await IssueService.updateIssueStatus(id, ISSUE_STATUS.RESOLVED);

    return NextResponse.json({ success: true, message: 'Issue resolved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Resolve Issue Error:', error);
    return NextResponse.json({ error: 'Failed to resolve issue' }, { status: 500 });
  }
}
