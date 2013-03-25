(function(){

    Meteor.subscribe("userData");

    Session.set('rooms.loading', true);
    Meteor.subscribe("rooms", function(){
        Session.set('rooms.loading', false);
    });

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
        Meteor.logout();
    };

    Meteor.Router.add({
        "/": function(){
            Session.set("roomId", null);        

            return "roompicker";
        },
            
        
        "/room/:id": function(roomId){
            console.log("Joining room "+roomId);

            if(DNC.p_handle){
                DNC.p_handle.stop();
                DNC.c_handle.stop();            
            }

            DNC.Player.stop();

            Session.set("roomId", roomId);        

            Session.set("playlist.loading", true);        
            DNC.p_handle = Meteor.subscribe("playlist", roomId, function(){
                Session.set("playlist.loading", false);        
            });
            
            DNC.c_handle = Meteor.subscribe("chat", roomId);

            return "room";
        }
    });

    Session.set("now", moment().valueOf());
    Meteor.setInterval(function(){
        Session.set("now", moment().valueOf());
        Meteor.call("heartbeat");
    }, 30000);
}());