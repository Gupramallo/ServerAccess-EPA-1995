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
      }
      res(readed);
    } catch (error) {
      console.error(error);
      rej(error);
    }
  });
}

function parseLine(line) {
  let obj = line.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g);
  const host = obj[0];
  const newFullDate = obj[1].substring(1).slice(0, -1).split(":");
  const datetime = {
    day: newFullDate[0],
    hour: newFullDate[1],
    minute: newFullDate[2],
    second: newFullDate[3],
  };
  obj[2] = obj[2].replace(/['"]+/g, "");
  const method = obj[2].match(/^([\S]+)/g);
  const url = obj[2].match(/\s(.*)/g);
  let request = {};
  if (method && url) {
    request = {
      method: method[0],
      url: url[0],
    };
  } else {
    request = {
      method: "INVALID",
      url: obj[2],
    };
  }

  let response_code = obj[3];
  let document_size = obj[4];
  if (response_code.length != 3) {
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

function getHTTPMethods(obj) {
  const gets = obj.filter((x) => x.request.method === "GET");
  const posts = obj.filter((x) => x.request.method === "POST");
  const heads = obj.filter((x) => x.request.method === "HEAD");
  const invalids = obj.filter((x) => x.request.method == "INVALID");

  return {
    gets,
    posts,
    heads,
    invalids,
  };
}

function getRequestPerMinute(objs) {
  const average = [];

  let time = objs[0].datetime.minute;

  console.log(objs.length);

  let cont = 0;
  console.log(time);
  objs.forEach((obj) => {
    if (obj.datetime.minute == time) {
      cont++;
    } else {
      average.push(cont);
      cont = 0;
      time = obj.datetime.minute;
    }
  });
  console.log(average);
  return average.length / 60;
}

function getCodes(obj) {
  const res_code = [];
  const cont_res_code = [];
  obj.forEach((codes) => {
    let code = codes.response_code;
    if (!res_code.includes(code)) {
      res_code.push(code);
    }
  });

  for (let index = 0; index < res_code.length; index++) {
    let cont = 0;
    let res_codeObj = {};
    obj.forEach((codes) => {
      if (codes.response_code.includes(res_code[index])) {
        cont++;
      }
    });
    res_codeObj = {
      code: res_code[index],
      calls: cont,
    };
    cont_res_code.push(res_codeObj);
  }

  return cont_res_code;
}

function getSize(objs) {
  let size = 0;
  objs.forEach((sizes) => {
    if (sizes.document_size != "-") {
      size += parseInt(sizes.document_size);
    }
  });
  console.log(size);
  return size;
}

module.exports = {
  readLine,
  getHTTPMethods,
  getRequestPerMinute,
  getCodes,
  getSize,
};
