var personas = {
    social : [
      {facebook : 'Facesmash'},
      {myspace : 'Friendster'},
      {twitter : 'PRE SMS MESSAGING'}
      ]
}
var a = [];
for(var i = 0 ; i < personas.social.length; i++){
  //console.log(personas.social[i]);
  a.push(personas.social[i]);
}

var fakebook = [];
a.forEach(function(face){
  if(face.myspace === undefined || face.twitter === undefined || face.facebook === undefined){
  console.log(face.twitter);
  fakebook.push(face.facebook);
 }else{

  }

});

console.log(fakebook);

//Ok now, here is the situation. When i TRY taking out only facebook all three of the social medias come out. Because all three of them are in a single for each loop. What if I had a seperate part for each social media. A seperate array, that I can call?

 social : {
    facebook : ['Link1', 'Link2', 'Link 2'],
    myspace : ['My1', 'My2'],
    twitter : ['Twit']
};

if (Person.facebook.length === 0){
  console.log('You can push one url to the array.');
}else if(Person.facebook.length === 1){
  console.log('You have one in there already.');
}else{
  console.log('WOW you have more that 1 account in your array.');
}


Person.twitter.forEach(function(tweet){
  console.log(tweet);
});

//Ok, now we have a way to get the tweet, and we have a way on top to confirm if the length of the array in the DB is greater than, equal to,or less than 1.



//console.log(Person.facebook);
