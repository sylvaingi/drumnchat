(function(){
    var subscribesIds = ["playlist", "chat", "allUserData"];
    var subscribesHandles = [];

    function subscribeAll(){
        _.each(subscribesIds, function(id){
            var handle = Meteor.subscribe(id);
            subscribesHandles.push(handle);
        });
    }

    function unsubscribeAll(){
        _.each(subscribesHandles, function(handle){
            handle.stop();
        });
    }

    function refreshUser(){
        SC.get("/me", function(me){
            Session.set("user", me);
            Meteor.call("heartbeat", Session.get("user"));

            DNC.heartbeatId = Meteor.setInterval(function(){
                Meteor.call("heartbeat");
            }, 10000);

            subscribeAll();
        });
    }

    DNC.login = function(){
        SC.connect(function(){
            refreshUser();
        });
    };

    DNC.logout = function(){
        unsubscribeAll();

        DNC.Player.destruct();
        
        Session.set("user", null);
        Session.set("onair", null);

        Meteor.clearInterval(DNC.heartbeatId);
        Meteor.logout();

        SC.disconnect();
    };

    SC.initialize({
        client_id: DNC.SC.client_id,
        redirect_uri: Meteor.absoluteUrl("soundcloud.html")
    });

    if(SC.isConnected()){
        refreshUser();
    }

    Meteor.setInterval(function(){
        Session.set("now", moment());
    }, 60000);
}());