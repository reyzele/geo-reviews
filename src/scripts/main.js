import ymapsClass from "./common/ymapsClass.js";

ymaps.ready(() => { // eslint-disable-line
  const myMap = new ymaps.Map( // eslint-disable-line
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

  ymap.addAllPoints();
});
