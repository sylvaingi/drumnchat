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
        DNC.initHB = false;
        Meteor.logout();
    };

    DNC.joinRoom = function(roomId){
        if(!roomId){
            roomId = localStorage.getItem("lastRoomId") || DNC.Rooms.findOne()._id;
        }
        
        if(Session.equals("roomId", roomId)){
            return;
        }

        console.log("Joining room "+roomId);

        if(DNC.p_handle){
            DNC.p_handle.stop();
            DNC.c_handle.stop();            
        }

        DNC.Player.stop();

        localStorage.setItem("lastRoomId", roomId);
        Session.set("roomId", roomId);        
        
        DNC.p_handle = Meteor.subscribe("playlist", roomId);
        DNC.c_handle = Meteor.subscribe("chat", roomId);
    };

    function startSCPlayer(scData){
        SC.initialize({
            client_id: scData.clientId
        });
        DNC.Player.init();
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