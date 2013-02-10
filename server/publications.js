Meteor.publish("playlist", function(){
    return DNC.Tracks.find();
});