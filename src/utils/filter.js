import {FilterType} from '../const';
import {isDateFuture, isDatePast} from './point';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isDateFuture(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => isDatePast(point.dateFrom)),
};
