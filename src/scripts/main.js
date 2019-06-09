import ymapsClass from "./common/ymapsClass.js";
import { resizeHendler } from "./common/utils";

ymaps.ready(() => { // eslint-disable-line
  const myMap = new ymaps.Map( // eslint-disable-line
    "map",
    {
      center: [31.523316, 34.602904], // Israel, Sderot
      zoom: 16,
      controls: [],
      lang: 'IL'
    },
    {
      searchControlProvider: "yandex#search"
    }
  );
  const ymap = new ymapsClass(myMap);

  ymap.addAllPoints();

  // event listeners
  myMap.events.add("click", function(e) {
    const coords = e.get("coords");

    ymap.map.balloon.close(); // close balloon
    ymap.overlay.open(e._sourceEvent._sourceEvent);
    ymap.overlay.setContent("Поиск...");
    document.querySelector(".overlay__desc").innerHTML = "Отзывов пока нет...";

    ymap.getAddress(coords).then(res => {
      ymap.overlay.setContent(res, coords);
    });
  });

  ymap.clasterer.events.add("balloonopen", () => {
    const overlayElement = document.querySelector(".overlay");

    if (overlayElement) {
      ymap.overlay.close();
    }
  });

    window.addEventListener("resize", resizeHendler);
});
