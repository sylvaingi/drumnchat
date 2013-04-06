"use strict";

Meteor.setInterval(function(){
    var oneMinuteAgo = (new Date()).getTime() - 60 * 1000;

    Meteor.users.find({active: true, last_seen:{$lte: oneMinuteAgo}}).forEach(function(user){
        console.log("Tagging inactive user "+ user._id);
        Meteor.users.update({_id : user._id}, {$set: {active:false, roomId:null}});
    });
},10000);
