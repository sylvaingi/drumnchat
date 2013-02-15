(function(){
    DNC.ensureUserIsConnected = function(){
        if(!Meteor.userId()){
            throw new Meteor.Error(403, "Please authenticate first.");
        }    
    };

    Meteor.methods({
        "setActiveState": function(active){
            Meteor.users.update({_id: this.userId}, {$set:{"profile.active":active}});
        },

        "vote": function(id){
            DNC.ensureUserIsConnected();
            console.log("Voting for "+id);

            DNC.Tracks.addVote(id, this.userId);
        },

        postMessage: function(msg){
            DNC.ensureUserIsConnected();
            console.log("Incoming message from "+this.userId);

            DNC.Chat.insert({message: msg, date: new Date(), user_id: this.userId});
        }
    });
}());
