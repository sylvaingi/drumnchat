Handlebars.registerHelper("userAvatar", function(user){
    var services = user.services;
    if(!services){
        return;
    }

    var url;
    if(services.soundcloud){
        url = services.soundcloud.avatar_url;
    }
    else if(services.google){
        url = services.google.picture;
    }
    else if(services.facebook){
        url = "http://graph.facebook.com/" + services.facebook.username + "/picture";
    }

    var username = Handlebars._escape(user.profile.name);
    url = Handlebars._escape(url);

    return new Handlebars.SafeString(
        "<img class='user-avatar' src='"+url+"' alt='"+username+"' title='"+username+"'/>"
    );
});