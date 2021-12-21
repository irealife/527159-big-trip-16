import {getRandomInteger, dateTimeStartEvent, dateTimeEndEvent, destinations} from '../utils';
import {pointTypes, destinationTexts, destinationPhotos, titleOffers, priceOffers} from '../const';

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

export const generatePoint = () => {
  const pointType = generatePointType();
  const pointOffers = generatePointOffers();
  return {
    pointType,
    destination: generateDestination(),
    dateFrom: dateTimeStartEvent(),
    dateTo: dateTimeEndEvent(dateTimeStartEvent()),
    price: getRandomInteger(60, 148),
    offers: pointOffers.get(pointType),
    isFavorite: getRandomInteger(0, 1),
    descriptions: generateDestinationDescriptions(),
  };
};
