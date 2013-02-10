Meteor.methods({
    "addTrack": function(url){
        console.log("Received SC URL "+url);

        this.unblock();
        DNC.Tracks.enqueue(url);
    },
    "vote": function(id){
        console.log("Voting for "+id);

        DNC.Tracks.addVote(id);
    }
});
