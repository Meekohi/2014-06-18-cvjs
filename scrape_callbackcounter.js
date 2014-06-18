// This one is node.js and about a zillion times faster
var http = require('http');
http.globalAgent.maxSockets = 100;
var request = require('request');
var async = require('async');
var cheerio = require('cheerio');
var _ = require('underscore');
_.str = require('underscore.string');
var moment = require('moment');
var fs = require('fs-extra');

var courselinks = [];

var domain = "https://www.edx.org";
var callbacks = 0;

setInterval(function(){
  console.log(callbacks);
},100);

async.each(_.range(30),function(page,indexcb){
  callbacks += 1;
  request.get(domain+"/course-list/allschools/allsubjects/allcourses?page="+page,function(err,r,body){
    callbacks -= 1;
    var $ = cheerio.load(body);
    var links = _.uniq($(".course-title a").map(function(i,elem){return elem.attribs.href;}));
    courselinks = courselinks.concat(links);
    async.each(courselinks, function(link,cb){
      if(/edxdemo101/.test(link)) return; //Don't include the demo courses

      callbacks += 1;
      request.get(link,function(err,r,body){
        callbacks -= 1;
        var $ = cheerio.load(body);
        var course = {};
        course.name = $(".course-detail-title").text();

        // get Teacher Objects
        var teacherObjects = $(".staff-row").map(function(i,elem){
          var teacher = {
            name: $(elem).find(".staff-title").text(),
            image: $(elem).find("img").attr("src"),
            bio: $(elem).find(".staff-resume").text()
          };
          return teacher;
        });

        // Format course information
        course.image = $(".course-detail-image img").attr('src');
        course.description = $(".course-detail-about").text();
        course.originUrl = link;

        course.teachers = $(".staff-title").map(function(i,elem){
          return $(this).text();
        }).toArray();

        var startdate = moment($(".course-detail-start").text().split(":")[1]);
        if(startdate.isValid())
        {
          course.startdate = startdate.format('YYYY-MM-DD');
        }
        cb(null);
      });
    },indexcb);
  });
},function(err){

});