import type { TabsProps } from 'antd';
import { 
  UserOutlined, 
  EnvironmentOutlined, 
  HeartOutlined, 
  HistoryOutlined,
  CommentOutlined
} from '@ant-design/icons';
import type { User } from '../../../types/user';
import ProfileInfo from './ProfileInfo';
import AddressList from './AddressList';
import OrderHistory from './OrderHistory';
import WishList from './WishList';
import CustomerProfileChat from '../chat/CustomerProfileChat';

/**
 * Configuration for profile tabs
 * @param userData User profile data
 * @returns Tab configuration for profile page
 */
export const getProfileTabItems = (
  userData: User | null | undefined
): TabsProps['items'] => {  
  return [
    {
      key: "profile",
      label: (<span><UserOutlined /> Thông tin tài khoản</span>),
      children: <ProfileInfo user={userData || { _id: '', name: '', email: '', role: '', createdAt: '' }} />
    },
    {
      key: "addresses",
      label: (<span><EnvironmentOutlined /> Địa chỉ giao hàng</span>),
      children: <AddressList />
    },
    {
      key: "orders",
      label: (<span><HistoryOutlined /> Lịch sử đơn hàng</span>),
      children: <OrderHistory />
    },
    {
      key: "chat",
      label: (<span><CommentOutlined /> Hỗ trợ trực tuyến</span>),
      children: <CustomerProfileChat />
    },
    {
      key: "wishlist",
      label: (<span><HeartOutlined /> Sản phẩm yêu thích</span>),
      children: <WishList />
    }
  ];
};
