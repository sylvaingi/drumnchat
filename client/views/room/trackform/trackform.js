Template.trackform.events({
    "submit": function(event, template){
        event.preventDefault();
        Meteor.call("addTrack", template.find("input:text").value, function(error){
            if(error){
                alert(error.reason);
            }
        });

        event.target.reset();
    }
});