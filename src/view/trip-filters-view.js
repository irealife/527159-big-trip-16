import AbstractView from './abstract-view';

const createFilterItemTemplate = (filter, currentFilterType) => `<div class="trip-filters__filter">
  <input
    id="filter-${filter.type}"
    class="trip-filters__filter-input  visually-hidden"
    type="radio"
    name="trip-filter"
    value="${filter.type}"
    ${currentFilterType === filter.type ? 'checked' : ''}
  />
  <label
    class="trip-filters__filter-label"
    for="filter-${filter.type}"
  >
    ${filter.type}
  </label>
</div>`;

const createFilterTypeTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('');
  return `<form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}
  </form>`;
};

export default class TripFiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTypeTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}
