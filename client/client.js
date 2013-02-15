(function(){

    Meteor.subscribe("playlist");
    Meteor.subscribe("chat");
    Meteor.subscribe("userData");

    function setUserActiveFlag(active){
        Meteor.users.update({_id: Meteor.userId}, {$set:{"profile.active":active}});
    }

    DNC.login = function(service){
        var cb = function(){setUserActiveFlag(true);};
        switch(service){
            case "soundcloud":
                Meteor.loginWithSoundcloud();
                break;
            case "facebook":
                break;
            case "google":
                break;
            default:
                alert("C'mon dude....");
        }
    };

    DNC.logout = function(){
        setUserActiveFlag(false);
        Meteor.logout();
    };

    Meteor.call("SC_clientId", function(error, clientId){
        if(error){
            alert(error.reason);
        }

        SC.initialize({
            client_id: clientId
        });
        DNC.Player.start();
    });

    Meteor.setInterval(function(){
        Session.set("now", moment());
    }, 60000);

    Meteor.autosubscribe(function(){
        var user = Meteor.user();

        if(user){
            setUserActiveFlag(true);
        }
    });
}());