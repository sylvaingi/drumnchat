Template.tracklist.tracks = function () {
    return Tracks.find();
};

Template.track.events({
    "click": function(event, template){
        SC.get("/tracks/"+this.id, function(track){
            Session.set("playing", track);
        })
    }
});

Template.form.events({
    "submit": function(event, template){
        event.preventDefault();
        Meteor.call("addTrack", template.find("input:text").value);
    }
});