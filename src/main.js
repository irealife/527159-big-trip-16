import {RenderPosition, renderElement} from './render';
import SiteMenuTripView from './view/site-menu-trip-view';
import SiteMenuNavigationView from './view/site-menu-navigation-view';
import SiteMenuFilterView from './view/site-menu-filter-view';
import PointsListFilterView from './view/points-list-filter-view';
import PointListView from './view/point-list-view';
import PointItemView from './view/point-item-view';
import EditPointView from './view/edit-point-view';
import {generatePoint} from './mock/point';
import {POINT_COUNT} from './const';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMenuElement = document.querySelector('.trip-main__trip-controls');
const siteControlsNavigationElement = siteMenuElement.querySelector('.trip-controls__navigation');
const siteControlsFiltersElement = siteMenuElement.querySelector('.trip-controls__filters');

renderElement(siteHeaderElement, new SiteMenuTripView().element, RenderPosition.AFTERBEGIN);
renderElement(siteControlsNavigationElement, new SiteMenuNavigationView().element, RenderPosition.AFTERBEGIN);
renderElement(siteControlsFiltersElement, new SiteMenuFilterView().element, RenderPosition.BEFOREEND);

const pageMainElement = document.querySelector('.page-main');
const tripPointsElement = pageMainElement.querySelector('.trip-events');

renderElement(tripPointsElement, new PointsListFilterView().element, RenderPosition.AFTERBEGIN);
renderElement(tripPointsElement, new PointListView().element, RenderPosition.BEFOREEND);

const points = Array.from({length: POINT_COUNT}, generatePoint);

const pointListElement = tripPointsElement.querySelector('.trip-events__list');

renderElement(pointListElement, new EditPointView(points[0]).element, RenderPosition.AFTERBEGIN);

for (let i = 1; i < POINT_COUNT; i++) {
  renderElement(pointListElement, new PointItemView(points[i]).element, RenderPosition.BEFOREEND);
}
