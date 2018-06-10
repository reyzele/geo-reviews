import ymapsClass from "./common/ymapsClass.js";


ymaps.ready(() => {
  var myPlacemark;
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

    var coords = e.get('coords');

    overlay.open();
    overlay.setContent('Поиск...')
    document.querySelector(".overlay__desc").innerHTML = 'Отзывов пока нет...'

    ymap.getAddress(coords).then(res => {
      overlay.setContent(res, coords);
    });
  });

  myMap.events.add("balloonopen", function (e) {
    e.preventDefault();
    const overlayElement = document.querySelector('.overlay');

    if (overlayElement) {
      overlay.close();
    }
  });

  ymap.clasterer.events.add("balloonopen", function (e) {

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

  myMap.events.add("balloonopen", function (e) {
  });

  ymap.addAllPoints();
  function closeButton() {
    document.querySelector(".popup").classList.toggle("hide");
  }

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
        contentElement.innerHTML = content;
      }
    };
  }
});
