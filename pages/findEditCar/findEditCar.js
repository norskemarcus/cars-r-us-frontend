import { API_URL } from "../../settings.js";
import { handleHttpErrors, makeOptions } from "../../utils.js";

//Add id to this URL to get a single user
const URL = `${API_URL}/cars/`;

export async function initFindEditCar(match) {
  document.querySelector("#btn-submit-edited-car").onclick = editCar;

  document.querySelector("#btn-fetch-car").onclick = fetchCarData;
  if (match?.params?.id) {
    const id = match.params.id;
    try {
      renderCar(id);
    } catch (err) {
      document.getElementById("error").innerText =
        "Could not find car with ID: " + id;
    }

    document.querySelector("#btn-delete-car").onclick = deleteCarById;
  }

  const navigoRoute = "find-edit-car";

  // bad name, doesn't fetch here!
  async function fetchCarData() {
    document.getElementById("error").innerText = "";
    const id = document.getElementById("car-id-input").value;

    if (!id) {
      document.getElementById("error").innerText = "Please provide an id";
      return;
    }
    try {
      renderCar(id);
      const queryString = "?id=" + id;
      //@ts-ignore
      window.router.navigate(`/${navigoRoute}${queryString}`, {
        callHandler: false,
        updateBrowserURL: true,
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  async function renderCar(id) {
    try {
      const car = await fetch(URL + id).then((res) => res.json());
      document.getElementById("car-id-input").value = "";

      //jsonplaceholder returns an empty object for users not found, NOT an error
      if (Object.keys(car).length === 0) {
        //checks for an empty object = {}
        throw new Error("No car found for id:" + id);
      }

      document.querySelector("#car-id").value = car.id;
      document.querySelector("#brand").value = car.brand;
      document.querySelector("#model").value = car.model;
      document.querySelector("#price-pr-day").value = car.pricePrDay;
      document.querySelector("#best-discount").value = car.bestDiscount;
    } catch (err) {
      document.querySelector("#error").innerText = err;
    }
  }

  async function editCar() {
    // Edit the car that is found:

    const idNotEdit = document.querySelector("#car-id").value;
    const brandEdit = document.querySelector("#brand").value;
    const modelEdit = document.querySelector("#model").value;
    const priceEdit = document.querySelector("#price-pr-day").value;
    const bestDiscount = document.querySelector("#bestDiscount").value;

    const bodyToEdit = {
      id: idNotEdit,
      brand: brandEdit,
      model: modelEdit,
      pricePrDay: priceEdit,
      bestDiscount: bestDiscount,
    };

    const options = makeOptions("PUT", bodyToEdit);

    await fetch(URL + idNotEdit, options);

    document.querySelector("#car-id").value = "";
    document.querySelector("#brand").value = "";
    document.querySelector("#model").value = "";
    document.querySelector("#price-pr-day").value = "";
    document.querySelector("#bestDiscount").value = "";

    document.querySelector("#edited-car").innerText =
      "The car with id " + idNotEdit + " is successfully edited";
  }
}

async function deleteCarById() {
  const carId = document.querySelector("#car-id").value;

  const bodyToDelete = {
    id: carId,
  };

  const options = makeOptions("DELETE", bodyToDelete);

  try {
    await fetch(URL + carId, options).then(handleHttpErrors);
  } catch (error) {
    console.log("ERROR");
  }
}
