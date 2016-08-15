var express = require('express');
var router = express.Router();
var dbService = require('routes/services/db.service');
var mailService = require('routes/services/mail.service');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'ServerSide Fostering Linux Training Mgmt System' });
});*/

console.log('in app controller index js');
// use session auth to secure the angular app files
router.use('/', function (req, res, next) {
console.log('in app.controller use function');
// comment if require to remove login functionality temporarily 

    if (req.path !== '/login' && !req.session.token) {
        return res.redirect('/login?returnUrl=' + encodeURIComponent('/app' + req.path));

    }
   

    next();
});

// make JWT token available to angular app
router.get('/token', function (req, res) {
console.log('in app.controller get function');
    res.send(req.session.token);
});

// serve angular app files from the '/app' route
router.use('/', express.static('app'));

var mongoose = require('mongoose');
// var mongoosastic = require('mongoosastic');

var InquiryModel = require('../models/InquiryBody.js');
var TrainerModel = require('../models/Trainer.js');
var StudentFeedbackModel = require('../models/StudentFeedback.js');    //by tejas
var emailModel = require('../models/email.js');//by tejas email account create function

router.get('/inquiry', function(req, res, next) {
 console.log('entered router get function for /getinquiries');
 // find is run thru model defined in mongoose.model
  InquiryModel.find(function(err, InquiryModel){
    if(err){
	    console.log ('i am here in error')
	    return next(err); }
    console.log('success');
    console.log(InquiryModel);
    res.json(InquiryModel);
  });
});


/* POST request */
router.post('/inquiry', function(req, res, next) {
	/* creating a new  object before saving in database */
console.log('entered router post function at /submitInquiry');
console.log(req.body);

  InquiryModel.create(req.body,function(err,post){
    if(err) return next(err);
    console.log('data being posted in db='+post);
    res.json(post);
  });
});

router.post('/mail', function(req, res, next) {
    /* creating a new  object before saving in database */
    console.log('entered router post function at /mail');
    
    
    var text = 'Hello world from \n\n' + req.body.name;
console.log(text);
        
   
        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'Gmail',
            auth: { user: 'tk.srivastava94@gmail.com',
                pass: 'blackperl' }
        }));
        transporter.sendMail({
            from: 'Contact <admin@fl.com>',
            to: "tejas1.srivastava@fosteringlinux.com",                 //tejas.srivastava@fosteringlinux.com
            subject: 'Test subject',
            text: text
          
        }, function (error, response) {
            //Email not sent
            if (error) {
                console.log(error);
                res.end("Email send Falied");
            }
            //email send sucessfully
            else {
                console.log(response);
                console.log("mail sent");
                res.send("Email send");
            }
        });
    
});
/* INQUIRY GET (Single) request*/
router.get('/inquiry/:id', function(req, res) {
console.log('entered router get function at /inquiry/:_id');
console.log(req.params.id);
      dbService.getinquiry(req.params.id)
        .then(function (inquiry) {
            console.log('then');
            console.log('inquiry found :'+ req.params.id);
            res.json(inquiry);
        })
        .catch(function (err) {
          console.log('catch');
          console.log('inquiry NOT found :'+ req.params.id +' err '+ err);
            res.status(400).send(err);
        });
});

//inquiry update
router.put('/inquiry/:_id', function(req, res) {
    /* creating a new  object before saving in database */
    console.log('entered router put function at /:_id');
    console.log(req.body);


    dbService.updateinquiry(req.params._id,req.body)
        .then(function () {
            console.log('then');
            console.log('inquiry updated :'+ req.params._id);

            res.sendStatus(200);
        })
        .catch(function (err) {
            console.log('catch');
            console.log('inquiry NOT updated : '+ req.params._id +' err: '+ err);
            res.status(400).send(err);
        });
});
router.put('/follow/:_id', function(req, res) {
    /* creating a new  object before saving in database */
    console.log('entered router put function at1 /:_id');
    console.log(req.body);
    dbService.updatefollowinquiry(req.params._id,req.body)
        .then(function () {
            console.log('then');
            console.log('Follow Up inquiry updated :'+ req.params._id);
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.log('catch');
            console.log('Follow Up inquiry NOT updated : '+ req.params._id +' err: '+ err);
            res.status(400).send(err);
        });
});
//tejas inquiry status update
router.put('/status/:_id', function(req, res) {
    /* creating a new  object before saving in database */
    console.log('entered router put function at1 /:_id');
    console.log(req.body);
    dbService.updateinquirystatus(req.params._id,req.body)
        .then(function () {
            console.log('then');
            console.log('Status Of inquiry updated :'+ req.params._id);
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.log('catch');
            console.log('Status Of inquiry NOT updated : '+ req.params._id +' err: '+ err);
            res.status(400).send(err);
        });
});
/* POST request */
router.post('/register', function(req, res, next) {
  /* creating a new  object before saving in database */
console.log('entered router post function at /register');
console.log(req.body);

});

/* POST request for create trainer */
router.post('/trainers', function(req, res, next) {
  /* creating a new  object before saving in database */
console.log('entered router post function at /createTrainer');
// console.log(req.body);


    console.log(req.body);
    dbService.addnewtrainer(req.body)
        .then(function () {
            console.log('then');
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.log('catch');
            console.log(err);
            res.status(400).send(err);
        });


});

/* GETALL  request for trainer */
router.get('/trainers', function(req, res, next) {
 console.log('entered router get function for /getTrainers');
 // find is run thru model defined in mongoose.model
  TrainerModel.find(function(err, TrainerModel){
    if(err){
      console.log ('i am here in error')
      return next(err); }
    console.log('success');
    console.log(TrainerModel);
    res.json(TrainerModel);
  });
});
// pls take care that for individual objects we need to give :id
router.get('/trainers/:id', function(req, res,next) {

  console.log('entered get trainer/:id function on server side');
  //console.log(req);
  console.log(req.params.id);
  //TrainerModel.findById(req.params.id, function (err, data) {
    TrainerModel.findOne({_id:req.params.id}, function (err, data) {
    if (err) return next (err);
    console.log('individual training record retrieved from db='+data);
    res.json(data);
  });
});

router.delete('/trainers/:id', function(req, res,next) {

  console.log('entered delete trainer/:id function on server side');
  //console.log(req);
  console.log(req.params.id);
  TrainerModel.findByIdAndRemove(req.params.id, req.body, function (err, data) {
    if (err) return next (err);
    console.log('individual trainer record deleted from db='+data);
    res.json(data);
  });
});


router.put('/trainers/:id', function(req, res) {

  console.log('entered update trainer/:id function on server side');

TrainerModel.findByIdAndUpdate(req.params.id, req.body, true, function (err, data) {
    if (err) return next (err);
    console.log('individual trainer record saved in db='+data);
    res.json(data);
  });
  //console.log(req);
});

/* COURSE POST request */
router.post('/course', function(req, res, next) {
  /* creating a new  object before saving in database */
console.log('entered router post function at /addcourse');
console.log(req.body);
    dbService.addnewcourse(req.body)
        .then(function () {
            console.log('then');
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.log('catch');
            console.log(err);
            res.status(400).send(err);
        });

});

/* COURSE GET All request */
router.get('/course', function(req, res, next) {
  /* creating a new  object before saving in database */
console.log('entered router getall function at /viewcourse');
console.log(req.body);
var query = require('url').parse(req.url,true).query;
console.log(query);
      if(query.name)
      {
      dbService.getcoursebyname(query.name)
        .then(function (course) {
            console.log('then');
            console.log('course found :'+ query.name);
            res.json(course);
        })
        .catch(function (err) {
          console.log('catch');
          console.log('course NOT found :'+ query.name +' err '+ err);
            res.status(400).send(err);
        });
      }
      else
      {
      dbService.viewallcourse()
        .then(function (courselist) {
              console.log('then');
                console.log('course list found');
                console.log(courselist);
                //res.send(courselist);
                res.json(courselist);
        })
        .catch(function (err) {
            console.log('catch');
            console.log(err);
            res.status(400).send(err);
        });        
      }
});

/* COURSE GET (Single) request*/
router.get('/course/:id', function(req, res) {
console.log('entered router get function at /course/:_id');
console.log(req.params.id);
      dbService.getcourse(req.params.id)
        .then(function (course) {
            console.log('then');
            console.log('course found :'+ req.params.id);
            res.json(course);
        })
        .catch(function (err) {
          console.log('catch');
          console.log('course NOT found :'+ req.params.id +' err '+ err);
            res.status(400).send(err);
        });
});


/* COURSE Delete request - not needed for now*/
router.delete('/:_id', function(req, res) {
  /* creating a new  object before saving in database */
console.log('entered router delete function at /:_id');
console.log(req.body);
      dbService.deletecourse(req.params._id)
        .then(function () {
            console.log('then');
            console.log('course deleted :'+ req.params._id);

            res.sendStatus(200);
        })
        .catch(function (err) {
          console.log('catch');
          console.log('course NOT deleted :'+ req.params._id +' err '+ err);

            res.status(400).send(err);
        });
});

/* COURSE Update request */
router.put('/course/:_id', function(req, res) {
  /* creating a new  object before saving in database */
console.log('entered router put function at /:_id');
console.log(req.body);


      dbService.updatecourse(req.params._id,req.body)
        .then(function () {
            console.log('then');
            console.log('course updated :'+ req.params._id);

            res.sendStatus(200);
        })
        .catch(function (err) {
          console.log('catch');
          console.log('course NOT updated : '+ req.params._id +' err: '+ err);
            res.status(400).send(err);
        });
});

/* STUDENT Find Batch request */
router.get('/student/findbatch', function(req, res, next) {
    console.log('entered router findbatch function at /student');
    var query = require('url').parse(req.url,true).query;
    console.log(query);

    dbService.findbatch(query.loc, query.course)
    .then(function (stuBat) {
    console.log('then');
    console.log('Student Batch found :'+ stuBat);
    res.json(stuBat);
    })
    .catch(function (err) {
    console.log('catch');
    console.log('Student Batch NOT found :'+ query.loc + query.course +' err '+ err);
    res.status(400).send(err);
    });


});


/* STUDENT POST request */
router.post('/student', function(req, res, next) {
  /* creating a new  object before saving in database */
console.log('entered router post function at /student');
console.log(req.body);
    dbService.addnewstudent(req.body)
        .then(function () {
            console.log('then');
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.log('catch');
            console.log(err);
            res.status(400).send(err);
        });

});

router.get('/studentid/:id', function(req, res, next) {
    console.log('entered router getstudentdataone function at /studentid');
    //  var query = require('url').parse(req.url,true).query;

    console.log(req.params.id);



    dbService.findtstudentone(req.params.id)
        .then(function (studentlist) {
            console.log('then');
            console.log('Student list found111');
            console.log(studentlist);
            //res.send(courselist);
            res.json(studentlist);
        })
        .catch(function (err) {
            console.log('catch');
            console.log(err);
            res.status(400).send(err);
        });
});

/* STUDENT GET All request */
router.get('/student', function(req, res, next) {
console.log('entered router getall function at /student');
var query = require('url').parse(req.url,true).query;
console.log(query);
if(!query.email)
{
      console.log('entered in Student List with Batch Id : '+query.batId);
      dbService.viewallstudent(query.batId)
        .then(function (studentlist) {
              console.log('then');
                console.log('Student list found');
                console.log(studentlist);
                res.json(studentlist);
        })
        .catch(function (err) {
            console.log('catch');
            console.log(err);
            res.status(400).send(err);
        });        
}
else
{
      console.log('entered in Find Student');
      dbService.getstudent(query.email)
        .then(function (student) {
            console.log('then');
            console.log('Student found :'+ query.email);
            res.json(student);
        })
        .catch(function (err) {
          console.log('catch');
          console.log('Student NOT found :'+ query.email +' err '+ err);
            res.status(400).send(err);
        });

}
});

/* STUDENT Delete request*/
router.delete('/student/:_id', function(req, res) {
console.log('entered router delete function at /student/:_id');
console.log(req.body);
      dbService.deletestudent(req.params._id)
        .then(function () {
            console.log('then');
            console.log('Student deleted :'+ req.params._id);

            res.sendStatus(200);
        })
        .catch(function (err) {
          console.log('catch');
          console.log('Student NOT deleted :'+ req.params._id +' err '+ err);

            res.status(400).send(err);
        });
});

/* STUDENT Update request */
router.put('/student/:_id', function(req, res) {
console.log('entered router put function at /student/:_id');
console.log(req.body);

      dbService.updatestudent(req.params._id,req.body)
        .then(function () {
            console.log('then');
            console.log('Student updated :'+ req.params._id);

            res.sendStatus(200);
        })
        .catch(function (err) {
          console.log('catch');
          console.log('Student NOT updated : '+ req.params._id +' err: '+ err);
            res.status(400).send(err);
        });
});


/* BATCH POST request */
router.post('/batch', function(req, res, next) {

console.log('entered router post function at /batch');
console.log(req.body);
    dbService.addnewbatch(req.body)
        .then(function () {
            console.log('then');
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.log('catch');
            console.log(err);
            res.status(400).send(err);
        });

});

/* BATCH GET TRAINER request*/
router.get('/batch/findtrainer/', function(req, res) {
var query = require('url').parse(req.url,true).query;

console.log('entered router get function at /batch/findtrainer/:course ::' + query.course);
      dbService.findtrainer(query.course, query.loc, query.day)
        .then(function (trainer) {
            console.log('then '+ trainer);
            console.log('Trainer found for :'+ query.course + ' Location : '+ query
              .loc +' and Day : '+query.day);
            res.json(trainer);
        })
        .catch(function (err) {
          console.log('catch');
          console.log('Trainer Not found for :'+ query.course + ' Location : '+ query
              .loc +' and Day : '+query.day +' err '+ err);
            res.status(400).send(err);
        });
});

/*FIND TRAINER MAIL BY PASSING BATCH ID */
router.get('/batch/findone', function(req, res, next) {
    console.log('entered router getbatchid function at /batch');
  var query = require('url').parse(req.url,true).query;
   
    console.log(query.id);
   
    dbService.findtrainermail(query.id)
        .then(function (batchlist) {
            console.log('then');
            console.log('Batch list found111');
            console.log(batchlist);
            //res.send(courselist);
            res.json(batchlist);
        })
        .catch(function (err) {
            console.log('catch');
            console.log(err);
            res.status(400).send(err);
        });
});

router.get('/trainersname/:tmail', function(req, res, next) {
    console.log('entered router gettrainername function at /trainersname');
    //  var query = require('url').parse(req.url,true).query;
    console.log(req.params.tmail);
    dbService.getTrainerName(req.params.tmail)
        .then(function (trainer) {
            console.log('then');
            console.log('trainer list found111');
            console.log(trainer);
            //res.send(courselist);
            res.json(trainer);
        })
        .catch(function (err) {
            console.log('catch');
            console.log(err);
            res.status(400).send(err);
        });
});
/* STUDENT GET All request */
router.get('/batch', function(req, res, next) {
console.log('entered router getall function at /batch');
//var query = require('url').parse(req.url,true).query;
//console.log(query.id);
//console.log(query.val);
var query = require('url').parse(req.url,true).query;
console.log(query);

      //dbService.viewallbatch(query.id, query.val)
      dbService.viewallbatch(query.traEmail)
        .then(function (batchlist) {
              console.log('then');
                console.log('Batch list found');
                console.log(batchlist);
                //res.send(courselist);
                res.json(batchlist);
        })
        .catch(function (err) {
            console.log('catch');
            console.log(err);
            res.status(400).send(err);
        });        
});

/* BATCH Update request */
router.put('/batch/:_id', function(req, res) {
console.log('entered router put function at /batch/:_id');
console.log(req.body);

      dbService.updatebatch(req.params._id,req.body)
        .then(function () {
            console.log('then');
            console.log('Batch updated :'+ req.params._id);

            res.sendStatus(200);
        })
        .catch(function (err) {
          console.log('catch');
          console.log('Batch NOT updated : '+ req.params._id +' err: '+ err);
            res.status(400).send(err);
        });
});


router.post('/studentfeedback', function(req, res, next) {
    /* creating a new  object before saving in database */
    console.log('entered router post function at /studentfeedback');
    console.log(req.body);
    StudentFeedbackModel.create(req.body,function(err,post){
        if(err) return next(err);
        console.log('data being posted in db='+post);
        res.json(post);
    });
});
router.post('/submitinquirym',function (req,res){
    console.log('entered router post function at /submitinquirym');
    console.log(req.body);
    mailService.submitinquiry(req.body)
        .then(function () {
            console.log('then');
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.log('catch');
            console.log(err);
            res.status(400).send(err);
        });
});
router.post('/createmail',function (req,res){
    console.log('entered router post function at /createmail');
    console.log(req.body);
    emailModel.create(req.body,function(err,post){
        if(err) return next(err);
        console.log('data being posted in db='+post);
        res.json(post);
    });
});
router.get('/mailinfo', function(req, res, next) {
    console.log('entered router get function for /mailinfo');
    emailModel.find(function(err, emailModel){
        if(err){
            console.log ('i am here in error')
            return next(err); }
        console.log('success');
        console.log(emailModel);
        res.json(emailModel);
    });
});
module.exports = router;
