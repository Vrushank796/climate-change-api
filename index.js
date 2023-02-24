//Import required libraries
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const PORT = 8000;

//Initializing express app
const app = express();

//Collection of Newspapers
const newspapers = [
  {
    name: 'thetimes',
    address: 'https://www.thetimes.co.uk/environment/climate-change',
    base: '',
  },
  {
    name: 'theguardian',
    address: 'https://www.theguardian.com/environment/climate-crisis',
    base: '',
  },
  {
    name: 'thetelegraph',
    address: 'https://www.telegraph.co.uk/climate-change',
    base: 'https://www.telegraph.co.uk',
  },
];

//Collection of Articles
const articles = [];

//To fetch all news from different newspapers
newspapers.forEach((newspaper) => {
  axios
    .get(newspaper.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr('href');
        articles.push({
          title,
          url: newspaper.base + url,
          source: newspaper.name,
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

//Display message on home
app.get('/', (req, res) => {
  res.json({
  "greeting": "Welcome to my Climate Change News API \\nAn API showing all the latest Climate Change News around the world.",
  "links": [
    {"To explore all news channels": "https://climate-change-api-3fd7.onrender.com/news"},
     { "To explore The Times": "https://climate-change-api-3fd7.onrender.com/news/thetimes"},
    {"To explore The Guardian": "https://climate-change-api-3fd7.onrender.com/news/theguardian"},
    {"To explore The Telegraph": "https://climate-change-api-3fd7.onrender.com/news/thetelegraph"},
  ]
});
});

//Fetch the muliple news sources
app.get('/news', (req, res) => {
  res.json(articles);
});

//Fetch single newspaper news
app.get('/news/:newspaperId', (req, res) => {
  const newspaperId = req.params.newspaperId;
  const specificArticles = [];

  const newspaper = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0];

  axios
    .get(newspaper.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr('href');
        specificArticles.push({
          title,
          url: newspaper.base + url,
          source: newspaper.name,
        });
      });
      res.json(specificArticles);
    })
    .catch((error) => {
      console.log(error);
    });
});

//Handle incorrect routes
app.get('*', function (req, res) {
  res.status(404).json({
    'NOT_FOUND (404)':
      'The requested operation failed because a resource associated with the request could not be found.',
  });
});

//Server listening to port
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
