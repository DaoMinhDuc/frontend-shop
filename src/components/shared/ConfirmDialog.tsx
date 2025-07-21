import React from 'react';
import { Modal } from 'antd';

export interface ConfirmDialogProps {
  title: string;
  content: React.ReactNode;
  okText?: string;
  cancelText?: string;
  okType?: 'primary' | 'dashed' | 'link' | 'text' | 'default' | 'danger';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  open: boolean;
  confirmLoading?: boolean;
  width?: number | string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  content,
  okText = 'Xác nhận',
  cancelText = 'Hủy',
  okType = 'primary',
  onConfirm,
  onCancel,
  open,
  confirmLoading,
  width = 416,
  ...rest
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      okType={okType}
      confirmLoading={confirmLoading}
      width={width}
      maskClosable={false}
      centered
      {...rest}
    >
      {content}
    </Modal>
  );
};

export default ConfirmDialog;
