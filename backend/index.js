const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

client.connect().then(() => {
  db = client.db('database');
  console.log('Connected to MongoDB');
}).catch(err => console.error('Error connecting to MongoDB:', err));

// Signup Route
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;

  const user = await db.collection('users').findOne({ email });
  if (user) return res.status(400).send({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.collection('users').insertOne({ email, password: hashedPassword });
  res.send({ message: 'User registered' });
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await db.collection('users').findOne({ email });
  if (!user) return res.status(404).send({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, 'secretKey');
  res.send({ token });
});

app.listen(3000, () => console.log('Server running on port 3000'));
