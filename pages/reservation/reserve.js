import { API_URL } from "../../settings.js";
import {
  makeOptions,
  handleHttpErrors,
  sanitizeStringWithTableRows,
  makeOptionsWithToken,
} from "../../utils.js";

const URL = API_URL + "/cars";

export async function initReservation() {
  fetchAllCars();
  document.querySelector("#table-rows").onclick = setupReservationModal;
  document.querySelector("#btn-reservation").onclick = makeReservation;
}

/*  Show all cars in the main table------------------------------------------------------------------------------ */
async function fetchAllCars() {
  document.getElementById("error").innerText = "";

  try {
    const options = makeOptionsWithToken("GET", null, true);

    const cars = await fetch(URL + "/user", options).then(handleHttpErrors);

    const tableRows = cars
      .map(
        (car) => `
    <tr>
      <td>${car.id}</td>
      <td>${car.brand}</td>
      <td>${car.model}</td>
      <td>${car.pricePrDay}</td>
    <td>
    <button id="reserve-row-btn_${car.id}" type="button" class="btn btn-sm btn-secondary" data-bs-toggle="modal" data-bs-target="#reservation-modal">Reserve car</button></td>
    </tr>`
      )
      .join("\n");

    document.querySelector("#table-rows").innerHTML =
      sanitizeStringWithTableRows(tableRows);
  } catch (err) {
    document.getElementById("error").innerText = err.message;
  }
}

/* Here begins the modal------------------------------------------------------------------------------------------- */

async function setupReservationModal(evt) {
  const target = evt.target;
  const parts = target.id.split("_");
  const id = parts[1];
  //e.preventDefault(); ???
  document.querySelector("#car-id").value = id;
  document.querySelector("#username-from-token").innerText =
    localStorage.getItem("user");
}

async function makeReservation() {
  const rentalDate = document.querySelector("#reservation-date").value;
  const today = new Date();

  if (rentalDate < today || !rentalDate) {
    return (document.querySelector("#status").innerText =
      "Pick a date in the future");
  }

  const carId = document.querySelector("#car-id").value;

  // Changed there from value to token ---------------------------------------------------------
  //const username = document.querySelector("#user-name").value;
  const username = localStorage.getItem("user");

  const body = {
    carId: carId,
    username: username,
    rentalDate: rentalDate,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage.token,
    },
    body: JSON.stringify(body),
  };

  // POST fetch to get reservation request
  // resURL = http://localhost:8080/reservations

  const resURL = API_URL + "/reservations";

  try {
    const reservation = await fetch(resURL, options).then(handleHttpErrors);

    document.querySelector("#status").innerText =
      "You have reserved car nr. " + carId + " for " + rentalDate;
  } catch (error) {
    console.error(error);
    document.querySelector("#status").innerText = error.message;
  }
}
