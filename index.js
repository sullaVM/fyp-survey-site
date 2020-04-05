const express = require('express');
const exphbs  = require('express-handlebars');
const fs = require('fs');

const apiPort = 8082;
const app = express();

app.use(express.static('static'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const index = (request, response) => {
  console.log(request.query.num);

  const s1Links = [
    "img/basic-face.png",
    "img/b-eye.png",
  ];
  const s1Labels = [
    "Full Face",
    "Eye Close Up",
  ]

  const s2Links = [
    "img/hq-face.png",
    "img/hq-eye.png",
  ];
  const s2Labels = [
    "Full Face",
    "Eye Close Up",
  ]

  const s3Links = [
    "img/basic-face.png",
    "img/b-eye.png",
  ];
  const s3Labels = [
    "Full Face",
    "Eye Close Up",
  ]

  const s4Links = [
    ["img/hq-skin.png", "img/skin-no-specular.png"],
  ]

  const sectionOne = [];
  s1Links.forEach((link, i) => {
    sectionOne.push({
      link,
      label: s1Labels[i],
      name: `s1-${i}`,
    })
  });

  const sectionTwo = [];
  s2Links.forEach((link, i) => {
    sectionTwo.push({
      linkA: s1Links[i],
      linkB: link,
      label: s2Labels[i],
      name: `s2-${i}`,
    })
  });

  const sectionThree = [];

  const sectionFour = [];
  s4Links.forEach((link, i) => {
    sectionFour.push({
      linkA: link[0],
      linkB: link[1],
      name: `s4-${i}`,
    });
  });

  // fs.appendFile('responses.csv', request.query.num, (err) => {
  //   if (err) {
  //     throw err;
  //   }
  //   console.log(`Response: `);
  // });

  response.render('index', {
    sectionOne,
    sectionTwo,
    sectionThree,
    sectionFour,
  }
  );
}

app.get('/', index);
 
app.listen(apiPort, () => console.log(`Listening on port: ${apiPort}`));