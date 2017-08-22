import React, { Component } from 'react';

export default class Alert extends Component {

	componentDidMount() {
    this.timer = setTimeout(
      this.props.onClose,
      this.props.timeout
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  alertClass (type) {
    let classes = {
      error: 'alert-danger',
      alert: 'alert-warning',
      notice: 'alert-info',
      success: 'alert-success'
    };
    return classes[type] || classes.success;
  }

  render() {
    const message = this.props.message;
    const alertClassName = `alert ${ this.alertClass(message.type) } fade in`;

    return(
      <div className={ alertClassName }>
        <button className='close'
          onClick={ () => {this.props.removeMessage(message)} }>
          &times;
        </button>
        { message.text }
      </div>
    );
  }
}
