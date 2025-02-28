require('dotenv').config()
const  express = require('express')
const connectDB = require('./Config/db')
const cors=require('cors')
const path = require('path');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const adminRoute = require('./Routes/adminRoutes')
const advocateRoute = require('./Routes/advocateRoute')
const clientRoute = require('./Routes/clientRoute')
const loginRoute = require('./Routes/loginRoute')
const caseCategoryRoutes = require('../Src/Routes/caseCategoryRoutes')
const profileRoutes = require('../Src/Routes/profileRoutes')
const evidenceRoutes = require ('../Src/Routes/evidenceRoutes')
const feedbackRoutes = require('../Src/Routes/feedbackRoutes')
const paymentRoutes = require('./Routes/paymentRoutes')
const invoiceRoutes = require('./Routes/invoiceRoutes')


//Connect to MongoDB
//------------------
connectDB()

// Cloudinary Upload Middleware
const { upload } = require("../Src/Config/cloudinary")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static invoices
app.use("/invoices", express.static("invoices"));

// Connecting with front end ie, React

const allowedOrigins = [
  'http://localhost:5174', // Local dev
  'https://law-linker-client.vercel.app' // Frontend on Vercel
];

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
}));

// Handle preflight requests
app.options('*', cors()); 

// Test route
app.get("/", (req, res) => {
    res.send("Server is running!!!");
});


app.use('/api/auth',adminRoute)
app.use('/api/advocate',advocateRoute)  // Route for both Jr.Advocate and Advocate
app.use('/api/client',clientRoute)
app.use('/api/login',loginRoute)
app.use('/api/category',caseCategoryRoutes)
app.use('/api/profile',profileRoutes)
app.use('/api/evidence',evidenceRoutes)
app.use('/api/feedback',feedbackRoutes)
app.use('/api/payment',paymentRoutes)
app.use('/api/invoice',invoiceRoutes)

//Connecting to port
//------------------
const PORT = process.env.PORT || 5500
app.listen (PORT, () => {
    console.log(`listening to port http://localhost:${PORT}`)
})