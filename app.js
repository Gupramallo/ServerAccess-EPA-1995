const express = require("express"); // Backend
const app = express();
const port = process.env.PORT || 8080; //Port of the Backend
const {
  readLine,
  getHTTPMethods,
  getRequestPerMinute,
  getCodes,
  getSize,
} = require("./functions"); 

app.use(express.static("public")); // The folder with the frontend

app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

var readed; //Variable that has the DB
dataLoad(); // In order to load the DB correctly, we do this async function first so we have the DB ready 

app.get("/data", async (req, res) => {
  const methods = await getHTTPMethods(readed); //Returns an object with all the info of the Methods Data
  const requests = await getRequestPerMinute(readed); //Returns an object with all the info of the Request per Minute Data
  const codes = await getCodes(readed); //Returns an object with all the info of the Response Codes Data
  const size = await getSize(readed); //Returns an object with all the info of the Document Size Data
  res.status(200).send({
    readed,
    methods,
    requests,
    codes,
    size,
  });   
});

async function dataLoad() {
  return (readed = await readLine());
}
