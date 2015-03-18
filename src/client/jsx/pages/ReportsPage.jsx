var ReportsPage = React.createClass({
    getInitialState: function () {
        return {
            options: null,
            criteria_report: 'Recent Versions Comparison',
            criteria_product: null,
            criteria_environment: null,
            reportData: null
        };
    },
    componentDidMount: function () {
        this.getReportOptions();
    },
    canvasNeedsRender: false,
    componentDidUpdate: function () {
        if (this.canvasNeedsRender) {
            this.canvasNeedsRender = false;
            this.renderReport();
        }
    },
    render: function () {
        
        var options = this.state.options;
        var reportData = this.state.reportData;
        
        if (options === null) {
            return null;   
        }
        
        var reports = this.getReports(options).map( function (item) {
            return (<option value={item}>{item}</option>);
        });
        
        var products = this.getProducts(options).map( function (item) {
            return (<option value={item}>{item}</option>);
        });
            
        var environments = this.getEnvironments(options, this.state.criteria_product).map( function (item) {
            return (<option value={item}>{item}</option>);
        });
            
        var reportDOM = [];
        if (reportData) {
            reportDOM.push(
                <div>
                    <h3 id="headingChart">Version Comparison Error Occurrences</h3>
                    <hr />
                    <div id="myLineChartContainer">
                        <canvas id="myLineChart" width="970" height="400"></canvas>
                    </div>
                    <div id="myLineChartLegend">

                    </div>
                </div>
            );
            reportDOM.push(
                <div>
                    <h3 id="headingChart2">Version Comparison Users Affected</h3>
                    <hr />
                    <div id="myLineChartContainer2">
                        <canvas id="myLineChart2" width="970" height="400"></canvas>
                    </div>
                    <div id="myLineChartLegend2">

                    </div>
                </div>
            );
            reportDOM.push(
                <div>
                    <h3 id="headingChart3">Version Comparison Types of Errors</h3>
                    <hr />
                    <div id="myLineChartContainer3">
                        <canvas id="myLineChart3" width="970" height="400"></canvas>
                    </div>
                    <div id="myLineChartLegend3">

                    </div>
                </div>
            );
        }

        return (
            <div className="row">
                <div id="criteria" className="expanded">
                    <form className="form-horizontal" role="form">
                        <div className="form-group">
                            <label for="selectReport" className="col-sm-4 control-label">Product</label>
                            <div className="col-sm-8">
                                <select id="selectReport" className="form-control" value={this.state.criteria_report} onChange={this.handleCriteriaChange}>
                                    {reports}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="selectProduct" className="col-sm-4 control-label">Product</label>
                            <div className="col-sm-8">
                                <select id="selectProduct" className="form-control" value={this.state.criteria_product} onChange={this.handleCriteriaChange}>
                                    {products}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="selectEnvironment" className="col-sm-4 control-label">Environment</label>
                            <div className="col-sm-8">
                                <select id="selectEnvironment" className="form-control" value={this.state.criteria_environment} onChange={this.handleCriteriaChange}>
                                    {environments}
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div id="view" className="with-criteria">
                    {reportDOM}
                </div>
            </div>
        );
    },
    openErrorHistory: function (field, row) {
        if (field === 'errorType') {
            this.popupErrorDetails(row.errorType, '', '');
        } else if (field === 'objectName') {
            this.popupErrorDetails('', row.objectName, '');
        } else {
            this.popupErrorDetails('', row.objectName, row.subName);
        }
    },
    handleCriteriaChange: function (event) {
        
        var stateChange = { reportData: null };
        
        if (event.target.id === 'selectReport') {
            stateChange.criteria_report = event.target.value;
        } else if (event.target.id === 'selectProduct') {
            stateChange.criteria_product = event.target.value;
            stateChange.criteria_environment = this.getEnvironments(this.state.options, stateChange.criteria_product)[0];
        } else if (event.target.id === 'selectEnvironment') {
            stateChange.criteria_environment = event.target.value;
        }

        this.getReportData(
            stateChange.criteria_product || this.state.criteria_product, 
            stateChange.criteria_environment || this.state.criteria_environment, 
            stateChange.criteria_version || this.state.criteria_version);

        this.setState(stateChange);
    },
    getReportData: function (report, product, environment) {
        $.ajax({
            context: this,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + app.getAccessToken()
            },
            url: app.HOST_NAME + '/api/reports' +
                '?report=' + encodeURIComponent(report) +
                '&product=' + encodeURIComponent(product) +
                '&environment=' + encodeURIComponent(environment)
        }).done(function (result) {
            
            // flag canvas for rerender
            this.canvasNeedsRender = true;
            
            this.setState({ reportData: result });

        }).fail(function (jqXHR, textStatus, errorThrown) {
            // notify error
            toastr.error(jqXHR.responseText || textStatus, 'System Error');
        });
    },
    renderReport: function () {
        var labels = [];
        var data = this.state.reportData;
        
        this.createChart1(data);
        this.createChart2(data);
        this.createChart3(data);
    },
    divideIfNotByZero: function (val1, val2) {
        if (val1 === 0 || val2 === 0) {
            return 0;
        } else {
            return val1 / val2;
        }
    },
    createChart1: function (result) {
        var labels = ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
        var ds1 = [];
        var ds2 = [];
        var ds3 = [];
        var datasets = [];

        // populate datasets
        ds1.push(this.divideIfNotByZero(result.query2[0].hour07, result.query5[0].hour07));
        ds1.push(this.divideIfNotByZero(result.query2[0].hour08, result.query5[0].hour08));
        ds1.push(this.divideIfNotByZero(result.query2[0].hour09, result.query5[0].hour09));
        ds1.push(this.divideIfNotByZero(result.query2[0].hour10, result.query5[0].hour10));
        ds1.push(this.divideIfNotByZero(result.query2[0].hour11, result.query5[0].hour11));
        ds1.push(this.divideIfNotByZero(result.query2[0].hour12, result.query5[0].hour12));
        ds1.push(this.divideIfNotByZero(result.query2[0].hour13, result.query5[0].hour13));
        ds1.push(this.divideIfNotByZero(result.query2[0].hour14, result.query5[0].hour14));
        ds1.push(this.divideIfNotByZero(result.query2[0].hour15, result.query5[0].hour15));
        ds1.push(this.divideIfNotByZero(result.query2[0].hour16, result.query5[0].hour16));
        ds1.push(this.divideIfNotByZero(result.query2[0].hour17, result.query5[0].hour17));
        ds1.push(this.divideIfNotByZero(result.query2[0].hour18, result.query5[0].hour18));
        ds1.push(this.divideIfNotByZero(result.query2[0].hour19, result.query5[0].hour19));
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
            ds2.push(this.divideIfNotByZero(result.query2[1].hour07, result.query5[1].hour07));
            ds2.push(this.divideIfNotByZero(result.query2[1].hour08, result.query5[1].hour08));
            ds2.push(this.divideIfNotByZero(result.query2[1].hour09, result.query5[1].hour09));
            ds2.push(this.divideIfNotByZero(result.query2[1].hour10, result.query5[1].hour10));
            ds2.push(this.divideIfNotByZero(result.query2[1].hour11, result.query5[1].hour11));
            ds2.push(this.divideIfNotByZero(result.query2[1].hour12, result.query5[1].hour12));
            ds2.push(this.divideIfNotByZero(result.query2[1].hour13, result.query5[1].hour13));
            ds2.push(this.divideIfNotByZero(result.query2[1].hour14, result.query5[1].hour14));
            ds2.push(this.divideIfNotByZero(result.query2[1].hour15, result.query5[1].hour15));
            ds2.push(this.divideIfNotByZero(result.query2[1].hour16, result.query5[1].hour16));
            ds2.push(this.divideIfNotByZero(result.query2[1].hour17, result.query5[1].hour17));
            ds2.push(this.divideIfNotByZero(result.query2[1].hour18, result.query5[1].hour18));
            ds2.push(this.divideIfNotByZero(result.query2[1].hour19, result.query5[1].hour19));
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
            ds3.push(this.divideIfNotByZero(result.query2[2].hour07, result.query5[2].hour07));
            ds3.push(this.divideIfNotByZero(result.query2[2].hour08, result.query5[2].hour08));
            ds3.push(this.divideIfNotByZero(result.query2[2].hour09, result.query5[2].hour09));
            ds3.push(this.divideIfNotByZero(result.query2[2].hour10, result.query5[2].hour10));
            ds3.push(this.divideIfNotByZero(result.query2[2].hour11, result.query5[2].hour11));
            ds3.push(this.divideIfNotByZero(result.query2[2].hour12, result.query5[2].hour12));
            ds3.push(this.divideIfNotByZero(result.query2[2].hour13, result.query5[2].hour13));
            ds3.push(this.divideIfNotByZero(result.query2[2].hour14, result.query5[2].hour14));
            ds3.push(this.divideIfNotByZero(result.query2[2].hour15, result.query5[2].hour15));
            ds3.push(this.divideIfNotByZero(result.query2[2].hour16, result.query5[2].hour16));
            ds3.push(this.divideIfNotByZero(result.query2[2].hour17, result.query5[2].hour17));
            ds3.push(this.divideIfNotByZero(result.query2[2].hour18, result.query5[2].hour18));
            ds3.push(this.divideIfNotByZero(result.query2[2].hour19, result.query5[2].hour19));
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
    },
    createChart2: function (result) {
        var labels = ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
        var ds1 = [];
        var ds2 = [];
        var ds3 = [];
        var datasets = [];

        // populate datasets
        ds1.push(this.divideIfNotByZero(result.query3[0].hour07, result.query5[0].hour07));
        ds1.push(this.divideIfNotByZero(result.query3[0].hour08, result.query5[0].hour08));
        ds1.push(this.divideIfNotByZero(result.query3[0].hour09, result.query5[0].hour09));
        ds1.push(this.divideIfNotByZero(result.query3[0].hour10, result.query5[0].hour10));
        ds1.push(this.divideIfNotByZero(result.query3[0].hour11, result.query5[0].hour11));
        ds1.push(this.divideIfNotByZero(result.query3[0].hour12, result.query5[0].hour12));
        ds1.push(this.divideIfNotByZero(result.query3[0].hour13, result.query5[0].hour13));
        ds1.push(this.divideIfNotByZero(result.query3[0].hour14, result.query5[0].hour14));
        ds1.push(this.divideIfNotByZero(result.query3[0].hour15, result.query5[0].hour15));
        ds1.push(this.divideIfNotByZero(result.query3[0].hour16, result.query5[0].hour16));
        ds1.push(this.divideIfNotByZero(result.query3[0].hour17, result.query5[0].hour17));
        ds1.push(this.divideIfNotByZero(result.query3[0].hour18, result.query5[0].hour18));
        ds1.push(this.divideIfNotByZero(result.query3[0].hour19, result.query5[0].hour19));
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
            ds2.push(this.divideIfNotByZero(result.query3[1].hour07, result.query5[1].hour07));
            ds2.push(this.divideIfNotByZero(result.query3[1].hour08, result.query5[1].hour08));
            ds2.push(this.divideIfNotByZero(result.query3[1].hour09, result.query5[1].hour09));
            ds2.push(this.divideIfNotByZero(result.query3[1].hour10, result.query5[1].hour10));
            ds2.push(this.divideIfNotByZero(result.query3[1].hour11, result.query5[1].hour11));
            ds2.push(this.divideIfNotByZero(result.query3[1].hour12, result.query5[1].hour12));
            ds2.push(this.divideIfNotByZero(result.query3[1].hour13, result.query5[1].hour13));
            ds2.push(this.divideIfNotByZero(result.query3[1].hour14, result.query5[1].hour14));
            ds2.push(this.divideIfNotByZero(result.query3[1].hour15, result.query5[1].hour15));
            ds2.push(this.divideIfNotByZero(result.query3[1].hour16, result.query5[1].hour16));
            ds2.push(this.divideIfNotByZero(result.query3[1].hour17, result.query5[1].hour17));
            ds2.push(this.divideIfNotByZero(result.query3[1].hour18, result.query5[1].hour18));
            ds2.push(this.divideIfNotByZero(result.query3[1].hour19, result.query5[1].hour19));
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
            ds3.push(this.divideIfNotByZero(result.query3[2].hour07, result.query5[2].hour07));
            ds3.push(this.divideIfNotByZero(result.query3[2].hour08, result.query5[2].hour08));
            ds3.push(this.divideIfNotByZero(result.query3[2].hour09, result.query5[2].hour09));
            ds3.push(this.divideIfNotByZero(result.query3[2].hour10, result.query5[2].hour10));
            ds3.push(this.divideIfNotByZero(result.query3[2].hour11, result.query5[2].hour11));
            ds3.push(this.divideIfNotByZero(result.query3[2].hour12, result.query5[2].hour12));
            ds3.push(this.divideIfNotByZero(result.query3[2].hour13, result.query5[2].hour13));
            ds3.push(this.divideIfNotByZero(result.query3[2].hour14, result.query5[2].hour14));
            ds3.push(this.divideIfNotByZero(result.query3[2].hour15, result.query5[2].hour15));
            ds3.push(this.divideIfNotByZero(result.query3[2].hour16, result.query5[2].hour16));
            ds3.push(this.divideIfNotByZero(result.query3[2].hour17, result.query5[2].hour17));
            ds3.push(this.divideIfNotByZero(result.query3[2].hour18, result.query5[2].hour18));
            ds3.push(this.divideIfNotByZero(result.query3[2].hour19, result.query5[2].hour19));
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
    },
    createChart3: function (result) {
        var labels = ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
        var ds1 = [];
        var ds2 = [];
        var ds3 = [];
        var datasets = [];

        // populate datasets
        ds1.push(this.divideIfNotByZero(result.query4[0].hour07, result.query5[0].hour07));
        ds1.push(this.divideIfNotByZero(result.query4[0].hour08, result.query5[0].hour08));
        ds1.push(this.divideIfNotByZero(result.query4[0].hour09, result.query5[0].hour09));
        ds1.push(this.divideIfNotByZero(result.query4[0].hour10, result.query5[0].hour10));
        ds1.push(this.divideIfNotByZero(result.query4[0].hour11, result.query5[0].hour11));
        ds1.push(this.divideIfNotByZero(result.query4[0].hour12, result.query5[0].hour12));
        ds1.push(this.divideIfNotByZero(result.query4[0].hour13, result.query5[0].hour13));
        ds1.push(this.divideIfNotByZero(result.query4[0].hour14, result.query5[0].hour14));
        ds1.push(this.divideIfNotByZero(result.query4[0].hour15, result.query5[0].hour15));
        ds1.push(this.divideIfNotByZero(result.query4[0].hour16, result.query5[0].hour16));
        ds1.push(this.divideIfNotByZero(result.query4[0].hour17, result.query5[0].hour17));
        ds1.push(this.divideIfNotByZero(result.query4[0].hour18, result.query5[0].hour18));
        ds1.push(this.divideIfNotByZero(result.query4[0].hour19, result.query5[0].hour19));
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
            ds2.push(this.divideIfNotByZero(result.query4[1].hour07, result.query5[1].hour07));
            ds2.push(this.divideIfNotByZero(result.query4[1].hour08, result.query5[1].hour08));
            ds2.push(this.divideIfNotByZero(result.query4[1].hour09, result.query5[1].hour09));
            ds2.push(this.divideIfNotByZero(result.query4[1].hour10, result.query5[1].hour10));
            ds2.push(this.divideIfNotByZero(result.query4[1].hour11, result.query5[1].hour11));
            ds2.push(this.divideIfNotByZero(result.query4[1].hour12, result.query5[1].hour12));
            ds2.push(this.divideIfNotByZero(result.query4[1].hour13, result.query5[1].hour13));
            ds2.push(this.divideIfNotByZero(result.query4[1].hour14, result.query5[1].hour14));
            ds2.push(this.divideIfNotByZero(result.query4[1].hour15, result.query5[1].hour15));
            ds2.push(this.divideIfNotByZero(result.query4[1].hour16, result.query5[1].hour16));
            ds2.push(this.divideIfNotByZero(result.query4[1].hour17, result.query5[1].hour17));
            ds2.push(this.divideIfNotByZero(result.query4[1].hour18, result.query5[1].hour18));
            ds2.push(this.divideIfNotByZero(result.query4[1].hour19, result.query5[1].hour19));
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
            ds3.push(this.divideIfNotByZero(result.query4[2].hour07, result.query5[2].hour07));
            ds3.push(this.divideIfNotByZero(result.query4[2].hour08, result.query5[2].hour08));
            ds3.push(this.divideIfNotByZero(result.query4[2].hour09, result.query5[2].hour09));
            ds3.push(this.divideIfNotByZero(result.query4[2].hour10, result.query5[2].hour10));
            ds3.push(this.divideIfNotByZero(result.query4[2].hour11, result.query5[2].hour11));
            ds3.push(this.divideIfNotByZero(result.query4[2].hour12, result.query5[2].hour12));
            ds3.push(this.divideIfNotByZero(result.query4[2].hour13, result.query5[2].hour13));
            ds3.push(this.divideIfNotByZero(result.query4[2].hour14, result.query5[2].hour14));
            ds3.push(this.divideIfNotByZero(result.query4[2].hour15, result.query5[2].hour15));
            ds3.push(this.divideIfNotByZero(result.query4[2].hour16, result.query5[2].hour16));
            ds3.push(this.divideIfNotByZero(result.query4[2].hour17, result.query5[2].hour17));
            ds3.push(this.divideIfNotByZero(result.query4[2].hour18, result.query5[2].hour18));
            ds3.push(this.divideIfNotByZero(result.query4[2].hour19, result.query5[2].hour19));
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
    },
    getReportOptions: function () {
        // ajax call: get http://~/api/shipping
        $.ajax({
            context: this,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + appapp.getAccessToken()
            },
            url: app.HOST_NAME + '/api/reportoptions'
        }).done(function (options) {
            
            var selectedReport = this.state.criteria_report;
            var selectedProduct = null;
            var selectedEnvironment = null;
            
            if (options && options.length > 0) {
                var selectedProduct = this.getProducts(options)[0];
                var selectedEnvironment = this.getEnvironments(options, selectedProduct)[0];
                
                // get the hourly summary
                this.getReportData(selectedReport, selectedProduct, selectedEnvironment);
            }
            
            // set state : first available product/env/ver or null
            this.setState({ 
                options: options,
                criteria_product: selectedProduct,
                criteria_environment: selectedEnvironment
            });
        });
    },
    getReports: function () {
        var reports = [
            'Recent Versions Comparison'
        ];

        return reports;
    },
    getProducts: function (options) {
        var products = [];
        
        for (var index = 0; index < options.length; index++) {
            if (products.indexOf(options[index].product) === -1) {
                products.push(options[index].product);
            }
        }
        
        return products;
    },
    getEnvironments: function (options, product) {
        var environments = [];
        
        for (var index = 0; index < options.length; index++) {
            if (options[index].product === product && environments.indexOf(options[index].environment) === -1) {
                environments.push(options[index].environment);
            }
        }
        
        return environments;
    },
});