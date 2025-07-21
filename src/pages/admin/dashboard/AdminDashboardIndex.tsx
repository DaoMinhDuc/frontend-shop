import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useAuth } from '../../../hooks/useAuth';

import AdminOverview from '../../../components/admin/dashboard/AdminOverview';
import UserProfileCard from '../../../components/admin/dashboard/UserProfileCard';
import api from '../../../services/api';
import { adminNavigationHelper } from '../../../utils/navigationHelper';
import type { User } from '../../../types/user';

const AdminDashboardIndex = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users');
        setUsers(response.data.data); // Access the users array in data.data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        message.error(error.response?.data?.message || 'Failed to fetch users');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleNavigateToUsers = () => {
    adminNavigationHelper.navigateToUsers(navigate);
  };

  const handleNavigateToProducts = () => {
    adminNavigationHelper.navigateToProducts(navigate);
  };

  return (
    <>
      {user && <UserProfileCard user={user} />}
      <AdminOverview 
        userCount={users.length} 
        adminCount={users.filter(u => u.role === 'admin').length}
        onNavigateToUsers={handleNavigateToUsers}
        onNavigateToProducts={handleNavigateToProducts}
      />
    </>
  );
};

export default AdminDashboardIndex;
