Template.tracklist.tracks = function () {
    return DNC.Tracks.playlist(Session.get("roomId"));
};

Template.track.artwork = function(){
    return this.sc.artwork_url || this.sc.user.avatar_url;
};

Template.track.voters = function(){
    return Meteor.users.find({_id : {$in: this.votes}});
};

Template.track.events({
    "click .track-vote": function(event, template){
        Meteor.call("vote", this._id, function(error){
            if(error){
                alert(error.reason);
            }
        });
    }
});

Template.track.rendered = function(){
    if(!this.data.playing){
        return;
    }

    var waveformEl = this.find(".waveform");

    var waveform = new Waveform({
        container: waveformEl
    });
    waveform.dataFromSoundCloudTrack(this.data.sc);

    var ctx = waveform.context;
    var gradient = ctx.createLinearGradient(0, 0, 0, waveform.height);
    gradient.addColorStop(0.0, "#f60");
    gradient.addColorStop(1.0, "#FF69B4");
    var opts = waveform.optionsForSyncedStream({
        playedColor: gradient
    });

    DNC.Player.onPlaying = opts.whileplaying;
    DNC.Player.onLoading = opts.whileloading;
};
