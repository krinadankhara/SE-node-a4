/**
 * @file Implements an Express Node HTTP server. Declares RESTful Web services
 * enabling CRUD operations on the following resources:
 * <ul>
 *     <li>users</li>
 *     <li>tuits</li>
 *     <li>likes</li>
 *     <li>follows</li>
 *     <li>bookmarks</li>
 *     <li>messages</li>
 * </ul>
 *
 * Connects to a remote MongoDB instance hosted on the Atlas cloud database
 * service
 */
import 'dotenv/config'
import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
const cors = require("cors");

const session = require("express-session");
import UserController from './controllers/UserController';
import TuitController from "./controllers/TuitController";
import AuthenticationController from "./controllers/AuthenticationController";

/**
 * Constants for database connection
 */
const PROTOCOL = "mongodb+srv";
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = "myFirstDatabase";
const DB_QUERY = "retryWrites=true&w=majority";

/**
 * @const {string} Represents the connection string for MongoDB Atlas connection
 */
const connectionString = `mongodb+srv://krinadankhara:Krina1010@cluster0.wpjsn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(connectionString);

/**
 * @const {Express} Represents the Express App
 */
const app = express();
app.use(cors({
    credentials: true,
    origin: [
        'http://localhost:3000',
        'http://localhost',
    ]
}));

const SECRET = process.env.SECRET;
let sess = {
    secret: SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
        secure: false,
        sameSite: 'none'
    }
}

if (process.env.ENVIRONMENT === 'PRODUCTION') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess));
app.use(express.json());

/**
 * Route to check if service is running
 * @param {string} path Base path of API
 * @param {callback} middleware Express middleware
 */
app.get('/', (req: Request, res: Response) => {
    res.send('Running!')
});

/**
 * Create RESTful Web service API
 */
UserController.getInstance(app);
TuitController.getInstance(app);
AuthenticationController(app);

/**
 * Start a server listening at port 4000 locally
 * but use environment variable PORT on Heroku if available.
 */
const PORT = 4000;
app.listen(process.env.PORT || PORT);
