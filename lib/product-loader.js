// Product loading utilities for large catalogs
import fs from 'fs';
import path from 'path';

/**
 * Load products with pagination
 * @param {number} page - Page number (0-based)
 * @param {number} limit - Items per page
 * @returns {Object} - { products, total, hasMore }
 */
export async function loadProductsPaginated(page = 0, limit = 20) {
  try {
    const productsPath = path.join(process.cwd(), 'data', 'products.json');
    const allProducts = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const products = allProducts.slice(startIndex, endIndex);
    
    return {
      products,
      total: allProducts.length,
      hasMore: endIndex < allProducts.length,
      currentPage: page,
      totalPages: Math.ceil(allProducts.length / limit)
    };
  } catch (error) {
    console.error('Error loading products:', error);
    return { products: [], total: 0, hasMore: false };
  }
}

/**
 * Load products by category with pagination
 * @param {string} category - Product category
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 */
export async function loadProductsByCategory(category, page = 0, limit = 20) {
  try {
    const productsPath = path.join(process.cwd(), 'data', 'products.json');
    const allProducts = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    
    const filteredProducts = allProducts.filter(product => 
      product.category === category || 
      product.categories?.includes(category)
    );
    
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const products = filteredProducts.slice(startIndex, endIndex);
    
    return {
      products,
      total: filteredProducts.length,
      hasMore: endIndex < filteredProducts.length,
      currentPage: page,
      totalPages: Math.ceil(filteredProducts.length / limit)
    };
  } catch (error) {
    console.error('Error loading products by category:', error);
    return { products: [], total: 0, hasMore: false };
  }
}

/**
 * Search products with pagination
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 */
export async function searchProducts(query, page = 0, limit = 20) {
  try {
    const productsPath = path.join(process.cwd(), 'data', 'products.json');
    const allProducts = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    
    const searchResults = allProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase()) ||
      product.category?.toLowerCase().includes(query.toLowerCase())
    );
    
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const products = searchResults.slice(startIndex, endIndex);
    
    return {
      products,
      total: searchResults.length,
      hasMore: endIndex < searchResults.length,
      currentPage: page,
      totalPages: Math.ceil(searchResults.length / limit),
      query
    };
  } catch (error) {
    console.error('Error searching products:', error);
    return { products: [], total: 0, hasMore: false };
  }
}

/**
 * Get product statistics
 */
export async function getProductStats() {
  try {
    const productsPath = path.join(process.cwd(), 'data', 'products.json');
    const allProducts = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    
    const categories = [...new Set(allProducts.map(p => p.category))];
    const totalProducts = allProducts.length;
    
    return {
      totalProducts,
      categories: categories.length,
      categoryList: categories
    };
  } catch (error) {
    console.error('Error getting product stats:', error);
    return { totalProducts: 0, categories: 0, categoryList: [] };
  }
}
