import { NextResponse } from 'next/server';
import { AnalyticsService } from '@/services/AnalyticsService';

export async function GET() {
  try {
    const stats = await AnalyticsService.getDashboardStats();
    
    return NextResponse.json({ 
      success: true, 
      data: stats
    }, { status: 200 });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
