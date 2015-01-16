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

    ns.getOptions = function () {

        // ajax call: get http://~/api/shipping
        $.ajax({
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + app.getAccessToken()
            },
            url: app.HTTP + '://' + app.HOST_NAME + '/api/options'
        }).done(function (result) {
            ns.options = result;

            ns.products = [];

            var selectProduct = $('#selectProduct');

            for (var index = 0; index < ns.options.length; index++) {
                if (ns.products.indexOf(ns.options[index].product) === -1) {
                    ns.products.push(ns.options[index].product);
                    selectProduct.append('<option value="' + ns.options[index].product + '"' + (index === 0 ? ' selected' : '') + '>' + ns.options[index].product + '</option>');
                }
            }

            ns.refreshOptions('Product');
        });
    };

    ns.refreshOptions = function (changedOption) {

        var index = 0;

        var selectProduct = $('#selectProduct');
        var selectEnvironment = $('#selectEnvironment');
        var selectVersion = $('#selectVersion');

        if (changedOption === 'Product') {
            // product changed - rebuild selectable environments
            selectEnvironment.empty();
            var product = selectProduct.val();
            var environments = [];
            for (index = 0; index < ns.options.length; index++) {
                if (ns.options[index].product === product) {
                    environments.push(ns.options[index].environment);
                    selectEnvironment.append('<option value="' + ns.options[index].environment + '"' + (index === 0 ? ' selected' : '') + '>' + ns.options[index].environment + '</option>');
                }
            }
        }

        // rebuild selectable versions
        if (selectVersion.length > 0) {
            selectVersion.empty();
            var environment = selectEnvironment.val();
            var versions = [];
            for (index = 0; index < ns.options.length; index++) {
                if (ns.options[index].product === product && ns.options[index].environment === environment) {
                    versions.push(ns.options[index].version);
                    selectVersion.append('<option value="' + ns.options[index].version + '"' + (index === 0 ? ' selected' : '') + '>' + ns.options[index].version + '</option>');
                }
            }
        }

        if (typeof ns.onRefreshOptions !== 'undefined') {
            ns.onRefreshOptions();
        }
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