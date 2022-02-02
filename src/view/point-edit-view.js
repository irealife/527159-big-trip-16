import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import {pointTypes} from '../const';
import {toUpperCaseFirstSymbol, getDateTimeFullFormat} from '../utils/point';
import SmartView from './smart-view';
import dayjs from 'dayjs';

const BLANK_POINT = {
  pointType: pointTypes[0],
  destination: undefined,
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().toDate(),
  price: '',
  offers: {},
  isFavorite: false,
};

const createPointTypes = (pointTypeCurrent, isDisabled) => pointTypes.map((type) => `<div class="event__type-item">
  <input
    id="event-type-${type}-1"
    class="event__type-input  visually-hidden"
    type="radio"
    name="event-type"
    value="${type}"
    ${pointTypeCurrent === type ? 'checked' : ''}
    ${isDisabled ? 'disabled' : ''}
  />
  <label
    class="event__type-label  event__type-label--${type}"
    for="event-type-${type}-1"
  >
    ${toUpperCaseFirstSymbol(type)}
  </label>
</div>`).join('');

const createPointOffers = (offer) => `<div class="event__offer-selector">
  <input
    class="event__offer-checkbox  visually-hidden"
    id="event-offer-${offer.title}-1"
    type="checkbox"
    value="${offer.id}"
    name="event-offer-${offer.title}"
    ${offer.isChecked ? 'checked' : ''}
  />
  <label
    class="event__offer-label"
    for="event-offer-${offer.title}-1"
  >
    <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </label>
</div>`;

const createEditPointTemplate = (data, destinations, offers) => {
  const pointTypeTemplate = createPointTypes(data.pointType, data.isDisabled);
  return `<form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${data.pointType}.png" alt="Event type icon" ${data.isDisabled ? 'disabled' : ''}>
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
              ${pointTypeTemplate}
           </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">${data.pointType}</label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${data.destination ? data.destination.name : ''}" list="destination-list-1" required="true">
        <datalist id="destination-list-1" ${data.isDisabled ? 'disabled' : ''}>${Object.values(destinations).map((item) => `<option value="${item.name}"></option>`).join('')}</datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value=${getDateTimeFullFormat(data.dateFrom)}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value=${getDateTimeFullFormat(data.dateTo)}>
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">${data.price}</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value=${data.price} required="true">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit" ${data.isDisabled ? 'disabled' : ''}>${data.isSaving ? 'saving...' : 'save'}</button>
      <button class="event__reset-btn" type="reset" ${data.isDisabled ? 'disabled' : ''}>${data.isDeleting ? 'deleting' : 'delete'}</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${offers[data.pointType].offers.map((offer) => createPointOffers({...offer, isChecked: !!data.offers[offer.id]})).join('')}
        </div>
      </section>
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${data.destination ? data.destination.description : ''}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${data.destination ? data.destination.pictures.map((image) => `<img class="event__photo" src="${image.src}" alt="${image.description}">`).join('') : ''}
          </div>
        </div>
      </section>
    </section>
  </form>`;
};

export default class PointEditView extends SmartView {
  #destinations = [];
  #offers = {};
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor(destinations, offers, point = BLANK_POINT) {
    super();
    this._data = PointEditView.parsePointToData(point);
    this.#destinations = destinations;
    this.#offers = offers;
    this.#setInnerHandlers();
    this.#setDateFromPicker();
    this.#setDateToPicker();
  }

  get template() {
    return createEditPointTemplate(this._data, this.#destinations, this.#offers);
  }

  removeElement = () => {
    super.removeElement();
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset = (point) => {
    this.updateData(
      PointEditView.parsePointToData(point),
    );
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDateFromPicker();
    this.#setDateToPicker();
    this.setFormSubmitHandler(this._callback.saveFormSubmit);
    this.setCloseEditClickHandler(this._callback.closeEditClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  setCloseEditClickHandler = (callback) => {
    this._callback.closeEditClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeEditClickHandler);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.saveFormSubmit = callback;
    this.element.addEventListener('submit', this.#saveFormSubmitHandler);
  }

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
  }

  #closeEditClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeEditClick();
  }

  #setDateFromPicker = () => {
    if (this._data.dateFrom) {
      this.#datepickerFrom = flatpickr(
        this.element.querySelector('input[name="event-start-time"]'),
        {
          enableTime: true,
          dateFormat: 'd/m/Y H:i',
          defaultDate: this._data.dateFrom,
          onChange: this.#dateFromChangeHandler,
        },
      );
    }
  }

  #setDateToPicker = () => {
    if (this._data.dateTo) {
      this.#datepickerTo = flatpickr(
        this.element.querySelector('input[name="event-end-time"]'),
        {
          enableTime: true,
          dateFormat: 'd/m/Y H:i',
          defaultDate: this._data.dateTo,
          onChange: this.#dateToChangeHandler,
        },
      );
    }
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationInputHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#pointOfferChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#pointPriceChangeHandler);
  }

  #destinationInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      destination: this.#destinations[evt.target.value],
    });
  }

  #dateFromChangeHandler = ([userDate]) => {
    this.updateData({
      dateFrom: userDate,
    });
  }

  #dateToChangeHandler = ([userDate]) => {
    this.updateData({
      dateTo: userDate,
    });
  }

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      pointType: evt.target.value,
      offers: {},
    });
  }

  #pointOfferChangeHandler = (evt) => {
    const offers = this._data.offers;
    if (evt.target.checked) {
      offers[evt.target.value] = this.#offers[this._data.pointType].offers.find((offer) => offer.id === Number(evt.target.value));
    } else {
      delete offers[evt.target.value];
    }
    this.updateData({
      offers,
    }, true);
  };

  #pointPriceChangeHandler = (evt) => {
    this.updateData({
      price: Number(evt.target.value),
    }, true);
  }

  #saveFormSubmitHandler = (evt) => {
    evt.preventDefault();
    this.element.reportValidity();
    this._callback.saveFormSubmit(PointEditView.parseDataToPoint(this._data));
  }

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(PointEditView.parseDataToPoint(this._data));
  }

  static parsePointToData = (point) => ({...point,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseDataToPoint = (data) => {
    const point = {...data};
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }
}
