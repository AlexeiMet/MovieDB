import * as React from 'react';
import {PageWrapper} from './../../common-components/PageWrapper/PageWrapper';
import {loadFilm} from './helper-functions/loadFilm';
import {getUniqKey} from './../../common-helper-functions/getUniqKey';

interface IFilmPageProps {
  match: {
    params: {
      id: number;
      category: string;
    }
  }
}

export interface IFilmContent {
  id: number;
  title: string;
  overview: string;
  poster: string;
  backdrops: string[];
  genres: string[];
  popularity: number;
  voteAverage: number;
  relatedFilms: {id: number; image: string}[]
}

export class FilmPage extends React.PureComponent<IFilmPageProps, IFilmContent> {
  state: IFilmContent = {
    id: undefined,
    title: undefined,
    overview: undefined,
    poster: undefined,
    backdrops: [],
    genres: [],
    popularity: undefined,
    voteAverage: undefined,
    relatedFilms: []
  }

  componentIsUnmount = false

  setFilmContent = (content: IFilmContent) => {
    if (this.componentIsUnmount) return;
    this.setState(content);
  }

  loadFilmContent = () => {
    const handleSuccessLoad = (content: IFilmContent) => {
      this.setFilmContent(content);
    }
    const handleErrorLoad = () => {
      alert('There was an error on load');
    }
    loadFilm(handleSuccessLoad, handleErrorLoad, this.props.match.params.category, this.props.match.params.id);
  }

  componentDidMount() {
    this.loadFilmContent();
  }

  componentDidUpdate(prevProps: IFilmPageProps) {
    if (this.props.match.params.id !== prevProps.match.params.id){
      this.loadFilmContent();
    }
  }

  componentWillUnmount() {
    this.componentIsUnmount = true;
  }

  render() {
    return (
      <PageWrapper>
        <div style={{color: '#fff'}}>
          <img src={this.state.poster} />
          <h1>{this.state.title}</h1>
          <p>{this.state.overview}</p>
          <ul>
            {this.state.genres.map(genre => <li key={getUniqKey()}>{genre}</li>)}
          </ul>
          <div>popularity: <span>{this.state.popularity}</span></div>
          <div>vote average: <span>{this.state.voteAverage}</span></div>
        </div>
      </PageWrapper>
    );
  }
}