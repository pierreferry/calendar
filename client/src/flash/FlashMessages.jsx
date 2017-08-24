import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Alert from "./Alert"
import './FlashMessages.css'

export default class FlashMessages extends Component {

  render () {
    const alerts = this.props.messages.map( message =>
      <Alert key={ message.id } message={ message }
        removeMessage={ this.props.removeMessage } />
    );

    return(
      <ReactCSSTransitionGroup
        transitionName='alerts'
        transitionEnter={false}
        transitionLeaveTimeout={500}>
        { alerts }
      </ReactCSSTransitionGroup>
    );
	}
}
