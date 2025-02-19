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
const loginRoute = require('../Src/Routes/loginRoute')
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
app.use(cors( {origin: 'http://localhost:5174', credentials:true } ) )


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