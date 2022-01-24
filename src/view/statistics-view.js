import SmartView from './smart-view';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getDateDuration} from '../utils/point';

const ChartItem = {
  MONEY: 'money',
  TYPE: 'type',
  TIME: 'time',
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
      formatter = (val) => `${getDateDuration(val)}`;
      break;
  }

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: labels,
      datasets: [{
        data: data,
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

const renderMoneyCharts = (moneyCtx) => {
  renderCharts(ChartItem.MONEY, moneyCtx);
};

const renderTypeCharts = (typeCtx) => {
  renderCharts(ChartItem.TYPE, typeCtx);
};

const renderTimeCharts = () => {

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
  #pointTypesTitle = null;

  constructor(points, pointTypes) {
    super();
    this._data = {
      points,
    };
    this.#pointTypes = pointTypes;
    this.#pointTypesTitle = this.#pointTypes.map((titleType) => titleType.toUpperCase());
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
    moneyCtx.height = BAR_HEIGHT * 5;
    typeCtx.height = BAR_HEIGHT * 5;
    timeCtx.height = BAR_HEIGHT * 5;
    this.#moneyChart = renderMoneyCharts(moneyCtx, this._data.points, this.#pointTypes, this.#pointTypesTitle);
    this.#typeChart = renderTypeCharts(typeCtx, this._data.points, this.#pointTypes, this.#pointTypesTitle);
    this.#timeChart = renderTimeCharts(timeCtx, this._data.points, this.#pointTypes, this.#pointTypesTitle);
  }
}

