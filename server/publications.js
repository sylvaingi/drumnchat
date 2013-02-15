Meteor.publish("playlist", function(){
    return DNC.Tracks.playlist();
});

Meteor.publish("userData", function () {
    var prefix = "services.soundcloud.";
    var fieldSpec = _.reduce(
        [
            'id','username','permalink_url',
            'avatar_url','country','full_name','city',
            'description','website'
        ], 
        function(memo, field){
            memo[prefix+field] = 1;
            return memo;
        }, 
        {active:1}
    );

    return Meteor.users.find({}, {fields: fieldSpec});
});

Meteor.publish("chat", function(){
    return DNC.Chat.find();
});