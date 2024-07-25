function verifyFinalDischarge()
{
    var victim_discharge_shelter_requests = document.getElementsByName("victim_discharge_shelter_request");
    var atLeastOneNotFulfilled=false;
    for (var i = 0; i < victim_discharge_shelter_requests.length; i++) {
        var inpElPD=victim_discharge_shelter_requests[i].getElementsByTagName("input")[0];
        if (inpElPD.parentElement.style.display === "none")
        {
            //console.log("ignoring "+inpElPD.value);
        }
        else
        {
            if(inpElPD.checked)
            {
                //console.log("all good with: "+inpElPD.value + " dis: " + isHidden(inpElPD));
            }
            else
            {
                //console.log("unchecked: "+inpElPD.value + " dis: " + isHidden(inpElPD));
                atLeastOneNotFulfilled=true;
            }

        }

     }
     if(atLeastOneNotFulfilled)
     {
        document.getElementById("performFinalDischargeButton").disabled=true;
        document.getElementById("performFinalDischargeButton").title="You have to Check All Checkboxes in order to complete Discharge";
     }
     else
     {
        document.getElementById("performFinalDischargeButton").disabled=false;
        document.getElementById("performFinalDischargeButton").title="Discharge is possible";
     }

     return atLeastOneNotFulfilled;
}

function performFinalDischarge()
{
    var formData = new FormData();
    formData.append("victim_request_id", document.getElementById("victim_request_id").value);
    formData.append("status", "DIS");
    var listOfFinalDischargeShelters=[]
    if(verifyFinalDischarge())
    {
        alert("You have to Check All Checkboxes in order to complete Discharge");
    }
    var victim_discharge_shelter_requests = document.getElementsByName("victim_discharge_shelter_request");
    var atLeastOneNotFulfilled=false;
    for (var i = 0; i < victim_discharge_shelter_requests.length; i++)
    {
        var inpElPD=victim_discharge_shelter_requests[i].getElementsByTagName("input")[0];
        if (inpElPD.parentElement.style.display === "none")
        {
            //console.log("ignoring "+inpElPD.value);

        }
        else
        {
            if(inpElPD.checked && inpElPD.disabled === false)
            {
                 //listOfFinalDischargeShelters.push(inpElPD.value);
                 formData.append("shelter_request_types", inpElPD.value);
                //console.log("all good with: "+inpElPD.value + " dis: " + isHidden(inpElPD));
            }
       }

   }
    updateData("perform_final_discharge/", formData,"finalDischargeModal",true);

}