import React from 'react'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'

import { ScrollToTop, BackToTop, MenuAppBar } from '../../components'

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: 30
    }
})

function Layout(props) {
    let { children, classes } = props
    return (
        <div id="appLayout">
            <MenuAppBar />
            {/* <div className={classes.root}>{children}</div> */}
            <div className="container-fluid">{children}</div>

            <BackToTop minScrollY={40} scrollTo={'appContainer'} />
        </div>
    )
}

export default withStyles(styles)(Layout)
