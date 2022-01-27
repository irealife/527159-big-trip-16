import {RenderPosition, render, remove} from './utils/render';
import TripInfoView from './view/trip-info-view';
import TripTabsView from './view/trip-tabs-view';
import StatisticsView from './view/statistics-view';
import {MenuItem, pointTypes} from './const';
import TripPresenter from './presenter/trip-presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import ApiService from './api-service';

const AUTHORIZATION = 'Basic nhsdgoiafb837tyv';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

const tripMainElement = document.querySelector('.trip-main');
const tripControlsElement = tripMainElement.querySelector('.trip-main__trip-controls');
const tripNavigationElement = tripControlsElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripControlsElement.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel(new ApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const tripTabsComponent = new TripTabsView();

render(tripMainElement, new TripInfoView(), RenderPosition.AFTERBEGIN);

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
      statisticsComponent = new StatisticsView(pointsModel.points, pointTypes);
      render(pageMainElement, statisticsComponent, RenderPosition.AFTERBEGIN);
      break;
  }
};

filterPresenter.init();
tripPresenter.init();
pointsModel.init().finally(() => {
  render(tripNavigationElement, tripTabsComponent, RenderPosition.AFTERBEGIN);
  tripTabsComponent.setMenuClickHandler(handleSiteMenuClick);
});

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
