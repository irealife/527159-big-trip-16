import AbstractView from './abstract-view.js';

const createButtonNewTemplate = () => (
  '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>'
);

export default class ButtonNewView extends AbstractView {
  get template() {
    return createButtonNewTemplate();
  }

  disableButton = () => (this.element.disabled = true);

  activateButton = () => (this.element.disabled = false);
}
