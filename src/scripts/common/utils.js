function setPosition(elem, container) {
  const offset = 5;
  let posY = elem.pageY;
  let posX = elem.pageX;

  if (posY + container.offsetHeight > window.innerHeight) {
    posY = window.innerHeight - container.offsetHeight - offset;
  }

  if (posX + container.offsetWidth > window.innerWidth) {
    posX = window.innerWidth - container.offsetWidth - offset;
  }

  container.style.top = posY + "px";
  container.style.left = posX + "px";
}

function resizeHendler() {
  const overlay = document.querySelector(".overlay");

  if (overlay) {
    const elementSize = overlay.getBoundingClientRect();
    const top = elementSize.top;
    const bottom = elementSize.bottom;
    const left = elementSize.left;
    const right = elementSize.right;
    const height = elementSize.height;
    const width = elementSize.width;
    const offset = 5;

    if (window.innerHeight < bottom && top > offset) {
      top < 0
        ? (overlay.style.top = offset)
        : (overlay.style.top = window.innerHeight - height - offset + "px");
    } else if (window.innerHeight > bottom && top <= offset) {
      overlay.style.top = offset + "px";
    }

    if (window.innerWidth < right && left > offset) {
      left < 0
        ? (overlay.style.left = offset)
        : (overlay.style.left = window.innerWidth - width - offset + "px");
    } else if (window.innerWidth > right && left <= offset) {
      overlay.style.left = offset + "px";
    }
  }
}

const dragAndDrop = element => e => {
  const parent = e.target.parentNode;

  if (
    parent.classList.contains("overlay__contents") ||
    e.target.classList.contains("overlay__footer")
  ) {
    const coords = getCoords(element);
    const shiftX = e.pageX - coords.left;
    const shiftY = e.pageY - coords.top;

    document.onmousemove = e => {
      element.style.left = e.pageX - shiftX + "px";
      element.style.top = e.pageY - shiftY + "px";
    };

    element.onmouseup = () => (document.onmousemove = null);
  }
};

function getCoords(elem) {
  const elemCoords = elem.getBoundingClientRect();

  return {
    top: elemCoords.top + pageYOffset,
    left: elemCoords.left + pageXOffset
  };
}

export { setPosition, resizeHendler, dragAndDrop };
