const imgOver = document.getElementsByClassName("img-comp-top");

const initSlider = () => {
  for (let item of imgOver) {
    if (!item.initialisedSlider) {
      if (item.offsetWidth > 0) {
        slideAction(item);
        item.initialisedSlider = true;
      }
    }
  }
};

const slideAction = (image) => {
  let clicked = false;

  const w = image.offsetWidth;
  const h = image.offsetHeight;

  image.style.width = w / 2 + "px";

  const slider = document.createElement("div");
  const arrows = document.createElement("img");
  arrows.src = "img/arrows.png";
  arrows.setAttribute("class", "arrows");
  slider.setAttribute("class", "img-comp-slider");

  slider.appendChild(arrows);
  image.parentElement.insertBefore(slider, image);

  slider.style.bottom = 10 + slider.offsetHeight / 2 + "px";
  slider.style.left = w / 2 - slider.offsetWidth / 2 + "px";

  const slideReady = (e) => {
    e.preventDefault();

    clicked = true;

    window.addEventListener("mousemove", slideMove);
    window.addEventListener("touchmove", slideMove);
    window.addEventListener("touchend", slideFinish);
    window.addEventListener("touchcancel", slideFinish);
  };

  const slideFinish = () => {
    clicked = false;
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

    if (!e.pageX) {
      if (!e.changedTouches) {
        return a.left - window.pageXOffset;
      }
      return e.changedTouches[0].pageX - a.left - window.pageXOffset;
    }

    return e.pageX - a.left - window.pageXOffset;
  };

  const slide = (x) => {
    image.style.width = x + "px";
    slider.style.left = image.offsetWidth - slider.offsetWidth / 2 + "px";
  };

  slider.addEventListener("mousedown", slideReady);
  window.addEventListener("mouseup", slideFinish);

  slider.addEventListener("touchstart", slideReady);
  window.addEventListener("touchend", slideFinish);
};

const goToSection = (previous, next) => {
  const prev = document.getElementById(previous);
  if (prev) {
    prev.hidden = true;
  }

  const nex = document.getElementById(next);
  if (nex) {
    nex.hidden = false;
  }

  initSlider();
  window.location.assign(`#${next}`);
};

initSlider();
