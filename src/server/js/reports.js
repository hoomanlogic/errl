var app = app || {};

(function (ns, $) {
    'use strict';

    ns.divideIfNotByZero = function (val1, val2) {
        if (val1 === 0 || val2 === 0) {
            return 0;
        } else {
            return val1 / val2;
        }
    };

    ns.getReport = function () {
        // ajax call: get http://~/api/reports
        $.ajax({
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + app.getAccessToken()
            },
            url: app.HTTP + '://' + app.HOST_NAME + '/api/reports/' + $('#selectReport').val() +
                '?product=' + encodeURIComponent($('#selectProduct').val()) + 
                '&environment=' + encodeURIComponent($('#selectEnvironment').val())
        }).done(function (data) {
            ns.reports[$('#selectReport').val()](data);
        });
    };

    ns.reports = {
        recentVersionsComparison: function (data) {
            ns.createChart1(data);
            ns.createChart2(data);
            ns.createChart3(data);
        }
    }

    ns.createChart1 = function (result) {
        var labels = ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
        var ds1 = [];
        var ds2 = [];
        var ds3 = [];
        var datasets = [];

        // populate datasets
        ds1.push(ns.divideIfNotByZero(result.query2[0].hour07, result.query5[0].hour07));
        ds1.push(ns.divideIfNotByZero(result.query2[0].hour08, result.query5[0].hour08));
        ds1.push(ns.divideIfNotByZero(result.query2[0].hour09, result.query5[0].hour09));
        ds1.push(ns.divideIfNotByZero(result.query2[0].hour10, result.query5[0].hour10));
        ds1.push(ns.divideIfNotByZero(result.query2[0].hour11, result.query5[0].hour11));
        ds1.push(ns.divideIfNotByZero(result.query2[0].hour12, result.query5[0].hour12));
        ds1.push(ns.divideIfNotByZero(result.query2[0].hour13, result.query5[0].hour13));
        ds1.push(ns.divideIfNotByZero(result.query2[0].hour14, result.query5[0].hour14));
        ds1.push(ns.divideIfNotByZero(result.query2[0].hour15, result.query5[0].hour15));
        ds1.push(ns.divideIfNotByZero(result.query2[0].hour16, result.query5[0].hour16));
        ds1.push(ns.divideIfNotByZero(result.query2[0].hour17, result.query5[0].hour17));
        ds1.push(ns.divideIfNotByZero(result.query2[0].hour18, result.query5[0].hour18));
        ds1.push(ns.divideIfNotByZero(result.query2[0].hour19, result.query5[0].hour19));
        datasets.push({
            label: result.query2[0].version,
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: ds1
        });

        if (result.query2.length > 1) {
            ds2.push(ns.divideIfNotByZero(result.query2[1].hour07, result.query5[1].hour07));
            ds2.push(ns.divideIfNotByZero(result.query2[1].hour08, result.query5[1].hour08));
            ds2.push(ns.divideIfNotByZero(result.query2[1].hour09, result.query5[1].hour09));
            ds2.push(ns.divideIfNotByZero(result.query2[1].hour10, result.query5[1].hour10));
            ds2.push(ns.divideIfNotByZero(result.query2[1].hour11, result.query5[1].hour11));
            ds2.push(ns.divideIfNotByZero(result.query2[1].hour12, result.query5[1].hour12));
            ds2.push(ns.divideIfNotByZero(result.query2[1].hour13, result.query5[1].hour13));
            ds2.push(ns.divideIfNotByZero(result.query2[1].hour14, result.query5[1].hour14));
            ds2.push(ns.divideIfNotByZero(result.query2[1].hour15, result.query5[1].hour15));
            ds2.push(ns.divideIfNotByZero(result.query2[1].hour16, result.query5[1].hour16));
            ds2.push(ns.divideIfNotByZero(result.query2[1].hour17, result.query5[1].hour17));
            ds2.push(ns.divideIfNotByZero(result.query2[1].hour18, result.query5[1].hour18));
            ds2.push(ns.divideIfNotByZero(result.query2[1].hour19, result.query5[1].hour19));
            datasets.push({
                label: result.query2[1].version,
                fillColor: "rgba(151,205,187,0.2)",
                strokeColor: "rgba(151,205,187,1)",
                pointColor: "rgba(151,205,187,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,205,187,1)",
                data: ds2
            });
        }

        if (result.query2.length > 2) {
            ds3.push(ns.divideIfNotByZero(result.query2[2].hour07, result.query5[2].hour07));
            ds3.push(ns.divideIfNotByZero(result.query2[2].hour08, result.query5[2].hour08));
            ds3.push(ns.divideIfNotByZero(result.query2[2].hour09, result.query5[2].hour09));
            ds3.push(ns.divideIfNotByZero(result.query2[2].hour10, result.query5[2].hour10));
            ds3.push(ns.divideIfNotByZero(result.query2[2].hour11, result.query5[2].hour11));
            ds3.push(ns.divideIfNotByZero(result.query2[2].hour12, result.query5[2].hour12));
            ds3.push(ns.divideIfNotByZero(result.query2[2].hour13, result.query5[2].hour13));
            ds3.push(ns.divideIfNotByZero(result.query2[2].hour14, result.query5[2].hour14));
            ds3.push(ns.divideIfNotByZero(result.query2[2].hour15, result.query5[2].hour15));
            ds3.push(ns.divideIfNotByZero(result.query2[2].hour16, result.query5[2].hour16));
            ds3.push(ns.divideIfNotByZero(result.query2[2].hour17, result.query5[2].hour17));
            ds3.push(ns.divideIfNotByZero(result.query2[2].hour18, result.query5[2].hour18));
            ds3.push(ns.divideIfNotByZero(result.query2[2].hour19, result.query5[2].hour19));
            datasets.push({
                label: result.query2[2].version,
                fillColor: "rgba(200,200,200,0.2)",
                strokeColor: "rgba(200,200,200,1)",
                pointColor: "rgba(200,200,200,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(200,200,200,1)",
                data: ds3
            });
        }

        // create line chart data object with populated datasets
        var data = {
            labels: labels,
            datasets: datasets
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

        // (re)generate the line chart legend
        $('#myLineChartLegend').empty();
        $('#myLineChartLegend').append(myLineChart.generateLegend());
    };

    ns.createChart2 = function (result) {
        var labels = ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
        var ds1 = [];
        var ds2 = [];
        var ds3 = [];
        var datasets = [];

        // populate datasets
        ds1.push(ns.divideIfNotByZero(result.query3[0].hour07, result.query5[0].hour07));
        ds1.push(ns.divideIfNotByZero(result.query3[0].hour08, result.query5[0].hour08));
        ds1.push(ns.divideIfNotByZero(result.query3[0].hour09, result.query5[0].hour09));
        ds1.push(ns.divideIfNotByZero(result.query3[0].hour10, result.query5[0].hour10));
        ds1.push(ns.divideIfNotByZero(result.query3[0].hour11, result.query5[0].hour11));
        ds1.push(ns.divideIfNotByZero(result.query3[0].hour12, result.query5[0].hour12));
        ds1.push(ns.divideIfNotByZero(result.query3[0].hour13, result.query5[0].hour13));
        ds1.push(ns.divideIfNotByZero(result.query3[0].hour14, result.query5[0].hour14));
        ds1.push(ns.divideIfNotByZero(result.query3[0].hour15, result.query5[0].hour15));
        ds1.push(ns.divideIfNotByZero(result.query3[0].hour16, result.query5[0].hour16));
        ds1.push(ns.divideIfNotByZero(result.query3[0].hour17, result.query5[0].hour17));
        ds1.push(ns.divideIfNotByZero(result.query3[0].hour18, result.query5[0].hour18));
        ds1.push(ns.divideIfNotByZero(result.query3[0].hour19, result.query5[0].hour19));
        datasets.push({
            label: result.query3[0].version,
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: ds1
        });

        if (result.query2.length > 1) {
            ds2.push(ns.divideIfNotByZero(result.query3[1].hour07, result.query5[1].hour07));
            ds2.push(ns.divideIfNotByZero(result.query3[1].hour08, result.query5[1].hour08));
            ds2.push(ns.divideIfNotByZero(result.query3[1].hour09, result.query5[1].hour09));
            ds2.push(ns.divideIfNotByZero(result.query3[1].hour10, result.query5[1].hour10));
            ds2.push(ns.divideIfNotByZero(result.query3[1].hour11, result.query5[1].hour11));
            ds2.push(ns.divideIfNotByZero(result.query3[1].hour12, result.query5[1].hour12));
            ds2.push(ns.divideIfNotByZero(result.query3[1].hour13, result.query5[1].hour13));
            ds2.push(ns.divideIfNotByZero(result.query3[1].hour14, result.query5[1].hour14));
            ds2.push(ns.divideIfNotByZero(result.query3[1].hour15, result.query5[1].hour15));
            ds2.push(ns.divideIfNotByZero(result.query3[1].hour16, result.query5[1].hour16));
            ds2.push(ns.divideIfNotByZero(result.query3[1].hour17, result.query5[1].hour17));
            ds2.push(ns.divideIfNotByZero(result.query3[1].hour18, result.query5[1].hour18));
            ds2.push(ns.divideIfNotByZero(result.query3[1].hour19, result.query5[1].hour19));
            datasets.push({
                label: result.query3[1].version,
                fillColor: "rgba(151,205,187,0.2)",
                strokeColor: "rgba(151,205,187,1)",
                pointColor: "rgba(151,205,187,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,205,187,1)",
                data: ds2
            });
        }

        if (result.query2.length > 2) {
            ds3.push(ns.divideIfNotByZero(result.query3[2].hour07, result.query5[2].hour07));
            ds3.push(ns.divideIfNotByZero(result.query3[2].hour08, result.query5[2].hour08));
            ds3.push(ns.divideIfNotByZero(result.query3[2].hour09, result.query5[2].hour09));
            ds3.push(ns.divideIfNotByZero(result.query3[2].hour10, result.query5[2].hour10));
            ds3.push(ns.divideIfNotByZero(result.query3[2].hour11, result.query5[2].hour11));
            ds3.push(ns.divideIfNotByZero(result.query3[2].hour12, result.query5[2].hour12));
            ds3.push(ns.divideIfNotByZero(result.query3[2].hour13, result.query5[2].hour13));
            ds3.push(ns.divideIfNotByZero(result.query3[2].hour14, result.query5[2].hour14));
            ds3.push(ns.divideIfNotByZero(result.query3[2].hour15, result.query5[2].hour15));
            ds3.push(ns.divideIfNotByZero(result.query3[2].hour16, result.query5[2].hour16));
            ds3.push(ns.divideIfNotByZero(result.query3[2].hour17, result.query5[2].hour17));
            ds3.push(ns.divideIfNotByZero(result.query3[2].hour18, result.query5[2].hour18));
            ds3.push(ns.divideIfNotByZero(result.query3[2].hour19, result.query5[2].hour19));
            datasets.push({
                label: result.query3[2].version,
                fillColor: "rgba(200,200,200,0.2)",
                strokeColor: "rgba(200,200,200,1)",
                pointColor: "rgba(200,200,200,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(200,200,200,1)",
                data: ds3
            });
        }

        // create line chart data object with populated datasets
        var data = {
            labels: labels,
            datasets: datasets
        };

        // (re)create the canvas element for the line chart (only reliable way to regenerate line chart without an overlay issue)
        $('#myLineChart2').remove();
        $('#myLineChartContainer2').append('<canvas id="myLineChart2" height="400" width="979"><canvas>');

        // create line chart object, passing in data
        // : get 2d canvas drawing context and pass to chart.js line chart constructor
        var ctx = $('#myLineChart2').get(0).getContext("2d");
        var myLineChart = new Chart(ctx).Line(data, {
            legendTemplate:
                '<ul class="<%=name.toLowerCase()%>-legend">' +
                    '<% for (var i=0; i<datasets.length; i++){%>' +
                        '<li><span class="badge" style="margin-right: 5px; background-color:<%=datasets[i].strokeColor%>">•</span><%if(datasets[i].label){%><%=datasets[i].label%><%}%>' +
                        '</li>' +
                    '<%}%>' +
                '</ul>'
        });

        // (re)generate the line chart legend
        $('#myLineChartLegend2').empty();
        $('#myLineChartLegend2').append(myLineChart.generateLegend());
    };

    ns.createChart3 = function (result) {
        var labels = ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
        var ds1 = [];
        var ds2 = [];
        var ds3 = [];
        var datasets = [];

        // populate datasets
        ds1.push(ns.divideIfNotByZero(result.query4[0].hour07, result.query5[0].hour07));
        ds1.push(ns.divideIfNotByZero(result.query4[0].hour08, result.query5[0].hour08));
        ds1.push(ns.divideIfNotByZero(result.query4[0].hour09, result.query5[0].hour09));
        ds1.push(ns.divideIfNotByZero(result.query4[0].hour10, result.query5[0].hour10));
        ds1.push(ns.divideIfNotByZero(result.query4[0].hour11, result.query5[0].hour11));
        ds1.push(ns.divideIfNotByZero(result.query4[0].hour12, result.query5[0].hour12));
        ds1.push(ns.divideIfNotByZero(result.query4[0].hour13, result.query5[0].hour13));
        ds1.push(ns.divideIfNotByZero(result.query4[0].hour14, result.query5[0].hour14));
        ds1.push(ns.divideIfNotByZero(result.query4[0].hour15, result.query5[0].hour15));
        ds1.push(ns.divideIfNotByZero(result.query4[0].hour16, result.query5[0].hour16));
        ds1.push(ns.divideIfNotByZero(result.query4[0].hour17, result.query5[0].hour17));
        ds1.push(ns.divideIfNotByZero(result.query4[0].hour18, result.query5[0].hour18));
        ds1.push(ns.divideIfNotByZero(result.query4[0].hour19, result.query5[0].hour19));
        datasets.push({
            label: result.query4[0].version,
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: ds1
        });

        if (result.query2.length > 1) {
            ds2.push(ns.divideIfNotByZero(result.query4[1].hour07, result.query5[1].hour07));
            ds2.push(ns.divideIfNotByZero(result.query4[1].hour08, result.query5[1].hour08));
            ds2.push(ns.divideIfNotByZero(result.query4[1].hour09, result.query5[1].hour09));
            ds2.push(ns.divideIfNotByZero(result.query4[1].hour10, result.query5[1].hour10));
            ds2.push(ns.divideIfNotByZero(result.query4[1].hour11, result.query5[1].hour11));
            ds2.push(ns.divideIfNotByZero(result.query4[1].hour12, result.query5[1].hour12));
            ds2.push(ns.divideIfNotByZero(result.query4[1].hour13, result.query5[1].hour13));
            ds2.push(ns.divideIfNotByZero(result.query4[1].hour14, result.query5[1].hour14));
            ds2.push(ns.divideIfNotByZero(result.query4[1].hour15, result.query5[1].hour15));
            ds2.push(ns.divideIfNotByZero(result.query4[1].hour16, result.query5[1].hour16));
            ds2.push(ns.divideIfNotByZero(result.query4[1].hour17, result.query5[1].hour17));
            ds2.push(ns.divideIfNotByZero(result.query4[1].hour18, result.query5[1].hour18));
            ds2.push(ns.divideIfNotByZero(result.query4[1].hour19, result.query5[1].hour19));
            datasets.push({
                label: result.query4[1].version,
                fillColor: "rgba(151,205,187,0.2)",
                strokeColor: "rgba(151,205,187,1)",
                pointColor: "rgba(151,205,187,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,205,187,1)",
                data: ds2
            });
        }
        if (result.query2.length > 2) {
            ds3.push(ns.divideIfNotByZero(result.query4[2].hour07, result.query5[2].hour07));
            ds3.push(ns.divideIfNotByZero(result.query4[2].hour08, result.query5[2].hour08));
            ds3.push(ns.divideIfNotByZero(result.query4[2].hour09, result.query5[2].hour09));
            ds3.push(ns.divideIfNotByZero(result.query4[2].hour10, result.query5[2].hour10));
            ds3.push(ns.divideIfNotByZero(result.query4[2].hour11, result.query5[2].hour11));
            ds3.push(ns.divideIfNotByZero(result.query4[2].hour12, result.query5[2].hour12));
            ds3.push(ns.divideIfNotByZero(result.query4[2].hour13, result.query5[2].hour13));
            ds3.push(ns.divideIfNotByZero(result.query4[2].hour14, result.query5[2].hour14));
            ds3.push(ns.divideIfNotByZero(result.query4[2].hour15, result.query5[2].hour15));
            ds3.push(ns.divideIfNotByZero(result.query4[2].hour16, result.query5[2].hour16));
            ds3.push(ns.divideIfNotByZero(result.query4[2].hour17, result.query5[2].hour17));
            ds3.push(ns.divideIfNotByZero(result.query4[2].hour18, result.query5[2].hour18));
            ds3.push(ns.divideIfNotByZero(result.query4[2].hour19, result.query5[2].hour19));
            datasets.push({
                label: result.query4[2].version,
                fillColor: "rgba(200,200,200,0.2)",
                strokeColor: "rgba(200,200,200,1)",
                pointColor: "rgba(200,200,200,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(200,200,200,1)",
                data: ds3
            });
        }

        // create line chart data object with populated datasets
        var data = {
            labels: labels,
            datasets: datasets
        };

        // (re)create the canvas element for the line chart (only reliable way to regenerate line chart without an overlay issue)
        $('#myLineChart3').remove();
        $('#myLineChartContainer3').append('<canvas id="myLineChart3" height="400" width="979"><canvas>');

        // create line chart object, passing in data
        // : get 2d canvas drawing context and pass to chart.js line chart constructor
        var ctx = $('#myLineChart3').get(0).getContext("2d");
        var myLineChart = new Chart(ctx).Line(data, {
            legendTemplate:
                '<ul class="<%=name.toLowerCase()%>-legend">' +
                    '<% for (var i=0; i<datasets.length; i++){%>' +
                        '<li><span class="badge" style="margin-right: 5px; background-color:<%=datasets[i].strokeColor%>">•</span><%if(datasets[i].label){%><%=datasets[i].label%><%}%>' +
                        '</li>' +
                    '<%}%>' +
                '</ul>'
        });

        // (re)generate the line chart legend
        $('#myLineChartLegend3').empty();
        $('#myLineChartLegend3').append(myLineChart.generateLegend());
    };

    ns.onRefreshOptions = function () {
        ns.getReport();
    };

    ns.getOptions();

}(app, $));