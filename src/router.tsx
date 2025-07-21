import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from './hooks/useAuth';
import { AdminRoute, ProtectedRoute } from './components/auth/ProtectedRoute';
import { ROUTES } from './constants/routes';

// Lazy load components
const Home = lazy(() => import('./pages/customer/home/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const AdminDashboard = lazy(() => import('./pages/admin/dashboard/AdminDashboard'));

// Admin components
const UserList = lazy(() => import('./pages/admin/users/UserList'));
const AdminDashboardIndex = lazy(() => import('./pages/admin/dashboard/AdminDashboardIndex'));
const AdminChatPage = lazy(() => import('./pages/admin/chat/AdminChatPage'));

// Product management pages
const ProductList = lazy(() => import('./pages/admin/products/ProductList'));
const ProductAdd = lazy(() => import('./pages/admin/products/ProductAdd'));
const ProductEdit = lazy(() => import('./pages/admin/products/ProductEdit'));
const ProductDetail = lazy(() => import('./pages/admin/products/ProductDetail'));
const CustomerProductDetail = lazy(() => import('./pages/customer/products/ProductDetail'));

// Category management pages
const CategoryList = lazy(() => import('./pages/admin/categories/CategoryList'));
const CategoryAdd = lazy(() => import('./pages/admin/categories/CategoryAdd'));
const CategoryEdit = lazy(() => import('./pages/admin/categories/CategoryEdit'));
const CategoryDetail = lazy(() => import('./pages/admin/categories/CategoryDetail'));

// Order management pages
const OrderList = lazy(() => import('./pages/admin/orders/OrderList'));
const OrderEdit = lazy(() => import('./pages/admin/orders/OrderEdit'));
const OrderDetail = lazy(() => import('./pages/admin/orders/OrderDetail'));

// Customer pages
const ShoppingCartPage = lazy(() => import('./pages/customer/cart/ShoppingCartPage'));
const CheckoutPage = lazy(() => import('./pages/customer/checkout/CheckoutPage'));
const OrderHistory = lazy(() => import('./pages/customer/orders/OrderHistory'));
const CustomerOrderDetail = lazy(() => import('./pages/customer/orders/OrderDetail'));
const CustomerProfile = lazy(() => import('./pages/customer/profile/CustomerProfile'));
const CategoryProductsPage = lazy(() => import('./pages/customer/products/CategoryProducts'));

// Other pages
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const UserAdd = lazy(() => import('./pages/admin/users/UserAdd'));
const UserEdit = lazy(() => import('./pages/admin/users/UserEdit'));
const UserDetail = lazy(() => import('./pages/admin/users/UserDetail'));

const LoadingComponent = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <Spin size="large" />
  </div>
);

const DashboardRouter = () => {
  const { user, isLoading: loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return null;
  }
  
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to={ROUTES.ADMIN.ROOT} replace />;
  } else {
    return <Navigate to={ROUTES.HOME} replace />;
  }
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: loading } = useAuth();
  const location = useLocation();
  

  if (loading) {
    return <LoadingComponent />;
  }

  if (user) {
    const from = location.state?.from?.pathname || 
      (user.role === 'admin' ? ROUTES.ADMIN.ROOT : ROUTES.HOME);
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        
        <Route path={ROUTES.LOGIN} element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        <Route path={ROUTES.REGISTER} element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
          <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
          <Route path={ROUTES.CART} element={<ShoppingCartPage />} />        
          <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
          <Route path={ROUTES.PRODUCTS} element={<CategoryProductsPage />} />
          <Route path="/products/:id" element={<CustomerProductDetail />} /><Route path={ROUTES.CUSTOMER.ORDERS} element={
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        } />
        
        <Route path="/customer/orders/detail/:id" element={
          <ProtectedRoute>
            <CustomerOrderDetail />
          </ProtectedRoute>
        } />
        
        <Route path={ROUTES.CUSTOMER.PROFILE} element={
          <ProtectedRoute>
            <CustomerProfile />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route 
          path={ROUTES.ADMIN.ROOT}
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboardIndex />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/add" element={<UserAdd />} />
          <Route path="users/edit/:id" element={<UserEdit />} />
          <Route path="users/detail/:id" element={<UserDetail />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<ProductAdd />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />
          <Route path="products/detail/:id" element={<ProductDetail />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="categories/add" element={<CategoryAdd />} />
          <Route path="categories/edit/:id" element={<CategoryEdit />} />
          <Route path="categories/detail/:id" element={<CategoryDetail />} />
          <Route path="orders" element={<OrderList />} />          
          <Route path="orders/edit/:id" element={<OrderEdit />} />
          <Route path="orders/detail/:id" element={<OrderDetail />} />
          <Route path="chat" element={<AdminChatPage />} />
        </Route>
        
        <Route path={ROUTES.DASHBOARD} element={<DashboardRouter />} />
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;