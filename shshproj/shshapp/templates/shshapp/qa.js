//function openQAModal() {
//  const modal = document.getElementById("qaModal");
//  // Load previous questions and answers here, e.g. using fetch()
//  const questionList = document.getElementById("question-list");
//  questionList.innerHTML = ""; // Clear previous questions
//  //questionList.appendChild(/* Your question list HTML here */);
//
//  modal.style.display = "block";
//}

function fetchQuestions(pv_id=null) {
  if (pv_id == null)
  {
    var victimRequestId = document.getElementById("victim_request_id").value;
  }else{
    var victimRequestId = pv_id;
  }
   if(victimRequestId == null)
   {
    return;
   }
  fetch(window.location.href+`get_victim_request_questions/${victimRequestId}/`)
    .then(response => response.json())
    .then(data => {
      var questionList = document.getElementById("question-list");
      questionList.innerHTML = ""; // Clear previous questions
      for (var question of data) {
        var questionHTML = `
          <div class="question" id="question_${question.question_id}" style="margin-top:10px;">
            <div><span class="label label-info">${question.shelter_provider_name} </span></div><div style="margin:10px;"><strong>${question.question}</strong></div>
            <!-- <span class="label label-info">${question.shelter_provider_name} </span>(${question.last_updated})<br><strong>${question.question}</strong> -->
            <ul class="list-group">
        `;
        for (var answer of question.answers) {
          var answerHTML = `
            <li class="list-group-item" id="answer_${answer.answer_id}"><span class="label label-light" >${answer.answered_by}:</span> ${answer.answer}</li>
           <!-- <li class="list-group-item" id="answer_${answer.answer_id}">${answer.answer} (answered by ${answer.answered_by}, acknowledged: ${answer.acknowledged}, last updated: ${answer.last_updated})</li> -->
          `;
          questionHTML += answerHTML;
        }
        if (!shelter_provider)
        {
            questionHTML += `<li class="list-group-item"><textarea class="form-control" id="new_answer_${question.question_id}" for="${question.question_id}" name="new_answer" placeholder="Enter your answer here" ></textarea></li>`;
        }
        questionHTML += `</ul></div>`;
        questionList.insertAdjacentHTML("beforeend", questionHTML);
      }
    })
    .catch(error => console.error(error));
}

function submitQuestion() {
  var formData = new FormData();
    var question = document.getElementById("new_question").value;
    if (question.length>0)
    {
        question=question.replace(/\n/g, "<br>");

      formData.append("victim_request_id", document.getElementById("victim_request_id").value);
      formData.append("new_question", question);
      document.getElementById("new_question").value = "";
       updateData("submit_question/", formData);
      fetchQuestions();
    }
    else
    {
      alert("Please enter a question");
    }


}
function submitAnswers() {
  var formData = new FormData();
  formData.append("victim_request_id", document.getElementById("victim_request_id").value);
  answers=document.getElementsByName("new_answer");
  jsondata={}
  var valid_answers = false;
  for(var i=0;i<answers.length;i++)
    {
        if (answers[i].value.length>0)
        {
            valid_answers=true;
        }

        jsondata[answers[i].getAttribute("for")]=answers[i].value.replace(/\n/g, "<br>");;

    }
    if (valid_answers)
    {
      formData.append("new_answers", JSON.stringify(jsondata));
       updateData("submit_answers/", formData);
      fetchQuestions();
  }
  else
    {
        alert("Please enter an answer");
    }

}