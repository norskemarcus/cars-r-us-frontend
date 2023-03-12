import { API_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";

const URL = API_URL + "/cars"; //adder admin når det fungerer

export function initCars() {
  getAllCars();
  document.querySelector("#table-rows").onclick = showCarDetails;
  filterCarsByBrand();
  /* document
    .getElementById("filtering-cars-by-brand")
    .addEventListener("input", filterCarsByBrand); */
}

async function getAllCars() {
  try {
    const data = await fetch(URL).then(handleHttpErrors);
    return data;
  } catch (err) {
    console.log(err.message);
  }
}

async function filterCarsByBrand() {
  const carsTable = document.getElementById("cars-table");
  const brandInput = document.getElementById("filtering-cars-by-brand");

  brandInput.addEventListener("input", filterCarsByBrand);
  const brand = brandInput.value.trim().toLowerCase();

  const cars = await getAllCars();

  const filteredCars = cars.filter((car) =>
    car.brand.toLowerCase().includes(brand)
  );

  makeTable(filteredCars);

  const tableBody = carsTable.getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";

  const tableRows = filteredCars.map(
    (car) => `
        <tr>
          <td>${car.id}</td>
          <td>${car.brand}</td>
          <td>${car.model}</td>
          <td>${car.pricePrDay}</td>
          <td>${car.bestDiscount}</td>
          <td><button id="row-btn_${car.id}" type="button" class="btn btn-sm btn-secondary">Edit/delete car</button></td>
        </tr>`
  );

  tableBody.innerHTML = tableRows.join("");
}

function makeTable(data) {
  const tableRows = data.map(
    (car) => `
<tr>
<td>${car.id}</td>
<td>${car.brand}</td>
<td>${car.model}</td>
<td>${car.pricePrDay}</td>
<td>${car.bestDiscount}</td>
<td><button id="row-btn_${car.id}" type="button" class="btn btn-sm btn-secondary">Edit/delete car</button></td>
</tr>`
  );

  const tableRowsString = tableRows.join("\n");
  document.querySelector("#table-rows").innerHTML =
    sanitizeStringWithTableRows(tableRowsString);
}

async function showCarDetails(evt) {
  const target = evt.target;
  if (!target.id.startsWith("row-btn_")) {
    return;
  }
  const id = target.id.replace("row-btn_", "");

  window.router.navigate("find-edit-car?id=" + id);
}
