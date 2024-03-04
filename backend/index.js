const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000',  
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // 
};
app.use(cors(corsOptions));

 

const express = require('express');
const socketIO = require('socket.io');

 

// Configure the Express application.
app.use(express.json()); // for parsing application/json

// Create a route to handle GET requests for weather data.
app.get('/weather', async (req, res) => {
  // Get the city name from the query parameters.
  const city = req.query.city;

  // Set the API key and host for the weather API.
  const apiKey = '918e48048fmsh78a5fedb146f662p1cad53jsn9165a9faaeea';
  const apiHost = 'open-weather13.p.rapidapi.com';

  // Set the options for the API request.
  const options = {
    method: 'GET',
    url: `https://${apiHost}/city/${city}`,
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': apiHost,
    },
  };

  // Make the API request.
  try {
    const response = await axios.request(options);

    // Send the weather data back to the frontend as a JSON response.
    res.json(response.data);
  } catch (error) {
    // Handle any errors that occur during the API request.
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the weather data.' });
  }
});

// Start the Express application.
const server = app.listen(3001, () => {
  console.log('Server is listening on port 3001');
});

// Create a Socket.IO server.
const io = socketIO(server);

// Listen for new WebSocket connections.
io.on('connection', (socket) => {
  console.log('A new WebSocket connection has been established.');

  // Fetch the weather data for the city entered by the user.
  const fetchWeatherData = async () => {
    // Get the city name from the user.
    const city = socket.handshake.query.city;

    // Set the API key and host for the weather API.
    const apiKey = '918e48048fmsh78a5fedb146f662p1cad53jsn9165a9faaeea';
    const apiHost = 'open-weather13.p.rapidapi.com';

    // Set the options for the API request.
    const options = {
      method: 'GET',
      url: `https://${apiHost}/city/${city}`,
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost,
      },
    };

    // Make the API request.
    try {
      const response = await axios.request(options);

      // Send the weather data back to the user.
      socket.emit('weather data', response.data);
    } catch (error) {
      // Handle any errors that occur during the API request.
      console.error(error);
      socket.emit('error', 'An error occurred while fetching the weather data.');
    }
  };

  // Fetch the weather data initially.
  fetchWeatherData();

  // Set an interval to fetch the weather data every 30 seconds.
  const interval = setInterval(() => {
    fetchWeatherData();
  }, 30000);

  // Listen for the "disconnect" event.
  socket.on('disconnect', () => {
    console.log('A WebSocket connection has been closed.');

    // Clear the interval.
    clearInterval(interval);
  });
});
 





