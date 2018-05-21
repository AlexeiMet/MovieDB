import * as React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import {MainWrapper} from './../common-components/MainWrapper/MainWrapper';

import {LibraryProvider} from './../contexts/LibraryContext';
import {NotificationProvider} from './../contexts/NotificationsContext';

import './App-styles/App.css';

export class App extends React.Component {
  public render() {
    return (
      <LibraryProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Route path='/' component={MainWrapper} />
          </BrowserRouter>
        </NotificationProvider>
      </LibraryProvider>
    );
  }
}