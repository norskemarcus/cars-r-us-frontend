import { API_URL } from "../../settings.js";
import { makeOptions } from "../../utils.js";

const URL = API_URL + "/members";

export function initSignup() {
  document.querySelector("#btn-submit-car").onclick = addMember;
}

async function addMember() {
  //e.preventDefault();

  const username = document.querySelector("#input-username").value;

  const email = document.querySelector("#input-email").value;

  const password = document.querySelector("#input-password").value;

  const firstName = document.querySelector("#input-firstname").value;

  const lastName = document.querySelector("#input-lastname").value;

  const street = document.querySelector("#input-street").value;

  const city = document.querySelector("#input-city").value;

  const zip = document.querySelector("#input-zip").value;

  const body = {
    username: username,
    email: email,
    password: password,
    firstName: firstName,
    lastName: lastName,
    street: street,
    city: city,
    zip: zip,
  };

  const options = makeOptions("POST", body);

  await fetch(URL, options);
}
