var StatusPage = React.createClass({
    getInitialState: function () {
        return {
            options: null,
            criteria_product: null,
            criteria_environment: null,
            criteria_version: null,
            criteria_from: null,
            criteria_to: null,
            fromOptions: [],
            toOptions: [],
            hourlySummaryResult: null,
            errorSummaryResult: null,
        };
    },
    componentDidMount: function () {
        this.getOptions();
    },
    hourlySummaryNeedsCanvasRender: false,
    errorSummaryNeedsCanvasRender: false,
    componentDidUpdate: function () {
        if (this.hourlySummaryNeedsCanvasRender) {
            this.paintChart_HourlySummary();
            this.hourlySummaryNeedsCanvasRender = false;
        }
        if (this.errorSummaryNeedsCanvasRender) {
            this.paintChart_ErrorSummary();
            this.errorSummaryNeedsCanvasRender = false;
        }
    },
    render: function () {
        
        var options = this.state.options;
        var hourlySummaryResult = this.state.hourlySummaryResult;
        var errorSummaryResult = this.state.errorSummaryResult;
        
        if (options === null) {
            return null;   
        }
        
        var products = this.getProducts(options).map( function (item) {
            return (<option value={item}>{item}</option>);
        });
            
        var environments = this.getEnvironments(options, this.state.criteria_product).map( function (item) {
            return (<option value={item}>{item}</option>);
        });
            
        var versions = this.getVersions(options, this.state.criteria_product, this.state.criteria_environment).map( function (item) {
            return (<option value={item}>{item}</option>);
        });
            
        var froms = this.state.fromOptions.map( function (item) {
            return (<option value={item.value}>{item.label}</option>);
        });
                        
        var tos = this.state.toOptions.map( function (item) {
            return (<option value={item.value}>{item.label}</option>);
        });
            
        var hourlySummary = null;
        if (hourlySummaryResult) {
            hourlySummary = (
                <div>
                    <h3 id="headingHourly">Hourly Summary</h3>
                    <hr />
                    <div id="myLineChartContainer">
                        <canvas id="myLineChart" width="970" height="400"></canvas>
                    </div>
                    <div id="myLineChartLegend">

                    </div>
                </div>
            );
        }
            
        var errorSummary = null;
        if (errorSummaryResult) {
            errorSummary = (
                <div id="errorSummarySection">
                    <h3>Error Summary</h3>
                    <hr />
                    <div id="myPieChartContainer">
                        <canvas id="myPieChart" width="600" height="300"></canvas>
                    </div>
                    <div id="myPieChartLegend"></div>

                    <DataTable sortBy={'latestOccurrence'} sortAsc={false} data={this.state.errorSummaryResult.details} columnDefinitions={[
                        { field: 'errorType', display: 'Type', onCellClick: this.openErrorHistory},
                        { field: 'errorDescription', display: 'Description'},
                        { field: 'objectName', display: 'Object', onCellClick: this.openErrorHistory},
                        { field: 'subName', display: 'Sub', onCellClick: this.openErrorHistory},
                        { field: 'timesOccurred', display: '# Errors'},
                        { field: 'latestOccurrence', display: 'Latest'},
                        { field: 'usersAffected', display: 'Users Affected'}
                    ]} />
                </div>
            );
        }
        
        return (
            <div className="row">
                <div id="criteria" className="expanded">
                    <form className="form-horizontal" role="form">
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
                        <div className="form-group">
                            <label for="selectVersion" className="col-sm-4 control-label">Version</label>
                            <div className="col-sm-8">
                                <select id="selectVersion" className="form-control" value={this.state.criteria_version} onChange={this.handleCriteriaChange}>
                                    {versions}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="selectFrom" className="col-sm-4 control-label">From</label>
                            <div className="col-sm-8">
                                <select id="selectFrom" className="form-control" value={this.state.criteria_from} onChange={this.handleCriteriaChange}>
                                    {froms}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="selectTo" className="col-sm-4 control-label">To</label>
                            <div className="col-sm-8">
                                <select id="selectTo" className="form-control" value={this.state.criteria_to}  onChange={this.handleCriteriaChange}>
                                    {tos}
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div id="view" className="with-criteria">
                    {hourlySummary}
                    {errorSummary}
                </div>
                <ErrorHistoryModal ref="errorHistoryModal" />
            </div>
        );
    },
    selectedProductChanged: function () {
        app.getHourlySummary(); 
        app.refreshOptions('Product');
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
        
        
        var stateChange = { errorSummaryResult: null };
        
        var needsFreshData = false;
        if (event.target.id === 'selectProduct') {
            needsFreshData = true;
            stateChange.criteria_product = event.target.value;
            stateChange.criteria_environment = this.getEnvironments(this.state.options, stateChange.criteria_product)[0];
            stateChange.criteria_version = this.getVersions(this.state.options, stateChange.criteria_product, stateChange.criteria_environment)[0];
        } else if (event.target.id === 'selectEnvironment') {
            needsFreshData = true;
            stateChange.criteria_environment = event.target.value;
            stateChange.criteria_version = this.getVersions(this.state.options, this.state.criteria_product, stateChange.criteria_environment)[0];
        } else if (event.target.id === 'selectVersion') {
            needsFreshData = true;
            stateChange.criteria_version = event.target.value;
        } else if (event.target.id === 'selectFrom') {
            stateChange.criteria_from = parseInt(event.target.value);
            if (stateChange.criteria_from >= this.state.criteria_to) {
                stateChange.criteria_to = stateChange.criteria_from + 1;
            }
        } else if (event.target.id === 'selectTo') {
            stateChange.criteria_to = parseInt(event.target.value);
            if (stateChange.criteria_to <= this.state.criteria_from) {
                stateChange.criteria_from = stateChange.criteria_to - 1;
            }
        }


        
        if (needsFreshData) {
            this.getHourlySummary(stateChange.criteria_product || this.state.criteria_product, 
                                  stateChange.criteria_environment || this.state.criteria_environment, 
                                  stateChange.criteria_version || this.state.criteria_version);
        } else {
            // no fresh data, just rerender the canvas based on selected date range
            this.hourlySummaryNeedsCanvasRender = true;
        }
        
        
        this.setState(stateChange);
    },
    getHourlySummary: function (product, environment, version) {
// ajax call: get http://~/api/hourlysummary
        $.ajax({
            context: this,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + app.getAccessToken()
            },
            url: app.HTTP + '://' + app.HOST_NAME + '/api/hourlysummary' +
                '?product=' + encodeURIComponent(product) +
                '&environment=' + encodeURIComponent(environment) +
                '&version=' + encodeURIComponent(version) +
                '&date='
        }).done(function (result) {
            
            // flag canvas for rerender
            this.hourlySummaryNeedsCanvasRender = true;
            
            // build from and to option lists
            var fromOptions = [];
            var toOptions = [];
            var selectedFrom = null;
            var selectedTo = null;
            
            if (result.timesOccurred.length > 0) {

                // only select up to the latest 36 data points
                var defaultStart = 0;
                if (result.timesOccurred.length > 36) {
                    defaultStart = result.timesOccurred.length - 36;
                }

                for (var i = 0; i < result.timesOccurred.length; i++) {

                    if (i === defaultStart) {
                        selectedFrom = { value: i, label: result.timesOccurred[i].key };
                    }
                    
                    if (i === 0) {
                        fromOptions.push({ value: i, label: result.timesOccurred[i].key });
                    } else if (i === result.timesOccurred.length - 1) {
                        selectedTo = { value: i, label: result.timesOccurred[i].key };
                        toOptions.push(selectedTo);
                    } else {
                        fromOptions.push({ value: i, label: result.timesOccurred[i].key });
                        toOptions.push({ value: i, label: result.timesOccurred[i].key });
                    }
                }
            }
            
            this.setState({ hourlySummaryResult: result, fromOptions: fromOptions, toOptions: toOptions, criteria_from: selectedFrom.value, criteria_to: selectedTo.value });

            //ns.refreshHourlySummary();

            //if (typeof preserveDetail !== 'undefined' && typeof ns.lastDateClicked !== 'undefined') {
            //    ns.getErrorSummary(ns.lastDateClicked, ns.lastHourClicked);
            //} else {
            //    $('#errorSummarySection').attr('hidden', true);
            //}

            //ns.poller = window.setInterval(ns.pollNeedsRefresh, 15000);

        }).fail(function (jqXHR, textStatus, errorThrown) {
            // notify error
            toastr.error(jqXHR.responseText || textStatus, 'System Error');
        });
    },
    paintChart_HourlySummary: function () {
        var labels = [];
        var ds1 = [];
        var ds2 = [];
        var ds3 = [];
        var data = this.state.hourlySummaryResult;
        
        // populate datasets for selected label range
        for (var i = parseInt(this.state.criteria_from) ; i <= parseInt(this.state.criteria_to) ; i++) {
            labels.push(data.timesOccurred[i].key);
            ds1.push(data.timesOccurred[i].value);
            ds2.push(data.procsAffected[i].value);
            ds3.push(data.usersAffected[i].value);
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

        // (re)create the canvas element for the line chart (seems to be the only reliable way to regenerate line chart without an overlay issue)
        $('#myLineChart').remove();
        $('#myLineChartContainer').append('<canvas id="myLineChart" height="400" width="979"><canvas>');

        // create line chart object, passing in data
        // : get 2d canvas drawing context and pass to chart.js line chart constructor
        var ctx = $('#myLineChart').get(0).getContext("2d");
        var myLineChart = new Chart(ctx).Line(data, {
            scaleFontColor: "rgb(100,100,100)",
            scaleLineColor: "rgba(60,60,60,0.4)",
            ///Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines: true,
            //String - Colour of the grid lines
            scaleGridLineColor: "rgba(80,80,80,.1)",
            //Number - Width of the grid lines
            scaleGridLineWidth: 1,

            legendTemplate:
                '<ul class="<%=name.toLowerCase()%>-legend">' +
                    '<% for (var i=0; i<datasets.length; i++){%>' +
                        '<li><span class="badge" style="margin-right: 5px; background-color:<%=datasets[i].strokeColor%>">•</span><%if(datasets[i].label){%><%=datasets[i].label%><%}%>' +
                        '</li>' +
                    '<%}%>' +
                '</ul>'
        });

        // store reference to myLineChart
        this.myLineChart = myLineChart;

        // handle the label click event of the line chart
        $('#myLineChart').click(this.handleLineChartLabelClick);

        // (re)generate the line chart legend
        $('#myLineChartLegend').empty();
        $('#myLineChartLegend').append(myLineChart.generateLegend());
    },
    getErrorSummary: function (product, environment, version, date, hour) {
        // ajax call: get http://~/api/shipping
        $.ajax({
            context: this,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + app.getAccessToken()
            },
            url: app.HTTP + '://' + app.HOST_NAME + '/api/errorsummary' +
                '?product=' + encodeURIComponent(product) +
                '&environment=' + encodeURIComponent(environment) +
                '&version=' + encodeURIComponent(version) +
                '&date=' + date +
                '&hour=' + hour + '&objectName='
        })
        .done(function (result) {
            
            this.errorSummaryNeedsCanvasRender = true;
            this.setState({ errorSummaryResult: result });

        });
    },
    paintChart_ErrorSummary: function () {
        
        var result = this.state.errorSummaryResult;
        
        var ds = [];
        var colors = ['rgb(247, 70, 74)', 'rgb(70, 191, 189)', 'rgb(253, 180, 92)', 'rgb(121,157,205)', 'rgb(135, 76, 194)'];
        var highlights = ['rgba(247, 70, 74, 0.7)', 'rgba(70, 191, 189, 0.7)', 'rgba(253, 180, 92, 0.7)', 'rgba(121,157,205,0.7)', 'rgba(135, 76, 194,0.7)'];

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
            //Boolean - Whether we should show a stroke on each segment
            segmentShowStroke: true,

            //String - The colour of each segment stroke
            segmentStrokeColor: "rgb(70,70,70)",

            //Number - The width of each segment stroke
            segmentStrokeWidth: 2,

            //Number - The percentage of the chart that we cut out of the middle
            //percentageInnerCutout: 50, // This is 0 for Pie charts

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
    },
    getOptions: function () {
        // ajax call: get http://~/api/shipping
        $.ajax({
            context: this,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + app.getAccessToken()
            },
            url: app.HTTP + '://' + app.HOST_NAME + '/api/options'
        }).done(function (options) {
            
            var selectedProduct = null;
            var selectedEnvironment = null;
            var selectedVersion = null;
            
            if (options && options.length > 0) {
                var selectedProduct = this.getProducts(options)[0];
                var selectedEnvironment = this.getEnvironments(options, selectedProduct)[0];
                var selectedVersion = this.getVersions(options, selectedProduct, selectedEnvironment)[0];
                
                // get the hourly summary
                this.getHourlySummary(selectedProduct, selectedEnvironment, selectedVersion);
            }
            
            // set state : first available product/env/ver or null
            this.setState({ 
                options: options, 
                criteria_product: selectedProduct,
                criteria_environment: selectedEnvironment,
                criteria_version: selectedVersion
            });
        });
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
    getVersions: function (options, product, environment) {
        var versions = [];
        
        for (var index = 0; index < options.length; index++) {
            if (options[index].product === product 
                && options[index].environment === environment 
                && versions.indexOf(options[index].version) === -1) {
                
                versions.push(options[index].version);
            }
        }
        
        return versions;
    },
    handleLineChartLabelClick: function (evt) {
        var activePoints = this.myLineChart.getPointsAtEvent(evt);

        // comment this for a quick way to generate an error
        if (activePoints.length === 0) {
            return;
        }

        // remember which values were clicked for later polling
        this.lastDateClicked = activePoints[0].label.split(" ")[0].replace('/', '-').replace('/', '-');
        this.lastHourClicked = activePoints[0].label.split(" ")[1];

        // get error details
        this.getErrorSummary(this.state.criteria_product, this.state.criteria_environment, this.state.criteria_version, this.lastDateClicked, this.lastHourClicked);
    },
    popupErrorDetails: function (errorType, objectName, subName) {
        $.ajax({
            context: this,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + app.getAccessToken()
            },
            url: app.HTTP + '://' + app.HOST_NAME + '/api/errorhistory' +
                '?environment=' + encodeURIComponent(this.state.criteria_environment) +
                '&version=' +
                '&errorType=' + errorType +
                '&objectName=' + objectName +
                '&subName=' + subName +
                '&userId='
        }).done(function (result) {
            
            this.refs.errorHistoryModal.open(result);

        });
    },
    pollNeedsRefresh: function () {
        // ajax call: get http://~/api/shipping
        $.ajax({
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + app.getAccessToken()
            },
            url: app.HTTP + '://' + app.HOST_NAME + '/api/needsrefresh' +
                '?product=' + encodeURIComponent(this.state.criteria_product) +
                '&environment=' + encodeURIComponent(this.state.criteria_environment) +
                '&version=' + encodeURIComponent(this.state.criteria_version) +
                '&date=' + this.state.hourlySummaryResult.latestPoll
        }).done(function (needsRefresh) {
            if (needsRefresh) {
                this.getHourlySummary(this.state.criteria_product, this.state.criteria_environment, this.state.criteria_version, true);
            }
        });
    }
});