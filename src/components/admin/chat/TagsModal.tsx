
import React from 'react';
import { Modal, Form, Select } from 'antd';
import type { ChatTags } from './types';

const { Option } = Select;

interface TagsModalProps {
  visible: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  onCancel: () => void;
  onSubmit: (values: ChatTags) => void;
}

const TagsModal: React.FC<TagsModalProps> = ({ visible, form, onCancel, onSubmit }) => {
  return (
    <Modal
      title="Quản lý tags"
      visible={visible}
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item
          name="tags"
          label="Tags"
        >
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Thêm tags"
            tokenSeparators={[',']}
          >
            <Option value="vip">VIP</Option>
            <Option value="new">Khách hàng mới</Option>
            <Option value="problem">Có vấn đề</Option>
            <Option value="feedback">Phản hồi</Option>
            <Option value="returns">Đổi trả</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TagsModal;
