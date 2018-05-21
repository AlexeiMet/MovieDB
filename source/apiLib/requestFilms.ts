import {apiConsts} from './apiConsts';

type requestFilmsType = (successCb: Function, errorCb: Function, category: string, page: number) => void;
export const requestFilms: requestFilmsType = (successCb, errorCb, category, page) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', `${apiConsts.url}/${category}/popular?api_key=${apiConsts.key}&page=${page}`);
  xhr.onload = () => {
    const responseResults: object[] = JSON.parse(xhr.responseText).results;
    successCb(responseResults);
  }
  xhr.onerror = () => {
    errorCb(xhr.status, xhr.statusText);
  }
  xhr.send();
}