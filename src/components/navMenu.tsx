import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom'

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    link: {
        textDecoration: "none"
    }
};

interface INavMenuState {
    anchorEl: null,
}
class NavMenu extends React.Component<any, INavMenuState>{
    constructor(props: any) {
        super(props);
        this.state = {
            anchorEl: null
        }
    }
    public render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu"
                            aria-owns={anchorEl ? 'simple-menu' : undefined}
                            aria-haspopup="true" onClick={this.handleClick}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            D3 Examples
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}>
                    <MenuItem onClick={this.handleClose}>
                        <Link className={classes.link} to='/users-bar-chart'>Users Bar Chart</Link>
                    </MenuItem>
                    <MenuItem onClick={this.handleClose}>
                        <Link className={classes.link} to='/line-chart'>Line Chart</Link>
                    </MenuItem>
                </Menu>
            </div>
        );
    }
    private handleClick = (event: any) => {
        this.setState({ anchorEl: event.currentTarget });
    }
    private handleClose = () => {
        this.setState({ anchorEl: null });
    };
}

export default withStyles(styles)(NavMenu);