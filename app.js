const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const { readLine, getHTTPMethods, getRequestPerMinute, getCodes } = require('./functions');


app.use(express.static("public"));

app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/data", async (req, res) => {
  const readed = await readLine();
  const methods = await getHTTPMethods(readed);
  const requests = await getRequestPerMinute(readed);
  const codes = await getCodes(readed);
  res.status(200).send({
    readed,
    methods,
    requests,
    codes
  });
});

