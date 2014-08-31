app.factory("FacebookService", function(){
    window.fbAsyncInit = function() {
        FB.init({
            appId      : '581313431951361',
            cookie     : true,  // enable cookies to allow the server to access 
                                // the session
            xfbml      : true,  // parse social plugins on this page
            version    : 'v2.0' // use version 2.0
        });
    };
    // Load the SDK asynchronously
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    function FacebookService(){
        var _getAccessTokenFromResponse = function(response){
            if (response.status === 'connected') {
                // Logged into your app and Facebook.
                return response.authResponse.accessToken;
            } else if (response.status === 'not_authorized') {
                // The person is logged into Facebook, but not your app.
                return undefined;
            } else {
                // The person is not logged into Facebook, so we're not sure if
                // they are logged into this app or not.
                return undefined;
            }
        };

        // returns a promise of the accessToken
        this.getAccessToken = function(){
            var promise = new Promise(function(resolve, reject){
                FB.getLoginStatus(function(response){
                    resolve(response);
                });    
            }).then(_getAccessTokenFromResponse);
            return promise;
        };

        // logs in to facebook
        // returns a promise of the accessToken
        this.login = function(){
            var promise = new Promise(function(resolve, response){
                FB.login(function(response) {
                    // handle the response
                    resolve(response);
                }, {scope: 'public_profile,email'});
            }).then(_getAccessTokenFromResponse);
            return promise;
        };

        this.logout = function(){
            var promise = new Promise(function(resolve, response){
                FB.logout(function(response) {
                    // Person is now logged out
                    resolve(response);
                });    
            });
            return promise;
        };   
    }

    return new FacebookService();
});