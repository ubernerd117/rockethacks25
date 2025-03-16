const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables
const app = express();
const port = 3000;

// Enable CORS for all domains (you can restrict this to just 'http://localhost:4200' if you want)
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Route to handle the chat message
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.userMessage;

  if (!userMessage) {
    return res.status(400).json({ message: 'User message is required.' });
  }

  try {
    const response = await axios.post('https://api.mistral.ai/v1/chat/completions', {
      model: 'mistral-large-latest',
      messages: [{ role: 'user', content: userMessage }],
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`, // Use the API key from environment variables
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error calling Mistral API:', error.response?.data || error.message); // Log error response
    res.status(500).json({ message: 'Error calling Mistral API', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
