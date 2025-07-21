import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Spin, Empty, Carousel, Grid } from 'antd';
import { ShopOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import type { Category } from '../../../types/category';
import { ROUTES } from '../../../constants/routes';

interface CategoryListProps {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const { useBreakpoint } = Grid;

const CategoryList: React.FC<CategoryListProps> = ({ categories, loading, error }) => {
  const screens = useBreakpoint();
  const [useCarousel, setUseCarousel] = useState(false);
  
  useEffect(() => {
    const shouldUseCarousel = categories.length > 8 || !screens.md;
    setUseCarousel(shouldUseCarousel);
  }, [categories.length, screens]);
  
  const getItemsPerRow = () => {
    if (screens.xl) return 6;
    if (screens.lg) return 4;
    if (screens.md) return 3;
    if (screens.sm) return 3;
    return 2;
  };
  
  const carouselSettings = {
    dots: true,
    arrows: screens.md ? true : false,
    slidesToShow: getItemsPerRow(),
    slidesToScroll: getItemsPerRow(),
    infinite: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      }
    ]
  };
    const CategoryCard = ({ category, index }: { category: Category, index: number }) => (
    <Link to={`${ROUTES.PRODUCTS}?category=${category._id}`}>
      <Card
        hoverable
        style={{ 
          textAlign: 'center',
          margin: '0 8px',
          height: '100%'
        }}
        cover={
          <div style={{ 
            padding: '20px 0', 
            fontSize: screens.md ? 32 : 24, 
            background: `hsl(${index * 30}, 70%, 90%)`,
            color: `hsl(${index * 30}, 70%, 40%)`
          }}>
            <ShopOutlined />
          </div>
        }
      >
        <Card.Meta 
          title={
            <Typography.Text ellipsis style={{ fontSize: screens.md ? 16 : 14 }}>
              {category.name}
            </Typography.Text>
          } 
        />
      </Card>
    </Link>
  );
  
  return (
    <div style={{ marginBottom: 24 }}>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>Danh mục nổi bật</Typography.Title>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <Spin />
          <Typography.Paragraph style={{ marginTop: 16 }}>Đang tải danh mục...</Typography.Paragraph>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '32px 0', background: '#fff1f0' }}>
          <Typography.Paragraph type="danger" style={{ marginBottom: 16 }}>
            {error}
          </Typography.Paragraph>
        </div>
      ) : categories && categories.length > 0 ? (
        useCarousel ? (
          <Carousel 
            autoplay={false}
            prevArrow={<LeftOutlined />}
            nextArrow={<RightOutlined />}
            {...carouselSettings}
          >
            {categories.map((category, index) => (
              <div key={category._id} style={{ padding: '0 8px' }}>
                <CategoryCard category={category} index={index} />
              </div>
            ))}
          </Carousel>
        ) : (
          <Row gutter={[16, 16]}>
            {categories.map((category, index) => (
              <Col xs={12} sm={8} md={6} lg={4} xl={3} key={category._id}>
                <CategoryCard category={category} index={index} />
              </Col>
            ))}
          </Row>
        )
      ) : (
        <Empty description="Không có danh mục nào" />
      )}
    </div>
  );
};

export default CategoryList;