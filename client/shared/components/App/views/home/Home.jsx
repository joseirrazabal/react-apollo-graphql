// @flow weak

import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import Jumbotron from '../../components/jumbotron/Jumbotron';
import cx from 'classnames';
import { Link } from 'react-router-dom';

class Home extends PureComponent {
  static propTypes = {
    // react-router 4:
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,

    // view props:
    currentView: PropTypes.string.isRequired,
    // view actions:
    enterHome: PropTypes.func.isRequired,
    leaveHome: PropTypes.func.isRequired
  };

  state = {
    viewEntersAnim: true
  };

  componentDidMount() {
    const { enterHome } = this.props;
    enterHome();
  }

  componentWillUnmount() {
    const { leaveHome } = this.props;
    leaveHome();
  }

  render() {
    const {
      viewEntersAnim
    } = this.state;

    return (
      <div
        key="homeView"
        className={cx({ 'view-enter': viewEntersAnim })}>
        <Link
          className="btn btn-success"
          to={'/about'}>
          <i className="fa fa-info"></i>
          &nbsp;
              go to about
            </Link>
      </div>
    );
  }
}

export default Home;
