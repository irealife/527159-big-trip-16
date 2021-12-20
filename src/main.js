import {renderTemplate} from './render';
import {createSiteMenuTripTemplate} from './view/site-menu-trip-view';
import {createSiteMenuNavigationTemplate} from './view/site-menu-navigation-view';
import {createSiteMenuFilterTemplate} from './view/site-menu-filter-view';
import {createPointsListFilterTemplate} from './view/points-list-filter-view';
import {createPointListTemplate} from './view/point-list-view';
import {createPointItemTemplate} from './view/point-item-view';
import {createEditPointTemplate} from './view/edit-point-view';
import {generatePoint} from './mock/point';
import {POINT_COUNT, RenderPosition} from './const';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMenuElement = document.querySelector('.trip-main__trip-controls');
const siteControlsNavigationElement = siteMenuElement.querySelector('.trip-controls__navigation');
const siteControlsFiltersElement = siteMenuElement.querySelector('.trip-controls__filters');

renderTemplate(siteHeaderElement, createSiteMenuTripTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(siteControlsNavigationElement, createSiteMenuNavigationTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(siteControlsFiltersElement, createSiteMenuFilterTemplate());

const pageMainElement = document.querySelector('.page-main');
const tripPointsElement = pageMainElement.querySelector('.trip-events');

renderTemplate(tripPointsElement, createPointsListFilterTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(tripPointsElement, createPointListTemplate());

const points = Array.from({length: POINT_COUNT}, generatePoint);

const pointListElement = tripPointsElement.querySelector('.trip-events__list');

renderTemplate(pointListElement, createEditPointTemplate(points[0]), RenderPosition.AFTERBEGIN);

for (let i = 1; i < POINT_COUNT; i++) {
  renderTemplate(pointListElement, createPointItemTemplate(points[i]));
}
