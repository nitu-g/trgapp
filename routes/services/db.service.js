var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var mongoose = require('mongoose');
var users = require('../../models/User.js');
var batches = require('../../models/Batch.js');
var courses = require('../../models/Course.js');
var students = require('../../models/Student.js');
var trainers = require('../../models/Trainer.js');


var inquiry = require('../../models/InquiryBody.js');

//var users = mongoose.model('userModel');
var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.usercheck = usercheck;
service.update = update;
service.delete = _delete;
service.getinquiry = getinquiry;
service.addnewcourse = addnewcourse;
service.viewallcourse = viewallcourse;
service.getcourse = getcourse;
service.getcoursebyname = getcoursebyname;
service.deletecourse = _deletecourse;
service.updatecourse = updatecourse;
service.updateinquiry = updateinquiry;
service.updatefollowinquiry = updatefollowinquiry;
service.addnewtrainer = addnewtrainer;
//service.viewalltrainer = viewalltrainer;
//service.deletetrainer = _deletetrainer;
//service.updatetrainer = updatetrainer;
service.findbatch = findbatch;
service.addnewstudent = addnewstudent;
service.viewallstudent = viewallstudent;
service.getstudent = getstudent;
service.findtrainermail = findtrainermail; 
service.batchtrainer = batchtrainer;
service.findtstudentone = findtstudentone;

service.deletestudent = _deletestudent;
service.updatestudent = updatestudent;
service.addnewbatch = addnewbatch;
service.findtrainer = findtrainer;
service.viewallbatch = viewallbatch;
service.updatebatch = updatebatch;
service.getTrainerName = getTrainerName; 
service.updateinquirystatus = updateinquirystatus;

module.exports = service;


function authenticate(username, password, inlineRadioOptions) {
    var deferred = Q.defer();

    users.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err);

        if ((user && bcrypt.compareSync(password, user.password)) && 
            (user.inlineRadioOptions == inlineRadioOptions)){

            
            console.log('authentication successful in user service');
            deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
        } else {
            console.log('authentication failed');
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    users.findById(_id, function (err, user) {
        if (err) deferred.reject(err);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function usercheck(userParam) {
    console.log('in checkuser.service.js user email sent check fucntion');
    var deferred = Q.defer();

    // validation
    users.findOne({ username: userParam.username }, function (err, user) {
        console.log('in checkuser.service.js user name does not exist');
        if (err) deferred.reject(err);

            if (user) {
                // username already exists
                deferred.reject('Mail Sent to the email ID"' + userParam.username + '", Please check');
            } else {}
        });
    return deferred.promise;
}


function create(userParam) {
    var deferred = Q.defer();

    // validation
    users.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err);

            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                //createUser();
                // create a user a new user
                var testUser = new users(userParam);
                console.log("create function")
                console.log(userParam.password);

            testUser.save(
            
            function (err, doc) {
                if (err) deferred.reject(err);

                console.log('within create');
                deferred.resolve();
            });


            }
        });


    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);
        console.log(userParam.password);
        console.log(user.hash);

        users.create(
            user,
            function (err, doc) {
                if (err) deferred.reject(err);

                console.log('within create');
                deferred.resolve();
            });
    }
    console.log('out of create');
    console.log(deferred.promise);
    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    users.findById(_id, function (err, user) {
        if (err) deferred.reject(err);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            users.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}

function getinquiry(_id) {
    var deferred = Q.defer();
    console.log('in user service js : getinquiry');
    inquiry.findOne(
        { _id: _id},
        function (err, inquiry) {
            console.log(err);
            if (err) deferred.reject(err);

            deferred.resolve(inquiry);
        });

    return deferred.promise;
    
}



function getTrainerName(tmail) {
    var deferred = Q.defer();
    console.log('in user service js : getinquiry');
    console.log(tmail);

    trainers.findOne(
        { email: tmail},
        function (err, trainer) {
            console.log(err);
            if (err) deferred.reject(err);

            deferred.resolve(trainer);
        });

    return deferred.promise;

}

function updateinquiry(_id, inquiryParam) {
    var deferred = Q.defer();
    console.log('in user service js : updateinquiry');

    // validation
    /*users.findById(_id, function (err, user) {
     if (err) deferred.reject(err);

     if (user.username !== userParam.username) {
     // username has changed so check if the new username is already taken
     users.findOne(
     { username: userParam.username },
     function (err, user) {
     if (err) deferred.reject(err);

     if (user) {
     // username already exists
     deferred.reject('Username "' + req.body.username + '" is already taken')
     } else {
     updateUser();
     }
     });
     } else {
     updateUser();
     }
     });*/

    //function updateUser() {
    // fields to update
    var set = {
       

        id:inquiryParam.id,
        candname:inquiryParam.candname,
        candmail:inquiryParam.candmail,
        candnum1:inquiryParam.candnum1,
        destrg:inquiryParam.destrg,

        startTime:inquiryParam.startTime,
        endTime:inquiryParam.endTime,
        desday:inquiryParam.desday,
        desmon:inquiryParam.desmon,
        desloc:inquiryParam.desloc,
        othCou:inquiryParam.othCou,
        othfee:inquiryParam.othfee,
        othdur:inquiryParam.othdur,
        fosc:inquiryParam.fosc,
        dosc:inquiryParam.dosc,
        stax:inquiryParam.stax,
        dio:inquiryParam.dio,
        da:inquiryParam.da,
        netfee:inquiryParam.netfee,
        sumofdis:inquiryParam.sumofdis

    };

    inquiry.update(
        { _id: _id },
        { $set: set },
        function (err, doc) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });
//    }

    return deferred.promise;
}
function updatefollowinquiry(_id, inquiryParam) {
    var deferred = Q.defer();
    console.log('in user service js : update follow up inquiry');

    // validation
    /*users.findById(_id, function (err, user) {
     if (err) deferred.reject(err);

     if (user.username !== userParam.username) {
     // username has changed so check if the new username is already taken
     users.findOne(
     { username: userParam.username },
     function (err, user) {
     if (err) deferred.reject(err);

     if (user) {
     // username already exists
     deferred.reject('Username "' + req.body.username + '" is already taken')
     } else {
     updateUser();
     }
     });
     } else {
     updateUser();
     }
     });*/

    //function updateUser() {
    // fields to update
    var set = {


        id:inquiryParam.id,
        followdate1: inquiryParam.followdate1,
        rem1: inquiryParam. rem1,
        stat1: inquiryParam.  stat1,
        followdate2: inquiryParam.followdate2,
        rem2: inquiryParam. rem2,

        followdate3: inquiryParam.followdate3,
        rem3: inquiryParam. rem3


    };

    inquiry.update(
        { _id: _id },
        { $set: set },
        function (err, doc) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });
//    }

    return deferred.promise;
}
//tejas
function updateinquirystatus(_id, inquiryParam) {
    var deferred = Q.defer();
    console.log('in user service js : update status of inquiry');
    // validation
    /*users.findById(_id, function (err, user) {
     if (err) deferred.reject(err);
     if (user.username !== userParam.username) {
     // username has changed so check if the new username is already taken
     users.findOne(
     { username: userParam.username },
     function (err, user) {
     if (err) deferred.reject(err);
     if (user) {
     // username already exists
     deferred.reject('Username "' + req.body.username + '" is already taken')
     } else {
     updateUser();
     }
     });
     } else {
     updateUser();
     }
     });*/
    //function updateUser() {
    // fields to update
    var set = {
        stat1: inquiryParam.stat1,
    };
    inquiry.update(
        { _id: _id },
        { $set: set },
        function (err, doc) {
            if (err) deferred.reject(err);
            deferred.resolve();
        });
//    }
    return deferred.promise;
}
function addnewcourse(addCourseParam) {
    var deferred = Q.defer();
    console.log('in user service js : addnewcourse ');
    console.log(addCourseParam);

    // validation
    courses.findOne(
        {
            $or: [{id: addCourseParam.id},
                  {name: addCourseParam.name}]},

        function (err, course) {
            if (err) deferred.reject(err);

            if (course) {
                console.log(course);

                // Course ID already exists
                deferred.reject('Course Id "' + addCourseParam.id + '"or Course Name "'+ addCourseParam.name + '"is already available.');
            } else {
                // create a user a new user
                var newCou = new courses(addCourseParam);
                console.log("create function for add course");

            newCou.save(
            
            function (err, doc) {
                if (err) deferred.reject(err);

                console.log(err);
                console.log(doc);
                console.log('within save');
                deferred.resolve();
            });


            }
        });

    console.log('out of findone');
    console.log(deferred.promise);
    return deferred.promise;
}

function viewallcourse() {
    var deferred = Q.defer();
    console.log('in user service js : viewallcourse ');

    // validation
    courses.find({},function (err, courselist) {
            console.log(err);
            console.log(courselist);
            if (err) deferred.reject(err);

            console.log('within find');
            deferred.resolve(courselist);
            });

    console.log('out of find');
    return deferred.promise;
}

function getcourse(_id) {
    var deferred = Q.defer();
    console.log('in user service js : getcourse');
    courses.findOne(
        { _id: _id},
        function (err, course) {
            console.log(err);
            if (err) deferred.reject(err);

            deferred.resolve(course);
        });

    return deferred.promise;
}

function getcoursebyname(cName)
{
    var deferred = Q.defer();
    console.log('in user service js : getcoursebyname');
    courses.findOne(
        { name: cName},
        'name regfee firinsfee secinsfee',
        function (err, course) {
            console.log(err);
            if (err) deferred.reject(err);

            deferred.resolve(course);
        });

    return deferred.promise;
}

function _deletecourse(_id) {
    var deferred = Q.defer();
    console.log('in user service js : deletecourse');
    courses.remove(
        { _id: _id},
        function (err) {
            console.log(err);
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}

function updatecourse(_id, courseParam) {
    var deferred = Q.defer();
    var proceedForUpdate = true;
    var errmsg = null;

    console.log('in user service js : updatecourse');

    courses.findOne(
        {_id:_id},
        function (err, course) {
            if (err) deferred.reject(err);

            if (course) {
                console.log(course);
                // Check for change in Course Id.
                console.log('Course found. id and name '+course.id+ course.name);
                //Both Id and Name changed
                if((course.id != courseParam.id) && 
                    (course.name != courseParam.name))
                {
                    console.log('Both Course Id changed. old Id '+course.id+ ' new id '+courseParam.id);
                    console.log('And Course name changed. old name '+course.name+ ' new name '+courseParam.name);
                    courses.findOne(
                        {
                            $or: [{id: courseParam.id},
                            {name: courseParam.name}]},

                        function (err, cou) {
                            if (err) deferred.reject(err);

                            if (cou) {
                                console.log(cou);
                                console.log('Course Id "' + courseParam.id + '"or Course Name "'+ courseParam.name + '"is already available.');
                                deferred.reject('Course Id "' + courseParam.id + '"or Course Name "'+ courseParam.name + '"is already available.');
                                //errmsg = 'Course Id "' + courseParam.id + '"is already available.';
                                //proceedForUpdate = false;
                            } 
                            else
                            {
                                savecourse(courseParam);
                            }
                        });
                }
                //Only if Id changed.
                else if(course.id != courseParam.id)
                {
                    console.log('Course Id changed. old Id '+course.id+ ' new id '+courseParam.id);
                    courses.findOne(
                        {id:courseParam.id},
                        function (err, couById) {
                            if (err) deferred.reject(err);

                            if (couById) {
                                console.log(couById);

                                // Course ID already exists
                                console.log('Course Id "' + courseParam.id + '"is already available.');
                                deferred.reject('Course Id "' + courseParam.id + '"is already available.');
                                //errmsg = 'Course Id "' + courseParam.id + '"is already available.';
                                //proceedForUpdate = false;
                            } 
                            else
                            {
                                savecourse(courseParam);
                            }
                        });
                }
                //Only if name changed
                else if(course.name != courseParam.name)
                {
                    console.log('Course name changed. old name '+course.name+ ' new name '+courseParam.name);
                    courses.findOne(
                        {name:courseParam.name},
                        function (err, couByName) {

                            if (couByName) {
                                console.log(couByName);

                                // Course Name already exists
                                console.log('Course Name"' + courseParam.name + '"is already available.');
                                deferred.reject('Course Name"' + courseParam.name + '"is already available.');
                                //errmsg = 'Course Name"' + courseParam.name + '"is already available.';

                                //proceedForUpdate = false;
                            }
                            else
                            {
                                savecourse(courseParam);
                            } 
                        });  
                }
            } 
            else 
            {
                deferred.reject('Course object '+ _id + 'not found.');
            }
        });


        //console.log('proceedForUpdate '+proceedForUpdate);
        //if(proceedForUpdate)
        function savecourse(courseParam)
        {
            var set = {
                id: courseParam.id,
                name: courseParam.name,
                fee:courseParam.fee,
                regfee:courseParam.regfee,
                firinsfee:courseParam.firinsfee,
                secinsfee:courseParam.secinsfee,
                srvctax:courseParam.srvctax,
                totalfee:courseParam.totalfee,
                duration:courseParam.duration,
                remarks:courseParam.remarks,
                status:courseParam.status
            };

            courses.update(
                { _id: _id },
                { $set: set },
                function (err, doc) {
                    if (err) deferred.reject(err);      

                    deferred.resolve();
                });
        }

    return deferred.promise;
}

function addnewtrainer(addTrainerParam) {
    var deferred = Q.defer();
    console.log('in user service js : addnewtrainer ');
    console.log(addTrainerParam);

    // validation
    trainers.findOne(
        {email: addTrainerParam.email},

        function (err, trainer) {
            if (err) deferred.reject(err);

            if (trainer) {
                console.log(trainer);

                // Trainer Name already exists
                deferred.reject('Trainer Email "' + addTrainerParam.email + '" is already exists.');
            } else {
                // create a new Trainer
                var newTra = new trainers(addTrainerParam);
                console.log("create function for add trainer" + addTrainerParam.trainername);

            newTra.save(
            function (err, doc) {
                if (err) deferred.reject(err);

                console.log(err);
                console.log(doc);
                console.log('within save');

                deferred.resolve();
            });
            }
        });

    console.log('out of findone');
    console.log(deferred.promise);
    return deferred.promise;
}

function findbatch(loc, course) {
    var deferred = Q.defer();
    console.log('in db service js : findbatch for ' + course +' and '+ loc);

    batches.find(
        { $and:
            [{course:  course},
            {loc:loc},
            {status:"Scheduled"}]},
        function (err, batch) {
            console.log(err);
            if (err) deferred.reject(err);

            if (batch) {
                console.log(batch);
                deferred.resolve(batch);
            } else {

           // deferred.reject('Batch '+batch.id+' strength is full. Wait for next batch schedule.');                    

            }
        });

    console.log('out of find');
    return deferred.promise;
}

function updateCurrStren(_id, currStren)
{

     batches.update(
        { _id: _id },
        { actualstren: currStren },
        function (err, doc) {
            console.log('err in updateCurrStren:: '+err);
            if (err) return false;      
            //deferred.resolve();
        });
     return true;
}

function addnewstudent(addParam) {
    var deferred = Q.defer();
    console.log('in user service js : addnewstudent for Id : '+ addParam.inquiryId);
    console.log(addParam);

    // validation
    students.findOne(
        { $and:
            [{email:  addParam.email},
            {loc:addParam.loc},
            {course:addParam.course}]},

        function (err, student) {
            console.log('err in student find one ' +err);
            if (err) deferred.reject(err);

            if (student) {
                console.log(student);

                // Student Name already exists
                deferred.reject('Student Email "' + addParam.email + '" is already enrolled for Course "' + addParam. course +'" and Location "'+addParam.loc+'".');
            } 
            else 
            {     
                if (addParam.status == "Batch Not Assigned")
                {
                    // create a new Student
                    var newStu = new students(addParam);
                    console.log("Create function for add student with batch not asssigned " + addParam.name);

                    newStu.save(
                    function (err, doc) {
                        if (err) deferred.reject(err);

                        console.log(err);
                        //console.log(doc);
                        console.log('within save');
                        deferred.resolve();
                    });                       
                }
                else
                {
                    //Check Batch Strength
                    batches.findOne(
                    {id:addParam.batchId},
                    function (err, batch) {
                        console.log('err in batch find one ' +err);
                        if (err) deferred.reject(err);

                        if (batch) {
                            console.log(batch);
                            //deferred.resolve(batch);
                            if(batch.targetstren < (batch.actualstren +1))
                            {
                                deferred.reject('Batch '+batch.id+' strength is full. Wait for next batch schedule.');                    
                            }
                            else
                            {
                               // create a new Student
                                var newStu = new students(addParam);
                                console.log("Create function for add student with batch asssigned " + addParam.name);

                                newStu.save(
                                function (err, doc) {
                                    if (err) deferred.reject(err);

                                    console.log(err);
                                    //console.log(doc);
                                    console.log('within save');
                                    updateCurrStren(batch._id,(batch.actualstren +1))
                                    deferred.resolve();
                                });                  
                            }
                        } 
                        else 
                        {
                           deferred.reject('Batch Id is invalid '+ addParam.batchId);                    
                        }
                    });
                }              
            }
        });

    console.log('out of findone');
    console.log(deferred.promise);
    return deferred.promise;
}

function viewallstudent(batId) {
    var deferred = Q.defer();
    console.log('in user service js : viewallstudent ');

    if(batId == null)
    {
    // validation
    students.find({},function (err, list) {
            console.log(err);
            console.log(list);
            if (err) deferred.reject(err);

            console.log('within find');
            deferred.resolve(list);
            });
    }
    else
    {
        students.find(
        { batchId: batId},
        function (err, list) {
            console.log(err);
            console.log(list);
            if (err) deferred.reject(err);

            console.log('within find');
            deferred.resolve(list);
        });        
    }
    console.log('out of find');
    return deferred.promise;
}

function getstudent(email) {
    var deferred = Q.defer();
    console.log('in user service js : getstudent');
    students.findOne(
        { email: email},
        function (err, student) {
            console.log(err);
            if (err) deferred.reject(err);

            console.log('within find');
            deferred.resolve(student);
        });
    console.log('out of find');
    return deferred.promise;
}

function batchtrainer(_id) {
    var deferred = Q.defer();
    console.log('in user service js : getstudent');
    students.findOne(
        { _id: _id},
        function (err, student) {
            console.log(err);
            if (err) deferred.reject(err);

            console.log('within find');
            deferred.resolve(student);
        });
    console.log('out of find');
    return deferred.promise;
}



function updatestudent(_id, studentParam) {
    var deferred = Q.defer();
    console.log('in user service js : updatestudent');
    var batchId = null;
    var status = studentParam.status;
    var set = null;

    /*If Batch moved from Assigned to Not Assigned*/
    if(((studentParam.status == "Batch Not Assigned") && (studentParam.preBatchStatus == "Batch Assigned")) ||
        (studentParam.status == "Batch Assigned") && (studentParam.newBatchId !=null))
    {
        if (studentParam.status == "Batch Not Assigned")
        {       
               //Clear batch strength from previous batch 
               console.log('Batch moved from Assigned to Not Assigned');
               var oldBatch = null;
               batches.findOne(
                    {id:studentParam.oldBatchId},
                    function (err, oldBatch) {
                        console.log('error in finding oldBatch for id ' + studentParam.oldBatchId + ' is ' + err);
                        if (err) deferred.reject(err);

                        if (oldBatch) {
                            console.log('old batch found as ' + oldBatch);
                            if (oldBatch.actualstren > 0)
                            {
                                console.log('Reduce batch stren. currStren '+oldBatch.actualstren);
                                updateCurrStren(oldBatch._id,(oldBatch.actualstren - 1));
                                console.log(' batchId : '+batchId +' status : '+status);
                                // fields to update
                                set = {
                                    feeSubmStatus:studentParam.feeSubmStatus,
                                    firInsFee:studentParam.firInsFee,
                                    firInsDate: studentParam.firInsDate,
                                    secInsFee:studentParam.secInsFee,
                                    secInsDate: studentParam.secInsDate,
                                    actFeeAmt:studentParam.actFeeAmt,
                                    batchId:batchId,
                                    status:status,
                                    remarks:studentParam.remarks,
                                    traCompleted:studentParam.traCompleted,
                                    certifIssu:studentParam.certifIssu,
                                    certifDate:studentParam.certifDate,
                                    feedbaSubm:studentParam.feedbaSubm
                                };

                                students.update(
                                { _id: _id },
                                { $set: set },
                                function (err, doc) {
                                    console.log('err :: '+err);
                                    if (err) deferred.reject(err);      

                                    deferred.resolve();
                                });
                            }
                            else
                            {
                                console.log('Error in batch stren. currStren '+oldBatch.actualstren);
                            }

                        } 
                        else {
                            deferred.reject('Old Batch Id is invalid '+ studentParam.oldBatchId);
                        }
                    }); 
                           
        }
        else
        {
            /*If Batch status in Assigned i.e. moved from Not Assigned or Batch Reassignment*/

            console.log('Batch Reassignment or Assignment started. New batch status '+studentParam.status +' and old batch status '+studentParam.preBatchStatus);
            console.log('newBatchId '+ studentParam.newBatchId);
            if (studentParam.newBatchId)
            {            
                var newBatch = null;
                var oldBatch = null;

                //Check batch strength in new batch
                batches.findOne(
                    {id:studentParam.newBatchId},
                    function (err, newBatch) {
                        console.log('error in finding newBatch for id ' + studentParam.newBatchId  + ' is '+ err);
                        if (err) deferred.reject(err);

                        if (newBatch) {
                            console.log('newBatch found as '+ newBatch);
                            if(newBatch.targetstren < (newBatch.actualstren + 1))
                            {
                                console.log('New Batch Strength exceeded');
                                deferred.reject('Batch '+studentParam.newBatchId+' strength is full. Wait for next batch schedule.');
                            }
                            else
                            {

                               batchId = studentParam.newBatchId;                                                            
                               console.log('batchId to be update'+batchId);
                               //Update batch strength in new batch
                               updateCurrStren(newBatch._id,(newBatch.actualstren + 1));
                            
                                /*If Batch Id re-assigned then clear batch strength from previous batch as well*/
                                if((studentParam.preBatchStatus == "Batch Assigned") && (studentParam.oldBatchId != null))
                                {            
                                    batches.findOne(
                                        {id:studentParam.oldBatchId},
                                        function (err, oldBatch) {
                                            console.log('error in finding oldBatch for id ' + studentParam.oldBatchId + ' is ' + err);
                                            if (err) deferred.reject(err);

                                            if (oldBatch) {
                                                console.log('old batch found ' + oldBatch);
                                                if (oldBatch.actualstren > 0)
                                                {
                                                    console.log('Reduce batch stren. currStren '+oldBatch.actualstren);
                                                    updateCurrStren(oldBatch._id,(oldBatch.actualstren - 1));
                                                }
                                                else
                                                {
                                                    console.log('Error in batch stren. currStren '+oldBatch.actualstren);
                                                }
                                            } 
                                            else {
                                                deferred.reject('Old Batch Id is invalid '+ studentParam.oldBatchId);
                                            }
                                        });        
                                }

                                console.log(' batchId : '+batchId +' status : '+status);
                                // fields to update
                                set = {
                                    feeSubmStatus:studentParam.feeSubmStatus,
                                    firInsFee:studentParam.firInsFee,
                                    firInsDate: studentParam.firInsDate,
                                    secInsFee:studentParam.secInsFee,
                                    secInsDate: studentParam.secInsDate,
                                    actFeeAmt:studentParam.actFeeAmt,
                                    batchId:batchId,
                                    status:status,
                                    remarks:studentParam.remarks,
                                    traCompleted:studentParam.traCompleted,
                                    certifIssu:studentParam.certifIssu,
                                    certifDate:studentParam.certifDate,
                                    feedbaSubm:studentParam.feedbaSubm
                                };

                                students.update(
                                { _id: _id },
                                { $set: set },
                                function (err, doc) {
                                    console.log('err :: '+err);
                                    if (err) deferred.reject(err);      

                                    deferred.resolve();
                                }); 
                            }
                        } 
                        else {
                            deferred.reject('New Batch Id is invalid '+ studentParam.newBatchId);
                        }
                    });
                
            }
        }
        
    }
    else
    {
        console.log('in updatestudent without batchid')
        // fields to update
            set = {
                feeSubmStatus:studentParam.feeSubmStatus,
                firInsFee:studentParam.firInsFee,
                firInsDate: studentParam.firInsDate,
                secInsFee:studentParam.secInsFee,
                secInsDate: studentParam.secInsDate,
                actFeeAmt:studentParam.actFeeAmt,
                remarks:studentParam.remarks,
                traCompleted:studentParam.traCompleted,
                certifIssu:studentParam.certifIssu,
                certifDate:studentParam.certifDate,
                feedbaSubm:studentParam.feedbaSubm                
            };

            students.update(
            { _id: _id },
            { $set: set },
            function (err, doc) {
                console.log('err :: '+err);
                if (err) deferred.reject(err);      

                deferred.resolve();
            });

    } 


    return deferred.promise;
}


function _deletestudent(_id) {
    var deferred = Q.defer();
    console.log('in user service js : deletestudent');
    students.remove(
        { _id: _id},
        function (err) {
            console.log(err);
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}

function updateActTrainerStren(trainerEmail, day, deferred)
{
    //var deferred = Q.defer();
    console.log('in user service js : updateActTrainerStren for '+trainerEmail +' and day as ' +day);
    trainers.findOne(
        { email: trainerEmail},
        function (err, trainer) {
            console.log(err);
            if (err) deferred.reject(err);

            if (trainer)
            {
                console.log('within find');
                //deferred.resolve(student);
                if((day==0) ||(day==6))
                {
                    if(trainer.actwkendstren < trainer.wkendcapa)
                    {
                        updatedAct = trainer.actwkendstren +1;

                        trainers.update(
                            { _id: trainer._id },
                            { actwkendstren: updatedAct },
                            function (err, doc) {
                                if (err) deferred.reject(err);      

                                deferred.resolve();
                            });
                    }
                    else
                    {
                        deferred.reject('Trainer ' + trainer.email + '" batch capacity exceeded.');
                    }
                }
                else if((day >0) && (day < 6))
                {
                    if(trainer.actwkdaystren < trainer.wkdaycapa)
                    {
                        updatedAct = trainer.actwkdaystren +1;

                        trainers.update(
                            { _id: trainer._id },
                            { actwkdaystren: updatedAct },
                            function (err, doc) {
                                if (err) deferred.reject(err);      

                                deferred.resolve();
                            });
                    }
                    else
                    {
                        deferred.reject('Trainer ' + trainer.email + '" batch capacity exceeded.');
                    }
                }
            }
            else
            {
                console.log('Trainer not found with email '+trainerEmail);
            }

        });
    console.log('out of find');
    return deferred.promise;
}

function addnewbatch(addParam) {
    var deferred = Q.defer();
    console.log('in user service js : addnewbatch for Id : '+ addParam.id);
    console.log(addParam);

    // validation
    batches.findOne(
        {id: addParam.id},

        function (err, batch) {
            if (err) deferred.reject(err);

            if (batch) {
                console.log(batch);

                // Student Name already exists
                deferred.reject('Batch ID "' + addParam.id + '" is already exists.');
            } else {

                var startDate = new Date(addParam.plstartdate);
                var day = startDate.getDay();
                //First update Trainer Strength 
                updateActTrainerStren(addParam.trainer, day, deferred);
                
                // create a new Student
                var newBat = new batches(addParam);
                console.log("Create function for add batch" + addParam.id);

                newBat.save(
                function (err, doc) {
                    if (err) deferred.reject(err);

                    console.log(err);
                    console.log(doc);
                    console.log('within save');

                    deferred.resolve();
                });
            }
        });

    console.log('out of findone');
    console.log(deferred.promise);
    return deferred.promise;
}


function findtrainer(course, loc, day) {
    var deferred = Q.defer();
    console.log('in db service js : findtrainer' + course);
    
    var set = null;

    //If day is Weekend
    if((day == 6) || (day == 0))
    {
        trainers.find(
        { $and: 
            [{courses:  course},
            {wkendcapa: {$gt: 0}},
            {trgloc:loc}]},
            '_id trainername email actwkendstren wkendcapa',
            {$where: "this.actwkendstren < this.wkendcapa"},
        function (err, trainer) {
            console.log(err);
            if (err) deferred.reject(err);

            if (trainer) {
                console.log('Trainer List for Weekend day :' + day +' are '+ trainer.length);
                deferred.resolve(trainer);
            } 
            else {
                console.log('No Trainer found for Weekend day :' + day);  
                deferred.reject('No Trainer found for Weekend day.' );  
            }
        });
    
    }
    //else day is Weekday
    else
    {
        trainers.find(
            { $and: 
                [{courses:  course},
                {wkdaycapa: {$gt: 0}},
                {trgloc:loc}]},
            '_id trainername email actwkdaystren wkdaycapa',
            {$where: "this.actwkdaystren < this.wkdaycapa"},
        function (err, trainer) {
            console.log(err);
            if (err) deferred.reject(err);

            if (trainer) {
                console.log('Trainer List for Weekday day :' + day +' are '+ trainer.length);
                deferred.resolve(trainer);
            } 
            else {
                deferred.reject('No Trainer found for Weekday day :' + day);  
            }
        });

    }
    
    console.log('out of find');
    return deferred.promise;
}

function findtrainermail(_id) {
    var deferred = Q.defer();
    console.log('in db service js : findtrainermail' + _id);

    batches.findOne(
        { _id: _id},
        function (err, trainer) {
            console.log(err);
            if (err) deferred.reject(err);

            console.log('within find');
            deferred.resolve(trainer);
        });
    console.log('out of find');
    return deferred.promise;
}

function findtstudentone(_id) {
    var deferred = Q.defer();
    console.log('in db service js : findstudentone' + _id);

    students.findOne(
        { _id: _id},
        function (err, student) {
            console.log(err);
            if (err) deferred.reject(err);

            console.log('within find');
            deferred.resolve(student);
        });
    console.log('out of find');
    return deferred.promise;
}


//function viewallbatch(id, val) {
function viewallbatch(traEmail) {
    var deferred = Q.defer();
    console.log('in db service js : viewallbatch with traEmail as '+traEmail);
    if (traEmail)
    {
        batches.find(
        {trainer:traEmail},
        function (err, batch) {
            console.log(err);
            if (err) deferred.reject(err);

            if (batch) {
                console.log(batch);
                deferred.resolve(batch);
            } else {

            }
        });
    }
    else
    {
        batches.find({},
        function (err, batch) {
            console.log(err);
            if (err) deferred.reject(err);

            if (batch) {
                console.log(batch);
                deferred.resolve(batch);
            } else {

            }
        });
    }
    console.log('out of find');
    return deferred.promise;
}


function updatebatch(_id, batchParam) {
    var deferred = Q.defer();
    console.log('in user service js : updatebatch');
    
        // fields to update
        var set = {
            trainer:batchParam.trainer,
            actstartdate:batchParam.actstartdate,
            actenddate:batchParam.actenddate,
            targetstren:batchParam.targetstren,
            status:batchParam.status,
            remarks:batchParam.remarks
        };

        batches.update(
            { _id: _id },
            { $set: set },
            function (err, doc) {
                console.log('err :: '+err);
                if (err) deferred.reject(err);      

                deferred.resolve();
            });

    return deferred.promise;
}
