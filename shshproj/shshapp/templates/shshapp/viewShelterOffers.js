function validateSeriviceOffers() {
const acceptCol=8;
const svcCol=1;
  var table = document.getElementById("viewShelterOffersTableBody");
  var selectedShelters = [];
  var checkBoxes=table.getElementsByClassName("shelter_request_offer_accept");
  var offeredSheltersList = table.getElementsByClassName("offeredShelters");
  for (var i = 0; i < table.rows.length; i++) {

    var checkbox = checkBoxes[i];
    checkbox.disabled=false;
    var offeredShelters = offeredSheltersList[i].innerHTML;

    if (checkbox.checked) {

        let ofServList = offeredShelters.split(",").map(function(item) {
          return item.trim();
        });

      selectedShelters = selectedShelters.concat(ofServList);
    }
  }
  document.getElementById("approved_shelters_display").innerHTML=selectedShelters.join();
  var reqServ=document.getElementById("requested_shelters_display").innerHTML.split(",").map(function(item) {
          return item.trim();
        });

/*
  if(listsAreEqual(reqServ,selectedShelters))
  {
    document.getElementById("acceptSelectedOffersButton").disabled=false;
  }
  else
  {
    document.getElementById("acceptSelectedOffersButton").disabled=true;
  }*/
  for (var j = 0; j < table.rows.length; j++) {
       checkbox = checkBoxes[j];
       if(checkbox.checked)
       {
       }
       else
       {
          var offeredShelters = offeredSheltersList[j].innerHTML;
          let ofServList = offeredShelters.split(",").map(function(item) {
          return item.trim();
          });

          for (var k=0;k<ofServList.length;k++)
          {
            if(selectedShelters.indexOf(ofServList[k]) > -1)
            {
                checkBoxes[j].disabled=true;
                break;
            }
          }
       }

    }
}

function populateShelterOffersTable(viewShelterOffers,requestedShelters) {
  var tableBody = document.getElementById("viewShelterOffersTableBody");
  tableBody.innerHTML = "";


    var strReqServ=requestedShelters.join();
    document.getElementById("requested_shelters_display").innerHTML= strReqServ;
  for (var i = 0; i < viewShelterOffers.length; i++) {
    var shelterOffer = viewShelterOffers[i];
    var shelterRequestTypes = shelterOffer.shelter_request_types.join(", ");

    var tr = document.createElement("tr");
    var notes="";
    if(shelterOffer.notes.length > 30)
       {
            notes="<td style='vertical-align: middle;' title='click to see full content.' onclick='displayHoverModal(\"" + shelterOffer.notes.replace('"','').replace("'","") + "\");'>" + shelterOffer.notes.substring(0, 30) + " <span class='badge badge-blue'>...</span></td>"
       }
       else
       {
            notes="<td style='vertical-align: middle;'>" + shelterOffer.notes + "</td>"
       }
    tr.innerHTML =
                   "<td style='vertical-align: middle;' class='pv_shelter_offer_application'>" + shelterOffer.shelter_offer_id + "</td>" +
                   "<td style='white-space: nowrap;text-align: center;vertical-align: middle;'>" + shelterOffer.shelter_provider_display_name + "</td>" +
                   "<td style='vertical-align: middle;' class='offeredShelters'>" + shelterRequestTypes + "</td>" +
                   "<td style='vertical-align: middle;'>" + shelterOffer.reference_number + "</td>" +
                   "<td style='text-align: center;vertical-align: middle;'>" + shelterOffer.price + "</td>" +
                   "<td style='text-align: center;vertical-align: middle;'>" + shelterOffer.shelter_location + "</td>" +
                    notes +
                   "<td style='text-align: center;vertical-align: middle;'>" + shelterOffer.status + "</td>" +
                   "<td style='white-space: nowrap;text-align: center;vertical-align: middle;'>" + shelterOffer.datetime_of_offer + "</td>"+
                   "<td style='text-align: center;vertical-align: middle;'><input type='checkbox' class='form-check-input shelter_request_offer_accept' id='shelter_offer_accept_"+ shelterOffer.shelter_provider +"' onchange='validateSeriviceOffers();'></td>";
    tableBody.appendChild(tr);
  }
}



function acceptSelectedOffers()
{
   var table = document.getElementById("viewShelterOffersTableBody");
   var checkBoxes=table.getElementsByClassName("shelter_request_offer_accept");
   var shelter_offer_id_list=table.getElementsByClassName("pv_shelter_offer_application");
   var acceptedShelterOffers=[];
   for (var i = 0; i < checkBoxes.length; i++) {
        var checkbox = checkBoxes[i];

        if (checkbox.checked) {
            acceptedShelterOffers.push(shelter_offer_id_list[i].innerHTML);
        }


    }
    var formData = new FormData();
    formData.append("victim_request_id", document.getElementById("victim_request_id").value);
    formData.append("accepted_shelter_offers", acceptedShelterOffers)
    formData.append("status", "RFD");
     updateData("accept_offers/", formData,"viewShelterOffersModal",true);



}