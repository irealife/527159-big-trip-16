import {pointStateFilters} from '../utils';
import {PointStateFilter} from '../const';

export const createSiteMenuFilterTemplate = () => {
  const createPointStateFilters = (pointFilterCurrent = PointStateFilter.EVERYTHING) =>
    pointStateFilters.map((filter) =>`<div class="trip-filters__filter">
      <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${pointFilterCurrent === filter ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
    </div>`).join('');

  const pointStateFilter = createPointStateFilters();
  return `<form class="trip-filters" action="#" method="get">${pointStateFilter}</form>`;
};
