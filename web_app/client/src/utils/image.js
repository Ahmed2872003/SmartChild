import imageCompression from 'browser-image-compression';

export const compressImage = async (imageFile, maxSizeMB = 1, maxWidthOrHeight = 1920) => {
  if (!imageFile || !imageFile.type.startsWith('image/')) {
    throw new Error('Invalid file provided. Please provide an image file.');
  }

  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
  };

  try {
    const compressedData = await imageCompression(imageFile, options);

    const finalFile = new File([compressedData], imageFile.name, {
      type: imageFile.type || 'image/jpeg',
      lastModified: Date.now(),
    });

    if (import.meta.env.DEV) {
      console.log(`Original: ${(imageFile.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Compressed: ${(finalFile.size / 1024 / 1024).toFixed(2)} MB`);
    }

    return finalFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};
