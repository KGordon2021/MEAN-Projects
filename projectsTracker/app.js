const mysql = require('mysql'); //where our data base is stored 
const express = require('express'); // a module ideal for routing and template engines
const bodyparser = require('body-parser'); // gives direct access to the req.body
const ejs = require('ejs');

 //assigning a path and rounter for our application
 const path = require('path');
 const router = express.Router();
 
 //Setup Express
 var app = express();

 //Configuring express server
//  app.use(bodyparser.json()); -- updated to info below
    app.use(express.json());
    app.use('/', router);
    app.use(express.urlencoded());
    app.use('/public', express.static('public'));// code to use scripts, this is route specific which means it can be used only on specified routes
    app.set('view engine', 'ejs'); //here we say what we are setting which is view engine and which engine which is ejs it looks for a folder called views by default

    
 var conn = mysql.createConnection({
    host: "localhost",   
    user: "root",    
    password: "Kristine@2018",   
    database: "nodeexpresscrud"  
  });

  
  conn.connect((err)=> {
    if(!err)
        console.log('Connected to database Successfully');
    else
        console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
    });


//Specify the Port to listen on
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

//setting up routers
router.get('/',function(req,res){
    res.render('../views/pages/home');
   });

// router.get('/allRecords',function(req,res){ // this router is used to pass data to show exiting records and as such is not required here when I had this it was throwing an error of data not defined
// res.render('../views/pages/allRecords');
// });

router.get('/new_Rec',function(req,res){
res.render('../views/pages/addProject');
});

//POST Router to Add Projects from the form
 app.post('/addProject/add' , (req, res) => {
    let data = {    project_title:     req.body.proj_title, 
                    project_description: req.body.dets, 
                    project_start_dt: req.body.rec_date, 
                    project_due_dt: req.body.comp_date,
                };

        let sqlQuery = "INSERT INTO Projects SET ?";
    //  let sqlQuery = "INSERT INTO students (frst_nm, last_nm, email_addr, cohort) VALUES ('"+ req.body.first_name +"', '" + req.body.last_name + "', '"+ req.body.email_address + "','" + req.body.cohort_number +  "') ";
    
        let vQuery = conn.query(sqlQuery, data,(err, results) => {
        if(err) throw err;
        res.send(JSONResponse(results));
        });
    }); 


//Create GET Router to fetch all the projects in Database

    router.get('/existing_Recs', function(req, res, next) { //route has to be declared once
        conn.query('SELECT * FROM nodeexpresscrud.projects',function(err, rows){
               if(err){
                   res.render('pages/allRecords', // was in incorrect file path allRecords
                   {data:''});   
               }else{
                   res.render('pages/allRecords', 
                   {data: rows});
               }                          
                });
           });

//Update router to update projects //this is the set up for the actual page

router.get('/allRecords/update/:id', function(req, res) { //must be router.get or app.get or whatever else i choose but it has to be a get http verb
    conn.query('SELECT * FROM projects WHERE id=' + req.params.id, function(err,row){
        if(err) {
            res.render('pages/update', {updatedInfo:''});
        } else {
            res.render('pages/update', {updatedInfo:row});
        }
    });
});

//the delete routes for students
 router.get('/allRecords/delete/:id', function(req, res, next){
     conn.query('DELETE FROM projects WHERE id =' + req.params.id, function(err, row){
         if(err)  throw err;
         //req.flash('error', err); //must install additionals 'flash messages and others from to do list for these to work;

        //req.flash('success', 'Deleted Successfully') ///must install additionals 'flash messages and others from to do list for these to work;
             alert('Delete Successful');
             res.redirect('/existing_Recs');
             next();
     });
 });


//  testing another update method this once works

app.post('/addProject/:id/updatesInfo',(req, res) => {
    const id = req.params.id;
    // var assigned_date = new Date(assigned_date).toLocaleDateString('fr-CA');
    // var due_date = new Date(due_date).toLocaleDateString('fr-CA');
    // let sql = "update nodeexpresscrud.projects SET title='"+req.body.title+"',  f_name='"+req.body.f_name+"',  l_name='"+req.body.l_name+"' where id ="+id;
    let sqlQuery = "UPDATE nodeexpresscrud.projects SET project_title ='" + req.body.proj_name + 
                "', project_description ='" + req.body.proj_dets + 
                "', project_start_dt ='" +  req.body.assigned_date + 
                "', project_due_dt ='" + req.body.due_date + 
                "' WHERE id = " + req.body.id;
    let query = conn.query(sqlQuery,(err, results) => {
      if(err) throw err;
      console.log(err)
      res.redirect('/existing_Recs');
    });
});


//NOTES SECTION


router.get('/all_NOtes', function(req, res, next) { //route has to be declared once
    conn.query('SELECT * FROM nodeexpresscrud.notes',function(err, rows){
           if(err){
               res.render('notes/allNotes', // was in incorrect file path allRecords
               {notes:''});   
           }else{
               res.render('notes/allNotes', 
               {notes: rows});
           }                          
            });
       });

//get info fromprojects to the add notes page

router.get('/addNotes/newNote/:id', function(req, res) { //must be router.get or app.get or whatever else i choose but it has to be a get http verb
    conn.query('SELECT * FROM projects WHERE id=' + req.params.id, function(err,row){
        if(err) {
            res.render('notes/addNote', {projInfo:''})
            // throw err,
            // console.log(err);
        } else {
            res.render('notes/addNote', {projInfo:row});
        }
    });
});



//FOR NOTES EDITS Page 
router.get('/editNotes/update/:id', function(req, res) { //must be router.get or app.get or whatever else i choose but it has to be a get http verb
    conn.query('SELECT * FROM notes WHERE id=' + req.params.id, function(err,row){
        if(err) {
            res.render('notes/editNotes', {updatingNotes:''})
            // throw err,
            // console.log(err);
        } else {
            res.render('notes/editNotes', {updatingNotes:row});
        }
    });
});



//Updating Notes to the database

app.post('/allNotes/:id/updateNotes',(req, res) => {
    const id = req.params.id;
    let sqlQuery = "UPDATE nodeexpresscrud.notes SET active_date ='" + req.body.dated + 
                // "', proj_title ='" + req.body.proj_t + 
                "', note ='" +  req.body.noted + 
                "' WHERE project_id = " + req.body.id;
    let query = conn.query(sqlQuery,(err, results) => {
      if(err) throw err;
      console.log(err)
      res.redirect('/all_NOtes');
    });
});


//Detleting notes from list
//the delete routes for students
router.get('/allNotes/delete/:id', function(req, res, next){
    conn.query('DELETE FROM notes WHERE project_id =' + req.params.id, function(err, row){
        if(err)  throw err;
        //req.flash('error', err); //must install additionals 'flash messages and others from to do list for these to work;

       //req.flash('success', 'Deleted Successfully') ///must install additionals 'flash messages and others from to do list for these to work;
            alert('Delete Successful');
            res.redirect('/all_NOtes');
            next();
    });
});

//posts new notes to the notes table in db

app.post('/addNewNotes' , (req, res) => {
    let data = {    project_id: req.body.id, 
                    note: req.body.newNotes,
                    active_date: req.body.noteDate, 
                };

        let sqlQuery = "INSERT INTO notes SET ?";
    //  let sqlQuery = "INSERT INTO students (frst_nm, last_nm, email_addr, cohort) VALUES ('"+ req.body.first_name +"', '" + req.body.last_name + "', '"+ req.body.email_address + "','" + req.body.cohort_number +  "') ";
    
        let vQuery = conn.query(sqlQuery, data,(err, results) => {
        if(err) throw err;
        res.send(JSONResponse(results));
        });
    }); 


