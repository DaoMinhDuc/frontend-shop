
import React from 'react';
import { Spin } from 'antd';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = 'Đang tải dữ liệu...'
}) => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Spin size="large" />
      <div style={{ marginTop: 16 }}>{message}</div>
    </div>
  );
};

export default LoadingIndicator;
