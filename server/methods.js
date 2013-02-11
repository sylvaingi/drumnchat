Meteor.methods({
    "addTrack": function(url){
        console.log("Received SC URL "+url);

        this.unblock();
        DNC.Tracks.enqueue(url);
    },
    "vote": function(id){
        console.log("Voting for "+id);
        this.unblock();

        DNC.Tracks.addVote(id);
    },

    "heartbeat": function(data){
        console.log("User heartbeat: "+ (data? data.username + " (initial)" : this.userId));
        this.unblock();

        if (data){
            var _id;
            var previousUser = Meteor.users.findOne({username: data.username});
            var user = _.pick(data, 'id', 'avatar_url', 'username', 'permalink_url');
            user.lastSeen = new Date();
            user.active = true;

            if(previousUser){
                _id = previousUser._id;
                Meteor.users.update(_id, {$set: user});
            }
            else {
                _id = Meteor.users.insert(user);
            }

            this.setUserId(_id);
        }
        else {
            Meteor.users.update(this.userId, {$set:{lastSeen: new Date(), active: true}});
        }
    }
});
