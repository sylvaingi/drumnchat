Template["active-users"].users = function(){
    return Meteor.users.find({active:true, "services":{$exists:true}});
};