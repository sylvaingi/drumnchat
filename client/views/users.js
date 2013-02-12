Template["active-users"].users = function(){
    return Meteor.users.find({active:true});
};