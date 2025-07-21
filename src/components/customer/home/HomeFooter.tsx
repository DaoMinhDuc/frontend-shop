import React from 'react';
import { Layout, Row, Col, Typography, Space, Button, Divider } from 'antd';
import { 
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  YoutubeOutlined
} from '@ant-design/icons';
import './HomeFooter.css';

const { Footer } = Layout;
const { Text, Title, Link } = Typography;

interface FooterLinkGroup {
  title: string;
  links: Array<{
    text: string;
    url: string;
  }>;
}

interface HomeFooterProps {
  footerLinks?: FooterLinkGroup[];
}

const defaultFooterLinks: FooterLinkGroup[] = [
  {
    title: 'Về chúng tôi',
    links: [
      { text: 'Giới thiệu', url: '/about' },
      { text: 'Liên hệ', url: '/contact' },
      { text: 'Tuyển dụng', url: '/careers' },
      { text: 'Điều khoản', url: '/terms' }
    ]
  },
  {
    title: 'Chính sách',
    links: [
      { text: 'Giao hàng', url: '/shipping' },
      { text: 'Đổi trả', url: '/return' },
      { text: 'Bảo hành', url: '/warranty' },
      { text: 'Thanh toán', url: '/payment' }
    ]
  },
  {
    title: 'Hỗ trợ khách hàng',
    links: [
      { text: 'Trung tâm hỗ trợ', url: '/help' },
      { text: 'Hướng dẫn mua hàng', url: '/buying-guide' },
      { text: 'Câu hỏi thường gặp', url: '/faq' },
      { text: 'Tra cứu đơn hàng', url: '/order-tracking' }
    ]
  }
];

const HomeFooter: React.FC<HomeFooterProps> = ({ footerLinks = defaultFooterLinks }) => {
  return (
    <Footer className="home-footer">
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8} md={8}>
          <Title level={4} style={{ margin: '0 0 20px 0' }}>Shop Online</Title>
          <Text style={{ display: 'block', marginBottom: 20 }}>
            Địa chỉ: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh
            <br />
            Email: support@shoponline.com
            <br />
            Hotline: 1900 1234
          </Text>
        </Col>
        
        {footerLinks.map((group, index) => (
          <Col key={index} xs={24} sm={8} md={5}>
            <Title level={5}>{group.title}</Title>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {group.links.map((link, linkIndex) => (
                <li key={linkIndex} style={{ marginBottom: 10 }}>
                  <Link href={link.url}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>
        ))}
        
        <Col xs={24} sm={24} md={6}>
          <Title level={5}>Kết nối với chúng tôi</Title>
          <Space size="middle" style={{ marginBottom: 20 }}>
            <Button type="primary" shape="circle" icon={<FacebookOutlined />} />
            <Button type="primary" shape="circle" icon={<InstagramOutlined />} />
            <Button type="primary" shape="circle" icon={<TwitterOutlined />} />
            <Button type="primary" shape="circle" icon={<YoutubeOutlined />} />
          </Space>
        </Col>
      </Row>
      
      <Divider style={{ margin: '24px 0 16px' }}/>
      <Text>
        © {new Date().getFullYear()} Shop Online. All Rights Reserved.
      </Text>
    </Footer>
  );
};

export default HomeFooter;
