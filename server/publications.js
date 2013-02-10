Meteor.publish("playlist", function(){
    return DNC.Tracks.playlist();
});

Meteor.publish("current", function(){
    this.set("current", Meteor.uuid(), DNC.Tracks.playingTrack());
    this.complete();
    this.flush();
});