Handlebars.registerHelper("user-avatar", function(user, size){
    var url = user.avatar_url;
    if(_.isString(size)){
        url = url.replace("large", size);
    }

    var username = Handlebars._escape(user.username);
    url = Handlebars._escape(url);

    return new Handlebars.SafeString(
        "<img src='"+url+"' alt='"+username+"'/>"
    );
});