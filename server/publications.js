"use strict";

Meteor.publish("playlist", function(roomId){
    Meteor.users.update({_id: this.userId}, {$set:{roomId: roomId}});

    return DNC.Tracks.playlist(roomId);
});

Meteor.publish("chat", function(roomId){
    return DNC.Chat.find({roomId: roomId});
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
            'services.facebook.username',
            'services.facebook.link'
        ],
        function(memo, field){
            memo[field] = 1;
            return memo;
        },
        {active: 1, 'profile.name': 1, 'roomId':1}
    );

    return Meteor.users.find({}, {fields: fieldSpec});
});
