(function(){
    "use strict";
    Template.connect.events({
        "click .connect": function(event, template){
            event.preventDefault();
            DNC.login(event.currentTarget.getAttribute("data-service"));
        },

        "click .disconnect": function(event, template){
            event.preventDefault();
            DNC.logout();
        } 
    });
}());
