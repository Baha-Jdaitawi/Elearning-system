import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { footerStyles } from '../../styles';

const Footer = () => {
  return (
    <Box component="footer" sx={footerStyles.footer}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={footerStyles.title}>
              EduPlatform
            </Typography>
            <Typography variant="body2" sx={footerStyles.description}>
              Empowering learners worldwide with quality education and innovative learning experiences.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={footerStyles.sectionTitle}>
              Quick Links
            </Typography>
            <Typography variant="body2" sx={footerStyles.sectionContent}>
              <Link href="/courses" color="inherit">Courses</Link><br />
              <Link href="/about" color="inherit">About Us</Link><br />
              <Link href="/contact" color="inherit">Contact</Link><br />
              <Link href="/help" color="inherit">Help Center</Link>
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={footerStyles.sectionTitle}>
              Categories
            </Typography>
            <Typography variant="body2" sx={footerStyles.sectionContent}>
              <Link href="/courses?category=programming" color="inherit">Programming</Link><br />
              <Link href="/courses?category=design" color="inherit">Design</Link><br />
              <Link href="/courses?category=business" color="inherit">Business</Link><br />
              <Link href="/courses?category=marketing" color="inherit">Marketing</Link>
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={footerStyles.sectionTitle}>
              Support
            </Typography>
            <Typography variant="body2" sx={footerStyles.sectionContent}>
              <Link href="/privacy" color="inherit">Privacy Policy</Link><br />
              <Link href="/terms" color="inherit">Terms of Service</Link><br />
              <Link href="/support" color="inherit">Customer Support</Link><br />
              <Link href="/faq" color="inherit">FAQ</Link>
            </Typography>
          </Grid>
        </Grid>
        
        <Typography variant="body2" sx={footerStyles.copyright}>
          © {new Date().getFullYear()} EduPlatform. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;