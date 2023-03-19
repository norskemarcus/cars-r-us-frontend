import {
  handleHttpErrors,
  sanitizeStringWithTableRows,
  makeOptions,
  makeOptionsWithToken,
} from "../../utils.js";
import { API_URL } from "../../settings.js";
const URL = API_URL + "/members";

export function initMembers() {
  getAllMembers();
  document.querySelector("#tbl-body").onclick = showMemberDetails;
  // filterMembersByUsername();
  //filterMembersByEmail();
}

/* async function filterMembersByUsername() {
  const membersTable = document.getElementById("members-table");
  const usernameInput = document.getElementById("username-input");

  usernameInput.addEventListener("input", filterMembersByUsername);
  const username = usernameInput.value.trim().toLowerCase();

  const members = await getAllMembers();

  const filteredMembers = members.filter((member) =>
    member.username.toLowerCase().includes(username)
  );
  makeTable(filteredMembers);

  const tableBody = membersTable.getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";

  const tableRows = filteredMembers.map(
    (member) => `
    <tr>                                
      <td>${member.username}</td>              
      <td>${member.email}</td>                     
      <td>${member.firstName}  ${member.lastName} </td>
      <td>${member.ranking}</td>
      <td><button id="row-btn_details_${member.username}" type="button"  class="btn btn-sm btn-secondary" data-bs-toggle="modal" data-bs-target="#member-details-modal">Details</button></td>
      <td><button id="row-btn_delete_${member.username}" type="button"  class="btn btn-sm btn-danger">Delete</button></td>    
    </tr>`
  );
  tableBody.innerHTML = tableRows.join("");
}

async function filterMembersByEmail() {
  const membersTable = document.getElementById("members-table");
  const emailInput = document.getElementById("email-input");

  emailInput.addEventListener("input", filterMembersByEmail);
  const email = emailInput.value.trim().toLowerCase();
  const members = await getAllMembers();
  const filteredMembers = members.filter((member) =>
    member.email.toLowerCase().includes(email)
  );
  makeTable(filteredMembers);

  const tableBody = membersTable.getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";

  const tableRows = filteredMembers.map(
    (member) => `
    <tr>                                
      <td>${member.username}</td>              
      <td>${member.email}</td>                     
      <td>${member.firstName}  ${member.lastName} </td>
      <td>${member.ranking}</td>
      <td><button id="row-btn_details_${member.username}" type="button"  class="btn btn-sm btn-secondary" data-bs-toggle="modal" data-bs-target="#member-details-modal">Details</button></td>
      <td><button id="row-btn_delete_${member.username}" type="button"  class="btn btn-sm btn-danger">Delete</button></td>    
    </tr>`
  );
  tableBody.innerHTML = tableRows.join("");
}
 */

async function getAllMembers() {
  const options = makeOptionsWithToken("GET", null, true);

  try {
    const members = await fetch(URL, options).then(handleHttpErrors);
    makeTable(members);
  } catch (err) {
    document.getElementById("status").innerText = err.message;
  }
}

function makeTable(members) {
  const tableRows = members.map(
    (member) => `
    <tr>                                
      <td>${member.username}</td>              
      <td>${member.email}</td>                     
      <td>${member.firstName}</td>
      <td>${member.ranking}</td>
      <td><button id="row-btn_details_${member.username}" type="button"  class="btn btn-sm btn-secondary" data-bs-toggle="modal" data-bs-target="#member-details-modal">Details</button></td>
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
        .forEach((field) => (field.innerText = member[field.dataset.property]));
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
