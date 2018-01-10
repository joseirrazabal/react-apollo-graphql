import React from 'react'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { createMuiTheme } from 'material-ui/styles'
import { grey, amber, red, blue } from 'material-ui/colors'

import { ScrollToTop, BackToTop, MenuAppBar } from '../../components'

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: 30
    }
})

function Layout(props) {
    let { children, classes } = props

    const muiTheme = createMuiTheme({
        palette: {
            primary: grey,
            accent: amber,
            error: red,
            type: 'dark'
        }
    })

    return (
        <MuiThemeProvider theme={muiTheme}>
            <div className="body">
                <MenuAppBar component={children} />

                <BackToTop minScrollY={40} scrollTo={'appContainer'} />
            </div>
        </MuiThemeProvider>
    )
}

export default withStyles(styles)(Layout)
