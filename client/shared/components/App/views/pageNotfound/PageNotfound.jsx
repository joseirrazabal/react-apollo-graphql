// @flow weak

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

class PageNotFound extends PureComponent {
    static propTypes = {
        // react-router 4:
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    render() {
        return (
            <div className={cx({ 'view-enter': true })}>
                <h1>Sorry this page does not exists...</h1>
            </div>
        )
    }
}

export default PageNotFound
