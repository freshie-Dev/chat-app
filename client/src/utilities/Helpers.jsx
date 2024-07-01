import imageCompression from 'browser-image-compression';



const formatTime = (timestamp) => {
    const date = new Date(timestamp);

    // Format the date to show only day, month, and year
    const formattedDate = date.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return formattedDate;
  };

  const compressImage = async (file) => {
    try {
        const compressedImage = await imageCompression(file, {
            maxSizeMB: 0.1,
            maxWidthOrHeight: 1024,
            useWebWorker: true
        });
        return compressedImage
    } catch (error) {
        console.error('Error compressing image:', error);
    }
}

const imageToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
          resolve(reader.result);
      };
      reader.onerror = reject;

      reader.readAsDataURL(file);
  });
};
  export {formatTime, compressImage, imageToBase64}