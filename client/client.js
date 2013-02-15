(function(){

    Meteor.subscribe("playlist");
    Meteor.subscribe("chat");
    Meteor.subscribe("userData");

    DNC.login = function(service){
        var cb = function(){Meteor.call("setActiveState", true);};
        switch(service){
            case "soundcloud":
                Meteor.loginWithSoundcloud(cb);
                break;
            case "facebook":
                Meteor.loginWithFacebook(cb);
                break;
            case "google":
                Meteor.loginWithGoogle(cb);
                break;
            default:
                alert("C'mon dude....");
                return;
        }

        DNC.connectService = service;
    };

    DNC.logout = function(){
        Meteor.call("setActiveState", false);
        Meteor.logout();
    };

    function startSCPlayer(scData){
        SC.initialize({
            client_id: scData.clientId
        });
        DNC.Player.start();
    }
    
    Accounts.loginServiceConfiguration.find({service: "soundcloud"})
        .observe({added: startSCPlayer});

    Meteor.setInterval(function(){
        Session.set("now", moment());
    }, 60000);
}());