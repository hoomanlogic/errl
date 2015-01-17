/* DropdownMenu
 * ClassNames: dropdown, dropdown-[default,primary,success,info,warning,danger], dropdown-menu, open
 * Dependencies: jQuery, Bootstrap(CSS)
 */
var DropdownMenu = React.createClass({
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
            <li ref="dropdown" className={'dropdown' + className} onClick={this.toggle}>
                <a href="#" data-toggle="dropdown" className="dropdown-toggle" style={style}>{buttonContent}</a>
                <ul className="dropdown-menu">
                  {menuItems}
                </ul>
            </li>
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