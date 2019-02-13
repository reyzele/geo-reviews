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

export { setPosition };
