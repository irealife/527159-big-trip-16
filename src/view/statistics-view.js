import SmartView from './smart-view';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const ChartItem = {
  MONEY: 'money',
  TYPE: 'type',
  TIME: 'time',
};

const MIN_ONE_HOUR = 60;
const MIN_ONE_DAY = 60 * 24;

const dateFormat = (dateDuration) => {
  const dateTime = dateDuration / 1000 / 60;
  const days = Math.floor(dateTime / 60 / 24);
  const hours = Math.floor(dateTime / 60 % 24);
  const minutes = Math.floor(dateTime  % 60);
  if (dateDuration < MIN_ONE_HOUR) {
    return minutes < 10 ? `0${minutes}M` : `${minutes}M`;
  }
  if (dateDuration < MIN_ONE_DAY) {
    return `${hours}H ${minutes}M`;
  }
  return `${days}D ${hours}H ${minutes}M`;
};

const renderCharts = (currentChart, ctx, labels, data) => {
  let title;
  let formatter;

  switch (currentChart) {
    case (ChartItem.MONEY):
      title = 'MONEY';
      formatter = (val) => `€ ${val}`;
      break;
    case (ChartItem.TYPE):
      title = 'TYPE';
      formatter = (val) => `${val}x`;
      break;
    case (ChartItem.TIME):
      title = 'TIME';
      formatter = (val) => `${dateFormat(val)}`;
      break;
  }

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: formatter,
        },
      },
      title: {
        display: true,
        text: title,
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderMoneyCharts = (node, points, pointTypeSortByItem) => {
  points.forEach((point) => pointTypeSortByItem[point.pointType] += point.price);
  return renderCharts(ChartItem.MONEY, node, Object.keys(pointTypeSortByItem), Object.values(pointTypeSortByItem));
};

const renderTypeCharts = (node, points, pointTypeSortByItem) => {
  points.forEach((point) => pointTypeSortByItem[point.pointType] += 1);
  return renderCharts(ChartItem.TYPE, node, Object.keys(pointTypeSortByItem), Object.values(pointTypeSortByItem));
};

const renderTimeCharts = (node, points, pointTypeSortByItem) => {
  points.forEach((point) => pointTypeSortByItem[point.pointType] += (point.dateTo - point.dateFrom));
  return renderCharts(ChartItem.TIME, node, Object.keys(pointTypeSortByItem), Object.values(pointTypeSortByItem));
};

const createStatisticsTemplate = () => `<section class="statistics">
  <h2 class="visually-hidden">Trip statistics</h2>
  <div class="statistics__item">
    <canvas class="statistics__chart" id="money" width="900"></canvas>
  </div>
  <div class="statistics__item">
    <canvas class="statistics__chart" id="type" width="900"></canvas>
  </div>
  <div class="statistics__item">
    <canvas class="statistics__chart" id="time" width="900"></canvas>
  </div>
</section>`;

export default class StatisticsView extends SmartView {
  #moneyChart = null;
  #typeChart = null;
  #timeChart = null;
  #pointTypes = null;

  constructor(points, pointTypes) {
    super();
    this._data = {
      points,
    };
    this.#pointTypes = pointTypes;
    this.#setCharts();
  }

  get template() {
    return createStatisticsTemplate();
  }

  removeElement() {
    super.removeElement();
    if (this.#moneyChart) {
      this.#moneyChart.destroy();
      this.#moneyChart = null;
    }
    if (this.#typeChart) {
      this.#typeChart.destroy();
      this.#typeChart = null;
    }
    if (this.#timeChart) {
      this.#timeChart.destroy();
      this.#timeChart = null;
    }
  }

  restoreHandlers = () => {
    this.#setCharts();
  }

  #setCharts = () => {
    const BAR_HEIGHT = 55;
    const moneyCtx = this.element.querySelector('#money');
    const typeCtx = this.element.querySelector('#type');
    const timeCtx = this.element.querySelector('#time');
    moneyCtx.height = BAR_HEIGHT * 8;
    typeCtx.height = BAR_HEIGHT * 8;
    timeCtx.height = BAR_HEIGHT * 8;
    const pointTypeSortByItem = {};
    this.#pointTypes.forEach((pointType) => pointTypeSortByItem[pointType] = 0);
    this.#moneyChart = renderMoneyCharts(moneyCtx, this._data.points, {...pointTypeSortByItem});
    this.#typeChart = renderTypeCharts(typeCtx, this._data.points, {...pointTypeSortByItem});
    this.#timeChart = renderTimeCharts(timeCtx, this._data.points, {...pointTypeSortByItem});
  }
}

