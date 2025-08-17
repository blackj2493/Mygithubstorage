# Image Management Strategy

## Current Implementation vs. Ideal System

### 🔄 **Current System (Basic)**
- Downloads images on first property fetch
- Stores in Vercel Blob Storage
- No database tracking
- No update mechanism
- Limited to first 20 properties per search

### 🎯 **Ideal System (Recommended)**

## 1. **Smart Download Strategy**

### **When images are downloaded:**
```
1. Property first encountered → Download all images
2. MediaChangeTimestamp newer → Re-download updated images  
3. Scheduled job (daily) → Check for updates across all properties
4. Manual trigger → Admin can force re-download specific properties
```

### **Database Tracking:**
```sql
PropertyImage {
  id: string
  propertyId: string (PropTx ListingKey)
  originalUrl: string (PropTx MediaURL)
  localUrl: string (Vercel Blob URL)
  downloadedAt: DateTime
  mediaChangeTimestamp: DateTime (from PropTx)
  fileSize: number
  status: 'pending' | 'downloaded' | 'failed' | 'outdated'
  order: number
}
```

## 2. **Image Freshness System**

### **How we detect outdated images:**
1. **PropTx provides MediaChangeTimestamp** for each property
2. **Compare with our downloadedAt timestamp**
3. **If PropTx timestamp is newer → Mark as outdated**
4. **Re-download outdated images**

### **Example Flow:**
```typescript
// When fetching properties
const property = await fetchFromPropTx(listingKey);
const needsUpdate = await imageService.checkImageFreshness(
  property.ListingKey, 
  property.MediaChangeTimestamp
);

if (needsUpdate) {
  await imageService.downloadPropertyImages(property.ListingKey, property.images);
}
```

## 3. **Serving Strategy**

### **Image URL Resolution:**
```typescript
async function getImageUrl(originalUrl: string, propertyId: string) {
  // 1. Check database for local image
  const localImage = await db.findLocalImage(originalUrl, propertyId);
  
  if (localImage?.status === 'downloaded') {
    return localImage.localUrl; // Serve local image
  }
  
  if (localImage?.status === 'outdated') {
    // Queue for re-download, but serve current version
    queueImageUpdate(originalUrl, propertyId);
    return localImage.localUrl;
  }
  
  // 2. No local image - queue download and serve proxy
  queueImageDownload(originalUrl, propertyId);
  return `/api/images/serve?url=${encodeURIComponent(originalUrl)}`;
}
```

## 4. **Background Jobs**

### **Daily Freshness Check:**
```typescript
// Run daily at 2 AM
async function dailyImageFreshnessCheck() {
  const properties = await getActiveProperties();
  
  for (const property of properties) {
    const needsUpdate = await checkImageFreshness(
      property.ListingKey,
      property.MediaChangeTimestamp
    );
    
    if (needsUpdate) {
      await queueImageUpdate(property.ListingKey);
    }
  }
}
```

### **Cleanup Job:**
```typescript
// Remove images for properties no longer active
async function cleanupOldImages() {
  const inactiveProperties = await getInactiveProperties();
  
  for (const property of inactiveProperties) {
    await deletePropertyImages(property.ListingKey);
  }
}
```

## 5. **Performance Optimization**

### **Lazy Loading Strategy:**
- **Priority 1:** Download images for properties currently being viewed
- **Priority 2:** Download images for properties in current search results
- **Priority 3:** Pre-download images for popular areas (Toronto, Vancouver, etc.)

### **Batch Processing:**
- Process 5-10 images at a time to avoid overwhelming PropTx
- Add delays between batches (500ms)
- Respect rate limits

## 6. **Implementation Phases**

### **Phase 1: Database Integration** ✅ (Partially Done)
- Add PropertyImage model to Prisma schema
- Track downloaded images in database
- Implement database lookup in image serving

### **Phase 2: Freshness Detection** 🔄 (Next)
- Use MediaChangeTimestamp to detect updates
- Implement re-download logic for outdated images
- Add status tracking (fresh, outdated, failed)

### **Phase 3: Background Jobs** 📅 (Future)
- Daily freshness check job
- Cleanup job for inactive properties
- Bulk processing for popular areas

### **Phase 4: Advanced Features** 🚀 (Future)
- Admin dashboard for image management
- Image analytics and monitoring
- CDN optimization
- Image variants (thumbnails, different sizes)

## 7. **Current Status**

### **What's Working:**
✅ Basic image downloading and storage
✅ Vercel Blob Storage integration
✅ Image optimization (Sharp)
✅ PropTx compliance (no direct URLs served)

### **What's Missing:**
❌ Database tracking of downloaded images
❌ Image freshness detection
❌ Update mechanism for changed images
❌ Comprehensive coverage (only first 20 properties)
❌ Background jobs for maintenance

### **Immediate Next Steps:**
1. Implement database tracking
2. Add MediaChangeTimestamp comparison
3. Expand coverage beyond first 20 properties
4. Add proper error handling and retry logic
