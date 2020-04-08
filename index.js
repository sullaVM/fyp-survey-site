const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const fs = require("fs");
var shuffle = require('shuffle-array');

const apiPort = 8082;
const app = express();

app.use(express.static("static"));
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));

const levelPairs = [
  [1, 2], [1, 3], [1, 4],
  [2, 3], [2, 4], [3, 4],
];

const labelSet = [
  "Full Face (Front)",
  "Full Face (Side Profile)",
  "Eye Close Up (Front)",
  "Eyes, Nose and Cheeks (Front)",
  "Eyes, Nose and Cheeks (Side)",
  "Mouth and Jaw (Front)",
  "Nose Close Up (Side)",
  "Skin Close Up (Front)",
];

const random = (request, response) => {
  const masterList = [];

  labelSet.forEach((label, i) => {
    levelPairs.forEach((pair) => {
      const shuffledPair = shuffle(pair);
      masterList.push({
        linkA: `img/Level${shuffledPair[0]}/l${shuffledPair[0]}-${i}.png`,
        linkB: `img/Level${shuffledPair[1]}/l${shuffledPair[1]}-${i}.png`,
        name: `${i},${shuffledPair[0]},${shuffledPair[1]}`,
        label,
        rightQuality: 'B',
        leftQuality: 'A',
      });
    });
  });

  const shuffledMasterList = shuffle(masterList);

  console.log(shuffledMasterList.length);

  // Divide list into 6 parts
  if (shuffledMasterList.length != (labelSet.length * levelPairs.length)) {
    response.sendStatus(500);
  }

  const isSubmit = (section) => {
    if (section == levelPairs.length) {
      return true;
    }
    return false;
  };

  const isHidden = (section) => {
    if (section == 1) {
      return '';
    }
    return 'hidden';
  };

  const sections = [];
  const sectionLen = shuffledMasterList.length / levelPairs.length;
  let levelNum = 1;
  for (let i = 0; i < shuffledMasterList.length; i = i + sectionLen) {
    sections.push({
      sectionName: levelNum,
      nextSection: levelNum + 1,
      submit: isSubmit(levelNum),
      hidden: isHidden(levelNum),
      items: shuffledMasterList.slice(i, i + sectionLen),
    });
    console.log(`${i}-${i + sectionLen}`);
    levelNum++;
  }

  response.render('random', {
    sections,
  });
};

const index = (_request, response) => {
  const sectionOne = [];
  const sectionTwo = [];
  const sectionThree = [];
  const sectionFour = [];

  for (let i = 0; i < labelSet.length; i++) {
    sectionOne.push({
      link: `img/Level1/l1-${i}.png`,
      label: labelSet[i],
      name: `l1-${i}`,
      quality: "A",
    });

    sectionTwo.push({
      linkA: `img/Level2/l2-${i}.png`,
      linkB: `img/Level1/l1-${i}.png`,
      label: labelSet[i],
      name: `l2-${i}`,
      rightQuality: "B",
      leftQuality: "A",
    });

    sectionThree.push({
      linkA: `img/Level3/l3-${i}.png`,
      linkB: `img/Level2/l2-${i}.png`,
      label: labelSet[i],
      name: `l3-${i}`,
      rightQuality: "C",
      leftQuality: "B",
    });

    sectionFour.push({
      linkA: `img/Level4/l4-${i}.png`,
      linkB: `img/Level3/l3-${i}.png`,
      label: labelSet[i],
      name: `l4-${i}`,
      rightQuality: "D",
      leftQuality: "C",
    });
  }

  response.render("index", {
    sectionOne,
    sectionTwo,
    sectionThree,
    sectionFour,
  });
};

const submit = (request, response) => {
  try {
    const source = request.header("user-agent");
    console.log(source);

    const answer = request.body;
    const data = {
      source,
      answer,
    };

    fs.appendFile(
      "responses.json",
      `${JSON.stringify(data, null, 4)},`,
      (err) => {
        if (err) {
          throw err;
        }
      }
    );

    response.status(200).send(`Thank you! <3`);
  } catch (error) {
    console.log(error);
    response.status(500).send("Something went wrong :(");
  }
};

const sendMail = async (request, response) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        serviceClient: process.env.CLIENT_ID,
        privateKey: process.env.PKEY,
      },
    });

    transporter.sendMail(
      {
        from: process.env.EMAIL,
        to: "montess@tcd.ie",
        subject: "Survey Response!",
        text: "test",
      },
      (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: ", info.response);
        }
      }
    );

    response.sendStatus(200);
  } catch (error) {
    console.log(error);
    response.sendStatus(200);
  }
};

app.get('/', index);
app.post('/submit', submit);
app.get('/send', sendMail);
app.get('/random', random);

app.listen(apiPort, () => console.log(`Listening on port: ${apiPort}`));
