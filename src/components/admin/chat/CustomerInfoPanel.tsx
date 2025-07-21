// CustomerInfoPanel.tsx
import React from 'react';
import { Card, Button, Form, Space, Tag, Typography, Input, Tabs } from 'antd';
import { UserOutlined, MenuFoldOutlined, TagOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import type { ExtendedChat } from './types';

const { Text, Title } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface CustomerInfoPanelProps {
  currentChat: ExtendedChat;
  showInfoPanel: boolean;
  setShowInfoPanel: (show: boolean) => void;
  handleManageTags: () => void;
}

const CustomerInfoPanel: React.FC<CustomerInfoPanelProps> = ({
  currentChat,
  showInfoPanel,
  setShowInfoPanel,
  handleManageTags
}) => {  return (
    <div className={`customer-info-panel ${!showInfoPanel ? 'customer-info-panel-collapsed' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <Title level={5}>Thông tin khách hàng</Title>
        <Button 
          type="text" 
          icon={<MenuFoldOutlined />} 
          onClick={() => setShowInfoPanel(false)}
        />
      </div>
      
      <Tabs defaultActiveKey="info">
        <TabPane tab="Thông tin" key="info">
          <Card size="small" style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ position: 'relative', marginRight: '10px' }}>
                <UserOutlined style={{ fontSize: '24px' }} />
                <span 
                  style={{ 
                    position: 'absolute', 
                    width: '8px', 
                    height: '8px', 
                    backgroundColor: '#52c41a', 
                    borderRadius: '50%', 
                    bottom: 0, 
                    right: 0, 
                    border: '1px solid white' 
                  }}
                />
              </div>
              <div>
                <Text strong>{currentChat.customer.name}</Text>
                <div>
                  <Text className="text-secondary">{currentChat.customer.email}</Text>
                </div>
              </div>
            </div>
            
            {currentChat.customerData && (
              <>
                {currentChat.customerData?.phone && (
                  <div style={{ marginBottom: '5px' }}>
                    <Text className="text-secondary">Số điện thoại:</Text>
                    <div>{currentChat.customerData?.phone}</div>
                  </div>
                )}
                
                {currentChat.customerData?.orderCount && (
                  <div style={{ marginBottom: '5px' }}>
                    <Text className="text-secondary">Số đơn hàng:</Text>
                    <div>{currentChat.customerData?.orderCount}</div>
                  </div>
                )}
                
                {currentChat.customerData?.totalSpent && (
                  <div style={{ marginBottom: '5px' }}>
                    <Text className="text-secondary">Tổng chi tiêu:</Text>
                    <div>{currentChat.customerData?.totalSpent?.toLocaleString()} đ</div>
                  </div>
                )}
              </>
            )}
          </Card>
          
          <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong>Tags</Text>
            <Button 
              type="text" 
              icon={<TagOutlined />} 
              size="small"
              onClick={handleManageTags}
            >
              Quản lý
            </Button>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            {currentChat.tags?.length ? (
              <Space wrap>
                {currentChat.tags?.map((tag: string, index: number) => (
                  <Tag key={index} color="blue">{tag}</Tag>
                ))}
              </Space>
            ) : (
              <Text className="text-secondary">Chưa có tag</Text>
            )}
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <Text strong>Ghi chú</Text>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            {currentChat.notes?.length ? (
              currentChat.notes?.map((note: {text: string; createdAt: string}, index: number) => (
                <Card 
                  key={index} 
                  size="small" 
                  style={{ marginBottom: '10px' }}
                >
                  <Text>{note.text}</Text>
                  <div>
                    <Text style={{ fontSize: '12px' }}>
                      {format(new Date(note.createdAt), 'dd/MM/yyyy HH:mm')}
                    </Text>
                  </div>
                </Card>
              ))
            ) : (
              <Text className="text-secondary">Chưa có ghi chú</Text>
            )}
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <Form layout="vertical">
              <Form.Item label="Thêm ghi chú mới">
                <TextArea rows={3} />
              </Form.Item>
              <Button type="primary" size="small">
                Lưu ghi chú
              </Button>
            </Form>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CustomerInfoPanel;
