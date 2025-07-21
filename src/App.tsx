import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { SocketProvider } from './contexts/SocketContext';
import { ChatProvider } from './contexts/ChatContext';
import AppRouter from './router';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './hooks/useTheme';

// Styles
import './App.css';

const ThemedApp = () => {
  const { themeConfig } = useTheme();
  
  return (
    <ConfigProvider theme={themeConfig}>
      <Router>
        <AppRouter />
      </Router>
    </ConfigProvider>
  );
};

function App() {
  return (
    <SocketProvider>
      <ChatProvider>
        <ThemeProvider>
          <ThemedApp />
        </ThemeProvider>
      </ChatProvider>
    </SocketProvider>
  );
}

export default App;
