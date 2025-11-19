import { list, put, del } from '@vercel/blob'

// Vercel Blob configuration
const BLOB_STORE_URL = process.env.BLOB_STORE_URL || ''
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || ''

/**
 * Get the full URL for an image stored in Vercel Blob
 * @param blobPath - The path to the blob (e.g., "products/1/main.jpg")
 * @returns Full URL to the blob
 */
export function getBlobImageUrl(blobPath: string): string {
  if (!blobPath) return '/placeholder.svg'
  
  // If it's already a full URL, return as-is
  if (blobPath.startsWith('http://') || blobPath.startsWith('https://')) {
    return blobPath
  }
  
  // If blob store URL is configured, use it
  if (BLOB_STORE_URL) {
    const cleanPath = blobPath.startsWith('/') ? blobPath.slice(1) : blobPath
    return `${BLOB_STORE_URL}/${cleanPath}`
  }
  
  // Fallback: use default blob store URL
  // Format: https://[store-name].public.blob.vercel-storage.com/[path]
  const cleanPath = blobPath.startsWith('/') ? blobPath.slice(1) : blobPath
  return `https://mr0u602ri2txkwqt.public.blob.vercel-storage.com/${cleanPath}`
}

/**
 * List all blobs in a directory
 * @param prefix - Directory prefix (e.g., "products/")
 * @returns Array of blob objects
 */
export async function listBlobs(prefix: string = '') {
  try {
    const { blobs } = await list({
      prefix,
      token: BLOB_READ_WRITE_TOKEN,
    })
    return blobs
  } catch (error) {
    console.error('Error listing blobs:', error)
    return []
  }
}

/**
 * Upload a file to Vercel Blob
 * @param file - File to upload
 * @param path - Path where to store the file
 * @returns Blob object with URL
 */
export async function uploadBlob(file: File | Buffer, path: string) {
  try {
    const blob = await put(path, file, {
      access: 'public',
      token: BLOB_READ_WRITE_TOKEN,
    })
    return blob
  } catch (error) {
    console.error('Error uploading blob:', error)
    throw error
  }
}

/**
 * Delete a blob from Vercel Blob
 * @param url - URL of the blob to delete
 */
export async function deleteBlob(url: string) {
  try {
    await del(url, {
      token: BLOB_READ_WRITE_TOKEN,
    })
  } catch (error) {
    console.error('Error deleting blob:', error)
    throw error
  }
}

/**
 * Convert old image path to Vercel Blob URL
 * This function helps migrate from old paths to new blob URLs
 * @param oldPath - Old image path (e.g., "/New Digital Product/...")
 * @param productId - Product ID to map to blob structure
 * @returns Vercel Blob URL
 */
export function convertToBlobUrl(oldPath: string, productId?: number): string {
  if (!oldPath) return '/placeholder.svg'
  
  // If it's already a blob URL, return as-is
  if (oldPath.includes('blob.vercel-storage.com') || oldPath.startsWith('http')) {
    return oldPath
  }
  
  // If you have a mapping or can derive the blob path from product ID
  if (productId) {
    // Example: products/{id}/main.jpg
    return getBlobImageUrl(`products/${productId}/main.jpg`)
  }
  
  // Try to extract filename and construct blob path
  const filename = oldPath.split('/').pop() || 'image.jpg'
  return getBlobImageUrl(`products/${filename}`)
}

