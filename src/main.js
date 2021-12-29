import {RenderPosition, render} from './render';
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
  const replacePointToForm = () => pointElement.replaceChild(pointEditComponent.element, pointComponent.element);
  const replaceFormToPoint = () => pointElement.replaceChild(pointComponent.element, pointEditComponent.element);
  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };
  pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });
  pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });
  render(pointElement, pointComponent.element, RenderPosition.BEFOREEND);
};

render(siteHeaderElement, new SiteMenuTripView().element, RenderPosition.AFTERBEGIN);
render(siteControlsNavigationElement, new SiteMenuNavigationView().element, RenderPosition.AFTERBEGIN);
render(siteControlsFiltersElement, new SiteMenuFilterView().element, RenderPosition.BEFOREEND);

const pageMainElement = document.querySelector('.page-main');
const tripPointsElement = pageMainElement.querySelector('.trip-events');

const points = Array.from({length: POINT_COUNT}, generatePoint);

if (points.length === 0) {
  render(tripPointsElement, new PointListEmpty().element, RenderPosition.BEFOREEND);
} else {
  render(tripPointsElement, new PointsListFilterView().element, RenderPosition.AFTERBEGIN);
  render(tripPointsElement, new PointListView().element, RenderPosition.BEFOREEND);
  for (let i = 0; i < POINT_COUNT; i++) {
    const pointListElement = tripPointsElement.querySelector('.trip-events__list');
    renderPoint(pointListElement, points[i]);
  }
}
