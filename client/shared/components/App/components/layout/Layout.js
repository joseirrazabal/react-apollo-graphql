import React from 'react'

import { ScrollToTop, BackToTop, MenuAppBar } from '../../components'

export default function Layout({ children }) {
    return (
        <div id="appLayout">
            <MenuAppBar
                //   brand={navModel.brand}
                //   navModel={navModel}
                userIsAuthenticated={false}
                //   handleLeftNavItemClick={this.handleLeftNavItemClick}
                //   handleRightNavItemClick={this.handleRightNavItemClick}
            />
            <div className="container-fluid">{children}</div>

            <BackToTop minScrollY={40} scrollTo={'appContainer'} />
        </div>
    )
}
