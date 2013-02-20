Meteor.publish("playlist", function(room_id){
    Meteor.users.update({_id: this.userId}, {$set:{room_id: room_id}});

    return DNC.Tracks.playlist(room_id);
});

Meteor.publish("chat", function(room_id){
    return DNC.Chat.find({room_id: room_id});
});

Meteor.publish("rooms", function(){
    return DNC.Rooms.find();
});

Meteor.publish("userData", function () {
    var fieldSpec = _.reduce(
        [
            'services.soundcloud.permalink_url',
            'services.soundcloud.avatar_url',
            'services.google.picture',
            'services.facebook.picture.data.url'
        ], 
        function(memo, field){
            memo[field] = 1;
            return memo;
        }, 
        {active: 1, 'profile.name': 1}
    );

    return Meteor.users.find({}, {fields: fieldSpec});
});
