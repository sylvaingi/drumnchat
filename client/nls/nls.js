var i18n = Meteor.i18n;

var lang = localStorage.getItem("lang") || navigator.language.split("-")[0];
i18n._current = i18n[lang] ? lang : "en";

i18n.stringFor = function(key){
    return i18n[i18n._current][key] || "!!"+key+"!!";
};

Handlebars.registerHelper("__", function(context, options){
    return i18n.stringFor(context);
});