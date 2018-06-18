import ymapsClass from "./common/ymapsClass.js";

ymaps.ready(() => {
  let overlay_ = false;
  let myMap = new ymaps.Map(
    "map",
    {
      center: [55.76, 37.64], // Москва
      zoom: 13,
      controls: []
    },
    {
      searchControlProvider: "yandex#search"
    }
  );

  const ymap = new ymapsClass(myMap);

  myMap.events.add("click", function (e) {
    ymap.clasterer.balloon.close();
    ymap.map.balloon.close();

    const coords = e.get('coords');

    overlay.open();
    overlay.setContent('Поиск...');
    document.querySelector('.overlay__desc').innerHTML = 'Отзывов пока нет...';

    ymap.getAddress(coords).then(res => {
      overlay.setContent(res, coords);
    })
  });

  ymap.clasterer.events.add("balloonopen", function (e) {
    e.preventDefault();
    const overlayElement = document.querySelector('.overlay');

    if (overlayElement) {
      overlay.close();
    }

    if (e.originalEvent.type !== "balloonopen") {
      let balloon = document.querySelector('.ymaps-2-1-64-balloon');
      let overlay = document.querySelector('#open-popup');
      let coords = overlay.dataset.coords.split(",");
      let promise = new Promise((resolve) => {
        if (balloon) {
          resolve();
        }
      })

      promise.then(() => {
        balloon.style.top = "-9999px";
        openOverlay(coords);
        overlay_ = true;
      })
    } else {

      return 0;
    }
  });

  function openOverlay(coords) {
    ymap.clasterer.balloon.close();
    ymap.map.balloon.close();

    overlay.open();
    overlay.setContent('Поиск...', coords)

    ymap.getAddress(coords).then(res => {
      overlay.setContent(res);
      ymap.getCommentsOnAddress(res);
    });
  }

  ymap.addAllPoints();

  // Добавление комментарий
  function addComment() {
    let address = document.querySelector(".overlay__title"),
      coords = address.dataset.coords,
      name = document.querySelector("#name").value,
      place = document.querySelector("#place").value,
      text = document.querySelector("#text").value;
    const form = document.querySelector('#form');

    if (name && place && text) {
      fetch("/add", {
        method: "POST",
        body: JSON.stringify({
          address: address.innerText,
          coords: coords,
          name: name,
          place: place,
          text: text
        }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then(() => {
        ymap.getCommentsOnAddress(address.innerText);
        ymap.addAllPoints();
      });
    }
    form.reset();
  }

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
      let promise = new Promise((resolve) => {
        if (overlay_) {
          resolve();
        } else {
          setTimeout(() => {
            resolve();
          }, 300);
        }
      })

      if (e.target.id === 'open-popup') {
        openOverlay(e.target.dataset.coords.split(","));
      } else if (e.target.tagName !== 'YMAPS') {

        return 0;
      }
      promise.then(() => {
        setPosition(e);
      })
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
    };

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
        if (content === undefined || content === '') {
          contentElement.innerHTML = 'Неизвестное место...';
        } else {
          contentElement.innerHTML = content;
        }
        if (coords !== undefined) {
          contentElement.dataset.coords = coords;
        }
      }
    };
  }
});
