import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { 
  PlusOutlined, 
  LoadingOutlined, 
  CloseCircleOutlined
} from '@ant-design/icons';
import type { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import { uploadImage, uploadImageDirect } from '../../services/uploadService';

interface ImageUploaderProps {
  value?: string;
  onChange?: (value: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange }) => {
  const [imageUrl, setImageUrl] = useState<string>(value || '');
  const [uploading, setUploading] = useState(false);

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Kích thước hình ảnh phải nhỏ hơn 2MB!');
    }
    
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }
    
    if (info.file.status === 'done') {
      setUploading(false);
      const newImageUrl = info.file.response.imageUrl;
      setImageUrl(newImageUrl);
      onChange?.(newImageUrl);
    }
  };

  const customUpload = async (options: UploadRequestOption) => {
    const { file, onSuccess, onError } = options;
    try {
      try {
        const result = await uploadImage(file as File);
        setImageUrl(result.imageUrl);
        onChange?.(result.imageUrl);
        onSuccess?.(result, file);
        return;
      } catch (backendError) {
        console.warn('Backend upload failed, trying direct Cloudinary upload:', backendError);
        const directResult = await uploadImageDirect(file as File);
        
        if (directResult && directResult.imageUrl) {
          setImageUrl(directResult.imageUrl);
          onChange?.(directResult.imageUrl);
          onSuccess?.(directResult, file);
        } else {
          throw new Error('Không nhận được URL hình ảnh từ Cloudinary');
        }
      }
    } catch (error) {
      console.error('All upload methods failed:', error);
      message.error('Không thể tải lên hình ảnh. Vui lòng thử lại.');
      onError?.(error instanceof Error ? error : new Error('Upload failed'));
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageUrl('');
    onChange?.('');
  };
  const uploadButton = (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: '100%',
      padding: '20px'
    }}>
      {uploading ? (
        <LoadingOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
      ) : (
        <PlusOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
      )}
      <div style={{ marginTop: 16, fontSize: '16px', textAlign: 'center' }}>
        Kéo và thả hoặc nhấn để tải lên ảnh sản phẩm
      </div>
    </div>
  );

  return (
    <div className="custom-upload-container" style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px dashed #d9d9d9',
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden',
      height: '200px',
      width: '100%'
    }}>
      <Upload.Dragger
        name="image"
        accept="image/jpeg,image/png"
        showUploadList={false}
        customRequest={customUpload}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        style={{ 
          padding: 0,
          border: 'none',
          background: 'transparent',
          height: '100%',
          width: '100%',
          display: imageUrl ? 'none' : 'block'
        }}
      >
        {uploadButton}
      </Upload.Dragger>
      
      {imageUrl && (
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img 
            src={imageUrl} 
            alt="product" 
            style={{ 
              maxWidth: '200px', 
              maxHeight: '200px', 
              objectFit: 'contain'
            }} 
          />
          <div
            className="image-remove-button"
            onClick={handleRemoveImage}
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '50%',
              padding: 4,
              zIndex: 10
            }}
          >
            <CloseCircleOutlined style={{ fontSize: '18px', color: '#ff4d4f' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
