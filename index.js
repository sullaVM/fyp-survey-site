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
    'img/b-face.png',
    'img/b-eye.png',
  ];
  const labelsSet1 = [
    'Full Face',
    'Eye Close Up',
  ];

  const s2Links = [
    'img/hq-face.png',
    'img/hq-eye.png',
  ];

  const s3Links = [
    'img/rt-face.png',
    'img/rt-eye.png',
  ];

  const s4Links = [
    ['img/hq-skin.png', 'img/skin-no-specular.png'],
  ];
  const labelsSet2 = [
    'Skin Close Up',
  ]

  const sectionOne = [];
  s1Links.forEach((link, i) => {
    sectionOne.push({
      link,
      label: labelsSet1[i],
      name: `s1-${i}`,
    })
  });

  const sectionTwo = [];
  s2Links.forEach((link, i) => {
    sectionTwo.push({
      linkA: link,
      linkB: s1Links[i],
      label: labelsSet1[i],
      name: `s2-${i}`,
    })
  });

  const sectionThree = [];
  s3Links.forEach((link, i) => {
    sectionThree.push({
      linkA: link,
      linkB: s2Links[i],
      label: labelsSet1[i],
      name: `s3-${i}`,
    })
  });

  const sectionFour = [];
  s4Links.forEach((link, i) => {
    sectionFour.push({
      linkA: link[0],
      linkB: link[1],
      name: `s4-${i}`,
      label: labelsSet2[i],
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