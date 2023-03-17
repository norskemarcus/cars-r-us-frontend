import { API_URL } from "../../settings.js";
import {
  handleHttpErrors,
  makeOptionsWithToken,
  sanitizeStringWithTableRows,
} from "../../utils.js";

const URL = API_URL + "/reservations";

export async function initListReservationsAll() {
  fetchAllReservations();
}

export async function fetchAllReservations() {
  try {
    const options = makeOptionsWithToken("GET", null, true);

    const reservations = await fetch(API_URL + "/reservations", options).then(
      handleHttpErrors
    );

    document.querySelector("#user-reservation").innerText =
      localStorage.getItem("user");

    const cars = await fetch(API_URL + "/cars/user", options).then(
      handleHttpErrors
    );

    // Create a map of car id to car object
    const carMap = new Map(cars.map((car) => [car.id, car]));

    const tableRows = reservations
      .map((reservation) => {
        const car = carMap.get(reservation.carId);
        return `
            <tr>
            <!--  <td>${reservation.carId}</td>  -->
            <td>${reservation.rentalDate}</td>
            <td>${car.brand}</td>
            <td>${car.model}</td>
            <td>${car.pricePrDay}</td>
            </tr>`;
      })
      .join("\n");

    document.querySelector("#tablerows").innerHTML =
      sanitizeStringWithTableRows(tableRows);
  } catch (err) {
    document.getElementById("error").innerText = err.message;
  }
}
