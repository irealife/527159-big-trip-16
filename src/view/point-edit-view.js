import {pointTypes} from '../const';
import {destinations, toUpperCaseFirstSymbol, getDateTimeFullFormat} from '../utils/point';
import AbstractView from './abstract-view';

const BLANK_POINT = {
  dateFrom: null,
  pointType: pointTypes[0],
  destination: destinations[0],
  descriptions: '',
  dateTo: null,
  price: '',
  offers: '',
};

const createPointTypes = (pointTypeCurrent) => pointTypes.map((type) => `<div class="event__type-item">
  <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${pointTypeCurrent === type ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${toUpperCaseFirstSymbol(type)}</label>
</div>`).join('');

const createPointOffers = (offer) => `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1" type="checkbox" name="event-offer-${offer.title}" ${offer.isChecked ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${offer.title}-1">
      <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
</div>`;

// в коде не работает сейчас, если подставить это выражение с классом event__destination-description
//${point.descriptions[point.destination].text}

const createEditPointTemplate = (point) => `<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${point.pointType}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
            ${createPointTypes(point.pointType)}
         </fieldset>
      </div>
    </div>
    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">${point.pointType}</label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${point.destination} list="destination-list-1">
      <datalist id="destination-list-1">${destinations.map((item) => `<option value="${item}"></option>`).join('')}</datalist>
    </div>
    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value=${getDateTimeFullFormat(point.dateFrom)}>
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value=${getDateTimeFullFormat(point.dateTo)}>
    </div>
    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">${point.price}</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${point.price}>
    </div>
    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${Object.values(point.offers).map((item) => createPointOffers(item)).join('')}
      </div>
    </section>
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">Текст</p>
    </section>
  </section>
</form>`;

export default class PointEditView extends AbstractView {
  #point = null;

  constructor(point = BLANK_POINT) {
    super();
    this.#point = point;
  }

  get template() {
    return createEditPointTemplate(this.#point);
  }

  setCloseEditClickHandler = (callback) => {
    this._callback.closeEditClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeEditClickHandler);
  }

  #closeEditClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeEditClick();
  }
}
