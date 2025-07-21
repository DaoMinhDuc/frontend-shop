import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Input, Flex, Badge, Typography, Empty, Spin } from 'antd';
import { SearchOutlined, FireOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useProductSearch } from '../../../hooks/useProduct';
import { useFeaturedProducts } from '../../../hooks/useFeaturedProducts';
import type { Product } from '../../../types/product';
import ProductCard from '../products/ProductCard';
import { debounce } from 'lodash-es';

const { Text } = Typography;

interface SearchBarProps {
  onSearch?: (value: string) => void;
  isMobile?: boolean;
  isDarkMode?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isMobile = false, isDarkMode = false }) => {  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(!isMobile);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts();
  
  // Debounced search handler - only updates search text after user stops typing
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      setSearchText(value);
      setIsDropdownOpen(!!value);
    }, 300),
    []
  );
  
  // Use React Query for search with debounced search text
  const { data: searchResults = [] } = useProductSearch(searchText);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        if (isMobile) {
          setShowSearch(false);
        }
        setIsDropdownOpen(false);
      }
    };    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

  const handleSearch = (value: string) => {
    if (onSearch) {
      onSearch(value.trim());
    } else if (value.trim()) {
      navigate(`/products?search=${encodeURIComponent(value.trim())}`);
    }
    setSearchText('');
    if (isMobile) {
      setShowSearch(false);
    }
  };  const renderProductCard = (product: Product): React.ReactNode => (
    <ProductCard
      product={product}
      size="small"
      showAddToCart={false}
      cardStyle={{
        marginBottom: 8,
        cursor: 'pointer',
        borderRadius: '8px',
        backgroundColor: isDarkMode ? '#1f1f1f' : '#fff'
      }}
      imageStyle={{
        height: 48,
        width: 48,
        objectFit: 'cover',
        borderRadius: '4px'
      }}
      onProductClick={(product) => navigate(`/products/${product._id}`)}
    />
  );
  const renderDropdownContent = () => (
    <div style={{ padding: '8px 0' }}>
      {searchText.trim() ? (
        <>
          <div style={{ padding: '0 12px', marginBottom: 10 }}>
            <Text type="secondary" strong>Kết quả tìm kiếm</Text>
          </div>
          {searchResults.length > 0 ? (
            <div style={{ maxHeight: '400px', overflow: 'auto', padding: '0 12px' }}>
              {searchResults.map(product => renderProductCard(product))}
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không tìm thấy sản phẩm"
              style={{ margin: '20px 0' }}
            />
          )}
        </>
      ) : (
        <>
          <div style={{ padding: '0 12px', marginBottom: 12 }}>
            <Flex align="center" gap="small">
              <FireOutlined style={{ color: '#ff4d4f' }} />
              <Text strong>Sản phẩm nổi bật</Text>
            </Flex>
          </div>
          <div style={{ maxHeight: '400px', overflow: 'auto', padding: '0 12px' }}>            
            {featuredLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin size="small" /> <Text type="secondary" style={{ marginLeft: 8 }}>Đang tải...</Text>
              </div>
            ) : featuredProducts && Array.isArray(featuredProducts) ? (
              featuredProducts.slice(0, 5).map((product) => renderProductCard(product))
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không có sản phẩm nổi bật"
                style={{ margin: '20px 0' }}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
  if (isMobile && !showSearch) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        paddingRight: '16px'
      }}>
        <Badge count={searchResults.length} size="small">
          <SearchOutlined 
            onClick={() => setShowSearch(true)}
            style={{ 
              fontSize: '20px',
              cursor: 'pointer',
              color: isDarkMode ? '#fff' : undefined,
              marginLeft: 'auto'
            }} 
          />
        </Badge>
      </div>
    );
  }return (
    <div ref={searchRef} style={{ 
      position: isMobile ? 'absolute' : 'relative',
      top: isMobile ? '64px' : 'auto',
      left: isMobile ? '0' : 'auto',
      width: isMobile ? '100%' : '300px',
      zIndex: isMobile ? 1000 : 'auto',
      padding: isMobile ? '8px' : 0,
      backgroundColor: isDarkMode ? '#141414' : '#fff',
      boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    }}>
      <div style={{ 
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}>        <Input.Search
          placeholder="Tìm kiếm sản phẩm..."
          value={searchText}
          onChange={e => debouncedSearch(e.target.value)}
          onSearch={handleSearch}
          onFocus={() => setIsDropdownOpen(true)}
          allowClear
          style={{ 
            width: '100%',
            borderColor: isDarkMode ? '#1677ff' : undefined,
            backgroundColor: isDarkMode ? '#141414' : '#fff',
            verticalAlign: 'middle',
            height: '38px',
            lineHeight: '38px'
          }}
        />{isDropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: '38px',
              left: 0,
              right: 0,
              backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
              boxShadow: '0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08)',
              borderRadius: 8,
              border: `1px solid ${isDarkMode ? '#434343' : '#d9d9d9'}`,
              zIndex: 1000,
              maxHeight: '450px',
              overflowY: 'auto'
            }}
          >
            {renderDropdownContent()}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
