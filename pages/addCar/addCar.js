import { API_URL, FETCH_NO_API_ERROR } from "../../settings.js";
import { handleHttpErrors, makeOptions } from "../../utils.js";

const URL = `${API_URL}/cars`;

export async function initAddCar() {
  document.querySelector("#btn-submit-car").onclick = addCar;
}

async function addCar() {
  //e.preventDefault();
  try {
    const brand = document.querySelector("#brand").value;
    const model = document.querySelector("#model").value;
    const pricePrDay = document.querySelector("#price-pr-day").value;
    const bestDiscount = document.querySelector("#best-discount").value;

    const body = { brand, model, pricePrDay, bestDiscount };

    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.token,
      },
      body: JSON.stringify(body),
    };

    const newCar = await fetch(URL, options).then(handleHttpErrors);
    document.getElementById("status").innerText = newCar;
  } catch (err) {
    alert(err.message);
  }

  // Hvordan reset? document.getElementById("form").reset();

  /* document.querySelector("#brand").value = "";
  document.querySelector("#model").value = "";
  document.querySelector("#price").value = "";
  document.querySelector("#best-discount").value = "";
  */
}
