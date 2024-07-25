function updateVictimData() {
    let formData = new FormData();
    formData.append("victim_id", document.getElementById("victim_id").value);
    formData.append("victim_first_name", document.getElementById("victim_first_name").value);
    formData.append("victim_last_name", document.getElementById("victim_last_name").value);
    formData.append("victim_gender", document.getElementById("victim_gender").value);
    formData.append("victim_dob", document.getElementById("victim_dob").value);
    formData.append("victim_residence_postcode", document.getElementById("victim_residence_postcode").value);
    formData.append("victim_residence_region", document.getElementById("victim_residence_region").value);
    formData.append("victim_residence_street", document.getElementById("victim_residence_street").value);
    formData.append("victim_residence_number", document.getElementById("victim_residence_number").value);
    formData.append("victim_residence_city", document.getElementById("victim_residence_city").value);
    formData.append("victim_residence_country", document.getElementById("victim_residence_country").value);
     updateData("update_victim/", formData,"saveVictimData");

}
