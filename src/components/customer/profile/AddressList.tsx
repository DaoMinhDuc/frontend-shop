import React, { useState } from 'react';
import {
  List,
  Card,
  Button,
  Typography,
  Modal,
  Form,
  Input,
  Radio,
  Popconfirm,
  message,
  Tag,
  Empty,
  Space
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useManageAddresses, useAddresses } from '../../../hooks/useUser';
import type { Address, AddressInput } from '../../../types/user';

const { Title } = Typography;

const AddressList: React.FC = () => {
  const [addressForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  // Use our custom hooks
  const { data: addresses = [], isLoading, isError } = useAddresses();
  const { 
    addAddress, 
    updateAddress, 
    deleteAddress 
  } = useManageAddresses();
  
  const showAddressModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      addressForm.setFieldsValue(address);
    } else {
      setEditingAddress(null);
      addressForm.resetFields();
      // If it's the first address, set as default automatically
      if (addresses.length === 0) {
        addressForm.setFieldsValue({ isDefault: true });
      }
    }
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingAddress(null);
    addressForm.resetFields();
  };
  
  const handleAddressSubmit = async (values: AddressInput & { isDefault: boolean }) => {
    try {
      if (editingAddress) {
        updateAddress.mutate({ 
          ...values, 
          _id: editingAddress._id
        } as Address);
      } else {
        addAddress.mutate(values);
      }
      
      setModalVisible(false);
      setEditingAddress(null);
      addressForm.resetFields();
    } catch (error) {
      console.error('Error saving address:', error);
      message.error('Không thể lưu địa chỉ. Vui lòng thử lại.');
    }
  };
  
  const handleDelete = (addressId: string) => {
    deleteAddress.mutate(addressId);
  };

  if (isLoading) {
    return <Card loading />;
  }

  if (isError) {
    return <Card>
      <Empty
        description="Không thể tải danh sách địa chỉ. Vui lòng thử lại sau."
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    </Card>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4}>Sổ địa chỉ</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => showAddressModal()}
          >
            Thêm địa chỉ mới
          </Button>
        </div>

        {addresses.length === 0 ? (
          <Empty 
            description="Bạn chưa có địa chỉ nào trong sổ" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={addresses}
            renderItem={item => (
              <List.Item>
                <Card>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start' 
                  }}>
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>{item.name}</strong>
                        {item.isDefault && (
                          <Tag color="blue" style={{ marginLeft: 8 }}>
                            Mặc định
                          </Tag>
                        )}
                      </div>
                      <div>{item.phone}</div>
                      <div>{item.address}</div>
                      <div>{item.city}</div>
                    </div>
                    <Space>
                      <Button 
                        icon={<EditOutlined />}
                        onClick={() => showAddressModal(item)}
                        loading={updateAddress.isPending && editingAddress?._id === item._id}
                      >
                        Sửa
                      </Button>
                      <Popconfirm
                        title="Xóa địa chỉ này?"
                        description="Bạn có chắc chắn muốn xóa địa chỉ này?"
                        onConfirm={() => handleDelete(item._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <Button 
                          danger 
                          icon={<DeleteOutlined />}
                          loading={deleteAddress.isPending}
                        >
                          Xóa
                        </Button>
                      </Popconfirm>
                    </Space>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Card>

      <Modal
        title={editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          form={addressForm}
          layout="vertical"
          onFinish={handleAddressSubmit}
          initialValues={{ isDefault: addresses.length === 0 }}
        >
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            label="Tỉnh/Thành phố"
            name="city"
            rules={[{ required: true, message: 'Vui lòng nhập tỉnh/thành phố' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="isDefault"
            valuePropName="checked"
          >
            <Radio>
              Đặt làm địa chỉ mặc định
            </Radio>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={addAddress.isPending || updateAddress.isPending}
              >
                {editingAddress ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button onClick={handleModalCancel}>Hủy bỏ</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddressList;
