var DNC = {};

(function(){
    var SC = DNC.SC = {};
    if(Meteor.absoluteUrl("").indexOf("localhost")!== -1){
        SC.client_id = "df2bc0d46bae945f26c0aec02e7d2bf0";
    }
    else {
       SC.client_id = "8825a38de1659e49c76daa975e964d25";
    }
}());
