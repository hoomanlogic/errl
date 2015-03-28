var ErrorHistoryModal = React.createClass({
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
                    <li>{item}</li>  
                );
            });
        }
        
        return (
            <Modal ref="modal" show={false} header="Error History" overflowX="scroll">
                <div>
                    <ul id="modalStatsInfo">
                        {nuggets}
                    </ul>
                    <DataTable sortBy={'occurred'} sortAsc={false} data={this.state.details} 
                        columnDefinitions={[
                            { field: 'errorType', display: 'Type'},
                            { field: 'errorDescription', display: 'Description'},
                            { field: 'objectName', display: 'Object'},
                            { field: 'subName', display: 'Sub'},
                            { field: 'stackTrace', display: 'Stack Trace', onRender: this.renderStackTrace},
                            { field: 'state', display: 'State', onRender: this.renderJsonTree},
                            { field: 'details', display: 'Details', onRender: this.renderJsonTree},
                            { field: 'userId', display: 'User'},
                            { field: 'occurred', display: 'Occurred', justify: 'right'} 
                        ]} />
                </div>
            </Modal>
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
                    <div><a target="_blank" href={location[1]}><span data-toggle="tooltip" data-placement="right" title={location[0]}>{clean}</span></a></div>
                );
            } else {
                return (
                    <div>{item}</div>  
                );
            }
            
        });
    },
    renderJsonTree: function (data, field, index) {
        return data[field].split(',').map(function (item, i) {
            return (
                <div>{item}</div>  
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