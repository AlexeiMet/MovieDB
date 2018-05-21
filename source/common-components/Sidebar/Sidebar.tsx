import * as React from 'react';
import {Link} from 'react-router-dom';
import {LibraryConsumer} from './../../contexts/LibraryContext';
import {ICardContent} from './../../pages/FilmsPage/components/Card/Card';
const s: {[props: string]: string} = require('./Sidebar.css');

interface ISidebarProps {
  savedFilms: ICardContent[]
}

interface ISidebarState {
  opened: boolean
}

class Sidebar extends React.PureComponent<ISidebarProps, ISidebarState> {
  state: ISidebarState = {
    opened: true
  }

  close = () => {
    this.setState({opened: false});
  }
  open = () => {
    this.setState({opened: true});
  }

  getSidebarOpenCloseClass = () => {
    let sidebarClass = s.sidebar;
    this.state.opened ?
      sidebarClass += ' '+s.sidebarOpened :
      sidebarClass += ' '+s.sidebarClosed;
    return sidebarClass;
  }

  getLibraryIndicator = () => {
    const savedFilmsCount = this.props.savedFilms.length;
    let libraryIndicator: null | JSX.Element;
    if (savedFilmsCount){
      const indicator = savedFilmsCount > 10 ? '10+' : savedFilmsCount;
      libraryIndicator = <span className={s.libraryIndicator}>({indicator})</span>
    } else {
      libraryIndicator = null
    }
    return libraryIndicator
  }

  render() {
    return (
      <div className={this.getSidebarOpenCloseClass()}>
        <div className={s.content}>
          <div className={s.top}>
            <div className={s.toggleIconWrapper}>
              {this.state.opened ?
                <span onClick={this.close} className={`${s.closeIcon} ${s.toggleIcon}`} /> :
                <span onClick={this.open} className={`${s.openIcon} ${s.toggleIcon}`}/>}
            </div>
            <Link to='/'>
              <div className={s.logo}>
                <div className={s.logoIcon} />
                <div className={s.logoText}><span>Movie</span> <span>House</span></div>
              </div>
            </Link>
          </div>
          <div className={s.pagesNav}>
            <Link to='/films/movies' className={s.pageLink}>
              <span className={`${s.movieIcon} ${s.pageIcon}`} />
              <span className={s.pageText}>Movie</span>
            </Link>
            <Link to='/films/tvshows' className={s.pageLink}>
              <span className={`${s.tvshowIcon} ${s.pageIcon}`} />
              <span className={s.pageText}>TV Show</span>
            </Link>
            <Link to='/films/library' className={s.pageLink}>
              <span className={`${s.libraryIcon} ${s.pageIcon}`} />
              <span className={s.pageText}>My Library</span>
              {this.getLibraryIndicator()}
            </Link>
            <Link to='/support' className={s.pageLink}>
              <span className={`${s.supportIcon} ${s.pageIcon}`} />
              <span className={s.pageText}>Support</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const LibraryContextSidebar = () =>
  <LibraryConsumer>
    {({savedFilms}) => <Sidebar savedFilms={savedFilms} />}
  </LibraryConsumer>

export {LibraryContextSidebar as Sidebar}