import PointListEmpty from '../view/point-list-empty';
import PointsListFilterView from '../view/points-list-filter-view';
import PointListView from '../view/point-list-view';
import PointItemView from '../view/point-item-view';
import EditPointView from '../view/edit-point-view';
import {render, RenderPosition, replace} from '../utils/render';
import {POINT_COUNT} from '../const';

export default class TripPresenter {
  #tripContainer = null;
  #pointElementContainer = null;

  #sortComponent = new PointsListFilterView();
  #pointListComponent = new PointListView();
  #pointEmptyComponent = new PointListEmpty();

  #tripPoints = [];

  constructor(tripContainer, pointElementContainer) {
    this.#tripContainer = tripContainer;
    this.#pointElementContainer = pointElementContainer;
    console.log(this.#pointElementContainer, this.#tripContainer);
  }

  init = (tripPoints) => {
    this.#tripPoints = [...tripPoints];

    render(this.#tripContainer, this.#sortComponent, RenderPosition.AFTERBEGIN);
    this.#renderPointList();

    this.#renderTrip();
  }

  #renderSort = () => {
    render(this.#tripContainer, this.#sortComponent, RenderPosition.AFTERBEGIN);
  }

  #renderPoint = (point) => {
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
    render(this.#pointElementContainer, pointComponent, RenderPosition.BEFOREEND);
  }

  #renderPoints = () => {
    this.#renderSort();
    this.#renderPointList();
    for (let i = 0; i < POINT_COUNT; i++) {
      this.#renderPoint(this.#tripPoints[i]);
    }
  }

  #renderPointList = () => {
    render(this.#tripContainer, this.#pointListComponent, RenderPosition.BEFOREEND);
  }

  #renderEmptyPoints = () => {
    render(this.#tripContainer, this.#pointEmptyComponent, RenderPosition.BEFOREEND);
  }

  #renderTrip = () => {
    if (this.#tripPoints.length === 0) {
      this.#renderEmptyPoints();
    } else {
      this.#renderPoints();
    }
  }
}
