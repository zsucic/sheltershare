function updateDischargeData() {
    let formData = new FormData();
    formData.append("victim_request_id", document.getElementById("victim_request_id").value);
    formData.append("discharge_date", document.getElementById("discharge_date").value);
    formData.append("coordinator", document.getElementById("coordinator").value);
    updateData("/update_request_discharge/", formData,"saveDischargeData");

}
