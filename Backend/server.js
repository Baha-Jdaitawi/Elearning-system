import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './database/connection.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';
import certificateRoutes from './routes/certificateRoutes.js';

// Load environment variables
dotenv.config();


console.log('🔍 GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('🔍 GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'EXISTS' : 'MISSING');
console.log('🔍 GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
console.log('🔍 CLIENT_URL:', process.env.CLIENT_URL);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3003;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));


const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW) || 15)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return process.env.NODE_ENV === 'development';
  }
});

app.use(limiter);


const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.CLIENT_URL
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'x-csrf-token',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.CLIENT_URL
  ].filter(Boolean);
  
  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || 'http://localhost:5173');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-csrf-token, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/certificates', express.static(path.join(__dirname, 'uploads/certificates')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LMS API is running successfully',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api', routes);
app.use('/api/certificates', certificateRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /health - Health check',
      'POST /api/auth/register - User registration',
      'POST /api/auth/login - User login',
      'GET /api/auth/google - Google OAuth',
      'GET /api/courses - Get all courses',
      'POST /api/courses - Create course (Instructor)',
      'GET /api/users/profile - Get user profile',
      'POST /api/enrollments - Enroll in course',
      'GET /api/categories - Get all categories',
      'GET /api/certificates - Get user certificates',
      'POST /api/certificates/generate - Generate certificate'
    ]
  });
});

// Global error handler
app.use(errorHandler);

// Start server function
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error(' Failed to connect to database. Server not started.');
      process.exit(1);
    }

    // Function to find available port
    const findAvailablePort = async (startPort) => {
      const net = await import('net');
      
      const isPortAvailable = (port) => {
        return new Promise((resolve) => {
          const server = net.createServer();
          server.listen(port, () => {
            server.once('close', () => {
              resolve(true);
            });
            server.close();
          });
          server.on('error', () => {
            resolve(false);
          });
        });
      };

      let port = startPort;
      while (port < startPort + 100) {
        if (await isPortAvailable(port)) {
          return port;
        }
        port++;
      }
      throw new Error('No available port found');
    };

    // Find available port
    const availablePort = await findAvailablePort(PORT);

    // Start server
    app.listen(availablePort, () => {
      console.log(`
🚀 LMS Backend Server Started Successfully!
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Server URL: http://localhost:${availablePort}
💾 Database: Connected
🔒 Security: Enabled (Helmet, CORS, Rate Limiting)
📊 Logging: ${process.env.NODE_ENV === 'development' ? 'Development' : 'Production'} mode
⚡ Compression: Enabled
🎯 Health Check: http://localhost:${availablePort}/health
📚 API Base URL: http://localhost:${availablePort}/api
📜 Certificates: /uploads/certificates/{userId}-{courseId}.pdf

✅ CORS Configuration:
   • Origin: http://localhost:5173
   • Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
   • Credentials: Enabled
   • Rate Limiting: ${process.env.NODE_ENV === 'development' ? 'Disabled for development' : 'Enabled'}

📋 Key Endpoints:
   • POST http://localhost:${availablePort}/api/auth/register
   • POST http://localhost:${availablePort}/api/auth/login
   • GET  http://localhost:${availablePort}/api/auth/google
   • GET  http://localhost:${availablePort}/api/courses
   • POST http://localhost:${availablePort}/api/courses
   • GET  http://localhost:${availablePort}/api/categories
   • POST http://localhost:${availablePort}/api/enrollments
   • GET  http://localhost:${availablePort}/api/certificates
   • POST http://localhost:${availablePort}/api/certificates/generate

${availablePort !== PORT ? `  Note: Started on port ${availablePort} (${PORT} was in use)` : ''}
      `);
    });

  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(' Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(' Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log(' SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log(' SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

export default app;
