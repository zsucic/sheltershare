function submitOffer() {
  var formData = new FormData();
  formData.append("victim_request_id", document.getElementById("victim_request_id").value);
  var shelter_request_offer_types = document.getElementsByName("shelter_request_offer_type");
    for (var i = 0; i < shelter_request_offer_types.length; i++) {
        if (shelter_request_offer_types[i].checked) {
            formData.append("shelter_request_offer_types", shelter_request_offer_types[i].value);
        }
    }
    formData.append("reference_number", document.getElementById("reference_number").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("shelter_location", document.getElementById("shelter_location").value);
    formData.append("notes", document.getElementById("pv_offer_notes").value);
    updateData("submit_offer/", formData,"shelterOfferModal",true);


}

