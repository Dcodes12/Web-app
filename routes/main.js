// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request')
// Handle our routes
router.get('/',function(req, res, next){
    res.render('login.ejs')
})

router.get('/about',function(req, res, next){
    res.render('about.ejs')
})

router.get('/weather', function(req, res, next) {
    res.send(`
        <link rel="stylesheet"  type="text/css" href="/main.css" />
        <style>
        body {
            background-image: url("https://static.vecteezy.com/system/resources/previews/001/227/306/non_2x/crumpled-paper-texture-free-photo.jpg");
            text-align:center;
            background-size: cover;
            backdrop-filter: blur(10px);
        }
        </style>
        <form action="/city_weather" method="get">
            <label for="city">Enter a city name:</label>
            <input type="text" id="city" name="city" required>
            <button type="submit">Get Weather</button>
        </form>
    `);
});

router.get('/city_weather', function(req, res, next) {
  let apiKey = 'efe9ce8321b74a217c902e42eae9b158';
  let city = req.query.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  request(url, function(err, response, body) {
      if (err) {
          return next(err);
      }

      var weather = JSON.parse(body);
      if (weather.cod === 200) {
          var wmsg = `
              <link rel="stylesheet"  type="text/css" href="/main.css" />
                <style>
            body {
                background-image: url("https://static.vecteezy.com/system/resources/previews/001/227/306/non_2x/crumpled-paper-texture-free-photo.jpg");
                text-align:center;
                background-size: cover;
                backdrop-filter: blur(10px);
            }
            </style>
              <h1>Weather in ${weather.name}</h1>
              <p>Temperature: ${weather.main.temp}°C</p>
              <p>Humidity: ${weather.main.humidity}%</p>
              <p>Weather: ${weather.weather[0].description}</p>
            <div style="text-align: center;">
                  <button type="submit"><a href="/weather">Check another city</a></button>
              </div>
              
          `;
          res.send(wmsg);
      } else {
          res.send(`<p>City not found. Please try again. <a href="/weather">Go back</a></p>`);
      }
  });
});
// Export the router object so index.js can access it
module.exports = router