(function(){
    function ensureUserIsConnected(userId){
        if(!userId){
            throw new Meteor.Error(403, "Please authenticate with Soundcloud first.");
        }    
    }

    Meteor.methods({
        "onAirOffset": function(){
            return DNC.Tracks.playingTrack().offset;
        },

        "addTrack": function(url){
            console.log("Received SC URL '"+url+"'");
            ensureUserIsConnected(this.userId);

            DNC.Tracks.enqueue(url, this.userId);
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
}());
