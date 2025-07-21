import React from 'react';
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Image,
  Tag,
  Typography
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import moment from 'moment';
import type { ColumnsType } from 'antd/es/table';
import type { Product } from '../../../types/product';
import type { Category } from '../../../types/category';

const { Text } = Typography;

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  categories,
  isLoading,
  onEdit,
  onDelete,
  onView
}) => {
  // Format currency in VND
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderCategory = (categoryValue: Product['category']) => {
    if (typeof categoryValue === 'object' && categoryValue !== null) {
      return <Tag color="blue">{categoryValue.name}</Tag>;
    }
    const category = categories.find(c => c._id === categoryValue);
    return <Tag color="blue">{category?.name || 'N/A'}</Tag>;
  };

  const columns: ColumnsType<Product> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => index + 1
    },
    {
      title: 'Sản phẩm',
      key: 'product',
      width: 300,
      render: (record: Product) => (
        <Space>
          <Image
            src={record.imageUrl}
            alt={record.name}
            width={60}
            height={60}
            style={{ objectFit: 'cover', borderRadius: 4 }}
          />
          <Text
            strong
            style={{ color: '#1890ff', cursor: 'pointer' }}
            onClick={() => onView(record._id)}
          >
            {record.name}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record: Product) => {        const now = moment();
        const startDate = record.discount?.startDate ? moment(record.discount.startDate) : null;
        const endDate = record.discount?.endDate ? moment(record.discount.endDate) : null;
        const hasDiscount = record.discount?.isActive && 
          record.discount.percentage > 0 && 
          (!startDate || startDate.isBefore(now)) &&
          (!endDate || endDate.isAfter(now));

        if (hasDiscount) {
          const discountedPrice = price * (1 - (record.discount?.percentage || 0) / 100);
          return (
            <Space direction="vertical" size={0}>
              <Text delete>{formatCurrency(price)}</Text>
              <Text type="danger" strong>{formatCurrency(discountedPrice)}</Text>
            </Space>
          );
        }

        return <Text>{formatCurrency(price)}</Text>;
      },
      sorter: (a, b) => a.price - b.price,
      width: 150
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: renderCategory,
      filters: categories.map(category => ({
        text: category.name,
        value: category._id
      })),
      onFilter: (value, record) => {
        const categoryId = typeof record.category === 'object' 
          ? record.category._id 
          : record.category;
        return categoryId === value;
      },
      width: 120
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 180,
      filters: [
        { text: 'Còn hàng', value: 'inStock' },
        { text: 'Hết hàng', value: 'outOfStock' },
        { text: 'Nổi bật', value: 'featured' },
        { text: 'Đang khuyến mãi', value: 'discounted' }
      ],
      render: (_: unknown, record: Product) => {
        const now = moment();
        const isDiscountActive = record.discount?.isActive && 
          record.discount.percentage > 0 &&
          (!record.discount.startDate || moment(record.discount.startDate).isBefore(now)) &&
          (!record.discount.endDate || moment(record.discount.endDate).isAfter(now));

        return (
          <Space size={[0, 4]} wrap>
            {record.inStock ? (
              <Tag color="success">Còn hàng</Tag>
            ) : (
              <Tag color="error">Hết hàng</Tag>
            )}
            {record.isFeatured && (
              <Tag color="warning">Nổi bật</Tag>
            )}
            {isDiscountActive && (
              <Tag color="error">-{record.discount?.percentage}%</Tag>
            )}
          </Space>
        );
      },      onFilter: (value: boolean | React.Key, record: Product): boolean => {
        const now = moment();
        const isDiscountActive = record.discount?.isActive === true && 
          (record.discount.percentage || 0) > 0 &&
          (!record.discount.startDate || moment(record.discount.startDate).isBefore(now)) &&
          (!record.discount.endDate || moment(record.discount.endDate).isAfter(now));

        const filterValue = value.toString();
        switch(filterValue) {
          case 'inStock':
            return record.inStock;
          case 'outOfStock': 
            return !record.inStock;
          case 'featured':
            return record.isFeatured === true;
          case 'discounted':
            return isDiscountActive === true;
          default:
            return false;
        }
      }
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
      width: 100
    },
    {
      title: 'Khuyến mãi',
      key: 'discount',
      width: 200,
      render: (_: unknown, record: Product) => {
        if (!record.discount?.isActive) return <Text>Không có</Text>;

        const now = moment();
        const startDate = record.discount.startDate ? moment(record.discount.startDate) : null;
        const endDate = record.discount.endDate ? moment(record.discount.endDate) : null;
        
        let status: string;
        let color: string;
        
        if (!startDate || startDate.isBefore(now)) {
          if (!endDate) {
            status = 'Đang diễn ra';
            color = 'success';
          } else if (endDate.isAfter(now)) {
            const daysLeft = endDate.diff(now, 'days');
            status = daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Sắp kết thúc';
            color = daysLeft > 3 ? 'success' : 'warning';
          } else {
            status = 'Đã kết thúc';
            color = 'error';
          }
        } else {
          status = 'Chưa bắt đầu';
          color = 'processing';
        }        return (
          <Space direction="vertical" size={2}>
            <Tag color={color}>{status}</Tag>
            <Text strong style={{ fontSize: '14px' }}>
              -{record.discount.percentage}%
            </Text>
            {startDate && (
              <Text  style={{ fontSize: '14px' }}>
                Bắt đầu: {startDate.format('DD/MM/YYYY')}
              </Text>
            )}
            {endDate && (
              <Text  style={{ fontSize: '14px' }}>
                Kết thúc: {endDate.format('DD/MM/YYYY')}
              </Text>
            )}
          </Space>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      align: 'center',
      render: (record: Product) => (
        <Space>
          <Button 
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record._id)}
            size="small"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa sản phẩm này?"
            onConfirm={() => onDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button 
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="_id"
      loading={isLoading}
      pagination={false}
      locale={{ emptyText: 'Không có dữ liệu' }}
      scroll={{ x: 1200 }}
      style={{ width: '100%' }}
    />
  );
};

export default ProductTable;
