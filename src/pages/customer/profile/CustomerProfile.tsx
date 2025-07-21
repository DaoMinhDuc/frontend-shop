import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import LoginPrompt from '../../../components/customer/profile/LoginPrompt';
import ProfileTabs from '../../../components/customer/profile/ProfileTabs';
import PageLayout from '../../../layouts/common/PageLayout';
import { getProfileTabItems } from '../../../components/customer/profile/profileTabConfig';
import { useUserProfile } from '../../../hooks/useUserQuery';
import { toast } from 'react-toastify';

const CustomerProfile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('profile');  const { 
    data: userData, 
    isLoading: isProfileLoading,
    error: profileError
  } = useUserProfile();
  React.useEffect(() => {
    if (profileError) {
      toast.error('Không thể tải thông tin cá nhân');
    }
  }, [profileError]);

  const handleTabChange = (key: string): void => {
    setActiveTab(key);
  };

  const loading = isProfileLoading;

  if (!user) {
    return (
      <PageLayout title="Trang cá nhân">
        <LoginPrompt />
      </PageLayout>
    );
  }

  const tabItems = getProfileTabItems(userData || { ...user, createdAt: '' });
  return (
    <PageLayout title="Trang cá nhân">
      <ProfileTabs 
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabItems}
        loading={loading}
      />
    </PageLayout>
  );
};

export default CustomerProfile;
