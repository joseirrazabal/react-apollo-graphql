// @flow weak

import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import AccountCircle from 'material-ui-icons/AccountCircle'
import Menu, { MenuItem } from 'material-ui/Menu'
import Drawer from 'material-ui/Drawer'
import { Link } from 'react-router-dom'

const styles = {
    root: {
        width: '100%'
    },
    flex: {
        flex: 1
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    }
}

class MenuAppBar extends React.Component {
    state = {
        auth: true,
        anchorEl: null
    }

    handleChange = (event, checked) => {
        this.setState({ auth: checked })
    }

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget })
    }

    handleClose = () => {
        this.setState({ anchorEl: null })
    }

    handleToggle = () => this.setState({ menuOpen: !this.state.menuOpen })

    closeLeftNav = () => {
        this.setState({ menuOpen: false })
    }

    render() {
        const { classes } = this.props
        const { auth, anchorEl } = this.state
        const open = Boolean(anchorEl)

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            className={classes.menuButton}
                            color="contrast"
                            aria-label="Menu"
                            onClick={this.handleToggle}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            type="title"
                            color="inherit"
                            className={classes.flex}
                            style={{ textDecoration: 'none' }}
                            to="/"
                            component={Link}
                        >
                            Titulo de app
                        </Typography>
                        {auth && (
                            <div>
                                <IconButton
                                    aria-owns={open ? 'menu-appbar' : null}
                                    aria-haspopup="true"
                                    onClick={this.handleMenu}
                                    color="contrast"
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}
                                    open={open}
                                    onClose={this.handleClose}
                                >
                                    <MenuItem onClick={this.handleClose}>
                                        Profile
                                    </MenuItem>
                                    <MenuItem
                                        onClick={this.handleClose}
                                        to="/logout"
                                        component={Link}
                                    >
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </div>
                        )}
                    </Toolbar>
                </AppBar>
                <Drawer open={this.state.menuOpen} onClose={this.closeLeftNav}>
                    <MenuItem
                        onClick={this.closeLeftNav}
                        to="/dashboard"
                        component={Link}
                    >
                        Dashboard
                    </MenuItem>
                    <MenuItem
                        onClick={this.closeLeftNav}
                        to="/about"
                        component={Link}
                    >
                        About
                    </MenuItem>
                </Drawer>
            </div>
        )
    }
}

MenuAppBar.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(MenuAppBar)
