import {pointListSorts} from '../utils/point';
import {PointListSort} from '../const';
import AbstractView from './abstract-view';

const createPointListSorts = (pointListSortCurrent = PointListSort.DAY) => pointListSorts.map((sort) => `<div class="trip-sort__item  trip-sort__item--${sort}">
  <input id="sort-${sort}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sort}" ${pointListSortCurrent === sort ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-${sort}">${sort}</label>
</div>`).join('');

const createPointsListFilterTemplate = () => `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">${createPointListSorts()}</form>`;

export default class PointsListFilterView extends AbstractView {
  get template() {
    return createPointsListFilterTemplate();
  }
}
