import React, { useMemo, useState } from 'react';
import { Layout } from 'antd';
import { 
  ShopOutlined, 
  FireOutlined, 
  GiftOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../../hooks/useProduct';
import { useCategories } from '../../../hooks/useCategory';
import { useTheme } from '../../../hooks/useTheme';
import type { Product } from '../../../types/product';
import HeroBanner from '../../../components/customer/home/HeroBanner';
import CategoryList from '../../../components/customer/home/CategoryList';
import ProductSection from '../../../components/customer/home/ProductSection';
import HomeHeader from '../../../components/customer/home/HomeHeader';
import HomeFooter from '../../../components/customer/home/HomeFooter';
import CustomerChatWidget from '../../../components/customer/chat/CustomerChatWidget';
import ROUTES from '../../../constants/routes';
import { getDarkModeStyles } from '../../../utils/uiUtils';

const { Content } = Layout;

const Home: React.FC = () => {
  const [, setIsChatDialogOpen] = useState(false);
  const { data: productResponse, isLoading: productsLoading, error: productsError } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const { themeOptions } = useTheme();
  const isDarkMode = themeOptions.mode === 'dark';
  const themeStyles = getDarkModeStyles(isDarkMode);
  const navigate = useNavigate();

  // Extract products from response
  const allProducts = useMemo(() => productResponse?.data || [], [productResponse?.data]);

  const bestSellingProducts = useMemo(() => {
    return allProducts.slice(0, 8);
  }, [allProducts]);
  
  const featuredProducts = useMemo(() => {
    return allProducts.filter((p: Product) => p.isFeatured).slice(0, 8);
  }, [allProducts]);
  
  const discountedProducts = useMemo(() => {
    return allProducts
      .filter((p: Product) => p.discount?.isActive && p.discount.percentage > 0)
      .sort((a: Product, b: Product) => (b.discount?.percentage || 0) - (a.discount?.percentage || 0))
      .slice(0, 8);
  }, [allProducts]);
  
  const handleViewDetails = (product: Product) => {
    navigate(ROUTES.PRODUCT_DETAIL(product._id));
  };
  
  return (
    <Layout className="home-page" style={{
      backgroundColor: themeStyles.primaryBackground
    }}>
      <HomeHeader />
      
      <Content style={{
        backgroundColor: themeStyles.primaryBackground,
        color: themeStyles.textColor
      }}>
        <HeroBanner />        
        <CategoryList 
          categories={categories}
          loading={categoriesLoading}
          error={categoriesError?.message || null}
        />
        
        <CustomerChatWidget onChatOpenChange={setIsChatDialogOpen} />
        
        <ProductSection 
          title="Sản Phẩm Nổi Bật"
          icon={<FireOutlined />}
          products={featuredProducts}
          loading={productsLoading}
          error={productsError?.message || null}
          onViewDetails={handleViewDetails}
        />

        <ProductSection 
          title="Sản Phẩm Bán Chạy"
          icon={<ShopOutlined />}
          products={bestSellingProducts}
          loading={productsLoading}
          error={productsError?.message || null}
          onViewDetails={handleViewDetails}
        />

        <ProductSection 
          title="Khuyến Mãi"
          icon={<GiftOutlined />}
          products={discountedProducts}
          loading={productsLoading}
          error={productsError?.message || null}
          onViewDetails={handleViewDetails}
        />
      </Content>
      
      <HomeFooter />
    </Layout>
  );
};

export default Home;