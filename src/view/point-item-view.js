import {getDateDuration, getDateStartFormat, getDateNoYearFormat, getDateTimeFullFormat, getTimeFormat} from '../utils/point';
import AbstractView from './abstract-view';

const getPointOffers = (offers) => {
  const pointOffers = [];
  for (const offer of offers) {
    pointOffers.push(
      `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`
    );
  }
  return `${pointOffers.join('')}`;
};

const createPointItemTemplate = (point) => `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime=${getDateStartFormat(point.dateFrom)}>${getDateNoYearFormat(point.dateFrom)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${point.pointType}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${point.pointType} ${point.destination}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime=${getDateTimeFullFormat(point.dateFrom)}>${getTimeFormat(point.dateFrom)}</time>
        &mdash;
        <time class="event__end-time" datetime=${getDateTimeFullFormat(point.dateTo)}>${getTimeFormat(point.dateTo)}</time>
      </p>
      <p class="event__duration">${getDateDuration(point.dateFrom, point.dateTo)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${point.price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">${point.offers.length !== 0 ? getPointOffers(point.offers) : ''}</ul>
    <button class="event__favorite-btn ${point.isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;

export default class PointItemView extends AbstractView {
  #point = null;

  constructor(point) {
    super();
    this.#point = point;
  }

  get template() {
    return createPointItemTemplate(this.#point);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  }
}
