export function Overlay() {
  const template = document.querySelector("#overlayTemplate").innerHTML;
  const overlay = createOverlay(template);

  function createOverlay(template) {
    let fragment = document.createElement('div');

    fragment.innerHTML = template;

    const overlayElement = fragment.querySelector(".overlay");
    const contentElement = fragment.querySelector(".overlay__title");
    const closeElement = fragment.querySelector(".overlay__close");
    const formElement = fragment.querySelector("#form");
    const buttonElement = fragment.querySelector(".overlay__btn");

    fragment = null;

    buttonElement.addEventListener('click', addComment);

    document.addEventListener('click', e => {
      e.preventDefault();

      if (e.target.classList.contains('placemark__link')) {
        console.log('Vualya');
        
      }

      if (e.target.id === 'open-popup') {
        openOverlay(e.target.dataset.coords.split(","));
      } else if (e.target.tagName !== 'YMAPS') {

        return 0;
      }

      setPosition(e);
    })

    function setPosition(elem) {
      let posY = elem.pageY;
      let posX = elem.pageX;

      if ((posY + overlayElement.offsetHeight) > window.innerHeight) {
        posY = window.innerHeight - overlayElement.offsetHeight - 5;
      }

      if ((posX + overlayElement.offsetWidth) > window.innerWidth) {
        posX = window.innerWidth - overlayElement.offsetWidth - 5;
      }

      overlayElement.style.top = posY + 'px';
      overlayElement.style.left = posX + 'px';
    }


    closeElement.addEventListener("click", () => {
      document.body.removeChild(overlayElement);
    });

    return {
      open() {
        formElement.reset();
        document.body.appendChild(overlayElement);
      },
      close() {
        closeElement.click();
      },
      setContent(content, coords) {
        if (coords !== undefined) {
          contentElement.dataset.coords = coords;
        }

        if (content === undefined || content === '') {
          contentElement.innerHTML = 'Неизвестное место...';
        } else {
          contentElement.innerHTML = content;
        }
      }
    };
  }
}
