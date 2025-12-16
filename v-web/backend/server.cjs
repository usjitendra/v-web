const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Environment setup
const NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV === 'development') {
  try {
    console.log('Loading development environment variables');
    require('dotenv').config({ path: './config.env' });
  } catch (error) {
    console.warn('config.env not found, using process environment variables');
  }
}
const ATLAS_URI = process.env.ATLAS_URI;
const PORT = process.env.PORT || 6003;

// CORS setup
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",

    // Active frontend domains
    "https://v-web-five.vercel.app",

    // Other valid deployments you used
    "https://v-web-frontend-flame.vercel.app",
    "https://v-web-frontend-s8pe.vercel.app",
    "https://v-web-frontend-gaci.vercel.app",
    "https://v-web-frontend-beta.vercel.app"
  ],
  // methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  // allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle OPTIONS preflight for all routes
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  const maxRetries = 3;
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      if (!ATLAS_URI) {
        throw new Error('ATLAS_URI environment variable is not defined');
      }
      await mongoose.connect(ATLAS_URI, {
        dbName: 'healthcare',
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        retryWrites: true,
        w: 'majority'
      });
      console.log('MongoDB connected via Mongoose');
      return;
    } catch (err) {
      attempts++;
      console.error(`Mongoose connection attempt ${attempts} failed:`, err.message);
      if (attempts >= maxRetries) {
        console.error('Max retries reached. Could not connect to MongoDB.');
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

// Explicitly load routes
try {
  const aboutRoute = require('./routes/about.cjs');
  app.use('/api/about', aboutRoute);
  console.log('✓ Loaded route: /api/about');
} catch (error) {
  console.error('✗ Failed to load route about:', error.message, error.stack);
}
try {
  const headingsRoute = require('./routes/headings.cjs');
  app.use('/api/headings', headingsRoute);
  console.log('✓ Loaded route: /api/headings');
} catch (error) {
  console.error('✗ Failed to load route about:', error.message, error.stack);
}
try {
  const languageRoute = require('./routes/language.cjs');
  app.use('/api/language', languageRoute);
  console.log('✓ Loaded route: /api/language');
} catch (error) {
  console.error('✗ Failed to load route language:', error.message, error.stack);
}

try {
  const collectionsRoute = require('./routes/collections.cjs');
  app.use('/api/collections', collectionsRoute);
  console.log('✓ Loaded route: /api/collections');
} catch (error) {
  console.error('✗ Failed to load route collections:', error.message, error.stack);
}

try {
  const servicesRoute = require('./routes/services.cjs');
  app.use('/api/services', servicesRoute);
  console.log('✓ Loaded route: /api/services');
} catch (error) {
  console.error('✗ Failed to load route services:', error.message, error.stack);
}

try {
  const hospitalsRoute = require('./routes/hospitals.cjs');
  app.use('/api/hospitals', hospitalsRoute);
  console.log('✓ Loaded route: /api/hospitals');
} catch (error) {
  console.error('✗ Failed to load route hospitals:', error.message, error.stack);
}

try {
  const procedureCostsRoute = require('./routes/procedureCosts.cjs');
  app.use('/api/procedure-costs', procedureCostsRoute);
  console.log('✓ Loaded route: /api/procedure-costs');
} catch (error) {
  console.error('✗ Failed to load route procedure-costs:', error.message, error.stack);
}

try {
  const patientOpinionsRoute = require('./routes/patientOpinion.cjs');
  app.use('/api/patient-opinions', patientOpinionsRoute);
  console.log('✓ Loaded route: /api/patient-opinions');
} catch (error) {
  console.error('✗ Failed to load route patient-opinions:', error.message, error.stack);
}

try {
  const faqsRoute = require('./routes/faqs.cjs');
  app.use('/api/faqs', faqsRoute);
  console.log('✓ Loaded route: /api/faqs');
} catch (error) {
  console.error('✗ Failed to load route faqs:', error.message, error.stack);
}

try {
  const assistanceRoute = require('./routes/assistance.cjs');
  app.use('/api/assistance', assistanceRoute);
  console.log('✓ Loaded route: /api/assistance');
} catch (error) {
  console.error('✗ Failed to load route assistance:', error.message, error.stack);
}

try {
  const doctorsRoute = require('./routes/doctor.cjs');
  app.use('/api/doctors', doctorsRoute);
  console.log('✓ Loaded route: /api/doctors');
} catch (error) {
  console.error('✗ Failed to load route doctors:', error.message, error.stack);
}

try {
  const treatmentsRoute = require('./routes/treatments.cjs');
  app.use('/api/treatments', treatmentsRoute);
  console.log('✓ Loaded route: /api/treatments');
} catch (error) {
  console.error('✗ Failed to load route treatments:', error.message, error.stack);
}

try {
  const doctorTreatmentsRoute = require('./routes/doctorTreatments.cjs');
  app.use('/api/doctor-treatment', doctorTreatmentsRoute);
  console.log('✓ Loaded route: /api/doctor-treatment');
} catch (error) {
  console.error('✗ Failed to load route doctor-treatment:', error.message, error.stack);
}

try {
  const hospitalTreatmentsRoute = require('./routes/hospitalTreatments.cjs');
  app.use('/api/hospital-treatment', hospitalTreatmentsRoute);
  console.log('✓ Loaded route: /api/hospital-treatment');
} catch (error) {
  console.error('✗ Failed to load route hospital-treatment:', error.message, error.stack);
}

try {
  const bookingRoute = require('./routes/bookings.cjs');
  app.use('/api/booking', bookingRoute);
  console.log('✓ Loaded route: /api/booking');
} catch (error) {
  console.error('✗ Failed to load route booking:', error.message, error.stack);
}

try {
  const adminRoute = require('./routes/admin.cjs');
  app.use('/api/admin', adminRoute);
  console.log('✓ Loaded route: /api/admin');
} catch (error) {
  console.error('✗ Failed to load route admin:', error.message, error.stack);
}

try {
  const blogRoute = require('./routes/blog.cjs');
  app.use('/api/blogs', blogRoute);
  console.log('✓ Loaded route: /api/blogs');
} catch (error) {
  console.error('✗ Failed to load route blogs:', error.message, error.stack);
}

try {
  const uploadRoute = require('./routes/upload.cjs');
  app.use('/api/upload', uploadRoute);
  console.log('✓ Loaded route: /api/upload');
} catch (error) {
  console.error('✗ Failed to load route upload:', error.message, error.stack);
}

try {
  const patientsRoute = require('./routes/patient.cjs');
  app.use('/api/patients', patientsRoute);
  console.log('✓ Loaded route: /api/patients');
} catch (error) {
  console.error('✗ Failed to load route patients:', error.message, error.stack);
}

// Rest of server.cjs remains the same
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  res.json({
    status: 'Healthcare Database API',
    dbStatus: dbStatus === 1 ? 'Connected' : 'Disconnected',
    environment: NODE_ENV
  });
});

app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  res.json({
    status: 'API is running',
    dbStatus: dbStatus === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/:unmatchedRoute', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl,
    attemptedRoute: req.params.unmatchedRoute
  });
});

app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: NODE_ENV === 'production' ? 'Please try again later' : error.message
  });
});

const handler = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (error) {
      console.error('Database connection failed in handler:', error.message, error.stack);
      return res.status(500).json({
        error: 'Database connection failed',
        message: 'Please try again later'
      });
    }
  }
  return app(req, res);
};

module.exports = handler;

if (NODE_ENV !== 'production') {
  const startServer = async () => {
    try {
      console.log('NODE:', NODE_ENV);
      console.log('ATLAS_URI:', ATLAS_URI ? 'Set' : 'Not set');
      await connectDB();
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
      });
    } catch (err) {
      console.error('Server startup failed:', err);
      process.exit(1);
    }
  };
  process.on('SIGINT', async () => {
    await mongoose.disconnect();
    console.log('Mongoose connection closed');
    process.exit(0);
  });
  startServer();
}
