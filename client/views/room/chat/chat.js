(function(){
    "use strict";

    var maximized = false;
    Template.chat.events({
        "click": function(event, template){
            if(!maximized){
                maximized = true;
                $(template.firstNode).toggleClass("maximized minimized");
            }
        },

        "click .minimize-btn": function(event, template){
            event.preventDefault();
            $(template.firstNode).toggleClass("maximized minimized");
            maximized = false;
        }
    });

    Template.chat.messages = function(){
        return DNC.Chat.find({}, {sort:{date:1}});
    };

    Template.chatMessage.chatUser = function(){
        return Meteor.users.findOne({_id: this.user_id});
    };

    Template.chatMessage.rendered = function(){
        var node = this.firstNode;
        node.parentNode.scrollTop = node.offsetTop;
    };

    Template.chatForm.events({
        "submit": function(event, template){
            Meteor.call("postMessage", template.find("input:text").value);
            event.preventDefault();
            event.target.reset();
        }
    });

}());
