'use strict';

app.home = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('home');

(function (parent) {
    var
        homeModel = kendo.observable({
            username: "",
            password: "",
            validateData: function () {
                var model = homeModel;

                if (homeModel.username == '' && homeModel.password == '') {
                    app.showNotification('Missing credentials');
                    return false;
                }

                if (homeModel.username == '') {
                    app.showNotification('Missing username');
                    return false;
                }

                if (homeModel.password == '') {
                    app.showNotification('Missing password');
                    return false;
                }
                return true;
            },
            signin: function () {
                if (homeModel.validateData()) {
                    var user = app.user;
                    var username = null,
                        peer = null,
                        displayname = null,
                        chaincodeid = null,
                        securecontext = null;
                    $.each(user, function (k, v) {
                        if (v.username == homeModel.username && v.password == homeModel.password) {
                            username = v.username;
                            peer = v.peer;
                            displayname = v.displayname;
                            chaincodeid = v.chaincodeid;
                            securecontext = v.securecontext;
                        }
                    });

                    if (username != null) {
                        app.login(username, peer, displayname, chaincodeid, securecontext);
                    } else {
                        app.showNotification('Please check your username and password');
                    }
                }
            }
        });

    parent.set('homeModel', homeModel);

    function enterToLogin(){
        var input = document.getElementById("login-password");
        input.addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                homeModel.signin();
            }
        });

        
    }

    parent.set('onShow', function (e) {

        enterToLogin();

        localStorage.clear();
        var $full_page = $('.full-page');

        $full_page.fadeOut('fast', function () {
            $full_page.css('background-image', 'url("' + $full_page.attr('data-image') + '")');
            $full_page.css('min-height', '100vh');
            $full_page.css('background-size', 'contain');
            $full_page.fadeIn('fast');
        });

        setTimeout(function () {
            $('.card').removeClass('card-hidden');
        }, 700)

        
    });

    parent.set('afterShow', function (e) {

    });
})(app.home);
