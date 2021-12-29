import AbstractView from './abstract-view';

const createPointListEmptyTemplate = () => '<p class="trip-events__msg">Click New Event to create your first point</p>';

export default class PointListEmpty extends AbstractView {
  get template () {
    return createPointListEmptyTemplate();
  }
}
