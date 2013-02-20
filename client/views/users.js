Template["active-users"].users = function(){
    return Meteor.users.find({active:true, room_id: Session.get("roomId"), "services":{$exists:true}});
};