import AbstractView from './abstract-view';
import {FilterType} from '../const';

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

const createPointListEmptyTemplate = (filterType) => {
  const noPointTextValue = NoPointsTextType[filterType];
  return (
    `<p class="trip-events__msg">
      ${noPointTextValue}
    </p>`
  );
};

export default class PointListEmpty extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template () {
    return createPointListEmptyTemplate(this._data);
  }
}
