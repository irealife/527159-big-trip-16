import {pointListSorts} from '../utils/point';
import {SortType} from '../const';
import AbstractView from './abstract-view';

const createPointListSorts = (pointListSortCurrent = SortType.DAY) => pointListSorts.map((sort) => `<div class="trip-sort__item  trip-sort__item--${sort}">
  <input id="sort-${sort}" data-sort-type="${sort}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sort}" ${pointListSortCurrent === sort ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-${sort}">${sort}</label>
</div>`).join('');

const createPointsListFilterTemplate = () => `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">${createPointListSorts()}</form>`;

export default class PointsListSortView extends AbstractView {
  get template() {
    return createPointsListFilterTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
