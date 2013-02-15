(function(){

    Meteor.subscribe("playlist");
    Meteor.subscribe("chat");
    Meteor.subscribe("userData");

    DNC.login = function(service){
        switch(service){
            case "soundcloud":
                Meteor.loginWithSoundcloud({});
                break;
            case "facebook":
                Meteor.loginWithFacebook({});
                break;
            case "google":
                Meteor.loginWithGoogle({});
                break;
            default:
                alert("C'mon dude....");
                return;
        }

        DNC.connectService = service;
    };

    DNC.logout = function(){
        Meteor.call("heartbeat", true);
        DNC.initHB = false;
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

    Meteor.autorun(function(){
        if(!DNC.initHB && Meteor.userId()){
            DNC.initHB = true;
            Meteor.call("heartbeat");
        }
    });

    Meteor.setInterval(function(){
        Session.set("now", moment());
        Meteor.call("heartbeat");
    }, 30000);
}());