import AbstractObservable from '../utils/abstract-observable';
import {UpdateType} from '../const';

export default class PointsModel extends AbstractObservable {
  #apiService = null;
  #points = [];
  #destinations = [];
  #offers = {};

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  // set points(points) {
  //   this.#points = [...points];
  // }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  init = async () => {
    try {
      const points = await this.#apiService.points;
      const offers = await this.#apiService.offers;
      this.#destinations = await this.#apiService.destinations;
      this.#points = points.map(this.#adaptToClient);
      offers.forEach((offer) => {
        this.#offers[offer.type] = offer.offers
      });
    } catch (err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = {};
    }
    this._notify(UpdateType.INIT);
  }

  updatePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    try {
      const response = await this.#apiService.updatePoint(update);
      const updatePoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatePoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatePoint);
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  };

  addPoint = async (updateType, update) => {
    try {
      const response = await this.#apiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  }


  deletePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }
    try {
      await this.#apiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  };

  #adaptToClient = (point) => {
    const adaptedPoint = {...point,
      pointType: point['type'],
      isFavorite: point['is_favorite'],
      price: point['base_price'],
      dateFrom: new Date(point['date_from']),
      dateTo: new Date(point['date_to']),
    };
    delete adaptedPoint.type;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;

    return adaptedPoint;
  }
}
