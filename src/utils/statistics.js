export const sumPriceByPoints = (type, points) => points.filter((point) => point.pointType === type)
  .reduce((sumPrice, point) => sumPrice + point.price, 0);
