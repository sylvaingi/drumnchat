DNC.refreshUser = function(){
    SC.get("/me", function(me){
        Session.set("user", me);
        Meteor.call("heartbeat", Session.get("user"));

        DNC.heartbeatId = Meteor.setInterval(function(){
            Meteor.call("heartbeat");
        }, 10000);
    });
};


Template.connect.events({
    "click .sc-connect": function(event, template){
        event.preventDefault();
        SC.connect(function(){
            DNC.refreshUser();
        });
    },

    "click .sc-disconnect": function(event, template){
        event.preventDefault();
        SC.disconnect();
        Session.set("user", null);
        Meteor.clearInterval(DNC.heartbeatId);
        Meteor.logout();
    } 
});

Template.connect.user = function(){
    return Session.get("user");
};