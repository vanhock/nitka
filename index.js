"use strict";
const cinema = {
  places: [],
	order: [],
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
	for (let row = 1; row <= 10; row++) {
		for (let column = 1; column <= 10; column++) {
			let placesCount = cinema.places.length;
			cinema.places.push({
				index: cinema.places.length,
				position: column,
				row: row,
				price: cinema.options.defaultPrice,
				available: !cinema.unavailable.some(item => {
					return item === placesCount;
				})
			});
		}
	}
	renderPlaces();
}

function renderPlaces() {
	if (!cinema.places.length) {
		return;
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
		return;
	}
	if (!cinema.order.length) {
		cinema.order = [place]
	} else {
		let p = cinema.order;
		if (p.includes(place)) {
			cinema.order.splice(p.indexOf(place), 1);
			selected = false;
		} else {
			cinema.order.push(place);
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
  if (!cinema.order.length) {
    clearOrder();
    return;
  }
  cinema.options.orderBlock.setAttribute("data-empty", "false");

	cinema.options.orderBlock.innerHTML =
    "<div class='order-text'>You chose places:</div>" +
    "<div class='order-places'>" +
    renderOrderPlaces(cinema.order) +
    "<div class='order-total'>Total: " +
		calcOrderTotal(cinema.order) +
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

  function calcOrderTotal(places) {
    return places
      .map(i => {
        return i.price;
      })
      .reduce((prev, current) => {
        return prev + current;
      });
  }
}

function bookPlaces() {
  cinema.order.forEach(p => {
    updatePlace(p.index, { selected: p.selected = false, available: p.available = false });
  });
  cinema.order = [];
	cinema.options.orderBlock.innerHTML =
    "<div class='success'>Thank you for the order! </div>";
}

function clearOrder() {
	cinema.order.forEach(p => {
		updatePlace(p.index, { selected: false });
	});
  cinema.order = [];
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

