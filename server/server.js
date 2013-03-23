Meteor.startup(function(){
    /*DNC.Tracks.remove({});
    Meteor.call("addTrack", "https://soundcloud.com/annie-mac-presents/free-music-monday-starkey-the?in=enum1on/sets/trap");
    Meteor.call("addTrack", "https://soundcloud.com/skreamizm/skream-ft-kelis-copy-cat?in=enum1on/sets/deep-dusbtep");
    Meteor.call("addTrack", "https://soundcloud.com/laurelhalo/lianne-la-havas-forget-laurel?in=enum1on/sets/deep-dusbtep");
    Meteor.call("addTrack", "https://soundcloud.com/just-blaze/just-blaze-x-baauer-higher?in=enum1on/sets/trap");
    DNC.Tracks.update({"sc.id": 69941995}, {$set: {votes: 10}});
    DNC.Tracks.update({"sc.id": 75409800}, {$set: {votes: 5}});*/

    if(DNC.Rooms.find().count() === 0){
        DNC.Rooms.insert({_id: DNC.Rooms.mixesRoom, name: "Mixes"});
    }

    var SC = Accounts.loginServiceConfiguration.findOne({service: "soundcloud"});
    if(SC){
        DNC.SC_clientId = SC.clientId;
    }
    else {
        console.log("Warning! SC account is not configured!");
    }

    DNC.tick();
});