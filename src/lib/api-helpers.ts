import { NextResponse } from 'next/server';
import { getMongoErrorMessage } from '@/lib/mongodb';

export function apiError(error: unknown, label: string) {
  console.error(label, error);
  return NextResponse.json(
    { error: getMongoErrorMessage(error) },
    { status: 500 }
  );
}
