const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
// const data = require("../backend/controller/dropdown.controller")

const app = express();

// Environment setup
const NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV === 'development') {
  try {
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
    "http://localhost:5174",

     "http://72.62.187.221:5173",

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
app.use("/api/v1", require("./route/main.routes"));

// Explicitly load routes
try {
  const aboutRoute = require('./routes/about.cjs');
  app.use('/api/about', aboutRoute);
} catch (error) {
  console.error('✗ Failed to load route about:', error.message, error.stack);
}
try {
  const headingsRoute = require('./routes/headings.cjs');
  app.use('/api/headings', headingsRoute);
} catch (error) {
  console.error('✗ Failed to load route about:', error.message, error.stack);
}
try {
  const languageRoute = require('./routes/language.cjs');
  app.use('/api/language', languageRoute);
} catch (error) {
  console.error('✗ Failed to load route language:', error.message, error.stack);
}

try {
  const collectionsRoute = require('./routes/collections.cjs');
  app.use('/api/collections', collectionsRoute);
} catch (error) {
  console.error('✗ Failed to load route collections:', error.message, error.stack);
}

try {
  const servicesRoute = require('./routes/services.cjs');
  app.use('/api/services', servicesRoute);
} catch (error) {
  console.error('✗ Failed to load route services:', error.message, error.stack);
}

try {
  const hospitalsRoute = require('./routes/hospitals.cjs');
  app.use('/api/hospitals', hospitalsRoute);
} catch (error) {
  console.error('✗ Failed to load route hospitals:', error.message, error.stack);
}

try {
  const procedureCostsRoute = require('./routes/procedureCosts.cjs');
  app.use('/api/procedure-costs', procedureCostsRoute);
} catch (error) {
  console.error('✗ Failed to load route procedure-costs:', error.message, error.stack);
}

try {
  const patientOpinionsRoute = require('./routes/patientOpinion.cjs');
  app.use('/api/patient-opinions', patientOpinionsRoute);
} catch (error) {
  console.error('✗ Failed to load route patient-opinions:', error.message, error.stack);
}

try {
  const faqsRoute = require('./routes/faqs.cjs');
  app.use('/api/faqs', faqsRoute);
} catch (error) {
  console.error('✗ Failed to load route faqs:', error.message, error.stack);
}

try {
  const assistanceRoute = require('./routes/assistance.cjs');
  app.use('/api/assistance', assistanceRoute);
} catch (error) {
  console.error('✗ Failed to load route assistance:', error.message, error.stack);
}

try {
  const doctorsRoute = require('./routes/doctor.cjs');
  app.use('/api/doctors', doctorsRoute);
} catch (error) {
  console.error('✗ Failed to load route doctors:', error.message, error.stack);
}

try {
  const treatmentsRoute = require('./routes/treatments.cjs');
  app.use('/api/treatments', treatmentsRoute);
} catch (error) {
  console.error('✗ Failed to load route treatments:', error.message, error.stack);
}

try {
  const doctorTreatmentsRoute = require('./routes/doctorTreatments.cjs');
  app.use('/api/doctor-treatment', doctorTreatmentsRoute);
} catch (error) {
  console.error('✗ Failed to load route doctor-treatment:', error.message, error.stack);
}

try {
  const hospitalTreatmentsRoute = require('./routes/hospitalTreatments.cjs');
  app.use('/api/hospital-treatment', hospitalTreatmentsRoute);
} catch (error) {
  console.error('✗ Failed to load route hospital-treatment:', error.message, error.stack);
}

// Booking route now included in main routes (/api/v1/booking)
try {
  // const bookingRoute = require('./routes/bookings.cjs');
  // app.use('/api/booking', bookingRoute);
} catch (error) {
  console.error('✗ Failed to load route booking:', error.message, error.stack);
}

try {
  const contactRoute = require('./routes/contact.cjs');
  app.use('/api/contact', contactRoute);
} catch (error) {
  console.error('✗ Failed to load route contact:', error.message, error.stack);
}

try {
  const adminRoute = require('./routes/admin.cjs');
  app.use('/api/admin', adminRoute);
} catch (error) {
  console.error('✗ Failed to load route admin:', error.message, error.stack);
}

try {
  const blogRoute = require('./routes/blog.cjs');
  app.use('/api/v1/blogs', blogRoute);
} catch (error) {
  console.error('✗ Failed to load route blogs:', error.message, error.stack);
}

try {
  const uploadRoute = require('./routes/upload.cjs');
  app.use('/api/upload', uploadRoute);
} catch (error) {
  console.error('✗ Failed to load route upload:', error.message, error.stack);
}

try {
  const patientsRoute = require('./routes/patient.cjs');
  app.use('/api/patients', patientsRoute);
} catch (error) {
  console.error('✗ Failed to load route patients:', error.message, error.stack);
}

try {
  const seoRoute = require('./routes/seo.cjs');
  app.use('/api/v1/seo', seoRoute);
} catch (error) {
  console.error('✗ Failed to load route seo:', error.message, error.stack);
}

// Rest of server.cjs remains the same
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  res.json({
    status: 'Server running successfully',
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
      // await connectDB();
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
      await connectDB();
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
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
