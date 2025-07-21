// Format a number to currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
};

// Format date
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format time remaining (for sales)
export const formatTimeRemaining = (endDate: string | Date): string => {
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  
  const timeRemaining = end - now;
  
  if (timeRemaining <= 0) {
    return 'Đã kết thúc';
  }
  
  // Convert ms to days, hours, minutes
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days} ngày ${hours} giờ`;
  }
  
  if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  }
  
  return `${minutes} phút`;
};
