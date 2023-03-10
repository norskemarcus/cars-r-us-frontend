import { API_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";

const URL = API_URL + "/reservations"; //adder admin når det fungerer

export async function initListReservationsAll() {
  fetchAllReservations();
}

export async function fetchAllReservations() {
  try {
    const reservations = await fetch(API_URL + "/reservations").then(
      handleHttpErrors
    );
    const cars = await fetch(API_URL + "/cars").then(handleHttpErrors);

    // Create a map of car id to car object
    const carMap = new Map(cars.map((car) => [car.id, car]));

    const tableRows = reservations
      .map((reservation) => {
        const car = carMap.get(reservation.carId);
        return `
            <tr>
              <td>${reservation.carId}</td>
              <td>${car.brand}</td>
              <td>${car.model}</td>
              <td>${reservation.rentalDate}</td>
              <td>${car.pricePrDay}</td>
            </tr>`;
      })
      .join("\n");

    document.querySelector("#tablerows").innerHTML =
      sanitizeStringWithTableRows(tableRows);
  } catch (err) {
    console.log(err);
  }
}
