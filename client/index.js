SC.storage = function(){
    return localStorage;
};

SC.initialize({
    client_id: DNC.SC.client_id,
    redirect_uri: "http://localhost:3501/callback.html"
});
