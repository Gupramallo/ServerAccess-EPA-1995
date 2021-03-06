const requestsPerMinuteChartCanvas = document.querySelector("#requestsPerMinuteChart");
const documentSizeChartCanvas = document.querySelector("#documentSizeChart");
const methodStats = document.querySelector("#method__stats");
const requestStats = document.querySelector("#request__stats");
const codeStats = document.querySelector("#code__stats");
const documentStats = document.querySelector("#document__stats");
const spinnerWrapper = document.querySelector(".spinner-wrapper");



const url = "/data";
const getDataFetched = fetch(url)
  .then((res) => res.json())
  .then((data) => showData(data))
  .catch((err) => console.log(err));

async function getData(methods,requests,codes,size) {
  methodsData(methods);
  codesData(codes);
  requestData(requests);
  sizeData(size);  
}
 
async function showData({ methods, requests, codes, size }) {
  await getData(methods,requests,codes,size);
  spinnerWrapper.parentElement.removeChild(spinnerWrapper);
}

function methodsData(methods) {
  const config = {
    type: "bar",
    data: {
      labels: ["GET", "POST", "HEAD", "INVALID"],
      datasets: [
        {
          label: "HTTP METHODS",
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgba(54, 162, 235)",
            "rgba(255, 206, 86)",
            "rgba(75, 192, 192)",
          ],
          borderColor: "rgb(255, 99, 132)",
          data: [
            methods.gets.length,
            methods.posts.length,
            methods.heads.length,
            methods.invalids.length,
          ],
          minBarLength: 20,
        },
      ],
    },
    options: { },
  };

  let myChart = new Chart(
    document.querySelector("#methodChart").getContext("2d"),
    config
  );

  methodStats.innerHTML = `
            <p># Of GET's: ${methods.gets.length}</p>
            <p># Of POST's:${methods.posts.length} </p>
            <p># Of HEAD's:${methods.heads.length}</p>
            <p># Of INVALIDS:${methods.invalids.length} </p>
  `;
}

function requestData({ averageNum, averageHour, peakTime }) {
  const labels = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Requests per Hour",
        data: averageHour,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };
  const config = {
    type: "line",
    data: data,
    options: {},
  };
  let myChart = new Chart(
    document.querySelector("#requestsPerMinuteChart").getContext("2d"),
    config
  );

  requestStats.innerHTML = `
              <p>Peak Time at: ${peakTime.hour}:${peakTime.minute} with ${
    peakTime.maxRequests
  } Requests</p>
              <p>Average of Requests: ${Math.round(averageNum)} </p>
    `;
}

function codesData(codes) {
  const codes_num = [];
  const codes_calls = [];

  codes.forEach((code) => {
    codes_num.push(code.code);
    codes_calls.push(code.calls);
    codeStats.innerHTML += `
  <p># Of ${code.code}'s: ${code.calls}</p>
`;
  });

  const config = {
    type: "bar",
    data: {
      labels: codes_num,
      datasets: [
        {
          label: "RESPONSE CODES",
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 206, 86)",
            "rgb(75, 192, 192)",
            "rgb(199, 0, 57)",
            "rgb(20, 7, 234)",
            "rgb(176, 3, 165 )",
            "rgb(5, 190, 182 )",
          ],
          borderColor: "rgb(255, 99, 132)",
          data: codes_calls,
          minBarLength: 20,
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

function sizeData({ totalSize, sizeArray }) {
  const labels = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Average Size Per Hour (200 Response code)",
        data: sizeArray,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };
  const config = {
    type: "line",
    data: data,
    options: {},
  };
  let myChart = new Chart(
    document.querySelector("#documentSizeChart").getContext("2d"),
    config
  );

  documentStats.innerHTML = `
  <p>Total Document Size of the 200 response codes: ${totalSize} Bytes</p>
  
  `;
}
