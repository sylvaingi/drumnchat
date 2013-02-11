(function(){
    "use strict";

    Template.connect.events({
        "click .sc-connect": function(event, template){
            event.preventDefault();
            DNC.login();
        },

        "click .sc-disconnect": function(event, template){
            event.preventDefault();
            DNC.logout();
        } 
    });

    Template.connect.user = function(){
        return Session.get("user");
    };

}());
