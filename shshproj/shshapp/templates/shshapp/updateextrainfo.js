function updateExtraInfo(setStatus="") {
    var formData = new FormData();
    formData.append("victim_request_id", document.getElementById("victim_request_id").value);
    formData.append("notes", document.getElementById("notes").value);
    formData.append("reason_for_request", document.getElementById("reason_for_request").value);

    formData.append("date_for_shelter", document.getElementById("date_for_shelter").value);
    if(setStatus.length===3)
    {
        formData.append("status", setStatus);
    }
    var shelter_request_types = document.getElementsByName("shelter_request_type");
    for (var i = 0; i < shelter_request_types.length; i++) {
        if (shelter_request_types[i].checked) {
            formData.append("shelter_request_types", shelter_request_types[i].value);
        }
    }

    formData.append("additional_shelter_requests", document.getElementById("additional_shelter_requests").value);


    updateData("/update_request_shelter/", formData,"saveShelterData");
}
function submittAndRequestAssessments()
{
    updateExtraInfo(setStatus="RFO");
}
