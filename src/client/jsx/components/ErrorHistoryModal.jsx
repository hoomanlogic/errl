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
            <Modal ref="modal" show={false} header="Error History">
                <div>
                    <ul id="modalStatsInfo">
                        {nuggets}
                    </ul>
                    <DataTable sortBy={'occurred'} sortAsc={false} data={this.state.details} columnDefinitions={[
                        { field: 'errorType', display: 'Type'},
                        { field: 'errorDescription', display: 'Description'},
                        { field: 'objectName', display: 'Object'},
                        { field: 'subName', display: 'Sub'},
                        { field: 'stackTrace', display: 'Stack Trace', onRender: this.renderStackTrace},
                        { field: 'state', display: 'State', limitLength: 100},
                        { field: 'details', display: 'Details', limitLength: 100},
                        { field: 'userId', display: 'User'},
                        { field: 'occurred', display: 'Occurred'}
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