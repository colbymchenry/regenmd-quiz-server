import express from 'express';
import cors from 'cors';

const app = express();

// enable JSON body parser
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000'],
    optionsSuccessStatus: 200
}));

app.get('/', (req, res) => {
    res.json({
        "success": true
    })
});

export default app;