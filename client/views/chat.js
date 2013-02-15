(function(){
    "use strict";

    Template.chat.messages = function(){
        return DNC.Chat.find({}, {sort:{date:1}});
    };

    Template.message.chatUser = function(){
        return Meteor.users.findOne({_id: this.user_id});
    };

    Template["chat-form"].events({
        "submit": function(event, template){
            Meteor.call("postMessage", template.find("input:text").value);
            event.preventDefault();
            event.target.reset();
        }
    });

}());
