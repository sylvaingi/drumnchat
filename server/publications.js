Meteor.publish("playlist", function(){
    return DNC.Tracks.playlist();
});

Meteor.publish("allUserData", function () {
    return Meteor.users.find({}, {fields:{'id':1, 'avatar_url':1, 'permalink_url':1, 'active':1}});
});