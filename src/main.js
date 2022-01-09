import {RenderPosition, render} from './utils/render';
import SiteMenuTripView from './view/site-menu-trip-view';
import SiteMenuNavigationView from './view/site-menu-navigation-view';
import SiteMenuFilterView from './view/site-menu-filter-view';
import {generatePoint} from './mock/point';
import {POINT_COUNT} from './const';
import TripPresenter from './presenter/trip-presenter';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMenuElement = siteHeaderElement.querySelector('.trip-main__trip-controls');
const siteControlsNavigationElement = siteMenuElement.querySelector('.trip-controls__navigation');
const siteControlsFiltersElement = siteMenuElement.querySelector('.trip-controls__filters');

render(siteHeaderElement, new SiteMenuTripView(), RenderPosition.AFTERBEGIN);
render(siteControlsNavigationElement, new SiteMenuNavigationView(), RenderPosition.AFTERBEGIN);
render(siteControlsFiltersElement, new SiteMenuFilterView(), RenderPosition.BEFOREEND);

const pageMainElement = document.querySelector('.page-main');
const tripPointsElement = pageMainElement.querySelector('.trip-events');

const points = Array.from({length: POINT_COUNT}, generatePoint);

const tripPresenter = new TripPresenter(tripPointsElement);

tripPresenter.init(points);
