import PointEditView from '../view/point-edit-view';
import {render, RenderPosition, remove} from '../utils/render';
import {UserAction, UpdateType} from '../const';

export  default class PointNewPresenter {
  #pointListContainer = null;
  #pointsModel = null;
  #changeData = null;
  #pointEditComponent = null;
  #buttonNewComponent = null;

  constructor(pointListContainer, pointsModel, changeData, buttonNewComponent) {
    this.#pointListContainer = pointListContainer;
    this.#buttonNewComponent = buttonNewComponent;
    this.#pointsModel = pointsModel;
    this.#changeData = changeData;
  }

  init = () => {
    if (this.#pointEditComponent !== null) {
      return;
    }
    this.#pointEditComponent = new PointEditView(this.#pointsModel.destinations, this.#pointsModel.offers);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);
    this.#pointEditComponent.setCloseEditClickHandler(this.#handleDeleteClick);
    render(this.#pointListContainer, this.#pointEditComponent, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;
    this.#buttonNewComponent.activateButton();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }

  setSaving = () => {
    this.#pointEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting = () => {
    const resetFormState = () => {
      this.#pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#pointEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  #handleDeleteClick = () => {
    this.destroy();
  }
}
