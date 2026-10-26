import { NextRequest, NextResponse } from 'next/server';
import { computeGapReport, generatePersonalizedPlan } from '@/lib/rag-engine';
import { SAMPLE_TOPICS } from '@/lib/sample-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId = 'course-cs301', topics = SAMPLE_TOPICS, quizAttempts = [], dailyHours = 3, timeframe = '3_day_sprint' } = body;

    const gapReport = computeGapReport(courseId, topics, quizAttempts);
    const revisionPlan = generatePersonalizedPlan(gapReport, topics, timeframe, dailyHours);

    return NextResponse.json({
      gapReport,
      revisionPlan
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Diagnosis generation failed' }, { status: 500 });
  }
}
