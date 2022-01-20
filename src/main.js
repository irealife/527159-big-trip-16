import {RenderPosition, render} from './utils/render';
import SiteMenuTripView from './view/site-menu-trip-view';
import SiteMenuNavigationView from './view/site-menu-navigation-view';
import {generatePoint} from './mock/point';
import {POINT_COUNT} from './const';
import TripPresenter from './presenter/trip-presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';

const points = Array.from({length: POINT_COUNT}, generatePoint);

const pointsModel = new PointsModel();
pointsModel.points = points;
const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.trip-main');
const siteMenuElement = siteHeaderElement.querySelector('.trip-main__trip-controls');
const siteControlsNavigationElement = siteMenuElement.querySelector('.trip-controls__navigation');
const siteControlsFiltersElement = siteMenuElement.querySelector('.trip-controls__filters');

render(siteHeaderElement, new SiteMenuTripView(), RenderPosition.AFTERBEGIN);
render(siteControlsNavigationElement, new SiteMenuNavigationView(), RenderPosition.AFTERBEGIN);

const pageMainElement = document.querySelector('.page-main');
const tripPointsElement = pageMainElement.querySelector('.trip-events');

const filterPresenter = new FilterPresenter(siteControlsFiltersElement, filterModel);
const tripPresenter = new TripPresenter(tripPointsElement, pointsModel);

filterPresenter.init();
tripPresenter.init();
