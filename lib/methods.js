(function(){
    function ensureUserIsConnected(userId){
        if(!userId){
            throw new Meteor.Error(403, "Please authenticate first.");
        }    
    }

    Meteor.methods({
        "setActiveState": function(active){
            Meteor.users.update({_id: this.userId}, {$set:{"profile.active":active}});
        },

        "vote": function(id){
            console.log("Voting for "+id);
            ensureUserIsConnected(this.userId);

            DNC.Tracks.addVote(id, this.userId);
        },

        postMessage: function(msg){
            ensureUserIsConnected(this.userId);
            console.log("Incoming message from "+this.userId);

            DNC.Chat.insert({message: msg, date: new Date(), user_id: this.userId});
        }
    });
}());
