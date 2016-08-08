var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var colors = require('colors');
var mongoose = require('mongoose');
var searchable = require('mongoose-searchable');
// index /dog----Get
// new /dog/new ---Get
// dog /dog ----Post
// show /dog/:id----Get
// edit /dog/:id/edit----Get
// update /dog/:id----Put
// delete /dog/delete---Delete

//====================================
    //Mongo Setup

////Day Setup
var currentdate = new Date();

var dateToday = (currentdate.getMonth() + 1) + "/" + (currentdate.getDate()) + "/" + (currentdate.getYear() - 100);
console.log(dateToday);




mongoose.connect('mongodb://localhost/rate-anyone');

//////////////////////////////////////////////////////////////////////////
                            //Schemas/Models//

// CommentSchema = new mongoose.Schema({
//     text : String,
//     author : {
//             id : {
//                 type : mongoose.Schema.Types.ObjectId,
//                 ref : 'Person'
//             },
//             username : String
//         }
//     });
    var CommentSchema = new mongoose.Schema({
      _creator : { type: Number, ref: 'Person' },
      author : String,
      comment    : String
    });


var Comment = mongoose.model('Comments', CommentSchema);

var likeSchema = new mongoose.Schema({
    likes : Number,
    dislikes : Number
});

var Likes = mongoose.model('Likes', likeSchema);

var personSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    state : String,
    city : String,
    career : String,
    image : String,
    comments : [{
      user : String,
      text : String,
      date : String
    }],
    social : {
      facebook : [],
      instagram : [],
      linkedin : [],
      twitter : []
    }
});


personSchema.plugin(searchable, {
    language : 'english',
   fields : ['firstName']
});

var Person = mongoose.model('Person', personSchema);


/////////////////////////////////////////////////////////////////////////
//====================================


//====================================
    //Express Setup, and Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended : true }));
app.use(methodOverride('_method'));
//====================================

////////////////////////
//Adding the search feature.

//Make it where the search query goes into the url, or it has a name when it is clicked on.
app.post('/home/filtered', function(req,res){
  console.log(req.body.searchName);

Person.find({}, function(err,whole){
  if(err){
    console.log(err);
  }else{

  Person.find({firstName : req.body.searchName}, function(err,body){
    if(err){
      console.log(err);
    }else{
      //console.log(whole);
if(req.body.searchName === "" || req.body.searchName === 'home'){
        res.redirect('/home');
      }else{
        //console.log(hole);
        res.render('showExact', {people : body});
          }
        }
        });
      }
    });
});




//   Person.search(req.body.searchName,function(err,results){
//       if(err){
//         console.log(err);
//       }else{
//         console.log(results);
//         res.redirect('/home');
//       }
//  });
//////////////////////////
app.get('/', function(req,res){
    res.redirect('/home');
});

app.get('/home', function(req,res){
    Person.find({}, function(err,body){
        if(err){
            console.log(err);
        }else{
            res.render('index', {people : body});
        }
    });
});

app.get('/home/new', function(req,res){
    res.render('new');
});

app.post('/home',function(req,res){
  if (req.body.firstName.length === 0){
    res.redirect('/home/new');
  }else{
    var newPerson = Person({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            state : req.body.state,
            city : req.body.city,
            career : req.body.career,
            image : req.body.image
    }).save(function(err,body){
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    });

  }


});

app.get('/show/:id',function(req,res){
    Person.findById(req.params.id, function(err,body){
        if(err){
            console.log(err);
        }else{
            res.render('show',{person : body,
                                date : dateToday
                                });
        }
    });
});

/////////////////////////////////////////////////////////
// THIS IS A COMPLETE TEST TO SEE IF THE COMMENTS WORK //
// EXPERIMENT STATUS ---> SUCCESS.
//Now that this works, we have to link the comments DB, with a users ID.
//Populate may be a method to link two models together.
// app.get('/show/:id/comments', function(req,res){
//    Comment.find({}, function(err,body){
//        if(err){
//            console.log(err);
//        }else{
//            res.render('commentTest', {comment : body,
//                                        date : dateToday
//                                      });
//        }
//    });
// });
//
// app.post('/show/:id/comments', function(req,res){
//    var newComment = Comment({
//        comments : [{
//            comment : req.body.comment,
//            author : req.body.author
//        }]
//    }).save(function(err){
//        if(err){
//            console.log(err);
//        }else{
//          res.redirect('/show/:id/comments');
//        }
//    });
// });

////////////////////////////////////////////////////////////////////
      //---- ALL OF THE COMMENT LOGIC --------- //

app.get('/show/:id/comments', function(req,res){
    var id = req.params.id;
    Person.findById(req.params.id, function(err,body){
        if(err){
            console.log(err);
        }else{
             res.render('commentTest',{person : body,
                                       date : dateToday
                                      });
        }
    });
});

app.post('/show/:id/comments', function(req,res){

    Person.findById(req.params.id,function(err,person){
       if(err){
            console.log(err);
        }else{

          var author = req.body.author;
          var comment = req.body.comment;

        if(author === "" && comment === ""){

        res.redirect('/show/' + req.params.id);

}else{

          person.comments.push({
            user : req.body.author,
            text : req.body.comment,
            date : dateToday
          });
          person.save(function(err){
            if(err){
              console.log(err);
            }else{
              //console.log(person);
              //console.log(person.comments);
              res.redirect('/show/' + req.params.id);
            }
          });
        }
}
    });
});
////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
//Instagram Link
app.get('/show/:id/social/instagram', function(req,res){
    Person.findById(req.params.id, function(err,body){
        if(err){
            console.log(err);
        }else{
            res.render('socialMedia/instagram', {person : body});
        }
    });
});

app.post('/show/:id/social/instagram', function(req,res){
    Person.findById(req.params.id, function(err,body){
        if(err){
            console.log(err);
        }else{
          if(req.body.instagram == ''){
          }else{

            body.social.instagram.push({
              instagram : "www.instagram.com/" + req.body.instagram
            });
          }
          body.save(function(err){
            if(err){
              console.log(err);
            }else{
              console.log(body.social);
              res.redirect('/show/' + req.params.id);
            }
          });
        }
    });
});

app.delete('/show/:id/social/instagram/delete', function(req,res){
    Person.findById(req.params.id, function(err,body){
      if(err){
        console.log(err);
      }else{
        body.social.instagram = [];
        body.save(function(err){
          if(err){
            console.log(err);
          }else{
            res.redirect('/show/' + req.params.id);
          }
        });
      }
    });
});

//Facebook Link
app.get('/show/:id/social/facebook', function(req,res){
    Person.findById(req.params.id, function(err,body){
        if(err){
            console.log(err);
        }else{
            res.render('socialMedia/facebook', {person : body});
        }
    });
});

app.post('/show/:id/social/facebook', function(req,res){
    Person.findById(req.params.id, function(err,body){
        if(err){
            console.log(err);
        }else{
          if(req.body.facebook == ''){
          }else{
            body.social.facebook.push({
              facebook : req.body.facebook
            });
          }
          body.save(function(err){
            if(err){
              console.log(err);
            }else{
              //console.log(body.social);
              res.redirect('/show/' + req.params.id);
            }
          });
        }
    });
});

app.delete('/show/:id/social/facebook/delete', function(req,res){
    Person.findById(req.params.id, function(err,body){
      if(err){
        console.log(err);
      }else{
        body.social.facebook = [];
        body.save(function(err){
          if(err){
            console.log(err);
          }else{
            res.redirect('/show/' + req.params.id);
          }
        });
      }
    });
});
//Twitter Link
app.get('/show/:id/social/twitter', function(req,res){
    Person.findById(req.params.id, function(err,body){
        if(err){
            console.log(err);
        }else{
            res.render('socialMedia/twitter', {person : body});
        }
    });
});

app.post('/show/:id/social/twitter', function(req,res){
    Person.findById(req.params.id, function(err,body){
        if(err){
            console.log(err);
        }else{
            //res.render('socialMedia/instagram', {person : body});
            if(req.body.twitter == ''){
            }else{
              body.social.twitter.push({
                twitter : "www.twitter.com/" + req.body.twitter
              });
            }
            body.save(function(err){
              if(err){
                console.log(err);
              }else{
                //console.log(body.social);
                res.redirect('/show/' + req.params.id);
              }
            });
        }
    });
});

app.delete('/show/:id/social/twitter/delete', function(req,res){
    Person.findById(req.params.id, function(err,body){
      if(err){
        console.log(err);
      }else{
        body.social.twitter = [];
        body.save(function(err){
          if(err){
            console.log(err);
          }else{
            res.redirect('/show/' + req.params.id);
          }
        });
      }
    });
});
//Linkedin Link
app.get('/show/:id/social/linkedin', function(req,res){
    Person.findById(req.params.id, function(err,body){
        if(err){
            console.log(err);
        }else{
            res.render('socialMedia/linkedin', {person : body});
        }
    });
});

app.post('/show/:id/social/linkedin', function(req,res){
    Person.findById(req.params.id, function(err,body){
        if(err){
            console.log(err);
        }else{
          if(req.body.linkedin == ''){
          }else{
            body.social.linkedin.push({
              linkedin : req.body.linkedin
            });
          }
          body.save(function(err){
            if(err){
              console.log(err);
            }else{
              res.redirect('/show/' + req.params.id);
            }
          });

        }
    });
});

app.delete('/show/:id/social/linkedin/delete', function(req,res){
    Person.findById(req.params.id, function(err,body){
      if(err){
        console.log(err);
      }else{
        body.social.linkedin = [];
        body.save(function(err){
          if(err){
            console.log(err);
          }else{
            res.redirect('/show/' + req.params.id);
          }
        });
      }
    });
});
/////////////////////////////////////////////////////////////////////////////////
//-----------SHOW PROFILES ROUTES ----------------------- //

  app.get('/show/:id/social/linkedin/magic', function(req,res){
    Person.findById(req.params.id, function(err,body){
      if(err){
        console.log(err);
      }else{
        res.render('./showProfiles/linkedin', {person : body});
      }
    });
  });

  app.get('/show/:id/social/facebook/magic', function(req,res){
    Person.findById(req.params.id, function(err,body){
      if(err){
        console.log(err);
      }else{
        res.render('./showProfiles/facebook', {person : body});
      }
    });
});

   app.get('/show/:id/social/twitter/magic', function(req,res){
     Person.findById(req.params.id, function(err,body){
       if(err){
         console.log(err);
       }else{
         res.render('./showProfiles/twitter', {person : body});
       }
     });
});

    app.get('/show/:id/social/instagram/magic', function(req,res){
      Person.findById(req.params.id, function(err,body){
        if(err){
          console.log(err);
        }else{
          res.render('./showProfiles/instagram', {person : body});
        }
      });
});


app.get('/home/deletario', function(){
  Person.remove({}, function(err){
    if(err){
        console.log(err);
    }else{
      console.log('ALL CLEAR');
    }
  });
});

//////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////

//-------------> OBJECTIVES TO BE COMPLETED <-----------
//- Make thumbs up and thumbs down. Relearn Jquery for it. SMH.
//- Link Comments with Each User's id(populate).
//- Add time functionality to each of the comments.(x)
//- Find a way to add social media links, given by the people.(x)

///////////////////////////////////////////////

/////
// So I added the UI to add a link for the Social Media. I need to make a seperate Schema for Social Media. Then I have to link THAT schema, WITH 'Person'
////
app.listen('3000', function(){
    console.log('=================='.blue);
    console.log(' Server Turned On'.green);
    console.log('=================='.blue);
});
