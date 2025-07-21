import React from 'react';
import { Card } from 'antd';
import type { CardProps } from 'antd';
import './CustomCard.css';

interface CustomCardProps extends CardProps {
  maxWidth?: number;
  contentClassName?: string;
}

const CustomCard: React.FC<CustomCardProps> = ({
  contentClassName = '',
  children,
  ...props
}) => {
  return (
    <div className="custom-card-container">
      <Card
        className={`custom-card ${props.className || ''}`}
        {...props}
        style={{
          width: '100%',
          ...props.style,
        }}
      >
        <div className={`custom-card-content ${contentClassName}`}>
          {children}
        </div>
      </Card>
    </div>
  );
};

export default CustomCard;
