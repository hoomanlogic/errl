var app = app || {};

(function (ns, $) {
    'use strict';

    ns.bufferLineChartLabelRange = function (sideOfRange) {

        if (parseInt($('#selectFrom').val()) >= parseInt($('#selectTo').val())) {
            var pad = 0;

            if (sideOfRange === 'from') {
                if (parseInt($('#selectFrom').val()) < ns.result.timesOccurred.length) {
                    pad = 1;
                }
                $('#selectTo').val(parseInt($('#selectFrom').val()) + pad);
            } else {
                if (parseInt($('#selectTo').val()) > 0) {
                    pad = 1;
                }
                $('#selectFrom').val(parseInt($('#selectTo').val()) - pad);
            }
        }
    };


    ns.getHourlySummary = function (preserveDetail) {

        if (typeof ns.poller !== 'undefined') {
            window.clearInterval(ns.poller);
        }

        

    };

    ns.popUpErrorHistory = function (errorType, objectName, subName) {


    };

    ns.onRefreshOptions = function () {
        ns.getHourlySummary();
    };

}(app, $));