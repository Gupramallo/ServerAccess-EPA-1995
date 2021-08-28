const lineByLine = require("n-readlines");
const liner = new lineByLine("./epa-http.txt");

function readLine() {
    return new Promise((res, rej) => {
      try {
      let readed = [];
      let line;
      let lineNumber = 0;
      while ((line = liner.next())) {
        var lineString = line.toString("ascii");
        const test = parseLine(lineString);
  
        readed.push(test);
        lineNumber++;
       /* if (lineNumber >= 47748) {
          //liner.close();
          console.log("end of line reached");
          res(readed)
        }*/
      }
      res(readed);
      } catch (error) {
          console.error(error);
          rej(error);
      }
      
  
      
    });
  }
  
  function parseLine(line) {
  
    let obj = line.replace(/"/g,'');
    obj = obj.split(" ");
    const host = obj[0];
    const newFullDate = obj[1].substring(1).slice(0, -1).split(":");
    const datetime = {
      day: newFullDate[0],
      hour: newFullDate[1],
      minute: newFullDate[2],
      second: newFullDate[3],
    };
    const protocol = obj[4].split("/");
    const request = {
      method: obj[2],
      url: obj[3],
      protocol: protocol[0],
      protocol_version: protocol[1], 
    };
    const response_code = obj[5];
    const document_size = obj[6];
    const lineObj = {
      host,
      datetime,
      request,
      response_code,
      document_size
    };
  
    return lineObj;
  }

function getHTTPMethods(obj) {
    const gets = obj.filter(x => x.request.method === 'GET' );
    const posts = obj.filter(x => x.request.method === 'POST' );
    const heads = obj.filter(x => x.request.method === 'HEAD' );
    const invalids = obj.filter(x => x.request.method !== 'GET' && x.request.method !== 'POST' && x.request.method !== 'HEAD');

    return {
      gets,
      posts,
      heads,
      invalids
    }
  }

function getRequestPerMinute(obj) {
    const average = [];
    let time= obj[0].datetime.minute;
    let cont = 0;
    console.log(time)
    obj.forEach(minutes => {
        if (minutes.datetime.minute == time) {
          cont++
        }else{
          average.push(cont);
          cont=0;
          time = minutes.datetime.minute;
        }
    });
    console.log(average.length/60)
    return average.length/60
}

function getCodes(obj) {
  const res_code = [];
  obj.forEach(codes=>{
    let code = codes.response_code;
    if (!res_code.includes(code)) {
      res_code.push(code) 
    }
  })
  console.log(res_code);
}

module.exports = {readLine, getHTTPMethods, getRequestPerMinute, getCodes};