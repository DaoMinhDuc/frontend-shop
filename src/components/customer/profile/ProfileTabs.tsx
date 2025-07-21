import React from 'react';
import { Tabs, Card, Spin } from 'antd';
import type { TabsProps } from 'antd';

interface ProfileTabsProps {
  activeKey: string;
  onChange: (key: string) => void;
  items: TabsProps['items'];
  loading: boolean;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeKey,
  onChange,
  items,
  loading
}) => {
  return (
    <Card>
      <Spin spinning={loading}>
        <Tabs activeKey={activeKey} onChange={onChange} items={items} />
      </Spin>
    </Card>
  );
};

export default ProfileTabs;
