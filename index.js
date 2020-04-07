const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const fs = require("fs");

const apiPort = 8082;
const app = express();

app.use(express.static("static"));
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));

const index = (_request, response) => {
  const labelsSet = [
    "Full Face (Front)",
    "Full Face (Side Profile)",
    "Eye Close Up (Front)",
    "Eyes, Nose and Cheeks (Front)",
    "Eyes, Nose and Cheeks (Side)",
    "Mouth and Jaw (Front)",
    "Nose Close Up (Side)",
    "Skin Close Up (Front)",
  ];

  const sectionOne = [];
  const sectionTwo = [];
  const sectionThree = [];
  const sectionFour = [];

  for (let i = 0; i < labelsSet.length; i++) {
    sectionOne.push({
      link: `img/Level1/l1-${i}.png`,
      label: labelsSet[i],
      name: `l1-${i}`,
      quality: "A",
    });

    sectionTwo.push({
      linkA: `img/Level2/l2-${i}.png`,
      linkB: `img/Level1/l1-${i}.png`,
      label: labelsSet[i],
      name: `l2-${i}`,
      quality: "B",
      prevQuality: "A",
    });

    sectionThree.push({
      linkA: `img/Level3/l3-${i}.png`,
      linkB: `img/Level2/l2-${i}.png`,
      label: labelsSet[i],
      name: `l3-${i}`,
      quality: "C",
      prevQuality: "B",
    });

    sectionFour.push({
      linkA: `img/Level4/l4-${i}.png`,
      linkB: `img/Level3/l3-${i}.png`,
      label: labelsSet[i],
      name: `l4-${i}`,
      quality: "D",
      prevQuality: "C",
    });
  }

  response.render("index", {
    sectionOne,
    sectionTwo,
    sectionThree,
    sectionFour,
  });
};

const submit = async (request, response) => {
  try {
    const source = request.header("user-agent");
    console.log(source);
  
    const answer = request.body;
    const data = {
      source,
      answer,
    };

    fs.appendFile("responses.json", `${JSON.stringify(data, null, 4)},`, (err) => {
      if (err) {
        throw err;
      }
    });
  
    console.log(info);
  
    response.status(200).send(`Thank you! <3`);
  } catch (error) {
    console.log(error);
    response.status(500).send('Something went wrong :(')
  }
};

const testMail = async (request, response) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    });
  
    let info = await transporter.sendMail({
      from: process.env.GMAIL,
      to: "montess@tcd.ie",
      subject: "Survey Response!",
      text: 'test',
    });
  
    console.log(info);
  
    response.sendStatus(200);
  } catch (error) {
    console.log(error);
    response.sendStatus(200);
  }

};

app.get("/", index);
app.post("/submit", submit);
app.get('/test', testMail);

app.listen(apiPort, () => console.log(`Listening on port: ${apiPort}`));
