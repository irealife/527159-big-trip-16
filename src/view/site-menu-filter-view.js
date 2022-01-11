import {pointStateFilters} from '../utils/point';
import {StateFilter} from '../const';
import AbstractView from './abstract-view';

const createPointStateFilters = (pointFilterCurrent = StateFilter.EVERYTHING) => pointStateFilters.map((filter) =>`<div class="trip-filters__filter">
  <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${pointFilterCurrent === filter ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
</div>`).join('');

const createSiteMenuFilterTemplate = () => `<form class="trip-filters" action="#" method="get">${createPointStateFilters()}</form>`;

export default class SiteMenuFilterView extends AbstractView {
  get template() {
    return createSiteMenuFilterTemplate();
  }
}
