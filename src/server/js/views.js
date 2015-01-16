var StatusPage = React.createClass({displayName: "StatusPage",
    componentDidMount: function () {
        app.getOptions();
    },
    render: function () {
        return (
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {id: "criteria", className: "expanded"}, 
                    React.createElement("form", {className: "form-horizontal", role: "form"}, 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement("label", {for: "selectProduct", className: "col-sm-4 control-label"}, "Product"), 
                            React.createElement("div", {className: "col-sm-8"}, 
                                React.createElement("select", {id: "selectProduct", className: "form-control", onchange: "app.getHourlySummary(); app.refreshOptions('Product');"})
                            )
                        ), 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement("label", {for: "selectEnvironment", className: "col-sm-4 control-label"}, "Environment"), 
                            React.createElement("div", {className: "col-sm-8"}, 
                                React.createElement("select", {id: "selectEnvironment", className: "form-control", onchange: "app.getHourlySummary(); app.refreshOptions('Environment');"})
                            )
                        ), 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement("label", {for: "selectVersion", className: "col-sm-4 control-label"}, "Version"), 
                            React.createElement("div", {className: "col-sm-8"}, 
                                React.createElement("select", {id: "selectVersion", className: "form-control", onchange: "app.getHourlySummary()"})
                            )
                        ), 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement("label", {for: "selectFrom", className: "col-sm-4 control-label"}, "From"), 
                            React.createElement("div", {className: "col-sm-8"}, 
                                React.createElement("select", {id: "selectFrom", className: "form-control", onchange: "app.bufferLineChartLabelRange('from'); app.refreshHourlySummary();"})
                            )
                        ), 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement("label", {for: "selectTo", className: "col-sm-4 control-label"}, "To"), 
                            React.createElement("div", {className: "col-sm-8"}, 
                                React.createElement("select", {id: "selectTo", className: "form-control", onchange: "app.bufferLineChartLabelRange('to'); app.refreshHourlySummary();"})
                            )
                        )
                    )
                ), 
                React.createElement("div", {id: "view", className: "with-criteria"}, 
                    React.createElement("div", null, 
                        React.createElement("h3", {id: "headingHourly"}, "Hourly Summary"), 
                        React.createElement("hr", null), 
                        React.createElement("div", {id: "myLineChartContainer"}, 
                            React.createElement("canvas", {id: "myLineChart", width: "970", height: "400"})
                        ), 
                        React.createElement("div", {id: "myLineChartLegend"}

                        )
                    ), 
                    React.createElement("div", {id: "errorSummarySection", hidden: true}, 
                        React.createElement("h3", null, "Error Summary"), 
                        React.createElement("hr", null), 
                        React.createElement("div", {id: "myPieChartContainer"}, 
                            React.createElement("canvas", {id: "myPieChart", width: "600", height: "300"})
                        ), 
                        React.createElement("div", {id: "myPieChartLegend"}), 

                        React.createElement("table", {className: "table table-striped"}, 
                            React.createElement("thead", null, 
                                React.createElement("tr", null, 
                                    React.createElement("th", {className: "text-right"}, React.createElement("a", {href: "javascript:;", onclick: "controller.model.doSort('errorType', '#sortErrorType')"}, "Error #", React.createElement("span", {id: "sortErrorType", className: "sort-indicators"}))), 
                                    React.createElement("th", null, React.createElement("a", {href: "javascript:;", onclick: "controller.model.doSort('errorDescription', '#sortDescription')"}, "Description", React.createElement("span", {id: "sortDescription", className: "sort-indicators"}))), 
                                    React.createElement("th", null, React.createElement("a", {href: "javascript:;", onclick: "controller.model.doSort('objectName', '#sortObject')"}, "Object", React.createElement("span", {id: "sortObject", className: "sort-indicators"}))), 
                                    React.createElement("th", null, React.createElement("a", {href: "javascript:;", onclick: "controller.model.doSort('subName', '#sortSub')"}, "Sub", React.createElement("span", {id: "sortSub", className: "sort-indicators"}))), 
                                    React.createElement("th", {className: "text-center"}, React.createElement("a", {href: "javascript:;", onclick: "controller.model.doSort('timesOccurred', '#sortOccurrences')"}, "Errors", React.createElement("span", {id: "sortOccurrences", className: "sort-indicators"}, "▲"))), 
                                    React.createElement("th", {className: "text-right"}, React.createElement("a", {href: "javascript:;", onclick: "controller.model.doSort('latestOccurrence', '#sortLatest', 'date')"}, "Latest Occurrence", React.createElement("span", {id: "sortLatest", className: "sort-indicators"}))), 
                                    React.createElement("th", {className: "text-center"}, React.createElement("a", {href: "javascript:;", onclick: "controller.model.doSort('usersAffected', '#sortUsers')"}, "Users", React.createElement("span", {id: "sortUsers", className: "sort-indicators"})))
                                )
                            ), 
                            React.createElement("tbody", {id: "errorSummaryTableBody"})
                        )
                    )
                )
            )
        );


 
    }
});