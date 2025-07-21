import api from './api';
import { CLOUDINARY_UPLOAD_URL } from '../config';

/**
 * Uploads an image to the backend API
 */
export const uploadImage = async (file: File): Promise<{ imageUrl: string }> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const { data } = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    });
    
    return data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Uploads an image directly to Cloudinary without going through backend
 * This is used as fallback or in development mode
 */
export const uploadImageDirect = async (file: File): Promise<{ imageUrl: string }> => {
  try {
    const formData = new FormData();    // Trong Cloudinary, field name phải là 'file' không phải 'image'
    formData.append('file', file);
    
    // 'upload_preset' phải được cấu hình trong Cloudinary Dashboard
    // Unsigned uploading cần một preset đã cấu hình trước
    // ml_default là preset mặc định của Cloudinary, hoạt động với hầu hết các tài khoản
    formData.append('upload_preset', 'ml_default'); 
    
    // Thêm tham số để tránh cache
    formData.append('timestamp', String(Date.now()));
      // Handle Cloudinary URL
    // If it's a full Cloudinary URL, extract the cloud name
    let uploadUrl = CLOUDINARY_UPLOAD_URL;
    
    if (uploadUrl.startsWith('cloudinary://')) {
      // Extract the cloud name from the Cloudinary URL
      const cloudName = uploadUrl.split('@')[1];
      if (cloudName) {
        uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName.replace(/\/$/, '')}/image/upload`;
      } else {
        // Fallback to hardcoded cloud name if parsing fails
        uploadUrl = 'https://api.cloudinary.com/v1_1/drvf09f8r/image/upload';
      }
    }
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });
      if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary error response:', errorText);
      throw new Error(`Upload failed with status: ${response.status}, details: ${errorText}`);
    }
    
    const data = await response.json();
    
    console.log('Cloudinary upload successful:', data);
    return {
      imageUrl: data.secure_url
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};
