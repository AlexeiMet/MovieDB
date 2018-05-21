import * as React from 'react';
const s: {[props: string]: string} = require('./Notification.css');

interface INotificationProps {
  children: string;
  tone: '-' | '+';
  pos: number
}

export class Notification extends React.PureComponent<INotificationProps> {
  public wrapperElem: HTMLElement

  render() {
    let wrapperClass = s.wrapper;
    if (this.props.tone === '-'){
      wrapperClass += ` ${s['wrapper_negative']}`;
    } else if (this.props.tone === '+'){
      wrapperClass += ` ${s['wrapper_positive']}`;
    }
    return (
      <div ref={el => this.wrapperElem = el} style={{bottom: `${145*this.props.pos+30}px`}} className={wrapperClass}>
        <div className={s.icon} />
        <div className={s.message}>{this.props.children}</div>
      </div>
    );
  }
}