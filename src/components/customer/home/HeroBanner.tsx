import { Carousel, Typography, Button } from 'antd';
import React from 'react';
import { ROUTES } from '../../../constants/routes';
import './HeroBanner.css';

interface BannerItem {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage?: string;
  backgroundGradient: string;
}

interface HeroBannerProps {
  bannerItems?: BannerItem[];
}

const defaultBanners: BannerItem[] = [
  {
    title: 'Khuyến mãi mùa hè',
    description: 'Giảm giá đến 50% cho tất cả sản phẩm mùa hè. Nhanh tay mua ngay!',
    buttonText: 'Mua ngay',
    buttonLink: `${ROUTES.PRODUCTS}?discount=true`,
    backgroundImage: 'https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg',
    backgroundGradient: 'linear-gradient(to right, #4568dc, #b06ab3)'
  },
  {
    title: 'Sản phẩm mới',
    description: 'Khám phá bộ sưu tập mới nhất với những thiết kế độc quyền',
    buttonText: 'Xem ngay',
    buttonLink: `${ROUTES.PRODUCTS}?sortBy=newest`,
    backgroundImage: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg',
    backgroundGradient: 'linear-gradient(to right, #11998e, #38ef7d)'
  },
  {
    title: 'Miễn phí vận chuyển',
    description: 'Miễn phí vận chuyển cho đơn hàng từ 500.000đ',
    buttonText: 'Mua sắm ngay',
    buttonLink: '/products',
    backgroundImage: 'https://images.pexels.com/photos/4482900/pexels-photo-4482900.jpeg',
    backgroundGradient: 'linear-gradient(to right, #f12711, #f5af19)'
  }
];

const HeroBanner: React.FC<HeroBannerProps> = ({ bannerItems = defaultBanners }) => {
  return (
    <div style={{ marginBottom: 24 }}>
      <Carousel autoplay swipe dotPosition="bottom">
        {bannerItems.map((item, index) => (
          <div key={index}>
            <div style={{ 
              height: {
                xs: '200px',
                sm: '300px',
                md: '400px'
              }[window.innerWidth < 576 ? 'xs' : window.innerWidth < 768 ? 'sm' : 'md'],              
              background: item.backgroundImage 
                ? `url(${item.backgroundImage})`
                : item.backgroundGradient,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '0 10%',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                maxWidth: '800px',
                width: '100%',
                textAlign: 'left',
                zIndex: 1
              }}>
                <Typography.Title 
                  level={1} 
                  className="hero-title"
                  style={{ 
                    marginBottom: '16px',
                    fontSize: {
                      xs: '24px',
                      sm: '32px',
                      md: '40px'
                    }[window.innerWidth < 576 ? 'xs' : window.innerWidth < 768 ? 'sm' : 'md'],
                  }}
                >
                  {item.title}
                </Typography.Title>
                <Typography.Paragraph 
                  className="hero-paragraph"
                  style={{ 
                    fontSize: {
                      xs: '14px',
                      sm: '16px',
                      md: '18px'
                    }[window.innerWidth < 576 ? 'xs' : window.innerWidth < 768 ? 'sm' : 'md'],
                    textAlign: 'left',
                    marginBottom: '24px',
                    maxWidth: '600px'
                  }}
                >
                  {item.description}
                </Typography.Paragraph>
                <Button 
                  type="default"
                  size="large" 
                  href={item.buttonLink}
                  className="hero-button"
                  style={{
                    height: '48px',
                    padding: '0 32px',
                    fontSize: '16px',
                    fontWeight: 600,
                    borderWidth: '2px',
                    backgroundColor: 'transparent'
                  }}
                >
                  {item.buttonText}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroBanner;