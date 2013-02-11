Template["active-users"].users = function(){
    return Meteor.users.find({active:true});
};

Template["active-user"].avatar_url_tiny = function(){
    return this.avatar_url.replace("large", "badge");
};