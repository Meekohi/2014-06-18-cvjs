var request = require('request');
var async = require('async');
var cheerio = require('cheerio');
var _ = require('underscore');
_.str = require('underscore.string');
var moment = require('moment');
var fs = require('fs-extra');


var baseUrl = "https://www.edx.org/course-list/allschools/allsubjects/allcourses?page=";
var urls = _.range(14).map(function(n){
  return baseUrl+n;
});

async.series([
  function(cb){ // Series
    console.time("series");
    async.eachSeries(urls,function(url,urlcb){
      request(url,function(err,r,body){
        $ = cheerio.load(body);
        console.log(" ",$(".view-header").text().trim());
        urlcb();
      });
    },function(){
      console.timeEnd("series");
      cb();
    });
  },
  function(cb) { // Parallel
    console.time("parallel");
    async.each(urls,function(url,urlcb){
      request(url,function(err,r,body){
        $ = cheerio.load(body);
        console.log(" ",$(".view-header").text().trim());
        urlcb();
      });
    },function(){
      console.timeEnd("parallel");
      cb();
    });
  }
]);