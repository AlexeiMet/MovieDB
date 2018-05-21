import {apiConsts} from './../../../apiLib/apiConsts';
import {requestFilms} from './../../../apiLib/requestFilms';
import {getSavedFilms} from './../../../common-helper-functions/getSavedFilms';
import {ICardContent} from './../components/Card/Card';

type requestFilmsFromLibType = (cb: Function, page: number) => void;
const requestFilmsFromLib: requestFilmsFromLibType = (cb, page) => {
  // Simulate request timeout
  setTimeout(cb.bind(undefined, getSavedFilms()), 250);
}

type loadFilmsType = (successCb: Function, errorCb: Function, category: string, page: number) => void;
export const loadFilms: loadFilmsType = (successCb, errorCb, category, page) => {
  type receiveLoadedFilmsType = (films: any[]) => void;
  const receiveLoadedFilms: receiveLoadedFilmsType = (films) => {
    try {
      const cardsContent: ICardContent[] = [];
      films.forEach((film) => {
        const filmCategory = film.category || category;

        const cardContent: ICardContent = {
          id: film.id,
          title: film.title || film.name,
          overview: film.overview,
          image: `${apiConsts.imageUrl}${film['poster_path']}`,
          category: filmCategory
        };

        cardsContent.push(cardContent);
      });
      successCb(cardsContent);
    } catch {
      errorCb();
    }
  }

  switch (category){
    case 'movies':
      requestFilms(receiveLoadedFilms, errorCb, 'movie', page);
      break;
    case 'tvshows':
      requestFilms(receiveLoadedFilms, errorCb, 'tv', page);
      break;
    case 'library':
      requestFilmsFromLib(successCb, page);
      break;
    default:
      successCb(undefined);
  }
}