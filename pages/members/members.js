import {
  handleHttpErrors,
  sanitizeStringWithTableRows,
  makeOptions,
} from "../../utils.js";
import { API_URL } from "../../settings.js";
const URL = API_URL + "/members";

export function initMembers() {
  document.querySelector("#tbl-body").onclick = showMemberDetails;

  getAllMembers();
}

async function getAllMembers() {
  try {
    const data = await fetch(URL).then(handleHttpErrors);
    makeTable(data);
  } catch (err) {
    console.log(err.message);
  }
}

function makeTable(data) {
  const tableRows = data.map(
    (member) => `
    <tr>                                
      <td>${member.username}</td>              
      <td>${member.email}</td>                     
      <td>${member.firstName}</td>
      <td>${member.ranking}</td>
      <td><button id="row-btn_details_${member.username}" type="button"  class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#member-details-modal">Details</button></td>
      <td><button id="row-btn_delete_${member.username}" type="button"  class="btn btn-sm btn-danger">Delete</button></td>    
    </tr>`
  );

  const tableRowsString = tableRows.join("\n");
  document.querySelector("#tbl-body").innerHTML =
    sanitizeStringWithTableRows(tableRowsString);
}

async function showMemberDetails(evt) {
  const target = evt.target;
  if (!target.id.startsWith("row-btn_")) {
    return;
  }

  const parts = target.id.split("_");
  const username = parts[2];
  const btnAction = parts[1];

  if (btnAction === "details") {
    try {
      const member = await fetch(URL + "/" + username).then(handleHttpErrors);
      document
        .querySelectorAll(".property")
        .forEach((field) => (field.innerText = member[field.dataset.property])); // kan også være value
    } catch (error) {
      alert(error.message);
    }
  } else if (btnAction === "delete") {
    deleteMember(username);

    getAllMembers();
  }
}

async function deleteMember(username) {
  const memberToDelete = username;

  const bodyToDelete = {
    username: memberToDelete,
  };

  const options = makeOptions("DELETE", bodyToDelete);

  try {
    await fetch(URL + "/" + memberToDelete, options).then(handleHttpErrors);
    getAllMembers();
  } catch (error) {
    console.log(error);
  }
}
