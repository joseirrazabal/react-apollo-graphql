// @flow weak

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import classNames from 'classnames'
import Drawer from 'material-ui/Drawer'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import List from 'material-ui/List'
import Menu, { MenuItem } from 'material-ui/Menu'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import ChevronRightIcon from 'material-ui-icons/ChevronRight'
import AccountCircle from 'material-ui-icons/AccountCircle'
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import InboxIcon from 'material-ui-icons/MoveToInbox'
import DraftsIcon from 'material-ui-icons/Drafts'
import StarIcon from 'material-ui-icons/Star'
import SendIcon from 'material-ui-icons/Send'
import MailIcon from 'material-ui-icons/Mail'
import DeleteIcon from 'material-ui-icons/Delete'
import ReportIcon from 'material-ui-icons/Report'
import { Link } from 'react-router-dom'
import { TransitionMotion } from 'react-motion'

const drawerWidth = 240

const styles = theme => ({
    root: {
        width: '100%',
        height: '100%',
        // marginTop: theme.spacing.unit * 3,
        zIndex: 1,
        overflow: 'hidden'
    },
    flex: {
        flex: 1
    },
    appFrame: {
        // position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%'
    },
    appBar: {
        position: 'absolute',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    'appBarShift-left': {
        marginLeft: drawerWidth
    },
    'appBarShift-right': {
        marginRight: drawerWidth
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20
    },
    hide: {
        display: 'none'
    },
    drawerPaper: {
        // position: 'relative',
        height: '100%',
        width: drawerWidth,
        overflow: 'hidden'
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar
    },
    content: {
        position: 'absolute',
        left: '0px',
        right: '0px',
        top: 64,
        bottom: '0px',
        overflow: 'auto',
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        // height: 'calc(100 - 56px)'
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        [theme.breakpoints.up('sm')]: {
            content: {
                height: 'calc(100% - 64px)',
                marginTop: 64
            }
        }
    },
    'content-left': {
        // marginLeft: -drawerWidth
        marginLeft: drawerWidth
    },
    'content-right': {
        // marginRight: -drawerWidth
        marginRight: drawerWidth
    },
    contentShift: {
        width: `calc(100% - ${drawerWidth}px - ${theme.spacing.unit * 3})`,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    'contentShift-left': {
        marginLeft: drawerWidth
        // marginLeft: 0
    },
    'contentShift-right': {
        marginRight: drawerWidth
        // marginRight: 0
    }
})

class PersistentDrawer extends React.Component {
    state = {
        open: false,
        anchor: 'left',
        openUserMenu: false,
        auth: true,
        anchorEl: null,
        isLoading: true
    }

    componentDidMount() {
        this.setState({ isLoading: false })
    }

    handleDrawerOpen = () => {
        this.setState({ open: true })
    }

    handleDrawerClose = () => {
        this.setState({ open: false })
    }

    handleChangeAnchor = event => {
        this.setState({
            anchor: event.target.value
        })
    }

    handleUserMenuToggle = () =>
        this.setState({ openUserMenu: !this.state.openUserMenu })

    render() {
        const { classes, theme, component } = this.props
        const { anchor, open, openUserMenu } = this.state
        const { auth, anchorEl } = this.state

        const menuUser = (
            <div>
                <IconButton
                    aria-owns={openUserMenu ? 'menu-appbar' : null}
                    aria-haspopup="true"
                    onClick={this.handleUserMenuToggle}
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
                    open={openUserMenu}
                    onClose={this.handleUserMenuToggle}
                >
                    <MenuItem onClick={this.handleUserMenuToggle}>
                        Profile
                    </MenuItem>
                    <MenuItem
                        onClick={this.handleUserMenuToggle}
                        to="/logout"
                        component={Link}
                    >
                        Logout
                    </MenuItem>
                </Menu>
            </div>
        )

        const drawer = (
            <Drawer
                type="persistent"
                classes={{
                    paper: classes.drawerPaper
                }}
                anchor={anchor}
                open={open}
            >
                <div className={classes.drawerInner}>
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={this.handleDrawerClose}>
                            {theme.direction === 'rtl' ? (
                                <ChevronRightIcon />
                            ) : (
                                <ChevronLeftIcon />
                            )}
                        </IconButton>
                    </div>
                    <Divider />
                    <List className={classes.list}>
                        <div>
                            <ListItem button to="/" component={Link}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Inbox" />
                            </ListItem>
                            <ListItem button to="/menuItem" component={Link}>
                                <ListItemIcon>
                                    <StarIcon />
                                </ListItemIcon>
                                <ListItemText primary="Starred" />
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                    <SendIcon />
                                </ListItemIcon>
                                <ListItemText primary="Send mail" />
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                    <DraftsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Drafts" />
                            </ListItem>
                        </div>
                    </List>
                    <Divider />
                    <List className={classes.list}>
                        <div>
                            <ListItem button>
                                <ListItemIcon>
                                    <MailIcon />
                                </ListItemIcon>
                                <ListItemText primary="All mail" />
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                    <DeleteIcon />
                                </ListItemIcon>
                                <ListItemText primary="Trash" />
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                    <ReportIcon />
                                </ListItemIcon>
                                <ListItemText primary="Spam" />
                            </ListItem>
                        </div>
                    </List>
                </div>
            </Drawer>
        )

        let before = null
        let after = null

        if (anchor === 'left') {
            before = drawer
        } else {
            after = drawer
        }

        return (
            <div className={classes.root}>
                {this.state &&
                    !this.state.isLoading && (
                        <div className={classes.appFrame}>
                            <AppBar
                                // position="static"
                                className={classNames(classes.appBar, {
                                    [classes.appBarShift]: open,
                                    [classes[`appBarShift-${anchor}`]]: open
                                })}
                            >
                                <Toolbar>
                                    <IconButton
                                        color="contrast"
                                        aria-label="open drawer"
                                        onClick={this.handleDrawerOpen}
                                        className={classNames(
                                            classes.menuButton,
                                            open && classes.hide
                                        )}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                    <Typography
                                        type="title"
                                        color="inherit"
                                        className={classes.flex}
                                        noWrap
                                        style={{ textDecoration: 'none' }}
                                        to="/"
                                        component={Link}
                                    >
                                        Titulo app
                                    </Typography>
                                    {auth && menuUser}
                                </Toolbar>
                            </AppBar>
                            {before}
                            <main
                                className={classNames(classes.content, {
                                    [classes.contentShift]: open,
                                    [classes[`contentShift-${anchor}`]]: open
                                })}
                            >
                                {component}
                            </main>
                            {after}
                        </div>
                    )}
            </div>
        )
    }
}

PersistentDrawer.propTypes = {
    component: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(PersistentDrawer)
