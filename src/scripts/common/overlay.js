const Overlay = function() {
  const template = document.querySelector("#overlayTemplate").innerHTML;
  const overlay = createOverlay(template);

  function createOverlay(template) {
    let fragment = document.createElement('div');

    fragment.innerHTML = template;

    const overlayElement = fragment.querySelector(".overlay");
    const contentElement = fragment.querySelector(".overlay__title");
    const closeElement = fragment.querySelector(".overlay__close");

    fragment = null;

    document.addEventListener('click', e => {
      if (e.target.tagName !== 'YMAPS') {
        return 0;
      }

      overlayElement.style.top = e.pageY + 'px';
      overlayElement.style.left = e.pageX + 'px';
    })


    closeElement.addEventListener("click", () => {
      document.body.removeChild(overlayElement);
    });

    return {
      open() {
        document.body.appendChild(overlayElement);
      },
      close() {
        closeElement.click();
      },
      setContent(content) {
        contentElement.innerHTML = content;
      }
    };
  }
}

export { Overlay };