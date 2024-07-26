const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const socket = new WebSocket(protocol + '//' + window.location.host + '/shsh_ws/');
function codeToClass(statusCode)
{
    switch(statusCode)
    {
        case "Submitted":
            return "label-info";
            break;
        case "Accepted":
            return "label-success";
            break;
        case "Rejected":
            return "label-danger";
            break;
        default:
            return "label-default";
    }
}
function updateVictimVisit(pk) {
  fetch( "victim_request/"+pk+"/")
    .then(response => response.json())
    .then(data => {
      if(data.error === "Unauthorized")
      {
         console.log("need to hide: "+pk);
         try{
            var existing=document.querySelector(`tr[id='pvtable_row_${pk}']`);
            if (existing)
            {
                existing.innerHTML="";
                existing.remove();
            }
         }
         catch
         {
            console.log("401 but couldn't find row: "+pk);
         }
         colorRows();
         return;
      }
      console.log("fetched: " + data.victim_request_id + " " + data.victim);

      // Check if the row with the same victim_request_id exists
      const existingRow = document.querySelector(`td[id='pvtable_id_${data.victim_request_id}']`);

      if (existingRow) {
        // Update the existing row
        const row = existingRow.parentElement;
        row.querySelector(`td[name='pvtable_identifier']`).textContent = data.victim_identifier;
        if(!data.user_is_shelter_provider)
        {
            row.querySelector(`td[name='pvtable_victim']`).textContent = data.victim_first_name + " " + data.victim_last_name;
        }

        row.querySelector(`td[name='pvtable_edd']`).textContent = data.discharge_date;
        row.querySelector(`td[name='pvtable_age']`).textContent = data.victim_age;
        document.getElementById("victim_age").value = data.victim_age;
        //row.querySelector(`td[name='pvtable_shelter_requests']`).textContent = data.shelter_request_type.join(", ");
        let shelterType = "";
        data.shelter_request_type.forEach(type => {
            // <span class="label label-light" title="{{ shelter_request_type.description }}">{{ shelter_request_type.code }}</span>
            shelterType +=  '<span style="margin:2px;"  class="label label-light" title="'+type +'">' +type +'</span>';
        });
        row.querySelector(`td[name='pvtable_shelter_requests']`).innerHTML = shelterType;
        row.querySelector(`td[name='pvtable_status']`).innerHTML = data.status_description;
        if(data.user_is_coordinator)
        {
            row.querySelector(`td[name='pvtable_status']`).innerHTML = data.status_description + '<i class="fas fa-edit" title="Change Victim Status"></i>'    ;
        }
        row.querySelector(`td[name='pvtable_status']`).className = data.status;
        row.querySelector(`td[name='pvtable_status']`).title = data.status_description;
        if(data.user_is_shelter_provider)
        {

            let shelter_provider_ofr_Str = "";
            for (let i = 0; i < data.shelter_provider_offers.length; i++) {
              let type = data.shelter_provider_offers[i];
              shelter_provider_ofr_Str += '<span style="margin:auto;margin-top:2px;" class="label label-block ' + codeToClass(type.status) + '" title='+type.status_description +'>' +type.status +'</span>';
            }
            row.querySelector(`td[name='pvtable_sp_offers']`).innerHTML = shelter_provider_ofr_Str;

        }
         if(data.user_is_coordinator)
        {


            let relevant_received_offers_Str = "";
            for (let i = 0; i < data.relevant_received_offers.length; i++) {
              let type = data.relevant_received_offers[i];
              relevant_received_offers_Str += '<span style="margin:auto;margin-top:2px;" class="label label-block ' + codeToClass(type.status) + '" title='+type.status_description +'>' + type.shelter_provider_display_name + " : " + type.status +'</span>';
            }
            row.querySelector(`td[name='pvtable_received_offers']`).innerHTML = relevant_received_offers_Str;

        }
      } else {
        // Append a new row
        const tableBody = document.querySelector("tbody");
        const newRow = document.createElement("tr");
        //newRow.setAttribute("onclick",  "openModal('"+data.victim_request_id+"');");
        newRow.setAttribute("id",  "pvtable_row_"+ data.victim_request_id);

        const idCell = document.createElement("td");
        idCell.setAttribute("onclick",  "openModal('"+data.victim_request_id+"');");
        idCell.setAttribute("data-label", "ID");
        idCell.setAttribute("style", "display:none");
        idCell.setAttribute("id",  "pvtable_id_"+ data.victim_request_id);
        idCell.setAttribute("name", "pvtable_id");
        idCell.textContent = data.victim_request_id;
        newRow.appendChild(idCell);

        const identifierCell = document.createElement("td");
        identifierCell.setAttribute("onclick",  "openModal('"+data.victim_request_id+"');");
        identifierCell.setAttribute("data-label", "IDENTIFIER");
        identifierCell.setAttribute("id",  "pvtable_identifier_"+ data.victim_request_id);
        identifierCell.setAttribute("name", "pvtable_identifier");
        identifierCell.textContent = data.victim_identifier;
        newRow.appendChild(identifierCell);

        const ageCell = document.createElement("td");
        ageCell.setAttribute("onclick",  "openModal('"+data.victim_request_id+"');");
        ageCell.setAttribute("data-label", "AGE");
        ageCell.setAttribute("id",  "pvtable_age_"+ data.victim_request_id);
        ageCell.setAttribute("name", "pvtable_age");
        ageCell.setAttribute("style", "text-align:center");
        ageCell.textContent = data.victim_age;
        newRow.appendChild(ageCell);
        // Insert the remaining cells here, using the same approach as above
        if(!data.user_is_shelter_provider)
        {
            const victimCell = document.createElement("td");
            victimCell.setAttribute("onclick",  "openModal('"+data.victim_request_id+"');");
            victimCell.setAttribute("data-label", "Victim");
            victimCell.setAttribute("id",  "pvtable_victim_"+ data.victim_request_id);
            victimCell.setAttribute("name", "pvtable_victim");
            victimCell.textContent =  data.victim_first_name + " " + data.victim_last_name;
            newRow.appendChild(victimCell);
        }
        // Victim name cell


        // EDD cell
        const eddCell = document.createElement("td");
        eddCell.setAttribute("onclick",  "openModal('"+data.victim_request_id+"');");
        eddCell.setAttribute("data-label", "EDD");
        eddCell.setAttribute("id",  "pvtable_edd_"+ data.victim_request_id);
        eddCell.setAttribute("name", "pvtable_edd");
        eddCell.textContent = data.discharge_date;
        newRow.appendChild(eddCell);


        // Location cell
        const locationCell = document.createElement("td");
        locationCell.setAttribute("onclick",  "openModal('"+data.victim_request_id+"');");
        locationCell.setAttribute("data-label", "Location");
        locationCell.setAttribute("id",  "pvtable_location_"+ data.victim_request_id);
        locationCell.setAttribute("name", "pvtable_location");
        newRow.appendChild(locationCell);

        // Shelter type cell
        const shelterTypeCell = document.createElement("td");
        shelterTypeCell.setAttribute("onclick",  "openModal('"+data.victim_request_id+"');");
        shelterTypeCell.setAttribute("data-label", "Shelter Type");
        shelterTypeCell.setAttribute("id",  "pvtable_shelter_requests_"+ data.victim_request_id);
        shelterTypeCell.setAttribute("name", "pvtable_shelter_requests");
        let shelterType="";
        data.shelter_request_type.forEach(type => {
            // <span class="label label-light" title="{{ shelter_request_type.description }}">{{ shelter_request_type.code }}</span>
            shelterType +=  '<span style="margin:2px;"  class="label label-light" title="'+type +'">' +type +'</span>';
        });
        shelterTypeCell.innerHTML = shelterType;
        newRow.appendChild(shelterTypeCell);


        // Create the status cell
        const statusCell = document.createElement("td");
        statusCell.setAttribute("data-label", "Status");
        statusCell.setAttribute("title", data.status_description);
        statusCell.setAttribute("class", data.status);
        statusCell.setAttribute("id",  "pvtable_status_"+ data.victim_request_id);
        statusCell.setAttribute("name", "pvtable_status");
        if(data.user_is_coordinator)
        {
            statusCell.setAttribute("onclick",  "openModal('"+data.victim_request_id+"','statusModal');");
            statusCell.innerHTML = data.status_description + '<i class="fas fa-edit" title="Change Victim Status"></i>'    ;

        }
        else
        {
            statusCell.setAttribute("onclick",  "openModal('"+data.victim_request_id+"');");
            statusCell.innerHTML = data.status_description;
        }

        newRow.appendChild(statusCell);


        if(data.user_is_shelter_provider)
        {
            const spOffersCell = document.createElement("td");
            spOffersCell.setAttribute("onclick",  "openModal('"+data.victim_request_id+"');");
            spOffersCell.setAttribute("id",  "pvtable_sp_offers_"+ data.victim_request_id);
            spOffersCell.setAttribute("name", "pvtable_sp_offers");
            let shelter_provider_ofr_Str = "";
            for (let i = 0; i < data.shelter_provider_offers.length; i++) {
              let type = data.shelter_provider_offers[i];
              shelter_provider_ofr_Str += '<span style="margin:auto;margin-top:2px;" class="label label-block ' + codeToClass(type.status) + '" title='+type.status_description +'>' +type.status +'</span>';
            }
            spOffersCell.innerHTML = shelter_provider_ofr_Str;
            newRow.appendChild(spOffersCell);
        }
         if(data.user_is_coordinator)
        {
            const recOffersCell = document.createElement("td");
            recOffersCell.setAttribute("id",  "pvtable_received_offers_"+ data.victim_request_id);
            recOffersCell.setAttribute("name", "pvtable_received_offers");
            let relevant_received_offers_Str = "";
            for (let i = 0; i < data.relevant_received_offers.length; i++) {
              let type = data.relevant_received_offers[i];
              relevant_received_offers_Str += '<span style="margin:auto;margin-top:2px;" class="label label-block ' + codeToClass(type.status) + '" title='+type.status_description +'>' + type.shelter_provider_display_name + " : " + type.status +'</span>';
            }
            recOffersCell.innerHTML = relevant_received_offers_Str;
            newRow.appendChild(recOffersCell);
        }

        const qaCell = document.createElement("td");
        qaCell.setAttribute("style", "text-align:center;");

        qaCell.setAttribute("id",  "pvtable_qa_"+ data.victim_request_id);
        qaCell.setAttribute("name", "pvtable_qa");
        qaCell.setAttribute("onclick",  "openModal('"+data.victim_request_id+"','qaModal');fetchQuestions('"+data.victim_request_id+"');");

         if(data.user_is_shelter_provider)
        {
            qaCell.innerHTML = '+';
        }
        newRow.appendChild(qaCell);

        // Append the row to the table
        document.querySelector("#victimrequestTable tbody").appendChild(newRow);
        }
//        let victim_info_iframes=document.getElementsByName("victim_info");
//        for (let i=0;i<victim_info_iframes.length;i++)
//        {
//            victim_info_iframes[i].contentWindow.location.reload();
//        }

        getPVQACount();
        fetchQuestions(pk);
         colorRows();
    });

}

socket.onmessage = function(event) {
  console.log("got message: " + event.data);
  const data = JSON.parse(event.data);
  updateVictimVisit(data.victim_request_id);
};


socket.onopen = function(event) {
    // Send a message to the server to subscribe to updates
};

socket.onclose = function(event) {
    // Handle the disconnection
};

function checkPasswordStrength(password) {
    let msg = "";
    let hasDigit = /\d/.test(password);
    let hasUpper = /[A-Z]/.test(password);
    let hasLower = /[a-z]/.test(password);
    let hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasDigit) {
        msg += "Password must have at least 1 digit.\n";
    }

    if (!hasUpper) {
        msg += "Password must have at least 1 uppercase character.\n";
    }

    if (!hasLower) {
        msg += "Password must have at least 1 lowercase character.\n";
    }

    if (!hasSpecial) {
        msg += "Password must have at least 1 special character.\n";
    }

    if (password.length < 8) {
          msg += "Password must be at least 8 characters long.\n";
    }

    return msg;
}


function validatePassword() {
    var password = document.getElementById("new_password").value;
    var retypePassword = document.getElementById("retype_password").value;
    if (password.length>0)
    {
        errorMsg=checkPasswordStrength(password);
        if (errorMsg)
        {
            alert(errorMsg);
            return false;
        }

        if (password != retypePassword) {
            alert("Passwords do not match.");
            return false;
        }
    }
    return true;
}
function toggleModal(name)
{
    // Insert code here to fetch the current user data and fill the form inputs with the data
    var modal = document.getElementById(name);
    if (modal.style.display == "none")
    {
        modal.style.display = "block";
    }
    else
    {
        modal.style.display = "none";
    }

}

function toggleProfile()
{
    // Insert code here to fetch the current user data and fill the form inputs with the data
    toggleModal("userModal");
}


var sortOrder = 1; // 1 for ascending, -1 for descending
var sortedColumn = -1; // index of the sorted column

function sortTable(event) {
  var columnIndex = event.target.cellIndex;

  if (columnIndex == sortedColumn) {
    sortOrder *= -1; // switch the sort order if the same header is clicked
  } else {
    sortOrder = 1; // set to ascending order if a different header is clicked
  }

  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("victimrequestTable");
  switching = true;

  // Update the sort direction icon for all headers
  var headers = table.getElementsByTagName("TH");
  for (var i = 0; i < headers.length; i++) {
    headers[i].getElementsByTagName("I")[0].className = "fas fa-sort";
  }

  // Update the sort direction icon for the sorted header
  if (sortOrder == 1) {
    headers[columnIndex].getElementsByTagName("I")[0].className = "fas fa-sort-up";
  } else {
    headers[columnIndex].getElementsByTagName("I")[0].className = "fas fa-sort-down";
  }

  sortedColumn = columnIndex; // store the index of the sorted column

  // Keep looping until no switching is needed
  while (switching) {
    switching = false;
    rows = table.rows;

    // Loop through all table rows (except the first, which is the header)
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;

      // Get the two elements you want to compare, one from current row and one from the next
      x = rows[i].getElementsByTagName("TD")[columnIndex];
      y = rows[i + 1].getElementsByTagName("TD")[columnIndex];

      // Check if the two rows should switch place
      if (sortOrder == -1) {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      // If a switch has been marked, make the switch and mark that a switch has been done
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}
function getAge(dob)
{
    const victimDOB = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - victimDOB.getFullYear();
    let m = today.getMonth() - victimDOB.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < victimDOB.getDate())) {
        age--;
    }
    return age;
}
function getAgeGroup(age) {
  if (age >= 14 && age <= 49) {
    return "14 - 49";
  } else if (age >= 50 && age <= 64) {
    return "50 - 64";
  } else if (age >= 65 && age <= 74) {
    return "65 - 74";
  } else if (age >= 75 && age <= 80) {
    return "75 - 80";
  } else if (age > 81) {
    return "Over 81";
  } else {
    return "Invalid age";
  }
}
//function selectCorrectOption(selectId,optionText)
//{
//    var select = document.getElementById(selectId);
//
//    var options = select.options;
//    for (var i = 0; i < options.length; i++)
//    {
//      if (options[i].text === optionText)
//      {
//        select.selectedIndex = i;
//        break;
//      }
//    }
//}

function openModal(pk,modalName=null) {
  fetch( "victim_request/"+pk+"/")
    .then(response => response.json())
    .then(data => {
        fetchVictimInfo(data.victim_id)
//        let victim_info_iframes=document.getElementsByName("victim_info");
//        for (let i=0;i<victim_info_iframes.length;i++)
//        {
//            victim_info_iframes[i].src="victim_info/"+data.victim_id+"/";
//        }
        var victim_age=getAge(data.victim_dob);
        var victim_age_group=getAgeGroup(victim_age);
        document.getElementById("pv_offer_referrence").value = data.discharge_date + ": " + data.victim_identifier;
        document.getElementById("pv_offer_shelterprovider").value = "{{ shelter_provider }}";
        document.getElementById("victim_id").value = data.victim_id;
        document.getElementById("victim_identifier").innerHTML = data.victim_identifier;
        document.getElementById("victim_first_name").value = data.victim_first_name;
        document.getElementById("victim_last_name").value = data.victim_last_name;
        document.getElementById("victim_gender").value = data.victim_gender;
        document.getElementById("victim_dob").value = data.victim_dob;
        document.getElementById("victim_age").value = victim_age;
        document.getElementById("victim_residence_region").value = data.victim_residence_region;
        document.getElementById("victim_residence_postcode").value = data.victim_residence_postcode;
        document.getElementById("victim_residence_street").value = data.victim_residence_street;
        document.getElementById("victim_residence_number").value = data.victim_residence_number;
        document.getElementById("victim_residence_city").value = data.victim_residence_city;
        document.getElementById("victim_residence_country").value = data.victim_residence_country;

        document.getElementById("victim_request_id").value = data.victim_request_id;
        document.getElementById("discharge_date").value = data.discharge_date;

        document.getElementById("coordinator").value = data.coordinator;

        document.getElementById("notes").value = data.notes;
        document.getElementById("reason_for_request").value = data.reason_for_request;
        document.getElementById("status").value = data.status;
        document.getElementById("newVictimStatus").value = data.status;

        document.getElementById("date_for_shelter").value = data.date_for_shelter;
        var shelter_request_types = document.getElementsByName("shelter_request_type");
        for (var i = 0; i < shelter_request_types.length; i++) {
            if (data.shelter_request_type.indexOf(shelter_request_types[i].value) > -1) {
                shelter_request_types[i].checked=true;
            }
            else
            {
                shelter_request_types[i].checked=false;
            }
        }

        document.getElementById("additional_shelter_requests").value = data.additional_shelter_requests;



        if (data.status==="REG")
        {

            if(modalName){
                toggleModal(modalName);
            }
            else
            {
                toggleModal("editVictimModal");
            }

        }

      else if(data.status==="SDR")
      {
         if(modalName){
                toggleModal(modalName);
            }
            else
            {
                toggleModal("selectShelterRequests");
            }
      }
       else if(data.status==="RFO")
      {

         document.getElementById("reference_number").value="";
         document.getElementById("price").value="";
         document.getElementById("shelter_location").value="";
         document.getElementById("pv_offer_notes").value="";
        var shelter_request_offer_types = document.getElementsByName("shelter_request_offer_type");
        for (var i = 0; i < shelter_request_types.length; i++) {
            shelter_request_offer_types[i].checked=false;

            if (data.shelter_request_type.indexOf(shelter_request_offer_types[i].value) > -1) {
                shelter_request_offer_types[i].disabled=false;
            }
            else
            {
                shelter_request_offer_types[i].disabled=true;
            }
        }
         if(data.shelter_provider_offers.length > 0)
         {
            for(var si=0;si<data.shelter_provider_offers.length;si++ )
            {
                if(data.shelter_provider_offers[si].shelter_provider === parseInt("{{ shelter_provider.id }}"))
                {
                    var shelter_request_offer_type = document.getElementsByName("shelter_request_offer_type");
                    for (var i = 0; i < shelter_request_types.length; i++) {
                        if (data.shelter_provider_offers[si].shelter_request_types.indexOf(shelter_request_offer_type[i].value) > -1) {
                            shelter_request_offer_type[i].checked=true;
                        }
                        else
                        {
                            shelter_request_offer_type[i].checked=false;
                        }
                    }
                     document.getElementById("reference_number").value=data.shelter_provider_offers[si].reference_number;
                     document.getElementById("price").value=data.shelter_provider_offers[si].price;
                     document.getElementById("shelter_location").value=data.shelter_provider_offers[si].shelter_location;
                     document.getElementById("pv_offer_notes").value=data.shelter_provider_offers[si].notes;
                }

            }

         }
         if(data.user_is_shelter_provider)
         {

             if(modalName){
                toggleModal(modalName);
            }
            else
            {
                toggleModal("shelterOfferModal");
            }

         }
         else
         {
            populateShelterOffersTable(data.shelter_provider_offers,data.shelter_request_type);
            if(modalName){
                toggleModal(modalName);
            }
            else
            {
                toggleModal("viewShelterOffersModal");
            }
         }

      }
      else if(data.status==="RFD")
      {
       if(data.user_is_shelter_provider)
         {

            alert("Shelter Application Access currently not enabled!")  ;

         }
         else
         {
            //"victim_discharge_shelter_request_{{ shelter_request_type.id }}"
            document.getElementById("victim_discharge_name").value=data.victim_first_name+ " " + data.victim_last_name;
            document.getElementById("victim_discharge_identifier").value=data.victim_identifier;
            document.getElementById("victim_discharge_notes").value = data.notes;
            document.getElementById("victim_discharge_additional_shelter_requests").value = data.additional_shelter_requests;
            var victim_discharge_shelter_requests = document.getElementsByName("victim_discharge_shelter_request");
            for (var i = 0; i < shelter_request_types.length; i++)
            {

                if(victim_discharge_shelter_requests[i].lastChild.textContent.startsWith("->"))
                {
                    victim_discharge_shelter_requests[i].lastChild.remove();
                }
                var inpElPD=victim_discharge_shelter_requests[i].getElementsByTagName("input")[0];
                if (data.shelter_request_type.indexOf(inpElPD.value) === -1) {
                    victim_discharge_shelter_requests[i].style="display:none";
                }
                else
                {
                    var matched=false;
                    for (var j=0;j<data.shelter_provider_accepted_offers.length;j++ )
                    {

                        var poffer=data.shelter_provider_accepted_offers[j];
                        if(poffer.shelter_request_types.indexOf(inpElPD.value) >-1)
                        {

                            const textnode = document.createTextNode("-> fulfilled by: " + poffer.shelter_provider_display_name);
                            victim_discharge_shelter_requests[i].appendChild(textnode);
                            matched=true;
                            inpElPD.checked=true;
                            inpElPD.disabled=true;
                        }
                    }



                    if(!matched)
                    {
                        const textnode = document.createTextNode("-> requires manual check at discharge!");
                        victim_discharge_shelter_requests[i].appendChild(textnode);
                    }
                        victim_discharge_shelter_requests[i].style="";
                }
            }
             if(modalName){
                toggleModal(modalName);
            }
            else
            {
                verifyFinalDischarge();
                toggleModal("finalDischargeModal");
            }
         }

      }
      else{
          if(modalName){
                toggleModal(modalName);
            }
            else
            {
                alert("Not yet implemented!");
            }
      }
    });


}

function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
function updateData(path,formData,disableButton=null,reloadPage=false,showAlert=false)
{
    const csrftoken = getCookie('csrftoken');
    let xhr = new XMLHttpRequest();

    xhr.open("POST", path);
    xhr.setRequestHeader('X-CSRFToken', csrftoken);

    xhr.send(formData);

    xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let response = JSON.parse(this.responseText);
        if (response.status === 'success') {
            if(showAlert)
            {
                alert("Data updated successfully!");
            }
            if (disableButton != null)
            {
                document.getElementById(disableButton).disabled = true;
            }
            if(reloadPage)
            {
                //location.reload(true);
            }
        } else {
            alert("Updating data failed due to: "+response.status);

        }
        }
    };


}

function listsAreEqual(list1, list2) {
  if (list1.length !== list2.length) {
    return false;
  }
  const set1 = new Set(list1);
  for (const item of list2) {
    if (!set1.has(item)) {
      return false;
    }
  }
  return true;
}
function isHidden(el) {
    return (el.offsetParent === null)
}

function fetchVictimInfo(victimId) {
  fetch(`/victim_info/${victimId}/`)
    .then(response => response.json())
    .then(data => {
      // Create the table using the provided template
      let table = `
        <table>
           <tr>
                <td>Name:</td>
                <td>${data.name}</td>
              </tr>
          <tr>
            <td>Gender:</td>
            <td>${data.gender}</td>
          </tr>
          <tr>
            <td>Date of Birth:</td>
            <td>${data.date_of_birth} (age: ${data.age})</td>
          </tr>
          <tr>
            <td>IDENTIFIER:</td>
            <td>${data.identifier}</td>
          </tr>
        </table>
      `;

      // Get all the divs with class name "victim_info"
      const victimInfoDivs = document.querySelectorAll(".victim_info");

      // Insert the table into each div
      victimInfoDivs.forEach(div => {
        div.innerHTML = table;
      });
    });
}
