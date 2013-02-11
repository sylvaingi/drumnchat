(function(){
    "use strict";

    Meteor.setInterval(function(){

        var now = Date.now();
        var tenMinsAgo = new Date(now - 10 * 60 * 1000);

        var inactiveUsers = Meteor.users.find({active: true, lastSeen:{$lte: tenMinsAgo}}).map(function(user){
            return user._id;
        });

        if(inactiveUsers.length){
            console.log("Tagging inactive users "+ inactiveUsers.join(","));
            Meteor.users.update({_id : {$in: inactiveUsers}}, {$set: {active:false}}, {multi: true});
        }

    },1000);

}());