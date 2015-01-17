var app = app || {};

(function (ns, $) {
    'use strict';

    ns.HTTP = 'http';
    ns.HOST_NAME = 'localhost:42026';
    //ns.HOST_NAME = 'errl.hoomanlogic.com';

    // configure error logger
    errl.config = {
        developer: 'hoomanlogic',
        key: '54263eb4-6ced-49bf-9bd7-14f0106c2a02',
        product: 'ErrL',
        environment: null,
        version: '1.0.0',
        getState: null,
        getUser: function () {
            return 'geoffrey.floyd';
        },
        onLogged: function (err) {
            toastr.error("<p><string>Oops!</strong></p><p>We're really sorry about that.</p><p>We'll get this fixed as soon as possible.</p>" + '<a class="btn btn-default btn-link" target="_blank" href="' + errl.getErrorDetailUrl(err.errorId) + '">Show me details</a> ');
        }
    }

    // Data access operations
    ns.setAccessToken = function (accessToken) {
        sessionStorage.setItem('accessToken', accessToken);
    };

    ns.getAccessToken = function () {
        return sessionStorage.getItem('accessToken');
    };

    ns.hideCriteria = function () {
        $('#criteria').removeClass('expanded');
        $('#view').removeClass('with-criteria');
    };

    ns.showCriteria = function () {
        $('#criteria').addClass('expanded');
        $('#view').addClass('with-criteria');
    };

}(app, $));

if (!app.getAccessToken()) {
    // The following code looks for a fragment in the URL to get the access token which will be
    // used to call the protected Web API resource
    var fragment = hl.common.getFragment();

    if (fragment.access_token) {
        // returning with access token, restore old hash, or at least hide token
        window.location.hash = fragment.state || '';
        app.setAccessToken(fragment.access_token);
    } else {
        // no token - so bounce to Authorize endpoint in AccountController to sign in or register
        window.location = "/Account/Authorize?client_id=web&response_type=token&state=" + encodeURIComponent(window.location.hash);
    }
}

window.onmousemove = function (event) {
    if (event.y > 50 && event.x < 20 && !$('#criteria').hasClass('expanded')) {
        app.showCriteria();
    } else if (event.y > 50 && event.x > 420 && $('#criteria').hasClass('expanded')) {
        app.hideCriteria();
    }
    
};