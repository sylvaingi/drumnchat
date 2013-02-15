Template["active-users"].users = function(){
    return Meteor.users.find({"profile.active":true});
};