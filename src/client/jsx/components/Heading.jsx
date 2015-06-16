var Heading = React.createClass({
    render: function () {
        
        var headingStyle = { 
            marginBottom: '0',
            backgroundColor: 'rgb(37,37,37)', //@clrBackgroundH
            borderRadius: '8px 8px 0 0', 
            padding: '1px 0 0 5px'
        };

        return (
            <div>
                <h3 style={headingStyle}>{this.props.title}</h3>
                <hr/>
            </div>
        );
    }
});