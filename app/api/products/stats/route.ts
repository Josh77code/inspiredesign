import { NextResponse } from 'next/server';
import { getProductStats } from '@/lib/product-loader';

export async function GET() {
  try {
    const stats = await getProductStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting product stats:', error);
    return NextResponse.json(
      { error: 'Failed to get product statistics' },
      { status: 500 }
    );
  }
}
