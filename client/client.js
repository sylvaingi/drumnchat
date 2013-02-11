SC.storage = function(){
    return localStorage;
};

SC.initialize({
    client_id: DNC.SC.client_id,
    redirect_uri: Meteor.absoluteUrl("soundcloud.html")
});

Meteor.subscribe("playlist");
Meteor.subscribe("onair");
Meteor.subscribe("allUserData");

if(SC.isConnected()){
    DNC.refreshUser();
}