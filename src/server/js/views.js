var ContentEditable = React.createClass({displayName: "ContentEditable",
    render: function () {
        return React.createElement("div", {
            style: {display: 'inline'}, 
            onInput: this.emitChange, 
            onBlur: this.emitChange, 
            contentEditable: true, 
            dangerouslySetInnerHTML: {__html: this.props.html}});    
    },
    shouldComponentUpdate: function(nextProps){
        //return nextProps.html !== this.getDOMNode().innerHTML;
        return nextProps.html !== this.props.html;
    },
    emitChange: function () {
        var html = this.getDOMNode().innerHTML;
        if (this.props.onChange && html !== this.lastHtml) {
            this.props.onChange({
                target: {
                    value: html
                }
            });
        }
        this.lastHtml = html;    
    }
});
var DataTable = React.createClass({displayName: "DataTable",
    getInitialState: function () {
        return { 
            sortBy: (this.props.sortBy || this.props.columnDefinitions[0].field), 
            sortAsc: true
        };
    },
    componentDidUpdate: function () {
        $('[data-toggle="tooltip"]').tooltip();
    },
    render: function () {
        // states
        var sortBy = this.state.sortBy;
        var sortAsc = this.state.sortAsc;
        
        // props
        var colDefs = this.props.columnDefinitions;
        var data = _.sortBy(this.props.data, function(item){ return item[sortBy]; });
        if (!sortAsc) {
            data.reverse();   
        }
        
        // minimum data requirement
        if (!colDefs) {
            return null;   
        }
        
        var domHeadColumns = [], domRows = [], i, j;
        
        // define columns
        for (i = 0; i < colDefs.length; i++) {
        
            var domHeadColumn = (
                React.createElement("th", {className: 'text-' + (colDefs[i].justify || 'left')}, 
                    React.createElement("a", {href: "javascript:;", onClick: this.sort.bind(null, colDefs[i].field)}, 
                        colDefs[i].display, " ", React.createElement("i", {className: sortBy === colDefs[i].field ? (sortAsc ? 'fa fa-sort-asc' : 'fa fa-sort-desc') : ''})
                    )
                )
            );
            domHeadColumns.push(domHeadColumn);
        };
    
        // todo: sort data, probably w/ underscore
        
        if (data) {
            // define rows
            for (j = 0; j < data.length; j++) {
                var domBodyColumns = [];

                for (i = 0; i < colDefs.length; i++) {

                    var cellContent = null;
                    var text = data[j][colDefs[i].field];
                    if (colDefs[i].limitLength) {
                        if (text.length > colDefs[i].limitLength) {
                            text = text.slice(0,colDefs[i].limitLength);
                        }
                    }
                    if (colDefs[i].onRender) {
                        cellContent = colDefs[i].onRender(data[j], colDefs[i].field, j);
                    } else if (colDefs[i].onCellClick) {
                        cellContent = (
                            React.createElement("a", {href: "javascript:;", onClick: colDefs[i].onCellClick.bind(null, colDefs[i].field, data[j])}, 
                                React.createElement("span", {"data-toggle": "tooltip", "data-placement": "bottom", title: data[j][colDefs[i].field]}, text)
                            )
                        );
                    } else {
                        cellContent = (
                            React.createElement("span", {"data-toggle": "tooltip", "data-placement": "bottom", title: data[j][colDefs[i].field]}, text)
                        );
                    }

                    var domBodyColumn = (
                        React.createElement("td", {className: 'text-' + (colDefs[i].justify || 'left')}, 
                            cellContent
                        )
                    );

                    domBodyColumns.push(domBodyColumn);
                };

                var domRow = (
                    React.createElement("tr", null, 
                        domBodyColumns
                    )
                );
                domRows.push(domRow);
            }; 
        }

        
        
        return (
            React.createElement("table", {className: "table table-striped"}, 
                React.createElement("thead", null, 
                    React.createElement("tr", null, 
                        domHeadColumns
                    )
                ), 
                React.createElement("tbody", null, 
                    domRows
                )
            )
        );
    },
    sort: function (field) {
        var sortBy = this.state.sortBy;
        var sortAsc = this.state.sortAsc;
        if (field === sortBy) {
            sortAsc = !sortAsc;
        } else {
            sortBy = field;
            sortAsc = true;
        }
        
        this.setState({ sortBy: sortBy, sortAsc: sortAsc });
    }
});
/* DropdownMenu
 * ClassNames: dropdown, dropdown-[default,primary,success,info,warning,danger], dropdown-menu, open
 * Dependencies: jQuery, Bootstrap(CSS)
 */
var DropdownMenu = React.createClass({displayName: "DropdownMenu",
    getDefaultProps: function () {
        return {
          className: '',
          style: null,
          buttonContent: null,
          menuItems: [],
          open: false
        };
    },
    render: function () {
        var className = this.props.className;
        var buttonContent = this.props.buttonContent;
        var style = this.props.style;
        var menuItems = this.props.menuItems;
      
        if (className.length > 0) {
          className = ' ' + className; 
        }
      
        return (
            React.createElement("li", {ref: "dropdown", className: 'dropdown' + className, onClick: this.toggle}, 
                React.createElement("a", {href: "#", "data-toggle": "dropdown", className: "dropdown-toggle", style: style}, buttonContent), 
                React.createElement("ul", {className: "dropdown-menu"}, 
                  menuItems
                )
            )
        );
    },
    toggle: function () {
        var $win = $(window);
        var $box = $(this.refs.dropdown.getDOMNode());
      
        var handler = function(event) {	
            // handle click outside of the dropdown
            if ($box.has(event.target).length == 0 && !$box.is(event.target)) {
              $box.removeClass('open');
              $win.off("click.Bst", handler);
            }
		};
                    
        $box.toggleClass('open');
        $win.on("click.Bst", handler);
    }
});
var Modal = React.createClass({displayName: "Modal",
    getDefaultProps: function () { 
        return {
            backdrop: true, 
            buttons: [],
            keyboard: true, 
            show: true, 
            remote: ''
        }
    }, 
    render: function () {
        var buttons = this.props.buttons.map(function(button, index) {
            return React.createElement("button", {key: index, type: "button", className: 'btn btn-' + button.type, onClick: button.handler}, button.text)
        })
        return (
            React.createElement("div", {className: "modal fade"}, 
                React.createElement("div", {className: "modal-dialog"}, 
                    React.createElement("div", {className: "modal-content"}, 
                        React.createElement("div", {className: "modal-header"}, 
                            this.renderCloseButton(), React.createElement("strong", null, this.props.header)
                        ), 
                        React.createElement("div", {className: "modal-body scroll"}, 
                            this.props.children
                        ), 
                        React.createElement("div", {className: "modal-footer"}, 
                            buttons
                        )
                    )
                )
            )
        );
    },
    renderCloseButton: function () {
        return React.createElement("button", {type: "button", className: "close", onClick: this.hide, dangerouslySetInnerHTML: {__html: '&times'}})
    },
    hide: function () {
        var domThis = $(this.getDOMNode());
        domThis.removeClass('in');
      
        window.setTimeout(function() {
            domThis.css('display', 'none');
        }, 150);
    },
    show: function () {
        var domThis = $(this.getDOMNode());
        domThis.css('display', 'block');
        
        // ensure display: block is truly set before
        // adding the 'in' or else the animation does
        // not occur
        window.setTimeout(function() {
            domThis.addClass('in');
        }, 1);
    },
});
/* Panel
 * ClassNames: panel, panel-[default,primary,success,info,warning,danger], panel-collapse, in, collapse, collapsing, clickable, panel-title, overflow
 * Dependencies: jQuery, Bootstrap(CSS)
 * Props: children :: an array of keyed li elements
 *        type :: a string of one of the following: default, primary, success, info, warning, danger
 *        header :: an element or string
 */
var Panel = React.createClass({displayName: "Panel",
    getDefaultProps: function () {
      return { header: null, type: 'default'  };
    },
    componentDidMount: function () {
      this.rememberHeight();
    },
    componentDidUpdate: function () {
      this.rememberHeight();
    },
    render: function () {
        // props
        var children = this.props.children;
        var type = this.props.type;
        var header = this.props.header;

        return (
            React.createElement("div", {className: 'panel panel-' + type}, 
                React.createElement("div", {className: "panel-heading clickable", onClick: this.toggle}, 
                    React.createElement("h4", {className: "panel-title overflow"}, 
                        header
                    )
                ), 
                React.createElement("div", {ref: "collapsible", className: "panel-collapse collapse"}, 
                    children
                )
            )
        );
    },
    rememberHeight: function () {
      var domPanel = $(this.refs.collapsible.getDOMNode());
      this.props.height = domPanel.height();
    },
    toggle: function () {
        
        var domPanel = $(this.refs.collapsible.getDOMNode());
        
        // abort if in transition
        if (domPanel.hasClass('collapsing')) {
            return; 
        }
        
        if (domPanel.hasClass('in')) {
            // collapse panel
            domPanel.css('height', this.props.height + 'px')
                    .removeClass('collapse in')
                    .addClass('collapsing')
                    .attr('aria-expanded', false)['height'](0)
                    .css('height', '0');
            window.setTimeout(function() {
                domPanel.removeClass('collapsing')
                        .addClass('collapse');
            }, 350);
        } else {
            // expand panel
            domPanel.css('height', '0')
                    .removeClass('collapse')
                    .addClass('collapsing')
                    .attr('aria-expanded', true)['height'](0)
                    .css('height', this.props.height + 'px')
            window.setTimeout(function() {
                domPanel.removeClass('collapsing')
                        .addClass('collapse in')['height']('')
                        .css('height', null);
            }, 350);
        }
    }
});
var ErrorHistoryModal = React.createClass({displayName: "ErrorHistoryModal",
    getInitialState: function () {
        return {
            details: null,
            info: null
        };
    },
    render: function () {
        
        var nuggets = null;
        if (this.state.info) {
            nuggets = this.state.info.map(function (item) {
                return (
                    React.createElement("li", null, item)  
                );
            });
        }
        
        return (
            React.createElement(Modal, {ref: "modal", show: false, header: "Error History"}, 
                React.createElement("div", null, 
                    React.createElement("ul", {id: "modalStatsInfo"}, 
                        nuggets
                    ), 
                    React.createElement(DataTable, {sortBy: 'occurred', sortAsc: false, data: this.state.details, 
                        columnDefinitions: [
                            { field: 'errorType', display: 'Type'},
                            { field: 'errorDescription', display: 'Description'},
                            { field: 'objectName', display: 'Object'},
                            { field: 'subName', display: 'Sub'},
                            { field: 'stackTrace', display: 'Stack Trace', onRender: this.renderStackTrace},
                            { field: 'state', display: 'State', onRender: this.renderJsonTree},
                            { field: 'details', display: 'Details', onRender: this.renderJsonTree},
                            { field: 'userId', display: 'User'},
                            { field: 'occurred', display: 'Occurred', justify: 'right'}
                        ]})
                )
            )
        );
    },
    renderStackTrace: function (data, field, index) {
        var locationMatch = /\((.*?):(\d+):(\d+)\)/;
        return data.stackTrace.split(' at ').slice(1).map(function (item, i) {
            console.log(item);
            var location = locationMatch.exec(item);
            
            if (location != null) {
                var clean = item.replace(location[0], '').trim();
                return (
                    React.createElement("div", null, React.createElement("a", {target: "_blank", href: location[1]}, React.createElement("span", {"data-toggle": "tooltip", "data-placement": "right", title: location[0]}, clean)))
                );
            } else {
                return (
                    React.createElement("div", null, item)  
                );
            }
            
        });
    },
    renderJsonTree: function (data, field, index) {
        return data[field].split(',').map(function (item, i) {
            return (
                React.createElement("div", null, item)  
            );
        });
    },
    handleClose: function(event) {
        // hide the modal
        this.refs.modal.hide();
    },
    open: function (data) {
        // set data
        this.setState({ details: data.details, info: data.info });
        
        // show the modal
        this.refs.modal.show();
    }
});
var StatusPage = React.createClass({displayName: "StatusPage",
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
            return (React.createElement("option", {value: item}, item));
        });
            
        var environments = this.getEnvironments(options, this.state.criteria_product).map( function (item) {
            return (React.createElement("option", {value: item}, item));
        });
            
        var versions = this.getVersions(options, this.state.criteria_product, this.state.criteria_environment).map( function (item) {
            return (React.createElement("option", {value: item}, item));
        });
            
        var froms = this.state.fromOptions.map( function (item) {
            return (React.createElement("option", {value: item.value}, item.label));
        });
                        
        var tos = this.state.toOptions.map( function (item) {
            return (React.createElement("option", {value: item.value}, item.label));
        });
            
        var hourlySummary = null;
        if (hourlySummaryResult) {
            hourlySummary = (
                React.createElement("div", null, 
                    React.createElement("h3", {id: "headingHourly"}, "Hourly Summary"), 
                    React.createElement("hr", null), 
                    React.createElement("div", {id: "myLineChartContainer"}, 
                        React.createElement("canvas", {id: "myLineChart", width: "970", height: "400"})
                    ), 
                    React.createElement("div", {id: "myLineChartLegend"}

                    )
                )
            );
        }
            
        var errorSummary = null;
        if (errorSummaryResult) {
            errorSummary = (
                React.createElement("div", {id: "errorSummarySection"}, 
                    React.createElement("h3", null, "Error Summary"), 
                    React.createElement("hr", null), 
                    React.createElement("div", {id: "myPieChartContainer"}, 
                        React.createElement("canvas", {id: "myPieChart", width: "600", height: "300"})
                    ), 
                    React.createElement("div", {id: "myPieChartLegend"}), 

                    React.createElement(DataTable, {sortBy: 'latestOccurrence', sortAsc: false, data: this.state.errorSummaryResult.details, columnDefinitions: [
                        { field: 'errorType', display: 'Type', onCellClick: this.openErrorHistory},
                        { field: 'errorDescription', display: 'Description'},
                        { field: 'objectName', display: 'Object', onCellClick: this.openErrorHistory},
                        { field: 'subName', display: 'Sub', onCellClick: this.openErrorHistory},
                        { field: 'timesOccurred', display: '# Errors'},
                        { field: 'latestOccurrence', display: 'Latest'},
                        { field: 'usersAffected', display: 'Users Affected'}
                    ]})
                )
            );
        }
        
        return (
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {id: "criteria", className: "expanded"}, 
                    React.createElement("form", {className: "form-horizontal", role: "form"}, 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement("label", {for: "selectProduct", className: "col-sm-4 control-label"}, "Product"), 
                            React.createElement("div", {className: "col-sm-8"}, 
                                React.createElement("select", {id: "selectProduct", className: "form-control", value: this.state.criteria_product, onChange: this.handleCriteriaChange}, 
                                    products
                                )
                            )
                        ), 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement("label", {for: "selectEnvironment", className: "col-sm-4 control-label"}, "Environment"), 
                            React.createElement("div", {className: "col-sm-8"}, 
                                React.createElement("select", {id: "selectEnvironment", className: "form-control", value: this.state.criteria_environment, onChange: this.handleCriteriaChange}, 
                                    environments
                                )
                            )
                        ), 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement("label", {for: "selectVersion", className: "col-sm-4 control-label"}, "Version"), 
                            React.createElement("div", {className: "col-sm-8"}, 
                                React.createElement("select", {id: "selectVersion", className: "form-control", value: this.state.criteria_version, onChange: this.handleCriteriaChange}, 
                                    versions
                                )
                            )
                        ), 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement("label", {for: "selectFrom", className: "col-sm-4 control-label"}, "From"), 
                            React.createElement("div", {className: "col-sm-8"}, 
                                React.createElement("select", {id: "selectFrom", className: "form-control", value: this.state.criteria_from, onChange: this.handleCriteriaChange}, 
                                    froms
                                )
                            )
                        ), 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement("label", {for: "selectTo", className: "col-sm-4 control-label"}, "To"), 
                            React.createElement("div", {className: "col-sm-8"}, 
                                React.createElement("select", {id: "selectTo", className: "form-control", value: this.state.criteria_to, onChange: this.handleCriteriaChange}, 
                                    tos
                                )
                            )
                        )
                    )
                ), 
                React.createElement("div", {id: "view", className: "with-criteria"}, 
                    hourlySummary, 
                    errorSummary
                ), 
                React.createElement(ErrorHistoryModal, {ref: "errorHistoryModal"})
            )
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