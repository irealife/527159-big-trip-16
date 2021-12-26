import {pointStateFilters} from '../utils';
import {PointStateFilter} from '../const';
import {createElement} from '../render';

const createSiteMenuFilterTemplate = () => {
  const createPointStateFilters = (pointFilterCurrent = PointStateFilter.EVERYTHING) =>
    pointStateFilters.map((filter) =>`<div class="trip-filters__filter">
      <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${pointFilterCurrent === filter ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
    </div>`).join('');

  const pointStateFilter = createPointStateFilters();
  return `<form class="trip-filters" action="#" method="get">${pointStateFilter}</form>`;
};

export default class SiteMenuFilterView {
  #element = null;

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createSiteMenuFilterTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
