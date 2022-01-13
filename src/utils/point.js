import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {StateFilter} from '../const';
dayjs.extend(duration);
import {Destination} from '../mock/point';
import {getRandomInteger} from './common';

export const dateTimeStartEvent = () => dayjs().add(getRandomInteger(1, 150), 'minute').toDate();

export const dateTimeEndEvent = (dateStart) => dayjs(dateStart).add(getRandomInteger(3, 72), 'hours').toDate();

export const destinations = Object.values(Destination);

export const pointStateFilters = Object.values(StateFilter);

export const toUpperCaseFirstSymbol = (word) => word[0].toUpperCase() + word.slice(1);

export const getDateStartFormat = (date) => dayjs(date).format('YYYY-MM-DD');
export const getDateNoYearFormat = (date) => dayjs(date).format('MMM DD');
export const getDateTimeFullFormat = (date) => dayjs(date).format('YYYY-MM-DD HH:mm');
export const getTimeFormat = (date) => dayjs(date).format('HH:mm');

export const getDateDuration = (startDate, endDate) => {
  const dateDuration = dayjs.duration(dayjs(endDate).diff(dayjs(startDate)));
  const days = dateDuration.days();
  const hours = dateDuration.hours();
  const minutes = dateDuration.minutes();

  if (days === 0 && hours === 0) {return `${minutes}M`;}
  else if (days === 0) {return `${hours}H ${minutes}M`;}
  else {return `${days}D ${hours}H ${minutes}M`;}
};

export const sortByDay = (pointA, pointB) => (dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom)));

export const sortByPrice = (pointA, pointB) => (pointB.price - pointA.price);

export const sortByTime = (pointA, pointB) => {
  const diffA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const diffB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return diffB - diffA;
};
