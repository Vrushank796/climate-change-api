const PORT = 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const newspapers = [
  {
    name: 'newyorktimes',
    address: 'https://www.nytimes.com/ca/section/climate',
    base: '',
  },
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

const articles = [];

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

app.get('/', (req, res) => {
  res.json('Welcome to my Climate Change News API');
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

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
