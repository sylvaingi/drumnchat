(function(){

    Meteor.subscribe("userData");
    DNC.r_handle = Meteor.subscribe("rooms");

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
            if(!DNC.r_handle.ready()){
                return "loader";
            }

            Session.set("roomId", null);
            return "roompicker";
        },


        "/room/:id": function(roomId){
            if(!DNC.r_handle.ready()){
                return "loader";
            }

            Session.set("roomId", roomId);

            return "room";
        }
    });

    Session.set("now", moment().valueOf());
    Meteor.setInterval(function(){
        Session.set("now", moment().valueOf());
        Meteor.call("heartbeat");
    }, 30000);
}());