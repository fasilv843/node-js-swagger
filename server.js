import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connect from './database/conn.js';
import userRouter from './router/user.js';
import postRouter from './router/post.js';
import commentRouter from './router/comment.js';

// Swagger setup
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs';

dotenv.config()
const app = express();

/** middlewares */
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack


const swaggerDocs = YAML.load('./swagger.yaml')

const port = process.env.PORT || 8080;

/** HTTP GET Request */
app.get('/', (req, res) => {
    res.status(201).json("Home GET Request");
});


/** api routes */
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/comment', commentRouter)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

/** start server only when we have valid connection */
connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`);
        })
    } catch (error) {
        console.log('Cannot connect to the server')
    }
}).catch(error => {
    console.log("Invalid database connection...!");
})

