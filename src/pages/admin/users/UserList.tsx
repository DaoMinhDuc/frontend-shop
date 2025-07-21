import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useUserFilters } from '../../../hooks/useUserFilters';
import { useDeleteUser } from '../../../hooks/useUser';
import { PageHeader, TablePagination, CustomCard } from '../../../components/shared';
import UserFilter from '../../../components/admin/users/UserFilter';
import UserTable from '../../../components/admin/users/UserTable';
import { ROUTES } from '../../../constants/routes';

const UserList: React.FC = () => {
  const navigate = useNavigate();  
  const {
    searchText,
    roleFilter,
    activeStatus,
    dateRange,
    currentPage,
    pageSize,
    userRoles,
    paginatedData,
    isLoading,
    totalCount,
    handleSearchChange,
    handleRoleChange,
    handleActiveStatusChange,
    handleDateRangeChange,
    handlePaginationChange,
    resetFilters
  } = useUserFilters();
  // Handle user actions
  const handleAddUser = () => {
    navigate(ROUTES.ADMIN.USERS.ADD);
  };
  
  const handleViewUser = (id: string) => {
    navigate(ROUTES.ADMIN.USERS.DETAIL(id));
  };

  const handleEditUser = (id: string) => {
    navigate(ROUTES.ADMIN.USERS.EDIT(id));
  };  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  
  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  return (
    <CustomCard>
      <PageHeader 
        title="Quản lý người dùng"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddUser}
          >
            Thêm người dùng
          </Button>
        }
        showBackButton={false}
      />
      
      <UserFilter
        searchText={searchText}
        roleFilter={roleFilter}
        activeStatus={activeStatus}
        dateRange={dateRange}
        userRoles={userRoles}
        isLoading={isLoading}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleChange}
        onActiveStatusChange={handleActiveStatusChange}
        onDateRangeChange={handleDateRangeChange}
        onResetFilters={resetFilters}
      />      
      <UserTable
        users={paginatedData}
        loading={isLoading || isDeleting}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onView={handleViewUser}
      />
      
      <TablePagination
        total={totalCount}
        pageSize={pageSize}
        current={currentPage}
        onChange={handlePaginationChange}
      />
    </CustomCard>
  );
};

export default UserList;
