import { NextRequest, NextResponse } from 'next/server';
import { loadProductsPaginated } from '@/lib/product-loader';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '0');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let result;

    if (search) {
      result = await loadProductsPaginated(page, limit);
      // Filter by search query
      result.products = result.products.filter((product: any) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase())
      );
    } else if (category) {
      result = await loadProductsPaginated(page, limit);
      // Filter by category
      result.products = result.products.filter((product: any) =>
        product.category === category || 
        product.categories?.includes(category)
      );
    } else {
      result = await loadProductsPaginated(page, limit);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in paginated products API:', error);
    return NextResponse.json(
      { error: 'Failed to load products' },
      { status: 500 }
    );
  }
}
