import {Chart} from 'chart.js';
import _ from 'lodash';

function MyCmpController($scope) {
  $scope.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  $scope.data1 = [140, 100, 70, 120, 160, 120, 150, 140];
  $scope.data2 = [83, 120, 140, 142, 140, 141, 130, 135];

  this.$onInit = function () {
    const chartElement = angular.element(document.getElementById('lineChart'))[0];
    let ctx = chartElement.getContext('2d');
    let grad1 = ctx.createLinearGradient(0, 0, 0, 300);
    grad1.addColorStop(0, 'rgba(0,174,255,0.38)');
    grad1.addColorStop(.4, 'rgba(0,153,255,0.36)');
    grad1.addColorStop(.8, 'rgba(93,188,210, 0.01)');
    grad1.addColorStop(1, 'rgba(0,00,250,0)');

    let grad2 = ctx.createLinearGradient(0, 0, 0, 300);
    grad2.addColorStop(0, 'rgba(243,164,205,1)');
    grad2.addColorStop(.4, 'rgba(243,164,205,.9)');
    grad2.addColorStop(.7, 'rgba(243,164,205,0.01)');
    grad2.addColorStop(1, 'rgba(255,255,255,0)');


    const horizonalLinePlugin = {
      afterDraw: function (chartInstance) {
        let yScale = chartInstance.scales["y-axis-0"];
        let canvas = chartInstance.chart;
        let ctx = canvas.ctx;
        let start = 45;
        let index;
        let line;
        let style;
        let yValue;

        if (chartInstance.options.horizontalLine) {
          for (index = 0; index < chartInstance.options.horizontalLine.length; index++) {
            line = chartInstance.options.horizontalLine[index];

            if (!line.style) {
              style = "rgba(169,169,169, .6)";
            } else {
              style = line.style;
            }

            if (line.y) {
              yValue = yScale.getPixelForValue(line.y);
            } else {
              yValue = 0;
            }

            ctx.lineWidth = 2;

            if (yValue) {
              ctx.beginPath();
              ctx.moveTo(45, yValue);
              ctx.lineTo(canvas.width, yValue);
              ctx.strokeStyle = style;
              ctx.closePath();
              ctx.stroke();
            }

            if (line.text) {
              ctx.fillStyle = style;
              ctx.fillText(line.text, 0, yValue + ctx.lineWidth);
            }
          }
          return;
        }
        ;
      }
    };
    Chart.pluginService.register(horizonalLinePlugin);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
          {
            backgroundColor: grad1,
            borderColor: 'rgb(20,145,210)',
            data: [83, 120, 140, 142, 140, 141, 130, 135],
            borderWidth: 2,
            pointRadius: 4,
            pointBorderWidth: 3,
            pointBackgroundColor: '#fff',
            pointHoverBackgroundColor: 'rgba(20,145,210,1)',
            pointHoverBorderColor: 'rgba(20,145,210,1)',
            pointHoverBorderWidth: 3,

          },
          {
            borderColor: 'rgba(243,164,205,1)',
            backgroundColor: grad2,
            data: [140, 100, 70, 120, 160, 120, 150, 140],
            borderWidth: 2,
            pointBackgroundColor: '#fff',
            pointRadius: 4,
            pointHoverBackgroundColor: 'rgba(243,164,205,1)',

          },
        ]
      },
      options: {
        maintainAspectRatio: false,
        spanGaps: false,
        elements: {
          line: {
            tension: 0.000001
          }
        },
        legend: {
          display: false,
        },
        scales: {
          yAxes: [{
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            },
            ticks: {
              min: 60,
              max: 180,
              stepSize: 20,
              callback: function (value) {
                return value + " \u00B0";
              }
            }
          }]
          ,
          xAxes: [{
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              drawBorder: true,
            }
          }]
        },
        "horizontalLine": [{
          "y": 110,
          "style": "rgba(243,164,205,1)",

        }, {
          "y": 90,
          "style": "rgb(20,145,210)",
        }],
        tooltips: {
          enabled: false,
          intersect: false,
          custom: function (tooltipModel) {
            let tooltipEl = document.getElementById('chartjs-tooltip');
            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-tooltip';
              tooltipEl.innerHTML = '<table></table>';
              document.body.appendChild(tooltipEl);
            }

            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0;
              return;
            }
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign);
            } else {
              tooltipEl.classList.add('no-transform');
            }

            function getBody(bodyItem) {
              return bodyItem.lines;
            }

            // Set Text
            if (tooltipModel.body) {
              let bodyLines = tooltipModel.body.map(getBody);

              let innerHtml = '<thead>';
              bodyLines.forEach(function (body, i) {
                let colors = tooltipModel.labelColors[i];
                let style = 'background:' + 'rgb(0, 0, 0)';
                style += '; border-color:' + colors.borderColor;
                style += '; border-width: 2px';
                let span = '<span style="' + style + '"></span>';
                innerHtml += '<tr><td>' + span + body + " \u00B0" + '</td></tr>';
              });
              innerHtml += '</tbody>';

              let tableRoot = tooltipEl.querySelector('table');
              tableRoot.innerHTML = innerHtml;
            }

            let position = this._chart.canvas.getBoundingClientRect();
            tooltipEl.style.opacity = 1;
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.left = tooltipModel.caretX - position.left + 'px';
            tooltipEl.style.top = tooltipModel.caretY - position.top - 30 + 'px';
            tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
            tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
            tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
            tooltipEl.style.fontWeight = 400;
            tooltipEl.style.color = 'rgba(255,255,255,1)';
            tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
            tooltipEl.style.pointerEvents = 'none';
            if (_.get(tooltipModel, 'dataPoints.0.datasetIndex', null) === 1) {
              tooltipEl.style.backgroundColor = 'rgba(243,164,205,1)';

            } else if (_.get(tooltipModel, 'dataPoints.0.datasetIndex', null) === 0) {
              tooltipEl.style.backgroundColor = 'rgba(37,173,253,1)';
            }

            tooltipEl.style.borderColor = 'rgba(37,173,253,1)';
            tooltipEl.style.borderColor = 4;

          }
        }
      }
    });

    this.chart.canvas.parentNode.style.height = '300px';
    this.chart.canvas.parentNode.style.width = '1000px';

  }
}

export const RootComponent = {
  selector: 'root',
  controller: MyCmpController,
  template: require('./root.html')
};
