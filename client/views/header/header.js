(function(){
    "use strict";
    Template.headerUser.events({
        "click .social-item": function(event, template){
            event.preventDefault();
            DNC.login(event.currentTarget.getAttribute("data-service"));
        },

        "click .disconnect": function(event, template){
            event.preventDefault();
            DNC.logout();
        } 
    });
}());
