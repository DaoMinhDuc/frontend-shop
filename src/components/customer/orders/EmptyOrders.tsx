/**
 * Empty orders component
 * Displays an empty state with a call to action
 */
import React from 'react';
import { Card, Empty, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const EmptyOrders: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <Empty
        description="Bạn chưa có đơn hàng nào"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Button type="primary" onClick={() => navigate('/')}>
          Mua sắm ngay
        </Button>
      </div>
    </Card>
  );
};

export default EmptyOrders;
