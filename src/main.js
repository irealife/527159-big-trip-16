import {RenderPosition, render, remove} from './utils/render';
import TripInfoView from './view/trip-info-view';
import TripTabsView from './view/trip-tabs-view';
import StatisticsView from './view/statistics-view';
import {generatePoint} from './mock/point';
import {POINT_COUNT, MenuItem} from './const';
import TripPresenter from './presenter/trip-presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';

const points = Array.from({length: POINT_COUNT}, generatePoint);

const pointsModel = new PointsModel();
pointsModel.points = points;
const filterModel = new FilterModel();

const tripMainElement = document.querySelector('.trip-main');
const tripControlsElement = tripMainElement.querySelector('.trip-main__trip-controls');
const tripNavigationElement = tripControlsElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripControlsElement.querySelector('.trip-controls__filters');

const tripTabsComponent = new TripTabsView();

render(tripMainElement, new TripInfoView(), RenderPosition.AFTERBEGIN);
render(tripNavigationElement, tripTabsComponent, RenderPosition.AFTERBEGIN);

const pageMainElement = document.querySelector('.page-main');
const tripPointsElement = pageMainElement.querySelector('.trip-events');

const filterPresenter = new FilterPresenter(tripFiltersElement, filterModel);
const tripPresenter = new TripPresenter(tripPointsElement, pointsModel, filterModel);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      filterPresenter.init();
      tripPresenter.destroy();
      tripPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATS:
      filterPresenter.destroy();
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.points);
      render(pageMainElement, statisticsComponent, RenderPosition.AFTERBEGIN);
      break;
  }
};

tripTabsComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
tripPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
