import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send("Boa");
})

app.listen(3333);