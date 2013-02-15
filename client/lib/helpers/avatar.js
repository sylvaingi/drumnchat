Handlebars.registerHelper("user-avatar", function(user, size){
    if(!user.services){
        return;
    }
    
    var url = user.services.soundcloud.avatar_url;
    if(_.isString(size)){
        url = url.replace("large", size);
    }

    var username = Handlebars._escape(user.profile.name);
    url = Handlebars._escape(url);

    return new Handlebars.SafeString(
        "<img src='"+url+"' alt='"+username+"'/>"
    );
});