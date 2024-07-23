function updateVictimStatus() {
    let formData = new FormData();
    formData.append("victim_request_id", document.getElementById("victim_request_id").value);
    formData.append("status", document.getElementById("newVictimStatus").value);
    updateData("/move_status/", formData, "changeVictimStatus", false,false);

}