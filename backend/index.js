require('dotenv').config();
const express = require("express");
const dbConnect = require('./config/db')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const cache = require('./utils/nodeCache')
const path = require('path');

const app = express();

dbConnect()
app.use(cors({ origin: '*', methods: 'GET, PUT, PATCH, POST, DELETE' }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

//Import and use routes
const authRoutes = require('./src/routes/authRoutes')
const userRoutes = require('./src/routes/userRoutes')
const depoRoutes = require('./src/routes/depoRoutes')
const regionRoutes = require('./src/routes/regionRoutes')
const productRoutes = require('./src/routes/productRoute')
const metrologySkladRoutes = require('./src/routes/metrologySkladRoute')


app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/depo', depoRoutes)
app.use('/region', regionRoutes)
app.use('/product', productRoutes)
app.use('/metrologiya-sklad', metrologySkladRoutes)

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'none'; font-src 'self' data:;"
  );
  next();
});

const PORT = process.env.PORT || 3000;
  
 app.listen(PORT, async () => {
   console.log(`Server is running on port ${PORT}`);
 });
