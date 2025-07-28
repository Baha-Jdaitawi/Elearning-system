import { Box, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, maxWidth = 'lg' }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: '#ffffff'
    }}>
      <Header />
      
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth={maxWidth}>
          {children}
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Layout;