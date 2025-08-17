import { put, del } from '@vercel/blob';
import sharp from 'sharp';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
   * Download and store an image from PropTx URL with database tracking
   */
  async downloadImage(originalUrl: string, propertyId: string, order: number = 0, mediaChangeTimestamp?: string): Promise<string | null> {
    try {
      // Check if already downloading
      if (this.downloadQueue.has(originalUrl)) {
        console.log(`Image already in download queue: ${originalUrl}`);
        return null;
      }

      this.downloadQueue.add(originalUrl);

      // Check if we already have this image in database
      const existingImage = await prisma.propertyImage.findFirst({
        where: {
          originalUrl,
          propertyId
        }
      });

      // If image exists and is fresh, return it
      if (existingImage && existingImage.status === 'downloaded' && existingImage.localUrl) {
        if (mediaChangeTimestamp) {
          const propTxTimestamp = new Date(mediaChangeTimestamp);
          const downloadTimestamp = existingImage.downloadedAt;

          if (downloadTimestamp && propTxTimestamp <= downloadTimestamp) {
            console.log(`✅ Using existing fresh image: ${existingImage.localUrl}`);
            return existingImage.localUrl;
          }
        } else {
          // No timestamp provided, assume existing image is good
          return existingImage.localUrl;
        }
      }

      // Mark as pending in database
      const imageRecord = await prisma.propertyImage.upsert({
        where: {
          propertyId_originalUrl: {
            propertyId,
            originalUrl
          }
        },
        update: {
          status: 'pending',
          order
        },
        create: {
          propertyId,
          originalUrl,
          status: 'pending',
          order
        }
      });

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

      // Update database record
      await prisma.propertyImage.update({
        where: { id: imageRecord.id },
        data: {
          localUrl: blob.url,
          downloadedAt: new Date(),
          fileSize: optimizedBuffer.length,
          status: 'downloaded'
        }
      });

      console.log(`✅ Downloaded and stored image: ${filename}`);
      return blob.url;

    } catch (error) {
      console.error(`❌ Failed to download image ${originalUrl}:`, error);

      // Mark as failed in database
      try {
        await prisma.propertyImage.updateMany({
          where: { originalUrl, propertyId },
          data: { status: 'failed' }
        });
      } catch (dbError) {
        console.error('Failed to update database with error status:', dbError);
      }

      return null;
    } finally {
      this.downloadQueue.delete(originalUrl);
    }
  }

  /**
   * Download all images for a property with freshness checking
   */
  async downloadPropertyImages(
    propertyId: string,
    images: Array<{ MediaURL: string; Order: number }>,
    mediaChangeTimestamp?: string
  ): Promise<Array<{ originalUrl: string; localUrl: string; order: number }>> {
    const results = [];

    // Process images in batches of 3 to avoid overwhelming the service
    for (let i = 0; i < images.length; i += 3) {
      const batch = images.slice(i, i + 3);

      const batchResults = await Promise.allSettled(
        batch.map(async (image) => {
          const localUrl = await this.downloadImage(
            image.MediaURL,
            propertyId,
            image.Order,
            mediaChangeTimestamp
          );
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
  async getImageUrl(originalUrl: string, propertyId: string, order: number = 0, mediaChangeTimestamp?: string): Promise<string> {
    if (!originalUrl) {
      return '/placeholder-property.jpg';
    }

    try {
      // Check database for existing local image
      const existingImage = await prisma.propertyImage.findFirst({
        where: { originalUrl, propertyId }
      });

      if (existingImage?.localUrl && existingImage.status === 'downloaded') {
        // Check if image is fresh
        if (mediaChangeTimestamp) {
          const propTxTimestamp = new Date(mediaChangeTimestamp);
          const downloadTimestamp = existingImage.downloadedAt;

          if (downloadTimestamp && propTxTimestamp <= downloadTimestamp) {
            return existingImage.localUrl; // Image is fresh
          }

          // Image is outdated, queue for re-download but return current version
          console.log(`🔄 Image outdated, queuing re-download: ${propertyId}`);
          this.downloadImage(originalUrl, propertyId, order, mediaChangeTimestamp).catch(error => {
            console.error('Background re-download failed:', error);
          });

          return existingImage.localUrl; // Return current version while re-downloading
        }

        return existingImage.localUrl; // No timestamp provided, return existing
      }

      // No local image exists, try to download
      const localUrl = await this.downloadImage(originalUrl, propertyId, order, mediaChangeTimestamp);

      // Return local URL if successful, otherwise return placeholder
      return localUrl || '/placeholder-property.jpg';

    } catch (error) {
      console.error('Error getting image URL:', error);
      return '/placeholder-property.jpg';
    }
  }

  /**
   * Check if images need updating based on PropTx MediaChangeTimestamp
   */
  async checkImageFreshness(propertyId: string, mediaChangeTimestamp: string): Promise<boolean> {
    try {
      const lastDownload = await prisma.propertyImage.findFirst({
        where: {
          propertyId,
          status: 'downloaded',
          downloadedAt: { not: null }
        },
        orderBy: { downloadedAt: 'desc' }
      });

      if (!lastDownload || !lastDownload.downloadedAt) {
        return true; // Need to download - no images exist
      }

      const propTxTimestamp = new Date(mediaChangeTimestamp);
      const needsUpdate = propTxTimestamp > lastDownload.downloadedAt;

      if (needsUpdate) {
        console.log(`🔄 Images for property ${propertyId} need updating`);
        console.log(`PropTx timestamp: ${propTxTimestamp.toISOString()}`);
        console.log(`Last download: ${lastDownload.downloadedAt.toISOString()}`);
      }

      return needsUpdate;

    } catch (error) {
      console.error('Error checking image freshness:', error);
      return true; // Assume needs update on error
    }
  }

  /**
   * Get all images for a property from database
   */
  async getPropertyImages(propertyId: string): Promise<Array<{ originalUrl: string; localUrl: string; order: number; status: string }>> {
    try {
      const images = await prisma.propertyImage.findMany({
        where: {
          propertyId,
          status: 'downloaded',
          localUrl: { not: null }
        },
        orderBy: { order: 'asc' }
      });

      return images.map(img => ({
        originalUrl: img.originalUrl,
        localUrl: img.localUrl!,
        order: img.order,
        status: img.status
      }));

    } catch (error) {
      console.error('Error getting property images:', error);
      return [];
    }
  }

  /**
   * Batch process images for multiple properties with freshness checking
   */
  async batchProcessProperties(properties: Array<{
    ListingKey: string;
    images: Array<{ MediaURL: string; Order: number }>;
    MediaChangeTimestamp?: string;
  }>): Promise<void> {
    console.log(`🔄 Starting batch processing for ${properties.length} properties`);

    for (const property of properties) {
      if (property.images && property.images.length > 0) {
        try {
          // Check if images need updating
          const needsUpdate = property.MediaChangeTimestamp
            ? await this.checkImageFreshness(property.ListingKey, property.MediaChangeTimestamp)
            : true; // Always download if no timestamp provided

          if (needsUpdate) {
            await this.downloadPropertyImages(
              property.ListingKey,
              property.images,
              property.MediaChangeTimestamp
            );
            console.log(`✅ Processed images for property ${property.ListingKey}`);
          } else {
            console.log(`⏭️ Skipped property ${property.ListingKey} - images are fresh`);
          }
        } catch (error) {
          console.error(`❌ Failed to process property ${property.ListingKey}:`, error);
        }
      }
    }

    console.log(`🎉 Batch processing completed`);
  }

  /**
   * Process all properties in a search result with smart downloading
   */
  async processSearchResults(properties: Array<any>): Promise<void> {
    const propertiesWithImages = properties
      .filter(p => p.images && p.images.length > 0)
      .map(p => ({
        ListingKey: p.ListingKey,
        images: p.images,
        MediaChangeTimestamp: p.MediaChangeTimestamp
      }));

    if (propertiesWithImages.length > 0) {
      console.log(`🔄 Processing ${propertiesWithImages.length} properties with images`);
      await this.batchProcessProperties(propertiesWithImages);
    }
  }
}

export const imageService = ImageService.getInstance();
