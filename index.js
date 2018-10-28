"use strict";
const cinema = {
  places: [],
	order: null,
	unavailable: generateUnavailableIdx(),
  options: {
		defaultPrice: 100,
		placeClass: "place",
		placesContainer: document.querySelector("#places"),
		orderBlock: document.querySelector("#order .content")
  }
};

document.addEventListener("DOMContentLoaded", setPlaces);

function setPlaces() {
  /** Generate 100 places with 10 random booked places **/
	let posCounter = 1,
		rowCounter = 0;
	for (let i = 0; i < 100; i++) {
		posCounter++;
		if (i % 10 === 0) {
			++rowCounter;
			posCounter = 1;
		}
		cinema.places.push({
			index: cinema.places.length,
			position: posCounter,
			row: rowCounter,
			price: cinema.options.defaultPrice,
			available: !cinema.unavailable.some(item => {
				return item === i + 1;
			})
		});
	}
	if (cinema.places && cinema.places.length) {
		renderPlaces();
	}
}

function renderPlaces() {
	if (!cinema.places.length) {
		return null;
	}
	cinema.options.placesContainer.innerHTML = "";
	cinema.options.placesContainer.removeAttribute("data-empty");
	cinema.places.forEach((p, i) => {
		const div = document.createElement("div");
		div.setAttribute("class", cinema.options.placeClass);
		div.setAttribute("available", p.available);
		div.setAttribute("data-index", i);
		div.innerHTML = p.row + "/" + p.position;
		cinema.options.placesContainer.appendChild(div);
	});
	cinema.options.placesContainer.childNodes.forEach(elem => {
		elem.addEventListener("click", togglePlaceInOrder);
	});
}

function togglePlaceInOrder(e) {
	const placeIndex = e.target.getAttribute("data-index");
	const place = cinema.places[placeIndex];
	let selected = true;
	if (!place.available) {
		return null;
	}
	if (!cinema.order) {
		cinema.order = {
			places: [place],
			total: place.price
		};
	} else {
		let p = cinema.order.places;
		if (p.includes(place)) {
			cinema.order.places.splice(p.indexOf(place), 1);
			selected = false;
		} else {
			cinema.order.places.push(place);
		}
	}

	updatePlace(placeIndex, { selected: selected });
	updateOrder();
}

function updatePlace(placeIndex, params) {
  const place = document.getElementsByClassName(cinema.options.placeClass)[
    placeIndex
  ];
  for (const [key, value] of Object.entries(params)) {
    place.setAttribute(key, value);
  }
}

/** Order functions: **/

function updateOrder() {
  if (!cinema.order.places.length) {
    clearOrder();
    return null;
  }
  cinema.options.orderBlock.setAttribute("data-empty", "false");

	cinema.options.orderBlock.innerHTML =
    "<div class='order-text'>You chose places:</div>" +
    "<div class='order-places'>" +
    renderOrderPlaces(cinema.order.places) +
    "<div class='order-total'>Total: " +
		calcOrderTotal() +
    "</div>" +
    "</div>" +
    "<button class='order-buy'>Get Tickets</button><button class='order-cancel'>Cancel</button>";

  document.querySelector(".order-buy").addEventListener("click", bookPlaces);
  document.querySelector(".order-cancel").addEventListener("click", clearOrder);

  function renderOrderPlaces(places) {
    let placesHtml = "";
    places.forEach(p => {
      placesHtml +=
        "<div class='order-place'>Row " +
        p.row +
        " position " +
        p.position +
        "</div>";
    });
    return placesHtml;
  }

  function calcOrderTotal() {
    return cinema.order.places
      .map(i => {
        return i.price;
      })
      .reduce((prev, current) => {
        return prev + current;
      });
  }
}

function bookPlaces() {
  cinema.order.places.forEach(p => {
    updatePlace(p.index, { selected: p.available = false, available: p.selected = false });
  });
  cinema.order = null;
	cinema.options.orderBlock.innerHTML =
    "<div class='success'>Thank you for the order! </div>";
}

function clearOrder() {
	cinema.order.places.forEach(p => {
		updatePlace(p.index, { selected: false });
	});
  cinema.order = null;
	cinema.options.orderBlock.setAttribute("data-empty", "true");
	cinema.options.orderBlock.innerHTML = "";
}

/** Utilities: **/

function generateUnavailableIdx() {
  const arr = [];
  while (arr.length <= 9) {
    let random = Math.floor(Math.random() * 100) + 1;
    if (arr.indexOf(random) > -1) continue;
    arr[arr.length] = random;
  }
  return arr;
}

