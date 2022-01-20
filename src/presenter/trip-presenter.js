import PointPresenter from '../presenter/point-presenter';
import PointListEmpty from '../view/point-list-empty';
import PointsListSortView from '../view/points-list-sort-view';
import PointListView from '../view/point-list-view';
import {render, RenderPosition, remove} from '../utils/render';
import {sortByDay, sortByTime, sortByPrice} from '../utils/point';
import {POINT_COUNT, SortType, UpdateType, UserAction} from '../const';

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #sortComponent = null;
  #pointListComponent = new PointListView();
  #pointEmptyComponent = new PointListEmpty();

  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;

  constructor(tripContainer, pointsModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.DAY:
        return [...this.#pointsModel.points].sort(sortByDay);
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortByTime);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortByPrice);
    }
    return this.#pointsModel.points;
  }

  init = () => {
    this.#renderTripPoints();
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTripPoints();
        this.#renderTripPoints();
        break;
      case UpdateType.MAJOR:
        this.#clearTripPoints({resetSortType: true});
        this.#renderTripPoints();
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearTripPoints();
    this.#renderTripPoints();
  }

  #renderSort = () => {
    this.#sortComponent = new PointsListSortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#tripContainer, this.#sortComponent, RenderPosition.AFTERBEGIN);
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPointList = () => {
    render(this.#tripContainer, this.#pointListComponent, RenderPosition.BEFOREEND);
  }

  #renderEmptyPoints = () => {
    render(this.#tripContainer, this.#pointEmptyComponent, RenderPosition.BEFOREEND);
  }

  #clearTripPoints = ({resetSortType = false} = {}) => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    remove(this.#sortComponent);
    remove(this.#pointEmptyComponent);
    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderTripPoints = () => {
    const pointCount = this.points.length;
    if (pointCount === 0) {
      this.#renderEmptyPoints();
      return;
    }
    this.#renderSort();
    this.#renderPointList();
    for (let i = 0; i < POINT_COUNT; i++) {
      this.#renderPoint(this.points[i]);
    }
  }
}
