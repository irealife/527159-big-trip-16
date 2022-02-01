import PointPresenter, {State as PointPresenterViewState} from '../presenter/point-presenter';
import PointNewPresenter from './point-new-presenter';
import PointListEmpty from '../view/point-list-empty';
import PointsListSortView from '../view/points-list-sort-view';
import PointListView from '../view/point-list-view';
import LoadingView from '../view/loading-view';
import {render, RenderPosition, remove} from '../utils/render';
import {sortByDay, sortByTime, sortByPrice} from '../utils/point';
import {filter} from '../utils/filter';
import {SortType, UpdateType, UserAction, FilterType} from '../const';

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #sortComponent = null;
  #pointListComponent = new PointListView();
  #loadingComponent = new LoadingView();
  #pointEmptyComponent = null;

  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  constructor(tripContainer, pointsModel, filterModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#pointListComponent, this.#pointsModel, this.#handleViewAction);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);
    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortByDay);
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }
    return filteredPoints;
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init = () => {
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#renderTripPoints();
  }

  destroy = () => {
    this.#clearTripPoints({resetSortType: true});
    remove(this.#pointListComponent);
    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  createPoint = () => {
    this.#pointNewPresenter.init(this.#pointsModel.offers, this.#pointsModel.destinations);
  }

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.SAVING);
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.DELETING);
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
        }
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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
    const pointPresenter = new PointPresenter(this.#pointListComponent, this.#pointsModel, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, this.#pointsModel.offers, this.#pointsModel.destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPointList = () => {
    render(this.#tripContainer, this.#pointListComponent, RenderPosition.BEFOREEND);
  }

  #renderLoading = () => {
    render(this.#tripContainer, this.#loadingComponent, RenderPosition.AFTERBEGIN);
  }

  #renderEmptyPoints = () => {
    this.#pointEmptyComponent = new PointListEmpty(this.#filterType);
    render(this.#tripContainer, this.#pointEmptyComponent, RenderPosition.BEFOREEND);
  }

  #clearTripPoints = ({resetSortType = false} = {}) => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    if (this.#pointEmptyComponent) {
      remove(this.#pointEmptyComponent);
    }
    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderTripPoints = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const pointCount = this.points.length;
    if (pointCount === 0) {
      this.#renderEmptyPoints();
      return;
    }
    this.#renderSort();
    this.#renderPointList();
    for (let i = 0; i < pointCount; i++) {
      this.#renderPoint(this.points[i]);
    }
  }
}
