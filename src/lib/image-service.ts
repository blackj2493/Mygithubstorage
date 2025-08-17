import { put, del } from '@vercel/blob';
import sharp from 'sharp';

export interface PropertyImage {
  id: string;
  propertyId: string;
  originalUrl: string;
  localUrl: string;
  downloadedAt: Date;
  fileSize: number;
  status: 'pending' | 'downloaded' | 'failed';
  order?: number;
}

export class ImageService {
  private static instance: ImageService;
  private downloadQueue: Set<string> = new Set();

  static getInstance(): ImageService {
    if (!ImageService.instance) {
      ImageService.instance = new ImageService();
    }
    return ImageService.instance;
  }

  /**
   * Download and store an image from PropTx URL
   */
  async downloadImage(originalUrl: string, propertyId: string, order: number = 0): Promise<string | null> {
    try {
      // Check if already downloading
      if (this.downloadQueue.has(originalUrl)) {
        console.log(`Image already in download queue: ${originalUrl}`);
        return null;
      }

      this.downloadQueue.add(originalUrl);

      // Fetch image from PropTx
      const response = await fetch(originalUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const imageBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(imageBuffer);

      // Optimize image with Sharp
      const optimizedBuffer = await sharp(buffer)
        .resize(1200, 800, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ 
          quality: 85,
          progressive: true 
        })
        .toBuffer();

      // Generate filename
      const filename = `properties/${propertyId}/${order}-${Date.now()}.jpg`;

      // Upload to Vercel Blob
      const blob = await put(filename, optimizedBuffer, {
        access: 'public',
        contentType: 'image/jpeg',
      });

      console.log(`✅ Downloaded and stored image: ${filename}`);
      return blob.url;

    } catch (error) {
      console.error(`❌ Failed to download image ${originalUrl}:`, error);
      return null;
    } finally {
      this.downloadQueue.delete(originalUrl);
    }
  }

  /**
   * Download all images for a property
   */
  async downloadPropertyImages(propertyId: string, images: Array<{ MediaURL: string; Order: number }>): Promise<Array<{ originalUrl: string; localUrl: string; order: number }>> {
    const results = [];

    // Process images in batches of 3 to avoid overwhelming the service
    for (let i = 0; i < images.length; i += 3) {
      const batch = images.slice(i, i + 3);
      
      const batchResults = await Promise.allSettled(
        batch.map(async (image) => {
          const localUrl = await this.downloadImage(image.MediaURL, propertyId, image.Order);
          return localUrl ? {
            originalUrl: image.MediaURL,
            localUrl,
            order: image.Order
          } : null;
        })
      );

      // Add successful downloads to results
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          results.push(result.value);
        }
      });

      // Small delay between batches
      if (i + 3 < images.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return results;
  }

  /**
   * Delete an image from storage
   */
  async deleteImage(url: string): Promise<boolean> {
    try {
      await del(url);
      console.log(`🗑️ Deleted image: ${url}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete image ${url}:`, error);
      return false;
    }
  }

  /**
   * Get local URL for an image, download if not exists
   */
  async getImageUrl(originalUrl: string, propertyId: string, order: number = 0): Promise<string> {
    // For now, return placeholder - we'll implement database lookup later
    if (!originalUrl) {
      return '/placeholder-property.jpg';
    }

    // Try to download the image
    const localUrl = await this.downloadImage(originalUrl, propertyId, order);
    
    // Return local URL if successful, otherwise return placeholder
    return localUrl || '/placeholder-property.jpg';
  }

  /**
   * Batch process images for multiple properties
   */
  async batchProcessProperties(properties: Array<{ ListingKey: string; images: Array<{ MediaURL: string; Order: number }> }>): Promise<void> {
    console.log(`🔄 Starting batch processing for ${properties.length} properties`);

    for (const property of properties) {
      if (property.images && property.images.length > 0) {
        try {
          await this.downloadPropertyImages(property.ListingKey, property.images);
          console.log(`✅ Processed images for property ${property.ListingKey}`);
        } catch (error) {
          console.error(`❌ Failed to process property ${property.ListingKey}:`, error);
        }
      }
    }

    console.log(`🎉 Batch processing completed`);
  }
}

export const imageService = ImageService.getInstance();
