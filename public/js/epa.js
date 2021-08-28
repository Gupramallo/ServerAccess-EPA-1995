/*jQuery(document).ready(function() {
 // var epaDataRecords = JSON.parse(window.epadata);

  // TODO: implementation
});
*/

//const methodChartCanvas = document.querySelector('#methodChart').getContext('2d');
const requestsPerMinuteChartCanvas = document.querySelector('#requestsPerMinuteChart').getContext('2d');
const responseCodeChartCanvas = document.querySelector('#responseCodeChart').getContext('2d');
const documentSizeChartCanvas = document.querySelector('#documentSizeChart').getContext('2d'); 



const url= '/data'
const getData = fetch(url)
                        .then(res=>  res.json())
                        .then(data => mostrarDatos(data) )
                        .catch(err=> console.log(error));

function mostrarDatos({methods}) {
  console.log()
 const config = {
    type: 'bar',
    data: {
      labels:[
        'GET',
        'POST',
        'HEAD',
        'INVALID',
      ],
      datasets: [{
        label: 'HTTP METHODS',
        backgroundColor: ['rgb(255, 99, 132)','rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)'],
        borderColor: 'rgb(255, 99, 132)',
        data: [methods.gets.length, methods.posts.length, methods.heads.length, methods.invalids.length],
      }]
    },
    options: {}
  }; 

  var myChart = new Chart(
    document.querySelector('#methodChart').getContext('2d'),
    config
  );
}


