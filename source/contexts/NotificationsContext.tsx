import * as React from 'react';
import {getUniqKey} from './../common-helper-functions/getUniqKey';
import {Notification} from './../common-components/Notification/Notification';

interface INotificationProviderValue {
  showNotification: (message: string, tone: '-' | '+') => void;
} 

const defaultValue: INotificationProviderValue = {
  showNotification: () => {}
}
const {Provider, Consumer} = React.createContext(defaultValue);

interface INotificationProviderProps {
  children: JSX.Element | JSX.Element[]
}

interface INotification {
  message: string;
  tone: '-' | '+';
  countdownId: number
}

interface INotificationProviderState {
  notifications: INotification[]
}

class NotificationProvider extends React.PureComponent<INotificationProviderProps, INotificationProviderState> {
  state: INotificationProviderState = {
    notifications: []
  }

  showNotification = (message: string, tone: '-' | '+') => {
    const newNotifications = [...this.state.notifications];
    const countdownId = window.setTimeout(() => {
      this.destroyNotification(countdownId)
    }, 5000);
    newNotifications.push({message, tone, countdownId});
    this.setState({notifications: newNotifications});
  }

  destroyNotification = (countdownId: number) => {
    const newNotifications = [...this.state.notifications];
    const notificationIndex = this.state.notifications.findIndex(notification => {
      const isDestroyNow = notification.countdownId === countdownId;
      return isDestroyNow;
    });
    newNotifications.splice(notificationIndex, 1);
    this.setState({notifications: newNotifications});
  }

  componentWillUnmount() {
    this.state.notifications.forEach(notification => {
      clearTimeout(notification.countdownId);
    })
  }

  render() {
    return (
      <Provider value={{showNotification: this.showNotification}}>
        {this.props.children}
        {this.state.notifications.map((notification, i) =>
          <Notification pos={i} tone={notification.tone} key={getUniqKey()}>{notification.message}</Notification>
        )}
      </Provider>
    );
  }
}

export {NotificationProvider, Consumer as NotificationConsumer}