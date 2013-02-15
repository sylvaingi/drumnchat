Handlebars.registerHelper("user-avatar", function(user){
    var services = user.services;
    var url;

    if(services.soundcloud){
        url = services.soundcloud.avatar_url;
    }
    else if(services.google){
        url = services.google.picture;
    }
    else if(services.facebook){
        url = services.facebook.picture.data.url;
    }

    var username = Handlebars._escape(user.profile.name);
    url = Handlebars._escape(url);

    return new Handlebars.SafeString(
        "<img class='user-avatar' src='"+url+"' alt='"+username+"'/>"
    );
});