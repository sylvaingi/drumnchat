var i18n = Meteor.i18n;

var lang = localStorage.getItem("lang") || navigator.language.split("-")[0];
var curLang = i18n._current = i18n[lang] ? lang : "en";

Handlebars.registerHelper("__", function(context, options){
    return i18n[curLang][context] || "!!"+context+"!!";
});