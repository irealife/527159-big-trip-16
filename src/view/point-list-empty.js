import {createElement} from '../render';

const createPointListEmptyTemplate = () => '<p class="trip-events__msg">Click New Event to create your first point</p>';

export default class PointListEmpty {
  #element = null;

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template () {
    return createPointListEmptyTemplate();
  }

  removeElement () {
    this.#element = null;
  }
}
