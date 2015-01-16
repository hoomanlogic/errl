/**
 * Errl Common Library
 * 2014, Errl, Geoff Manning
 * Namespace: hl.common
 * Dependencies: jquery 1.11.1
 */
var hl = hl || {};

hl.common = (function (ns, $) {
    'use strict';

    ns.getFriendlyName = function (propertyName) {
        // todo: split camel case
        if (propertyName === 'TwoWord') {
            return 'Two Word';
        } else {



            return propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
        }
    };

    ns.isBlank = function (obj) {
        if (typeof obj === 'undefined' || obj === null || obj === 0) {
            return true;
        } else {
            return false;
        }
    };
    
    ns.lookupDescription = function (model, propName, listName, listKeyName, listValueName) {
        // this function compares model.propName 
        // to list.key then returns list.value

        // optional override of list's comparison property
        if (typeof listKeyName === 'undefined') {
            listKeyName = 'key';
        }

        // optional override of list's description property
        if (typeof listValueName === 'undefined') {
            listValueName = 'value';
        }

        for (var i = 0; i < $scope[listName].length; i++) {
            if ($scope[listName][i][listKeyName] === model[propName]) {
                return $scope[listName][i][listValueName];
            }
        }

        // if we don't find it in the list, 
        // just return the value we were using to compare
        return model[propName];
    };
    
    /**
     * Returns blank string if val is 0 or '0', else returns original value.
     * @param {Object} val - the value to modify to a blank string when 0 or '0'
     */
    ns.zeroToBlank = function (val) {
        if (val === 0) {
            return '';
        }
        if (val === '0') {
            return '';
        }
        return val;
    };

    ns.pluralize = function (noun, count) {
        if (count === 0) {
            return 'no ' + noun.plural();
        } else if (count === 1) {
            return noun;
        } else {
            return noun.plural();
        }
    };
    
    ns.store = function (namespace, data) { 
        if (data) { 
            return localStorage.setItem(namespace, JSON.stringify(data));
        } 

        var localStore = localStorage.getItem(namespace); 
        return (localStore && JSON.parse(localStore)) || []; 
    };

    ns.assign = function (target, items) { 

        items = [].slice.call(arguments, 1); 

        return items.reduce(function (target, item) { 
            return Object.keys(item).reduce(function (target, property) { 
                target[property] = item[property]; 
                return target; 
            }, target); 
        }, target); 
    }; 

    ns.uuid = function () {
        var i, random;
        var result = '';

        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                result += '-';
            }
            result += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
                .toString(16);
        }

        return result;
    };

    ns.getFragment = function getFragment() {
        if (window.location.hash.indexOf("#") === 0) {
            return parseQueryString(window.location.hash.substr(1));
        } else {
            return {};
        }
    };

    function parseQueryString(queryString) {
        var data = {},
            pairs, pair, separatorIndex, escapedKey, escapedValue, key, value;

        if (queryString === null) {
            return data;
        }

        pairs = queryString.split("&");

        for (var i = 0; i < pairs.length; i++) {
            pair = pairs[i];
            separatorIndex = pair.indexOf("=");

            if (separatorIndex === -1) {
                escapedKey = pair;
                escapedValue = null;
            } else {
                escapedKey = pair.substr(0, separatorIndex);
                escapedValue = pair.substr(separatorIndex + 1);
            }

            key = decodeURIComponent(escapedKey);
            value = decodeURIComponent(escapedValue);

            data[key] = value;
        }

        return data;
    }

    return ns;
}(hl.common || {}, $));