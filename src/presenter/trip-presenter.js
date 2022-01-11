import PointPresenter from '../presenter/point-presenter';
import PointListEmpty from '../view/point-list-empty';
import PointsListSortView from '../view/points-list-sort-view';
import PointListView from '../view/point-list-view';
import {render, RenderPosition} from '../utils/render';
import {updateItem} from '../utils/common';
import {sortByDay, sortByTime, sortByPrice} from '../utils/point';
import {POINT_COUNT, SortType} from '../const';

export default class TripPresenter {
  #tripContainer = null;
  #sortComponent = new PointsListSortView();
  #pointListComponent = new PointListView();
  #pointEmptyComponent = new PointListEmpty();

  #tripPoints = [];
  #sourceTripPoints = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;

  constructor(tripContainer) {
    this.#tripContainer = tripContainer;
  }

  init = (tripPoints) => {
    this.#tripPoints = [...tripPoints];
    this.#sourceTripPoints = [...tripPoints];
    this.#renderSort();
    this.#renderPointList();
    this.#renderTripPoints();
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #handlePointChange = (updatePoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatePoint);
    this.#sourceTripPoints = updateItem(this.#sourceTripPoints, updatePoint);
    this.#pointPresenter.get(updatePoint.id).init(updatePoint);
  }

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.DAY:
        this.#tripPoints.sort(sortByDay);
        break;
      case SortType.TIME:
        this.#tripPoints.sort(sortByTime);
        break;
      case SortType.PRICE:
        this.#tripPoints.sort(sortByPrice);
        break;
      default:
        this.#tripPoints = [...this.#sourceTripPoints];
    }
    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderTripPoints();
  }

  #renderSort = () => {
    render(this.#tripContainer, this.#sortComponent, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
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
