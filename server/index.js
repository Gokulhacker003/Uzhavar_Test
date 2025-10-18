const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  'https://uzhavar.vercel.app', // production frontend
  'http://localhost:3000'           // CRA dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow curl/postman
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy does not allow access from this origin.'), false);
    }
    return callback(null, true);
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: false // set to true only if you use cookies; then also set fetch credentials: 'include'
}));

app.use(express.json());

// Example route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
