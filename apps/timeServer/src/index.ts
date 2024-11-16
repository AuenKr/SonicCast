import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 3005;

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.json({
    datetime: new Date().getTime(),
  })
})

app.listen(PORT, () => {
  console.log(`App listing on ${PORT}`)
})