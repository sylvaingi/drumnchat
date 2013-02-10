Meteor.publish("playlist", function(){
    return DNC.Tracks.playlist();
});

Meteor.publish("current", function(){
    var self = this;

    var handle = DNC.Tracks.find({playing: true}).observe({
        added: function (doc, idx) {
            self.set("current", Meteor.uuid(), DNC.Tracks.playingTrack());
            self.flush();
        }
    });

    self.complete();
    self.flush();

    self.onStop(function () {
        handle.stop();
    });
});