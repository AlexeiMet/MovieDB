import * as React from 'react';
import {Switch, Route} from 'react-router-dom';
import ResizeObserver from 'resize-observer-polyfill';
// Components
import {PageWrapper} from './../../common-components/PageWrapper/PageWrapper';
import {Card} from './components/Card/Card';
import {ICardContent} from './components/Card/Card';
// Contexts
import {LibraryConsumer} from './../../contexts/LibraryContext';
// Helper functions
import {getUniqKey} from './../../common-helper-functions/getUniqKey';
import {loadFilms} from './helper-functions/loadFilms';
import {executeIfScrolledDown} from './helper-functions/executeIfScrolledDown';
import {apiConsts} from './../../apiLib/apiConsts';

const s: {[props: string]: string} = require('./FilmsPage.css');

interface IFilmsPagePropsCategory {
  match: {
    params: {
      category: string | undefined
    }
  }
}
interface IFilmsPageProps extends IFilmsPagePropsCategory {
  libraryContext: {
    savedFilms: ICardContent[];
    addFilm: (film: ICardContent) => void;
    removeFilm: (id: number) => void
  }
}

interface IFilmsPageState {
  cardsContent: ICardContent[];
  loaded: boolean;
  error: boolean;
  allContentLoaded: boolean
}

class FilmsPage extends React.PureComponent<IFilmsPageProps, IFilmsPageState> {
  public cardsGrid: HTMLElement
  public pageWrapperComp: PageWrapper

  state: IFilmsPageState = {
    cardsContent: [],
    loaded: false,
    error: false,
    allContentLoaded: false
  }

  componentIsUnmount = false

  addCardsContent = (content: ICardContent[] | undefined) => {
    if (!content || this.componentIsUnmount) return;
    const cardsContent = [...this.state.cardsContent].splice(0, this.getCurrentPage()*apiConsts.cardsOnPage);
    const newCardsContent = cardsContent.concat(content);
    this.setState({cardsContent: newCardsContent});
  }

  loadCardsContent = () => {
    if (this.state.loaded || this.state.allContentLoaded || this.componentIsUnmount) return;
    this.setState({loaded: true});
    const handleSuccess = (content: ICardContent[]) => {
      if (this.componentIsUnmount) return;
      this.addCardsContent(content);
      this.setState({loaded: false});
      if (content.length < apiConsts.cardsOnPage){
        this.setState({allContentLoaded: true});
      }
      const wrapper = this.pageWrapperComp.mainContentWrapperElem;
      executeIfScrolledDown(wrapper, this.loadCardsContent);
    }
    const handleError = (content: ICardContent[]) => {
      if (this.componentIsUnmount) return;
      this.setState({
        loaded: false,
        error: true
      })
    }
    loadFilms(handleSuccess, handleError, this.props.match.params.category, this.getCurrentPage() + 1);
  }

  getCurrentPage = (): number => {
    const page = Math.floor(this.state.cardsContent.length / apiConsts.cardsOnPage);
    return page;
  }

  resetPage = () => {
    if (this.componentIsUnmount) return;
    this.setState({
      cardsContent: [],
      loaded: false,
      error: false,
      allContentLoaded: false
    })
  }

  removeFilm = (id: number) => {
    if (this.props.match.params.category === 'library'){
      const newCardsContent = [...this.state.cardsContent];
      newCardsContent.forEach((content, i) => {
        if (content.id === id){
          newCardsContent.splice(i, 1);
        }
      })
      this.setState({cardsContent: newCardsContent});
    }
    this.props.libraryContext.removeFilm(id);
  }

  setCardsGridClass = () => {
    if (!this.cardsGrid) return;
    const cardsGridWidth = this.cardsGrid.offsetWidth;
    let cardsGridClass = s.cardsGrid;
    if (cardsGridWidth > 0 && cardsGridWidth <= 320){
      cardsGridClass = s['cardsGrid_extrasmall'];
    } else if (cardsGridWidth > 320 && cardsGridWidth <= 500){
      cardsGridClass += ' ' + s['cardsGrid_small'];
    } else if (cardsGridWidth > 500 && cardsGridWidth <= 750){
      cardsGridClass += ' ' + s['cardsGrid_medium'];
    } else if (cardsGridWidth > 750 && cardsGridWidth <= 1050){
      cardsGridClass += ' ' + s['cardsGrid_big'];
    } else if (cardsGridWidth > 1050){
      cardsGridClass += ' ' + s['cardsGrid_extrabig'];
    }
    this.cardsGrid.className = cardsGridClass;
  }

  componentWillReceiveProps(nextProps: IFilmsPageProps) {
    if (this.props.match.params.category !== nextProps.match.params.category){
      this.resetPage();
    }
  }

  componentDidUpdate(prevProps: IFilmsPageProps) {
    if (this.props.match.params.category !== prevProps.match.params.category){
      const wrapper = this.pageWrapperComp.mainContentWrapperElem;
      executeIfScrolledDown(wrapper, this.loadCardsContent);
    }
  }

  componentDidMount() {
    const wrapper = this.pageWrapperComp.mainContentWrapperElem;
    executeIfScrolledDown(wrapper, this.loadCardsContent);
    wrapper.addEventListener('scroll', () => {
      executeIfScrolledDown(wrapper, this.loadCardsContent);
    });
    const wrapperResizeObserver = new ResizeObserver(executeIfScrolledDown.bind(undefined, wrapper, this.loadCardsContent));
    wrapperResizeObserver.observe(wrapper);
    const cardsGridResizeObserver = new ResizeObserver(this.setCardsGridClass);
    cardsGridResizeObserver.observe(this.cardsGrid);
  }

  componentWillUnmount() {
    this.componentIsUnmount = true
  }

  render() {
    return (
      <PageWrapper ref={el => this.pageWrapperComp = el}>
        <div ref={el => this.cardsGrid = el} className={s.cardsGrid}>
          {
            this.state.cardsContent.map((content: ICardContent, i) => {
              return (
                <div key={getUniqKey()} className={s.cardWrapper}>
                  <Card onRemoveFilm={this.removeFilm}>{content}</Card>
                </div>
              )
            })
          }
        </div>
        {this.state.loaded && <div className={s.notification}>Please wait, content loaded...</div>}
        {this.state.error && <div className={s.notification}>Error on load!</div>}
        {this.state.allContentLoaded && 
          <div className={s.loadBtnWrapper}>
            <button onClick={this.loadCardsContent} className={s.loadBtn}>Refresh</button>
          </div>
        }
      </PageWrapper>
    );
  }
}

const LibraryContextHomePage = (props: IFilmsPagePropsCategory) =>
  <LibraryConsumer>
    {
      libraryContext => {
        const homeProps = {...props, libraryContext}
        return <FilmsPage {...homeProps} />
      }
    }
  </LibraryConsumer>

export {LibraryContextHomePage as FilmsPage}