const moment = require("moment");

export default class {
  constructor(map) {
    this.map = map;
    this.customItemContentLayout = ymaps.templateLayoutFactory.createClass(
      "<div class=ballon_header>{{ properties.balloonContentHeader|raw }}</div>" +
      "<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>" +
      "<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>"
    );
    this.clasterer = new ymaps.Clusterer({
      preset: 'islands#invertedVioletClusterIcons',
      clusterDisableClickZoom: true,
      clusterOpenBalloonOnClick: true,
      clusterBalloonContentLayout: "cluster#balloonCarousel",
      clusterBalloonItemContentLayout: this.customItemContentLayout,
      clusterBalloonPanelMaxMapArea: 0,
      clusterBalloonContentLayoutWidth: 250,
      clusterBalloonContentLayoutHeight: 130,
      clusterBalloonPagerSize: 5
    });
  }

  createPlacemark(coords, data) {
    return new ymaps.Placemark(coords.split(","), data, {
      preset: "islands#violetIcon",
      balloonPanelMaxMapArea: 0,
      openEmptyBalloon: true,
      draggable: false
    });
  }

  getAddress(coords) {
    return new ymaps.geocode(coords).then(res =>
      res.geoObjects.get(0).getAddressLine()
    );
  }

  getCommentsOnAddress(address) {
    const OverlayText = document.querySelector(".overlay__desc");
    fetch("/get/" + encodeURIComponent(address), {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(res => {
      res.text().then(res => {
        if (res === '<ul id="commentsList"></ul>') {
          OverlayText.innerHTML = 'Отзывов пока нет...';
        } else {
          OverlayText.innerHTML = res;
        }
      });
    });
  }

  addAllPoints() {
    let geoObjects = [];
    this.clasterer.removeAll();
    fetch("/get/all", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(res => res.json()
      )
      .then(res => {
        res.forEach(point => {
          let newPlacemark = this.createPlacemark(point.coords, {
            balloonContentHeader:
              point.place,
            balloonContentBody:
              '<a href="" id="open-popup" data-coords="' +
              point.coords +
              '">' +
              point.address +
              "</a>" +
              "<p>" + point.text + "</p>",
            balloonContentFooter:
              "<p>" + moment(point.date).format('DD.MM.YYYY hh:mm:ss') + "</p>"
          });
          geoObjects.push(newPlacemark);
        });
        return geoObjects;
      })
      .then(geoObjects => {
        this.clasterer.add(geoObjects);
        this.map.geoObjects.add(this.clasterer);
      });
  }
}
