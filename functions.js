const lineByLine = require("n-readlines");
const liner = new lineByLine("./epa-http.txt"); //Library needed to read the file

function readLine() {  //Reads the txt file line by line  
  return new Promise((res, rej) => {
    try {
      let readed = []; 
      let line;
      while ((line = liner.next())) {
        var lineString = line.toString("ascii");
        const file = parseLine(lineString); //Take the line to transformt it into a JSON Format
        readed.push(file);
      }
      res(readed);
    } catch (error) {
      console.error(error);
      rej(error);
    }
  });
}

function parseLine(line) {
  let obj = line.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g); //Regex function that separates the file by spaces unless they are in quotation marks
  const host = obj[0];  
  const newFullDate = obj[1].substring(1).slice(0, -1).split(":"); // Ignore the Brackets and split the numbers by ":"
  const datetime = {   //Object with all the numbers of the date
    day: newFullDate[0],
    hour: newFullDate[1],
    minute: newFullDate[2],
    second: newFullDate[3],
  };
  obj[2] = obj[2].replace(/['"]+/g, "");  //Remove the quotation marks
  
  const method = obj[2].match(/^([\S]+)/g); // Regex function that separates the method('GET','POST','HEAD') and the URL
  const url = obj[2].match(/\s(.*)/g);
  let request = {};
  if (method && url) {  
    request = {
      method: method[0],
      url: url[0],
    };
  } else {
    request = { // In the case the line doesn't have a request method
      method: "INVALID",
      url: obj[2],
    };
  }

  let response_code = obj[3];
  let document_size = obj[4];
  if (response_code.length != 3)  { //Special cases when the line doesn't have the response method
    response_code = obj[4];
    document_size = obj[5];
  }

  const lineObj = {
    host,
    datetime,
    request,
    response_code,
    document_size,
  };
  return lineObj;
}

function getHTTPMethods(objs) { 
  const gets = objs.filter((obj) => obj.request.method === "GET");
  const posts = objs.filter((obj) => obj.request.method === "POST");
  const heads = objs.filter((obj) => obj.request.method === "HEAD");
  const invalids = objs.filter((obj) => obj.request.method == "INVALID");

  return {
    gets,
    posts,
    heads,
    invalids,
  };
}

function getRequestPerMinute(objs) {
  const averageMin = []; //Array to calculate the average request per minute 
  const averageHour = []; //Needed to order the graph by hour
  let min = objs[0].datetime.minute;
  let hour = objs[0].datetime.hour;
  let cont = 0; //Counts the number of requests in a minute
  let maxCont =0; //Takes the number of most requests
  let contHour = 0; 
  let maxRequests;//Counts the number of requests in an hour
  let peakTime = { //Exact hour of the most requests per minute
    hour: 0,
    minute : 0,
    maxRequests
  };
  objs.forEach((obj) => {
    if (obj.datetime.minute == min) { //Counter adds until no longer is in the same minute
      cont++;
    } else {
      if (cont > maxCont) {   //To take the Peak Time
        maxCont = cont;
        peakTime.hour = obj.datetime.hour;
        peakTime.minute = obj.datetime.minute;
      }
      averageMin.push(cont);       //Push the array, resets the counter, and changes to the next minute
      cont = 0;                     
      min = obj.datetime.minute;
    }

    if (obj.datetime.hour == hour) {  //Same concept but with the hours
      contHour++;
    }else {
      averageHour.push(contHour);
      contHour = 0;
      hour = obj.datetime.hour
    }
   

  });

 peakTime.maxRequests = Math.max(...averageMin);
  
 const averageObj= {
    averageHour,
    averageNum : (averageMin.length / 60),
    peakTime

  }
  
  return averageObj;
}

function getCodes(obj) {
  const res_code = []; //To get the Response Codes
  const res_codeJSON = []; // JSON with all the response codes data
  obj.forEach((codes) => {
    let code = codes.response_code;
    if (!res_code.includes(code)) { //Captures every unique response code
      res_code.push(code);
    }
  });

  for (let index = 0; index < res_code.length; index++) {  // To get how many response codes they were
    let cont = 0;
    let res_codeObj = {};
    obj.forEach((codes) => {
      if (codes.response_code.includes(res_code[index])) { //To know the number of calls that response code had
        cont++;
      }
    });
    res_codeObj = { 
      code: res_code[index],
      calls: cont,
    };
    res_codeJSON.push(res_codeObj); 
  }

  return res_codeJSON; 
}

function getSize(objs) {
  let size = 0;
  let totalSize=0;
  let sizeArray = [];
  let hour = objs[0].datetime.hour;

  objs.forEach((sizes) => {
    if (sizes.document_size != "-") {
      totalSize += parseInt(sizes.document_size);
      if (sizes.datetime.hour == hour) {
        size +=  parseInt(sizes.document_size);
      }else {
        sizeArray.push(Math.round(size/Math.pow(1024, 2)));
        size = 0;
        hour = sizes.datetime.hour
      }    
    }
  });
  
  const sizeObj= {
    totalSize,
    sizeArray,
  }
  return sizeObj;
}

module.exports = {
  readLine,
  getHTTPMethods,
  getRequestPerMinute,
  getCodes,
  getSize,
};
