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

export const destinations = [
  'Amsterdam',
  'Cheboksary',
  'Qatar',
  'Dubai',
  'Moscow',
  'Ottawa',
];

const generatePointType = () => pointTypes[getRandomInteger(0, pointTypes.length - 1)];

const generateDestination = () => destinations[getRandomInteger(0, destinations.length - 1)];

const generateDestinationInfo = () => {
  const destinationText = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
  ];
  const destinationPhoto = [
    '../../img/photos/1.jpg',
    '../../img/photos/2.jpg',
    '../../img/photos/3.jpg',
    '../../img/photos/4.jpg',
    '../../img/photos/5.jpg',
  ];
  return {
    text: destinationText[getRandomInteger(0, destinationText.length - 1)],
    photo: destinationPhoto[getRandomInteger(0, destinationPhoto.length - 1)],
  };
};

const destinationDescription = new Map();
const generateDestinationDescription = () => {
  for (const destination of destinations) {
    const destinationDescriptions = new Array(getRandomInteger(0, 4)).fill('').map(generateDestinationInfo);
    destinationDescription.set(destination, destinationDescriptions);
  }
  return destinationDescription;
};

const generateOffer = () => {
  const offerTitle = [
    'Upgrade to a business class',
    'Choose the radio station',
    'Add luggage',
    'Switch to comfort',
    'Add breakfast',
  ];
  const offerPrice = [
    '69',
    '89',
    '68',
    '98',
    '86',
  ];
  return {
    title: offerTitle[getRandomInteger(0, offerTitle.length - 1)],
    price: offerPrice[getRandomInteger(0, offerPrice.length - 1)],
  };
};

const offers = new Map();
const generateOffersPoint = () => {
  for (const pointType of pointTypes) {
    const additionalOptions = new Array(getRandomInteger(0, 4)).fill('').map(generateOffer);
    offers.set(pointType, additionalOptions);
  }
  return offers;
};

const dateTimeStartEvent = () => dayjs().add(getRandomInteger(1, 150), 'minute').toDate();
const dateTimeEndEvent = (dateStart) => dayjs(dateStart).add(getRandomInteger(3, 72), 'hours').toDate();

export const generatePoint = () => {
  const pointType = generatePointType();
  const offers = generateOffersPoint();
  return {
    pointType,
    destination: generateDestination(),
    dateTimeStartEvent: dateTimeStartEvent(),
    dateTimeEndEvent: dateTimeEndEvent(dateTimeStartEvent()),
    price: getRandomInteger(60, 148),
    offers: offers.get(pointType),
    isFavorite: getRandomInteger(0, 1),
    destinationDescription: generateDestinationDescription(),
  };
};
