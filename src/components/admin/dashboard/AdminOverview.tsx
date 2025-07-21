import { Card, Typography, Button } from 'antd';

const { Title, Paragraph } = Typography;

interface AdminOverviewProps {
  userCount: number;
  adminCount: number;
  onNavigateToUsers: () => void;
  onNavigateToProducts: () => void;
}

const AdminOverview: React.FC<AdminOverviewProps> = ({
  userCount,
  adminCount,
  onNavigateToUsers,
  onNavigateToProducts
}) => {
  return (
    <Card>
      <div className="user-info">
        <Title level={4}>Tổng quan hệ thống</Title>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <Title level={5}>Chào mừng đến trang quản trị</Title>
        <Paragraph>
          Đây là trang tổng quan hệ thống nơi bạn có thể xem các thông tin và thống kê quan trọng.
          Sử dụng menu bên trái để điều hướng đến các phần quản lý khác nhau.
        </Paragraph>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        <Card style={{ width: '48%', marginBottom: '16px' }}>
          <Title level={5}>Người dùng</Title>
          <Paragraph>
            Tổng số người dùng: {userCount}
          </Paragraph>
          <Paragraph>
            Quản trị viên: {adminCount}
          </Paragraph>
          <Button type="primary" onClick={onNavigateToUsers}>
            Quản lý người dùng
          </Button>
        </Card>

        <Card style={{ width: '48%', marginBottom: '16px' }}>
          <Title level={5}>Sản phẩm</Title>
          <Paragraph>
            Quản lý danh sách sản phẩm, thêm, sửa và xóa sản phẩm.
          </Paragraph>
          <Button type="primary" onClick={onNavigateToProducts}>
            Quản lý sản phẩm
          </Button>
        </Card>
      </div>
    </Card>
  );
};

export default AdminOverview;