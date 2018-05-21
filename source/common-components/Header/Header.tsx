import * as React from 'react';
import {Link, withRouter} from 'react-router-dom';
const s: {[props: string]: string} = require('./Header.css');

interface IHeaderProps {
  location: {
    pathname: string
  }
}

class Header extends React.PureComponent<IHeaderProps> {
  addMovieElement(): null | JSX.Element {
    const location = this.props.location.pathname;
    if (location === '/films/movies'){
      return <Link className={s.link} to='/films/movies/add'>Add Movie</Link>
    } else if(location === '/films/tvshows') {
      return <Link className={s.link} to='/films/tvshows/add'>Add Tvshow</Link>
    }
    return null;
  }

  render() {
    return (
      <div className={s.header}>
        <div className={s.row}>
          <div className={s.searchCol}>
            <form>
              <div className={s.search}>
                <button className={s.searchBtn}></button>
                <input className={s.searchInput} placeholder='Search...' />
              </div>
            </form>
          </div>
          <div className={s.navCol}>
            <div className={s.nav}>
              {this.addMovieElement()}
              <Link className={s.link} to='/about'>About</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const HeaderWithRouter = withRouter(props => <Header {...props} />);

export {HeaderWithRouter as Header}