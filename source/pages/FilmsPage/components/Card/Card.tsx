import * as React from 'react';
import {Link} from 'react-router-dom';
import {LibraryConsumer} from './../../../../contexts/LibraryContext';
import {NotificationConsumer} from '../../../../contexts/NotificationsContext';
const s: {[props: string]: string} = require('./Card.css');

export interface ICardContent {
  id: number;
  title: string;
  overview: string;
  image: string;
  category: string
}

interface ICardPropsContent {
  children: ICardContent;
  onRemoveFilm: (id: number) => void
}
interface ICardProps extends ICardPropsContent {
  savedFilms: ICardContent[];
  addFilm: (film: ICardContent) => void;
  removeFilm: (id: number) => void;
  showNotification: (message: string, tone: '-' | '+') => void
}

interface ICardState {
  overview: boolean
}

class Card extends React.PureComponent<ICardProps, ICardState> {
  state = {
    overview: false
  }

  isSaved = () => {
    return this.props.savedFilms.some((savedFilm) => {
      return savedFilm.id === this.props.children.id
    })
  }

  handleAdd = () => {
    this.props.addFilm(this.props.children);
    const message = `'${this.props.children.title}' has been added successfully`;
    this.props.showNotification(message, '+');
  }

  handleRemove = () => {
    this.props.onRemoveFilm(this.props.children.id);
    const message = `'${this.props.children.title}' has been removed successfully`;
    this.props.showNotification(message, '-');
  }

  toggleOverview = () => {
    this.setState({overview: !this.state.overview});
  }

  closeOverview = () => {
    this.setState({overview: false});
  }

  public render() {
    const cardClass = this.isSaved() ? `${s.card} ${s.cardSaved}` : s.card;
    return (
      <div onMouseLeave={this.closeOverview} style={{backgroundImage: `url(${this.props.children.image})`}} className={cardClass}>
        <div className={s.cardHover}>
          <div className={s.cardHeader}>
            <div onClick={this.toggleOverview} className={s.cardOverviewIcon}></div>
            {
              this.isSaved() ?
                <div onClick={this.handleRemove} className={s.cardRemove}></div> :
                <div onClick={this.handleAdd} className={s.cardAdd}></div>
            }
          </div>
          <Link to={`/film/${this.props.children.category}/${this.props.children.id}`}  className={s.cardMain}>
            <div className={s.cardTitle}>{this.props.children.title}</div>
            <div className={
              this.state.overview ?
                `${s.cardOverviewContent} ${s.cardOverviewContentShown}` :
                s.cardOverviewContent
            }>
              {this.props.children.overview}
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

const LibraryContextNotificationContextCard = (props: ICardPropsContent) =>
  <LibraryConsumer>
    {libraryContext => {
      return (
        <NotificationConsumer>
          {notificationContext => {
            const cardProps = {...props, ...libraryContext, ...notificationContext};
            return (
              <Card {...cardProps} />
            )
          }}
        </NotificationConsumer>
      )
    }}
  </LibraryConsumer>

export {LibraryContextNotificationContextCard as Card}