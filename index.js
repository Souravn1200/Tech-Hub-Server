const express = require('express')
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Tech is runnig')
})

app.listen(port, () => {
    console.log(`Tech server running on the port ${port}`);
})