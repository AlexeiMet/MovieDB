import * as React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {FilmsPage} from './../../pages/FilmsPage/FilmsPage';
import {FilmPage} from './../../pages/FilmPage/FilmPage';
import {SupportPage} from './../../pages/SupportPage/SupportPage';
import {AddMoviePage} from './../../pages/AddMoviePage/AddMoviePage';
import {AboutPage} from './../../pages/AboutPage/AboutPage';
import {Sidebar} from './../../common-components/Sidebar/Sidebar';
import {Header} from './../../common-components/Header/Header';
const s: {[props: string]: string} = require('./MainWrapper.css');

export class MainWrapper extends React.PureComponent {
  public render() {
    return (
      <div className={s.wrapper}>
        <div className={s.row}>
          <div className={s.sidebarCol}>
            <Sidebar />
          </div>
          <div className={s.mainCol}>
            <Header />
            <Switch>
              <Route exact path='/films/:category' component={FilmsPage} />
              <Route exact path='/films/:category/add' component={FilmsPage} />
              <Route exact path='/film/:category/:id' component={FilmPage} />
              <Route exact path='/support' component={SupportPage} />
              <Route exact path='/about' component={AboutPage} />
              <Redirect from='/' to='/films/movies' />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}