Meteor.publish("playlist", function(){
    return DNC.Tracks.playlist();
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

Meteor.publish("chat", function(){
    return DNC.Chat.find();
});