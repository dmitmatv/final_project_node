import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from "./routes/profileRoutes.js";
import cors from "cors";
import booksRoutes from "./routes/booksRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import writtenRoutes from "./routes/writtenRoutes.js";

const app = express();
const PORT = 4000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bookweb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(cors({
                 credentials: true,
                 origin: "http://localhost:3000" ,
             }
));

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express session middleware
app.use(
    session({
                secret: 'your-secret-key',
                resave: false,
                saveUninitialized: false,
            })
);

// Authentication routes
app.use('/auth', authRoutes);

// Profile routes
app.use('/profile', profileRoutes);

// Book routes
app.use('/', booksRoutes);

// Review routes
app.use('/reviews', reviewRoutes);

app.use('/', writtenRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});