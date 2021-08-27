const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const lineByLine = require("n-readlines");
const liner = new lineByLine("./epa-http.txt");

let line;
let lineNumber = 0;

app.use(express.static("public"));

app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/test", async (req, res) => {
  const readed = 
  
   
  await readLine();
  res.status(200).send({
    mesage: readed,
  });
});

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
      if (lineNumber == 10) {
        liner.close();
        console.log("end of line reached");
        res(readed)
      }
    }
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
