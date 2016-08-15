/**
 * Created by tejas on 30-07-2016.
 */
var _ = require('lodash');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


var express = require('express');

var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());








var service = {};

service.submitinquiry = submitinquiry;




module.exports = service;



function submitinquiry(mailbody) {
    
    

    

        console.log("in server");
        //var text = 'Hello world from \n\n\n\n' + mailbody;

        ///////////////////////////////////
    var frommail = mailbody.frmmail;
    var frmpass = mailbody.frmpass;
        var to = mailbody.to;
        var name  = mailbody.name;



        var inqfor = mailbody.inqfor;
        var by = mailbody.by;
        var  course= mailbody.course;
        var  fee= mailbody.fee;
        var  dur= mailbody.dur;
        var  month= mailbody.month;
        var st= mailbody.st;
        var  et= mailbody.et;
        var day= mailbody.day;
        var loc= mailbody.loc;
        var se= mailbody.se;
        var dio= mailbody.dio;
        var da= mailbody.da;
        var nfe= mailbody.nfe;


        var x = "Hello ,"+name+"\n\n"+"\n\n"+"Thanks For Choosing Us , Below are your inquiry details" + "\n\n" + "\n\n" +"Training" +
            " Course"+"\t\t\t\t\t"+course + "\n\n" +"Training Month"+"\t\t\t\t\t"+month+"\n\n"+"Start Time"+"\t\t\t\t\t"+st+"\n\n"+"End" +
            " Time"+"\t\t\t\t\t"+et+"\n\n"+"Training Day"+"\t\t\t\t\t"+day+"\n\n"+"Training Location"+"\t\t\t\t"+loc+"\n\n"+"Duration Of" +
            " Course"+"\t\t\t\t"+dur+"Hrs"+"\n\n"+"Fee Of Course"+"\t\t\t\t\t"+fee+" Rs"+"\n\n"+"Service Tax"+"\t\t\t\t\t"+se+"%"+"\n\n"+"Discount Offered"+"\t\t\t\t"+dio+"%"+"\n\n"+"Discount Approved By"+"\t\t\t\t"+da+"\n\n"+"Net Fee"+"\t\t\t\t\t"+nfe+" Rs"+"\n\n"+"Inquiry Handled By"+"\t\t\t\t\t"+by+"\n\n"+"\n\n"+"!!! Hope to see you soon !!!"+"\n\n"+"\n\n"+"Thanks & Regards"+"\n\n"+"FosteringLinux";

        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'Gmail',
            auth: { user: frommail,
                pass: frmpass }
        }));

        transporter.sendMail({
            from: 'admin',
            to:to ,                 //tejas.srivastava@fosteringlinux.com
            subject: 'Inquiry Details From Fostering Linux',
            text:x
        }, function (error, res) {
            //Email not sent
            if (error) {
                console.log(error);
           //   res.end("Email send Falied");
            }
            //email send sucessfully
            else {
                console.log(res);
                console.log("mail sent");
              //  res.send("Email send");
            }
        });



    
    
}


