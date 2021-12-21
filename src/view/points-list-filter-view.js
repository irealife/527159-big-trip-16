import {pointListSorts} from '../utils';
import {PointListSort} from '../const';

const createPointListSorts = (pointListSortCurrent = PointListSort.DAY) =>
  pointListSorts.map((sort) => `<div class="trip-sort__item  trip-sort__item--${sort}">
    <input id="sort-${sort}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sort}" ${pointListSortCurrent === sort ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-${sort}">${sort}</label>
  </div>`).join('');

export const createPointsListFilterTemplate = () => {
  const pointsSort = createPointListSorts();
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">${pointsSort}</form>`;
};
