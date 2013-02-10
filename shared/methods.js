Meteor.methods({
    "addTrack": function(url){
        this.unblock();

        var result = Meteor.http.get("http://api.soundcloud.com/resolve", {
            params : {url:url, client_id: DNC.SC.client_id, format:'json'}
        });

        if(result.statusCode !== 200){
            throw new Meteor.Error(result.statusCode, "Unable to resolve SC URL");
        }

        var track = _.pick(result.data, 'id', 'title', 'artwork_url');
        Tracks.insert(track);
    }
});
