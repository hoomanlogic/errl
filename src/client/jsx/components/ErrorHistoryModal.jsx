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
                        { field: 'stackTrace', display: 'State Trace', limitLength: 100},
                        { field: 'state', display: 'State', limitLength: 100},
                        { field: 'details', display: 'Details', limitLength: 100},
                        { field: 'userId', display: 'User'},
                        { field: 'occurred', display: 'Occurred'}
                    ]} />
                </div>
            </Modal>
        );
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