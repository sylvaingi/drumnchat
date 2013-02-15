(function(){

    Meteor.subscribe("playlist");
    Meteor.subscribe("chat");
    Meteor.subscribe("userData");

    function setUserActiveFlag(active){
        Meteor.users.update({_id: Meteor.userId}, {$set:{"profile.active":active}});
    }

    function startSCPlayer(scData){
        SC.initialize({
            client_id: scData.clientId
        });
        DNC.Player.start();
    }

    DNC.login = function(service){
        var cb = function(){setUserActiveFlag(true);};
        switch(service){
            case "soundcloud":
                Meteor.loginWithSoundcloud();
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
        setUserActiveFlag(false);
        Meteor.logout();
    };

    Accounts.loginServiceConfiguration.find({service: "soundcloud"})
        .observe({added: startSCPlayer});

    Meteor.setInterval(function(){
        Session.set("now", moment());
    }, 60000);

    Meteor.autosubscribe(function(){
        if(Meteor.userId()){
            setUserActiveFlag(true);
        }
    });
}());