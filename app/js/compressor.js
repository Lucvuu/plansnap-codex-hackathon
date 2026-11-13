// PlanSnap Client-side Image Compressor - Canvas max 1600px JPEG
class ImageCompressor {
  static async compress(file, maxDimension = 1600, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // Resize if exceeding maxDimension
          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          const base64Data = compressedDataUrl.split(',')[1];
          const originalSizeKb = Math.round(file.size / 1024);
          const compressedSizeKb = Math.round((base64Data.length * 3) / 4 / 1024);

          resolve({
            name: file.name,
            originalSizeKb,
            compressedSizeKb,
            dataUrl: compressedDataUrl,
            base64Data,
            mimeType: 'image/jpeg',
            width,
            height
          });
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  }

  static async compressMultiple(files) {
    const results = [];
    for (let i = 0; i < files.length; i++) {
      const res = await ImageCompressor.compress(files[i]);
      results.push(res);
    }
    return results;
  }
}

window.ImageCompressor = ImageCompressor;

