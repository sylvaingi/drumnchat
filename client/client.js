SC.storage = function(){
    return localStorage;
};

SC.initialize({
    client_id: DNC.SC.client_id,
    redirect_uri: Meteor.absoluteUrl("soundcloud.html")
});

Meteor.subscribe("playlist");
Meteor.subscribe("current");

new Meteor.Collection("current").find().observe({
    added: function(track){
        Session.set("current-track", track);
    }
});
