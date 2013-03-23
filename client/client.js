(function(){

    Meteor.subscribe("userData");

    //Use a duplicated non-reactive var for the router function
    var roomsLoading = true;
    Session.set('rooms.loading', true);

    Meteor.subscribe("rooms", function(){
        roomsLoading = false;
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
        "/": "roompicker",
        
        "/room/:id": function(roomId){
            console.log("Joining room "+roomId);

            if(!roomsLoading && !DNC.Rooms.findOne(roomId)){
                Meteor.Router.to('/404');
            }

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
    
    //Start playback as soon as the server sends us the SC clientId
    Accounts.loginServiceConfiguration
        .find({service: "soundcloud"}).observe({
            added: function(scData){
                SC.initialize({
                    client_id: scData.clientId
                });
                DNC.Player.init();
           
                Meteor.call("heartbeat");
            }
        });

    Session.set("now", moment().valueOf());
    Meteor.setInterval(function(){
        Session.set("now", moment().valueOf());
        Meteor.call("heartbeat");
    }, 30000);
}());