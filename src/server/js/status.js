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

    ns.handleLineChartLabelClick = function (evt) {
        var activePoints = ns.myLineChart.getPointsAtEvent(evt);

        //TODO uncomment this when done testing error logging
        //if (activePoints.length === 0) {
        //    return;
        //}


        // remember which values were clicked for later polling
        ns.lastDateClicked = activePoints[0].label.split(" ")[0].replace('/', '-').replace('/', '-');
        ns.lastHourClicked = activePoints[0].label.split(" ")[1];

        // get error details
        ns.getErrorSummary(ns.lastDateClicked, ns.lastHourClicked);
    };

    ns.pollNeedsRefresh = function () {
        // ajax call: get http://~/api/shipping
        $.ajax({
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + app.getAccessToken()
            },
            url: app.HTTP + '://' + app.HOST_NAME + '/api/needsrefresh' +
                '?product=' + encodeURIComponent($('#selectProduct').val()) +
                '&environment=' + encodeURIComponent($('#selectEnvironment').val()) +
                '&version=' + encodeURIComponent($('#selectVersion').val()) +
                '&date=' + ns.result.latestPoll
        }).done(function (result) {
            if (result === true) {
                ns.getHourlySummary(true);
            }
        });
    };

    ns.getHourlySummary = function (preserveDetail) {

        if (typeof ns.poller !== 'undefined') {
            window.clearInterval(ns.poller);
        }

        // ajax call: get http://~/api/hourlysummary
        $.ajax({
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + app.getAccessToken()
            },
            url: app.HTTP + '://' + app.HOST_NAME + '/api/hourlysummary' +
                '?product=' + encodeURIComponent($('#selectProduct').val()) +
                '&environment=' + encodeURIComponent($('#selectEnvironment').val()) +
                '&version=' + encodeURIComponent($('#selectVersion').val()) +
                '&date='
        }).done(function (result) {

            ns.result = result;

            // clear select range
            var selectFrom = $('#selectFrom');
            var selectTo = $('#selectTo');

            selectFrom.empty();
            selectTo.empty();

            if (result.timesOccurred.length > 0) {
                var fromDate = result.timesOccurred[0].key;
                var toDate = result.timesOccurred[result.timesOccurred.length - 1].key;

                var defaultStart = 0;

                if (ns.result.timesOccurred.length > 36) {
                    defaultStart = ns.result.timesOccurred.length - 36;
                }

                for (var i = 0; i < ns.result.timesOccurred.length; i++) {
                    var fromDefaultSelected = '';
                    var toDefaultSelected = '';
                    if (i === defaultStart) {
                        fromDefaultSelected = ' selected';
                    }
                    if (i === ns.result.timesOccurred.length - 1) {
                        toDefaultSelected = ' selected';
                    }

                    if (i === 0) {
                        selectFrom.append('<option value="' + i + '"' + fromDefaultSelected + '>' + ns.result.timesOccurred[i].key + '</option>');
                    } else if (i === ns.result.timesOccurred.length - 1) {
                        selectTo.append('<option value="' + i + '"' + toDefaultSelected + '>' + ns.result.timesOccurred[i].key + '</option>');
                    } else {
                        selectFrom.append('<option value="' + i + '"' + fromDefaultSelected + '>' + ns.result.timesOccurred[i].key + '</option>');
                        selectTo.append('<option value="' + i + '"' + toDefaultSelected + '>' + ns.result.timesOccurred[i].key + '</option>');
                    }

                }
            }

            ns.refreshHourlySummary();

            if (typeof preserveDetail !== 'undefined' && typeof ns.lastDateClicked !== 'undefined') {
                ns.getErrorSummary(ns.lastDateClicked, ns.lastHourClicked);
            } else {
                $('#errorSummarySection').attr('hidden', true);
            }

            ns.poller = window.setInterval(ns.pollNeedsRefresh, 15000);

        }).fail(function (jqXHR, textStatus, errorThrown) {
            // notify error
            toastr.error(jqXHR.responseText || textStatus, 'System Error');
        });

    };

    ns.refreshHourlySummary = function () {

        var labels = [];
        var ds1 = [];
        var ds2 = [];
        var ds3 = [];

        // populate datasets for selected label range
        for (var i = parseInt($('#selectFrom').val()) ; i <= parseInt($('#selectTo').val()) ; i++) {

            labels.push(ns.result.timesOccurred[i].key);
            ds1.push(ns.result.timesOccurred[i].value);
            ds2.push(ns.result.procsAffected[i].value);
            ds3.push(ns.result.usersAffected[i].value);
        }

        // create line chart data object with populated datasets
        var data = {
            labels: labels,
            datasets: [
                {
                    label: "Total errors",
                    fillColor: "rgba(200,200,200,0.2)",
                    strokeColor: "rgba(200,200,200,1)",
                    pointColor: "rgba(200,200,200,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(200,200,200,1)",
                    data: ds1
                },
                {
                    label: "Procedures affected",
                    fillColor: "rgba(151,205,187,0.2)",
                    strokeColor: "rgba(151,205,187,1)",
                    pointColor: "rgba(151,205,187,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,205,187,1)",
                    data: ds2
                },
                {
                    label: "Users affected",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: ds3
                }
            ]
        };

        // (re)create the canvas element for the line chart (only reliable way to regenerate line chart without an overlay issue)
        $('#myLineChart').remove();
        $('#myLineChartContainer').append('<canvas id="myLineChart" height="400" width="979"><canvas>');

        // create line chart object, passing in data
        // : get 2d canvas drawing context and pass to chart.js line chart constructor
        var ctx = $('#myLineChart').get(0).getContext("2d");
        var myLineChart = new Chart(ctx).Line(data, {
            legendTemplate:
                '<ul class="<%=name.toLowerCase()%>-legend">' +
                    '<% for (var i=0; i<datasets.length; i++){%>' +
                        '<li><span class="badge" style="margin-right: 5px; background-color:<%=datasets[i].strokeColor%>">•</span><%if(datasets[i].label){%><%=datasets[i].label%><%}%>' +
                        '</li>' +
                    '<%}%>' +
                '</ul>'
        });

        // store reference to myLineChart
        ns.myLineChart = myLineChart;

        // handle the label click event of the line chart
        $('#myLineChart').click(ns.handleLineChartLabelClick);

        // (re)generate the line chart legend
        $('#myLineChartLegend').empty();
        $('#myLineChartLegend').append(myLineChart.generateLegend());
    };

    ns.getErrorSummary = function (date, hour) {

        // hide the error summary while we're loading new results
        $('#errorSummarySection').attr('hidden', true);

        // ajax call: get http://~/api/shipping
        $.ajax({
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + app.getAccessToken()
            },
            url: app.HTTP + '://' + app.HOST_NAME + '/api/errorsummary' +
                '?product=' + encodeURIComponent($('#selectProduct').val()) +
                '&environment=' + encodeURIComponent($('#selectEnvironment').val()) +
                '&version=' + encodeURIComponent($('#selectVersion').val()) +
                '&date=' + date +
                '&hour=' + hour + '&objectName='
        })
        .done(function (result) {
            var ds = [];

            var colors = ['#F7464A', '#46BFBD', '#FDB45C', 'rgba(121,157,205,1)', 'rgb(135, 76, 194)'];
            var highlights = ['#FF5A5E', '#5AD3D1', '#FFC870', 'rgba(121,157,205,0.7)', 'rgba(135, 76, 194,0.7)'];

            for (var i = 0; i < result.timesOccurred.length; i++) {
                if (ds.length > 4) {
                    ds[4].value = ds[4].value + result.timesOccurred[i].value;
                    ds[4].label = ds[4].label + ', ' + result.timesOccurred[i].key;
                } else {
                    ds.push({
                        value: result.timesOccurred[i].value,
                        color: colors[i],
                        highlight: highlights[i],
                        label: result.timesOccurred[i].key
                    });
                }
            }

            $('#myPieChart').remove(); // this is my <canvas> element
            $('#myPieChartContainer').append('<canvas id="myPieChart" height="300" width="800"><canvas>');


            var ctx = $('#myPieChart').get(0).getContext("2d");

            var myPieChart = new Chart(ctx).Pie(ds, {
                legendTemplate:
                    '<table style="width: 370px" class="<%=name.toLowerCase()%>-legend">' +
                    '<tbody>' +

                        '<% for (var i=0; i<segments.length; i++){%>' +
                            '<tr><td><span class="badge" style="background-color:<%=segments[i].fillColor%>"><%=segments[i].value%></span></td><td style="padding-left: 5px;"><%if(segments[i].label){%><%=segments[i].label%><%}%></td>' +
                            '</tr>' +
                        '<%}%>' +
                    '</tbody>' +
                    '</table>'
            });

            // (re)generate the pie chart legend
            $('#myPieChartLegend').empty();
            $('#myPieChartLegend').append(myPieChart.generateLegend());

            // (re)generate the rows in the error summary table
            $('#errorSummaryTableBody').empty();
            for (var n = 0; n < result.details.length; n++) {
                $('#errorSummaryTableBody').append(
                    '<tr>' +
                        '<td class="text-right"><a href="javascript:;" onclick="app.popUpErrorHistory(\'' + result.details[n].errorType + '\',null,null)">' + result.details[n].errorType + '</a></td>' +
                        '<td>' + result.details[n].errorDescription + '</td>' +
                        '<td><a href="javascript:;" onclick="app.popUpErrorHistory(null,\'' + result.details[n].objectName + '\',null)">' + result.details[n].objectName + '</a></td>' +
                        '<td><a href="javascript:;" onclick="app.popUpErrorHistory(null,\'' + result.details[n].objectName + '\',\'' + result.details[n].subName + '\')">' + result.details[n].subName + '</td>' +
                        '<td class="text-center">' + result.details[n].timesOccurred + '</td>' +
                        '<td class="text-right">' + result.details[n].latestOccurrence + '</td>' +
                        '<td class="text-center">' + result.details[n].usersAffected + '</td>' +
                    '</tr>'
                );
            }

            // display the error summary now that we are done generating the error summmary section
            $('#errorSummarySection').removeAttr('hidden');

        });
    };

    ns.popUpErrorHistory = function (errorType, objectName, subName) {

        // ajax call: get http://~/api/get
        $.ajax({
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + app.getAccessToken()
            },
            url: app.HTTP + '://' + app.HOST_NAME + '/api/errorhistory' +
                '?environment=' + $('#selectEnvironment').val() +
                '&version=' +
                '&errorType=' + errorType +
                '&objectName=' + objectName +
                '&subName=' + subName +
                '&userId='
        }).done(function (result) {

            // clear elements from containers that we're going to generate
            // new elements into
            $('#modalStatsInfo').empty();
            $('#modalStatsDetails').empty();

            // generate info list items
            for (var i = 0; i < result.info.length; i++) {
                $('#modalStatsInfo').append(
                    '<li>' + result.info[i] + '</li>'
                );
            }

            // generate rows of error history
            for (var i = 0; i < result.details.length; i++) {
                $('#modalStatsDetails').append(
                    '<tr>' +
                        '<td>' + result.details[i].errorType + '</td>' +
                        '<td>' + result.details[i].errorDescription + '</td>' +
                        '<td>' + result.details[i].objectName + '</td>' +
                        '<td>' + result.details[i].subName + '</td>' +
                        '<td>' + result.details[i].stackTrace + '</td>' +
                        '<td>' + result.details[i].state + '</td>' +
                        '<td>' + result.details[i].details + '</td>' +
                        '<td>' + result.details[i].userId + '</td>' +
                        '<td>' + result.details[i].occurred + '</td>' +
                    '</tr>'
                );
            }

            $('#myModal').show().toggleClass('in');

        });
    };

    ns.onRefreshOptions = function () {
        ns.getHourlySummary();
    };

}(app, $));