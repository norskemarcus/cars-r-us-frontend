import { API_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";

const URL = API_URL + "/members";

export async function initMembers() {
  getAllMembers();
}

async function getAllMembers() {
  try {
    const members = await fetch(URL).then((res) => res.json());
    makeTable(members);
  } catch (err) {
    console.log("UPS: " + err); //TODO: write better error message!
  }

  function makeTable(data) {
    const tableRows = data
      .map(
        (member) => `
  <tr>
<td>${member.username}</td>
<td>${member.email}</td>
<td>${member.firstName}</td>
<td>${member.lastName}</td>
<td>${member.street}</td>
<td>${member.city}</td>
<td>${member.zip}</td>
<td>${member.created}</td>
<td>${member.edited}</td>
<td>${member.ranking}</td>

<td>
<button id="row-btn_details_${member.username}" type="button"  class="btn btn-sm btn-primary">Details</button> 

<button id="row-btn_delete_${member.username}" type="button"  class="btn btn-sm btn-danger">Delete</button> 
</td> 
  `
      )
      .join("\n");

    document.querySelector("#tbl-body").innerHTML =
      sanitizeStringWithTableRows(tableRows);
  }
}
