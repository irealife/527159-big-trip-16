import {RenderPosition, render, replace} from './utils/render';
import SiteMenuTripView from './view/site-menu-trip-view';
import SiteMenuNavigationView from './view/site-menu-navigation-view';
import SiteMenuFilterView from './view/site-menu-filter-view';
import PointsListFilterView from './view/points-list-filter-view';
import PointListView from './view/point-list-view';
import PointItemView from './view/point-item-view';
import EditPointView from './view/edit-point-view';
import PointListEmpty from './view/point-list-empty';
import {generatePoint} from './mock/point';
import {POINT_COUNT} from './const';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMenuElement = siteHeaderElement.querySelector('.trip-main__trip-controls');
const siteControlsNavigationElement = siteMenuElement.querySelector('.trip-controls__navigation');
const siteControlsFiltersElement = siteMenuElement.querySelector('.trip-controls__filters');

const renderPoint = (pointElement, point) => {
  const pointComponent = new PointItemView(point);
  const pointEditComponent = new EditPointView(point);
  const replacePointToForm = () => replace(pointEditComponent, pointComponent);
  const replaceFormToPoint = () => replace(pointComponent, pointEditComponent);
  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };
  pointComponent.setEditClickHandler(() => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });
  pointEditComponent.setCloseEditClickHandler(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });
  render(pointElement, pointComponent.element, RenderPosition.BEFOREEND);
};

render(siteHeaderElement, new SiteMenuTripView(), RenderPosition.AFTERBEGIN);
render(siteControlsNavigationElement, new SiteMenuNavigationView(), RenderPosition.AFTERBEGIN);
render(siteControlsFiltersElement, new SiteMenuFilterView(), RenderPosition.BEFOREEND);

const pageMainElement = document.querySelector('.page-main');
const tripPointsElement = pageMainElement.querySelector('.trip-events');

const points = Array.from({length: POINT_COUNT}, generatePoint);

if (points.length === 0) {
  render(tripPointsElement, new PointListEmpty(), RenderPosition.BEFOREEND);
} else {
  render(tripPointsElement, new PointsListFilterView(), RenderPosition.AFTERBEGIN);
  render(tripPointsElement, new PointListView(), RenderPosition.BEFOREEND);
  for (let i = 0; i < POINT_COUNT; i++) {
    const pointListElement = tripPointsElement.querySelector('.trip-events__list');
    renderPoint(pointListElement, points[i]);
  }
}
