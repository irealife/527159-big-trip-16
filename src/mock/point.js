import {getRandomInteger} from '../utils';
import dayjs from 'dayjs';

const pointTypes = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

export const Destination = {
  Amsterdam: 'Amsterdam',
  Cheboksary: 'Cheboksary',
  Qatar: 'Qatar',
  Dubai: 'Dubai',
  Moscow: 'Moscow',
  Ottawa: 'Ottawa',
};

export const destinations = Object.values(Destination);

const destinationTexts = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
];

const destinationPhotos = [
  'img/photos/1.jpg',
  'img/photos/2.jpg',
  'img/photos/3.jpg',
  'img/photos/4.jpg',
  'img/photos/5.jpg',
];

const titleOffers = [
  'Upgrade to a business class',
  'Choose the radio station',
  'Add luggage',
  'Switch to comfort',
  'Add breakfast',
];
const priceOffers = [
  '69',
  '89',
  '68',
  '98',
  '86',
];

const generatePointType = () => pointTypes[getRandomInteger(0, pointTypes.length - 1)];

const generateDestination = () => destinations[getRandomInteger(0, destinations.length - 1)];

const generateDestinationInfo = () => {
  return {
    text: destinationTexts[getRandomInteger(0, destinationTexts.length - 1)],
    photo: destinationPhotos[getRandomInteger(0, destinationPhotos.length - 1)],
  };
};

export const generateDestinationDescriptions = () => {
  const descriptions = {};
  for (const destination of destinations) {
    descriptions[destination] = generateDestinationInfo();
  }
  return descriptions;
};

const generateOffers = () => {
  return {
    title: titleOffers[getRandomInteger(0, titleOffers.length - 1)],
    price: priceOffers[getRandomInteger(0, priceOffers.length - 1)],
  };
};

const offers = new Map();
export const generatePointOffers = () => {
  for (const pointType of pointTypes) {
    const additionalOptions = new Array(getRandomInteger(0, 4)).fill('').map(generateOffers);
    offers.set(pointType, additionalOptions);
  }
  return offers;
};

const dateTimeStartEvent = () => dayjs().add(getRandomInteger(1, 150), 'minute').toDate();
const dateTimeEndEvent = (dateStart) => dayjs(dateStart).add(getRandomInteger(3, 72), 'hours').toDate();

export const generatePoint = () => {
  const pointType = generatePointType();
  const pointOffers = generatePointOffers();
  return {
    pointType,
    destination: generateDestination(),
    dateTimeStartEvent: dateTimeStartEvent(),
    dateTimeEndEvent: dateTimeEndEvent(dateTimeStartEvent()),
    price: getRandomInteger(60, 148),
    offers: pointOffers.get(pointType),
    isFavorite: getRandomInteger(0, 1),
    descriptions: generateDestinationDescriptions(),
  };
};
