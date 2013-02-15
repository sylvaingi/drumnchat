var DNC = {};

DNC.SC_client_id = function(){
    var SC = Accounts.loginServiceConfiguration
                    .findOne({service: "soundcloud"});

    return SC.clientId;  
};