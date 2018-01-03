import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Badge, Nav, NavItem } from 'reactstrap';
import classNames from 'classnames';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
// import nav from './_nav';

class Sidebar extends Component {

  componentDidMount() {
    this.subscribeToNewMenuItem();
  }

  subscribeToNewMenuItem = () => {
    this.props.subscribeToMore({
      document: gql`
        subscription {
          menuItemAdded {
            title,
            name,
            order,
            url,
            icon,
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
        if (subscriptionData.data) {
          const newObj = subscriptionData.data.menuItemAdded;

          if (!previous.getAllMenuItem.find(msg => msg.name === newObj.name)) {
            return Object.assign({}, previous, {
              getAllMenuItem: [...previous.getAllMenuItem, newObj],
            });
          }
        }
        return previous;
      },
    });
  }

  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName, props) {
    // return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
    return props.location.pathname.indexOf(routeName) > -1
      ? 'nav-item nav-dropdown open'
      : 'nav-item nav-dropdown';
  }

  // todo Sidebar nav secondLevel
  // secondLevelActive(routeName) {
  //   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
  // }

  render() {
    const props = this.props;
    const activeRoute = this.activeRoute;
    const handleClick = this.handleClick;

    const { itemsMenu } = this.props;

    // badge addon to NavItem
    const badge = (badge) => {
      if (badge) {
        const classes = classNames(badge.class);
        return (
          <Badge className={classes} color={badge.variant}>
            {badge.text}
          </Badge>
        );
      }
    };

    // simple wrapper for nav-title item
    const wrapper = item =>
      (item.wrapper && item.wrapper.element
        ? React.createElement(item.wrapper.element, item.wrapper.attributes, item.name)
        : item.name);

    // nav list section title
    const title = (title, key) => {
      const classes = classNames('nav-title', title.class);
      return (
        <li key={key} className={classes}>
          {wrapper(title)}{' '}
        </li>
      );
    };

    // nav list divider
    const divider = (divider, key) => <li key={key} className="divider" />;

    // nav item with nav link
    const navItem = (item, key) => {
      const classes = classNames('nav-link', item.class);
      return (
        <NavItem key={key}>
          <NavLink to={item.url} className={classes} activeClassName="active">
            <i className={item.icon} />
            {item.name}
            {badge(item.badge)}
          </NavLink>
        </NavItem>
      );
    };

    // nav dropdown
    const navDropdown = (item, key) => (
      <li key={key} className={activeRoute(item.url, props)}>
        <a className="nav-link nav-dropdown-toggle" href="#" onClick={handleClick.bind(this)}>
          <i className={item.icon} /> {item.name}
        </a>
        <ul className="nav-dropdown-items">{navList(item.children)}</ul>
      </li>
    );

    // nav link
    const navLink = (item, idx) =>
      (item.title
        ? title(item, idx)
        : item.divider
          ? divider(item, idx)
          : item.children ? navDropdown(item, idx) : navItem(item, idx));

    // nav list
    const navList = items => items.map((item, index) => navLink(item, index));

    // sidebar-nav root
    return (
      <div className="sidebar">
        <nav className="sidebar-nav">
          {itemsMenu &&
            <Nav>{navList(itemsMenu)}</Nav>
          }
        </nav>
      </div>
    );
  }
}

const getAllMenuItem = gql`
  query getAllMenuItem{
    getAllMenuItem {
        title,
        name,
        order,
        url,
        icon,
    }
  }
`;

export default graphql(getAllMenuItem, {
  // name: 'user',
  // options: {
  //   fetchPolicy: 'network-only',
  //   ssr: false,
  // },
  props: ({
    data: { loading, getAllMenuItem, subscribeToMore },
  }) => ({
      subscribeToMore,
      loading,
      itemsMenu: getAllMenuItem,
    }),
})(Sidebar);
