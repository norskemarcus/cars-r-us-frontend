import { API_URL, FETCH_NO_API_ERROR } from "../../settings.js";
import { makeOptions } from "../../utils.js";

const URL = `${API_URL}/cars`;

export async function initAddCar() {
  document.querySelector("#btn-submit-car").onclick = addCar;
}

async function addCar() {
  //e.preventDefault();

  const brand = document.querySelector("#brand").value;
  const model = document.querySelector("#model").value;
  const price = document.querySelector("#price-pr-day").value;
  const bestDiscount = document.querySelector("#best-discount").value;

  const body = {
    brand: brand,
    model: model,
    pricePrDay: price,
    bestDiscount: bestDiscount,
  };

  const options = makeOptions("POST", body);

  await fetch(URL, options);

  document.querySelector("#brand").value = "";
  document.querySelector("#model").value = "";
  document.querySelector("#price").value = "";
  document.querySelector("#best-discount").value = "";
}
