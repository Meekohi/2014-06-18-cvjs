var request = require('request');
var cheerio = require('cheerio');

request("http://www.meetup.com/Central-Virginia-Javascript-Enthusiasts-CVJSE/",function(err,r,body){
  $ = cheerio.load(body);

  var links = $(".event-item h3 a").map(function(idx,elem){
    return {
      text: $(elem).text().trim(),
      href: $(elem).attr("href")
    };
  }).toArray();

  links.forEach(function(l){
    console.log(l.href, l.text);
  });
});