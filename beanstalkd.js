beanstalkd.watch("createSpin", function(err, tubename){
  reserveWork();
});

function reserveWork(){
  async.auto({
    reservation: function(cb){
      beanstalkd.reserve(function(err, jobid, payload){
        cb(null,{ payload: payload, jobid: jobid });
      });
    },
    work: ['reservation',function(cb,r){
      var payload = JSON.parse(r.reservation.payload);
      // work work work...
      cb(null, new_payload);
    }],
    done: ['work',function(cb,r){
      beanstalkd.use("editor",function(err,tube){// next tube
        beanstalkd.put(1024, 0, 300, r.work, function(err,new_jobid){
          beanstalkd.destroy(jobid, cb);
        });
      });
    }]
  }, reserveWork);
}