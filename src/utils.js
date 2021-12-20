import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {Destination, PointStateFilter, PointListSort} from './const';
dayjs.extend(duration);

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const dateTimeStartEvent = () => dayjs().add(getRandomInteger(1, 150), 'minute').toDate();

export const dateTimeEndEvent = (dateStart) => dayjs(dateStart).add(getRandomInteger(3, 72), 'hours').toDate();

export const destinations = Object.values(Destination);

export const pointStateFilters = Object.values(PointStateFilter);

export const pointListSorts = Object.values(PointListSort);

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
