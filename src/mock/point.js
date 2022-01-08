import {nanoid} from 'nanoid';
import {dateTimeStartEvent, dateTimeEndEvent, destinations} from '../utils/point';
import {getRandomInteger} from '../utils/common';
import {pointTypes} from '../const';

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

export const Destination = {
  Amsterdam: 'Amsterdam',
  Cheboksary: 'Cheboksary',
  Qatar: 'Qatar',
  Dubai: 'Dubai',
  Moscow: 'Moscow',
  Ottawa: 'Ottawa',
};

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

const generateDestinationInfo = () => ({
  text: destinationTexts[getRandomInteger(0, destinationTexts.length - 1)],
  photo: destinationPhotos[getRandomInteger(0, destinationPhotos.length - 1)],
});

export const generateDestinationDescriptions = () => {
  const descriptions = {};
  for (const destination of destinations) {
    descriptions[destination] = generateDestinationInfo();
  }
  return descriptions;
};

const generateOffers = () => ({
  title: titleOffers[getRandomInteger(0, titleOffers.length - 1)],
  price: priceOffers[getRandomInteger(0, priceOffers.length - 1)],
});

const offers = new Map();
export const generatePointOffers = () => {
  for (const pointType of pointTypes) {
    const additionalOptions = new Array(getRandomInteger(0, 4)).fill('').map(generateOffers);
    offers.set(pointType, additionalOptions);
  }
  return offers;
};

export const generatePoint = () => {
  const pointType = pointTypes[getRandomInteger(0, pointTypes.length - 1)];
  const pointOffers = generatePointOffers();
  return {
    id: nanoid(),
    pointType,
    destination: destinations[getRandomInteger(0, destinations.length - 1)],
    dateFrom: dateTimeStartEvent(),
    dateTo: dateTimeEndEvent(dateTimeStartEvent()),
    price: getRandomInteger(60, 148),
    offers: pointOffers.get(pointType),
    isFavorite: Math.random() < 0.5,
    descriptions: generateDestinationDescriptions(),
  };
};
