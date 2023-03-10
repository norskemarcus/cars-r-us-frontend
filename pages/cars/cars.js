import { API_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";

const URL = API_URL + "/cars"; //adder admin når det fungerer

export async function initCars() {
  getAllCars();
  document.querySelector("#table-rows").onclick = showCarDetails;
}

export async function getAllCars() {
  try {
    const cars = await fetch(URL).then(handleHttpErrors);
    makeTable(cars);
  } catch (err) {
    console.log(err);
  }
}

function makeTable(cars) {
  const tableRows = cars
    .map(
      (car) => `
<tr>
<td>${car.id}</td>
<td>${car.brand}</td>
<td>${car.model}</td>
<td>${car.pricePrDay}</td>
<td>${car.bestDiscount}</td>
<td><button id="row-btn_${car.id}" type="button" class="btn btn-sm btn-secondary">Details</button></td>
</tr>`
    )
    .join("\n"); // Laver den om til en enkelt streng

  document.querySelector("#table-rows").innerHTML =
    sanitizeStringWithTableRows(tableRows);
}

async function showCarDetails(evt) {
  const target = evt.target;
  if (!target.id.startsWith("row-btn_")) {
    return;
  }
  const id = target.id.replace("row-btn_", "");

  window.router.navigate("find-edit-car?id=" + id);
}
