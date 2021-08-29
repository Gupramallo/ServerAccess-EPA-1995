/*jQuery(document).ready(function() {
 // var epaDataRecords = JSON.parse(window.epadata);

  // TODO: implementation
});
*/

const requestsPerMinuteChartCanvas = document
  .querySelector("#requestsPerMinuteChart");
const documentSizeChartCanvas = document
  .querySelector("#documentSizeChart");

const url = "/data";
const getData = fetch(url)
  .then((res) => res.json())
  .then((data) => mostrarDatos(data))
  .catch((err) => console.log(err));




function mostrarDatos({ methods, requests, codes, size }) {
  methodsGraph(methods);
  codesGraph(codes);
  requestData(requests);
  sizeData(size)
}

function methodsGraph(methods) {
  console.log(methods);
  const config = {
    type: "bar",
    data: {
      labels: ["GET", "POST", "HEAD", "INVALID"],
      datasets: [
        {
          label: "HTTP METHODS",
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
          ],
          borderColor: "rgb(255, 99, 132)",
          data: [
            methods.gets.length,
            methods.posts.length,
            methods.heads.length,
            methods.invalids.length,
          ],
        },
      ],
    },
    options: {},
  };

  let myChart = new Chart(
    document.querySelector("#methodChart").getContext("2d"),
    config
  );
}

function codesGraph(codes) {
  const codes_num = [];
  const codes_calls = [];

  codes.forEach((code) => {
    codes_num.push(code.code);
    codes_calls.push(code.calls);
  });
  console.log(codes_num);
  console.log(codes_calls);

  console.log(codes);

  const config = {
    type: "bar",
    data: {
      labels: codes_num,
      datasets: [
        {
          label: "RESPONSE CODES",
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgb(255, 99, 132)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
          ],
          borderColor: "rgb(255, 99, 132)",
          data: codes_calls,
        },
      ],
    },
    options: {},
  };

  let myChart = new Chart(
    document.querySelector("#responseCodeChart").getContext("2d"),
    config
  );
}

function requestData(requests) {
  var ctx = requestsPerMinuteChartCanvas.getContext('2d');
  ctx.font = '10px serif';
  ctx.fillText(`El numero de requests por minuto fue de ${Math.round(requests)}`, 50, 90);
  console.log(requestsPerMinuteChartCanvas)
}


function sizeData(size) {
  var ctx = documentSizeChartCanvas.getContext('2d');
  ctx.font = '10px serif';
  ctx.fillText(`El tamaño del archivo fue de ${size}`, 50, 90);
  console.log(requestsPerMinuteChartCanvas)
}
