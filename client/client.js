(function(){

    Meteor.subscribe("userData");
    Meteor.subscribe("rooms", function(){
        DNC.joinRoom();
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

            if(!DNC.Rooms.findOne(roomId)){
                Meteor.Router.to('/404');
            }

            if(DNC.p_handle){
                DNC.p_handle.stop();
                DNC.c_handle.stop();            
            }

            DNC.Player.stop();

            Session.set("roomId", roomId);        
            
            DNC.p_handle = Meteor.subscribe("playlist", roomId);
            DNC.c_handle = Meteor.subscribe("chat", roomId);

            return "room";
        }
    });


    DNC.joinRoom = function(roomId){
        if(roomId && Session.equals("roomId", roomId)){
            return;
        }

        if(!roomId){
            roomId = localStorage.getItem("lastRoomId") || DNC.Rooms.findOne()._id;
        }

    };
    
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

    Meteor.setInterval(function(){
        Session.set("now", moment());
        Meteor.call("heartbeat");
    }, 30000);
}());