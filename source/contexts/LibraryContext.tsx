import * as React from 'react';
import {getSavedFilms} from './../common-helper-functions/getSavedFilms';
import {ICardContent} from './../pages/FilmsPage/components/Card/Card';

const savedFilms: ICardContent[] = getSavedFilms();

type addFilmType = (film: ICardContent) => void;
type removeFilmType = (id: number) => void;

interface ILibraryProviderState {
  savedFilms: ICardContent[];
}

interface ILibraryProviderValue {
  savedFilms: ICardContent[];
  addFilm: addFilmType;
  removeFilm: removeFilmType
}
const defaultProviderValue: ILibraryProviderValue = {
  savedFilms: [],
  addFilm: () => {},
  removeFilm: () => {}
};
const {Provider, Consumer} = React.createContext(defaultProviderValue);

class LibraryProvider extends React.PureComponent<null, ILibraryProviderState> {
  state: ILibraryProviderState = {
    savedFilms: savedFilms
  }

  addFilm: addFilmType = (film) => {
    const savedFilms = [...this.state.savedFilms];
    savedFilms.push(film);
    localStorage.savedFilms = JSON.stringify(savedFilms);
    this.setState({savedFilms: savedFilms});
  }

  removeFilm: removeFilmType = (id) => {
    this.state.savedFilms.forEach((film, i) => {
      if (film.id === id){
        const savedFilms = [...this.state.savedFilms];
        savedFilms.splice(i, 1);
        localStorage.savedFilms = JSON.stringify(savedFilms);
        this.setState({savedFilms: savedFilms})
      }
    })
  }

  render() {
    const value = {
      ...this.state,
      addFilm: this.addFilm,
      removeFilm: this.removeFilm
    }
    return (
      <Provider value={value}>
        {this.props.children}
      </Provider>
    );
  }
}

export {LibraryProvider, Consumer as LibraryConsumer}