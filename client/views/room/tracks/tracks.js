"use strict";

Template.tracklist.tracks = function () {
    var rank = 0;
    return DNC.Tracks.playlist(Session.get("roomId")).map(function(track) {
        track._rank = rank++;
        return track;
    });
};

Template.tracklist.tracklistLoading = function () {
    return Session.get("playlist.loading");
};

Template.track.artwork = function(){
    return this.serviceData.artwork_url || this.serviceData.user.avatar_url;
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
    if(!this.data.playing) {
        destroySoundcloudWaveform(this);
    }
    else {
        renderSoundcloudWaveform(this);
    }

    animateTrack(this);
};

Template.track.destroyed = function() {
    destroySoundcloudWaveform(this);
};

var trackHeight = 100;

function animateTrack (template) {
  var rank = template.data._rank;
  var $this = $(template.firstNode);
  var newPosition = rank * trackHeight;

  if (typeof(template.currentPosition) !== 'undefined') {
    var previousPosition = template.currentPosition;
    var delta = previousPosition - newPosition;
    $this.css("top", delta + "px");
  }
  else {
    $this.addClass("invisible");
  }

  Meteor.defer(function() {
    template.currentPosition = newPosition;
    $this.css("top",  "0px").removeClass("invisible");
  });
}

function renderSoundcloudWaveform(template) {
    if (template.data.type !== "sc" || template.waveform) {
        return;
    }

    var waveformEl = template.find(".waveform");

    var waveform = new Waveform({
        container: waveformEl
    });
    waveform.dataFromSoundCloudTrack(template.data.serviceData);

    var ctx = waveform.context;
    var gradient = ctx.createLinearGradient(0, 0, 0, waveform.height);
    gradient.addColorStop(0.0, "#f60");
    gradient.addColorStop(1.0, "#FF69B4");
    var opts = waveform.optionsForSyncedStream({
        playedColor: gradient
    });

    DNC.Player.onPlaying = opts.whileplaying;
    DNC.Player.onLoading = opts.whileloading;

    template.waveform = waveform;
}

function destroySoundcloudWaveform(template) {
    if (template.waveform){
        template.waveform.destroy();
        delete template.waveform;
    }
}