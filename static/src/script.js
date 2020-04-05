const initSlider = () => {
  const imgOver = document.getElementsByClassName("img-comp-top");

  for (let item of imgOver) {
    slideAction(item);
  }
};

const slideAction = (image) => {
  let clicked = false;

  const w = image.offsetWidth;
  const h = image.offsetHeight;

  image.style.width = w / 2 + "px";

  const slider = document.createElement("div");
  slider.setAttribute("class", "img-comp-slider");

  image.parentElement.insertBefore(slider, image);

  slider.style.bottom = 10 +  slider.offsetHeight / 2 + "px";
  slider.style.left = w / 2 - slider.offsetWidth / 2 + "px";

  const slideReady = (e) => {
    e.preventDefault();

    clicked = true;

    window.addEventListener("mousemove", slideMove);
    window.addEventListener("touchmove", slideMove);
  };

  const slideFinish = () => {
    clicked = false;
    console.log(clicked);
  };

  const slideMove = (e) => {
    if (!clicked) {
      return false;
    }

    let pos = getCursorPos(e);

    if (pos < 0) {
      pos = 0;
    }
    if (pos > w) {
      pos = w;
    }

    slide(pos);
  };

  const getCursorPos = (e) => {
    const a = image.getBoundingClientRect();
    e = e || window.event;

    return e.pageX - a.left - window.pageXOffset;
  };

  const slide = (x) => {
    image.style.width = x + "px";
    slider.style.left = image.offsetWidth - slider.offsetWidth / 2 + "px";
  };

  slider.addEventListener("mousedown", slideReady);
  window.addEventListener("mouseup", slideFinish);

  slider.addEventListener("touchstart", slideReady);
  window.addEventListener("touchstop", slideFinish);
};

initSlider();
