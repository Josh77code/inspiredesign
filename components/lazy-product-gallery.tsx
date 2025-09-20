'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Product } from '@/lib/database';
import { ProductCard } from './product-card';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface LazyProductGalleryProps {
  initialProducts?: Product[];
  category?: string;
  searchQuery?: string;
}

export function LazyProductGallery({ 
  initialProducts = [], 
  category, 
  searchQuery 
}: LazyProductGalleryProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Load more products
  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: '20'
      });
      
      if (category) params.append('category', category);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/products/paginated?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to load products');
      }
      
      const data = await response.json();
      
      setProducts(prev => [...prev, ...data.products]);
      setHasMore(data.hasMore);
      setPage(prev => prev + 1);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, category, searchQuery]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );
    
    observerRef.current.observe(loadMoreRef.current);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreProducts, hasMore, loading]);

  // Reset when category or search changes
  useEffect(() => {
    setProducts(initialProducts);
    setPage(0);
    setHasMore(true);
    setError(null);
  }, [category, searchQuery, initialProducts]);

  if (products.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {searchQuery 
            ? `No products found for "${searchQuery}"`
            : 'No products available at the moment'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            lazy={true}
          />
        ))}
      </div>

      {/* Loading States */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">
              Loading more products...
            </span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button 
            onClick={loadMoreProducts}
            variant="outline"
            disabled={loading}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Load More Button (fallback) */}
      {!loading && hasMore && (
        <div className="text-center py-8">
          <Button 
            onClick={loadMoreProducts}
            variant="outline"
            disabled={loading}
          >
            Load More Products
          </Button>
        </div>
      )}

      {/* End of results */}
      {!hasMore && products.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            You've reached the end of the catalog
          </p>
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={loadMoreRef} className="h-4" />
    </div>
  );
}

// Enhanced ProductCard with lazy loading
interface LazyProductCardProps {
  product: Product;
  lazy?: boolean;
}

export function LazyProductCard({ product, lazy = false }: LazyProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image with lazy loading */}
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        {lazy && !imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-sm">Image not available</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading={lazy ? 'lazy' : 'eager'}
          />
        )}
      </div>
      
      {/* Product info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-green-600">
            {product.pricing?.from && product.pricing?.to 
              ? `€${product.pricing.from} - €${product.pricing.to}`
              : `€${product.price}`
            }
          </span>
          <Button size="sm" className="ml-2">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
