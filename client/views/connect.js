DNC.refreshUser = function(){
    SC.get("/me", function(me){
        Session.set("user", me);
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
    } 
});

Template.connect.user = function(){
    return Session.get("user");
};