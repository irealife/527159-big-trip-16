import {SortType} from '../const';
import AbstractView from './abstract-view';

const disabledSortTypes = [
  SortType.EVENT,
  SortType.OFFERS,
];

const createPointsListFilterTemplate = (currentSortType) => {
  const sortingElements = Object.values(SortType).map((sort) => `<div class="trip-sort__item  trip-sort__item--${sort}">
    <input
      id="sort-${sort}"
      class="trip-sort__input  visually-hidden"
      type="radio"
      name="trip-sort"
      value="${sort}"
      ${sort === currentSortType ? 'checked' : ''}
      ${disabledSortTypes.includes(sort) ? 'disabled' : ''}
    />
    <label
      class="trip-sort__btn"
      for="sort-${sort}"
    >
      ${sort}
    </label>
</div>`).join('');
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">${sortingElements}</form>`;
};

export default class PointsListSortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createPointsListFilterTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.value);
  }
}
