import PointPresenter from '../presenter/point-presenter';
import PointListEmpty from '../view/point-list-empty';
import PointsListFilterView from '../view/points-list-filter-view';
import PointListView from '../view/point-list-view';
import {render, RenderPosition} from '../utils/render';
import {updateItem} from '../utils/common';
import {POINT_COUNT} from '../const';

export default class TripPresenter {
  #tripContainer = null;

  #sortComponent = new PointsListFilterView();
  #pointListComponent = new PointListView();
  #pointEmptyComponent = new PointListEmpty();

  #tripPoints = [];
  #pointPresenter = new Map();

  constructor(tripContainer) {
    this.#tripContainer = tripContainer;
  }

  init = (tripPoints) => {
    this.#tripPoints = [...tripPoints];
    this.#renderSort();
    this.#renderPointList();
    this.#renderTripPoints();
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #handlePointChange = (updatePoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatePoint);
    this.#pointPresenter.get(updatePoint.id).init(updatePoint);
  }

  #renderSort = () => {
    render(this.#tripContainer, this.#sortComponent, RenderPosition.AFTERBEGIN);
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #renderPointList = () => {
    render(this.#tripContainer, this.#pointListComponent, RenderPosition.BEFOREEND);
  }

  #renderEmptyPoints = () => {
    render(this.#tripContainer, this.#pointEmptyComponent, RenderPosition.BEFOREEND);
  }

  #renderTripPoints = () => {
    if (this.#tripPoints.length === 0) {
      this.#renderEmptyPoints();
      return;
    }
    for (let i = 0; i < POINT_COUNT; i++) {
      this.#renderPoint(this.#tripPoints[i]);
    }
  }
}
