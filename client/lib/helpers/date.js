Handlebars.registerHelper("dateAgo", function(date){
    var m = moment(date);
    var now = moment(Session.get("now"));

    if(now.diff(m, 'days') === 0){
        return m.fromNow();
    }
    else {
        return m.format("L");
    }
});

