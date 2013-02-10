var Tracks = new Meteor.Collection("tracks");
Tracks.deny({
    insert: function(){
        return false;
    },
    update: function(){
        return false;
    },
    remove: function(){
        return false;
    }
});