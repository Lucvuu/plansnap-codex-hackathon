// PlanSnap client-side image compressor: Canvas, max 1600px, JPEG quality 0.8.
class ImageCompressor {
  static loadImage(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`Không thể đọc ảnh ${file.name || ''}.`)); };
      img.src = url;
    });
  }

  static canvasToBlob(canvas, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Trình duyệt không thể nén ảnh.')),
        'image/jpeg', quality
      );
    });
  }

  static blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error('Không thể đọc ảnh đã nén.'));
      reader.readAsDataURL(blob);
    });
  }

  static async compress(file, maxDimension = 1600, quality = 0.8) {
    if (!(file instanceof Blob) || !String(file.type || '').startsWith('image/')) {
      throw new TypeError('Tệp đã chọn không phải ảnh hợp lệ.');
    }
    const img = await ImageCompressor.loadImage(file);
    const sourceWidth = img.naturalWidth || img.width;
    const sourceHeight = img.naturalHeight || img.height;
    const longestEdge = Math.max(sourceWidth, sourceHeight);
    const scale = longestEdge > maxDimension ? maxDimension / longestEdge : 1;
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Thiết bị không hỗ trợ Canvas 2D.');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await ImageCompressor.canvasToBlob(canvas, quality);
    const dataUrl = await ImageCompressor.blobToDataUrl(blob);
    const originalSizeKb = Math.max(1, Math.round(file.size / 1024));
    const compressedSizeKb = Math.max(1, Math.round(blob.size / 1024));
    const savingsPercent = Math.max(0, Math.round((1 - blob.size / Math.max(1, file.size)) * 100));
    return {
      id: `image-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name || 'anh-chup.jpg',
      fileName: file.name || 'anh-chup.jpg',
      originalSizeKb, compressedSizeKb, savingsPercent, dataUrl,
      base64Data: dataUrl.split(',')[1], mimeType: 'image/jpeg', width, height
    };
  }

  static compressMultiple(files) {
    return Promise.all(Array.from(files || []).map((file) => ImageCompressor.compress(file)));
  }
}

window.ImageCompressor = ImageCompressor;
