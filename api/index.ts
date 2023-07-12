import express from 'express';

const app = express();

// enable JSON body parser
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        "success": true
    })
});

export default app;