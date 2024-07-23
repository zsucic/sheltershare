from django.urls import path
from .views import index,generate,logout_view,login_view,update_user_info,get_victim_request,update_victim,\
    update_request_discharge,update_request_shelter,move_status,submit_offer,accept_offers,\
    perform_final_discharge, victim_info,submit_question,get_victim_request_questions,get_pv_qa_count,submit_answers

urlpatterns = [

    path('generate/', generate, name='generate'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('update_user_info/', update_user_info, name='update_user_info'),
    path('update_victim/', update_victim, name='update_victim'),
    path('update_request_discharge/', update_request_discharge, name='update_request_discharge'),
    path('update_request_shelter/', update_request_shelter, name='update_request_shelter'),
    path('submit_offer/', submit_offer, name='submit_offer'),
    path('submit_question/', submit_question, name='submit_question'),
    path('submit_answers/', submit_answers, name='submit_answers'),
    path('move_status/', move_status, name='move_status'),
    path('get_pv_qa_count/', get_pv_qa_count, name='get_pv_qa_count'),
    path('accept_offers/', accept_offers, name='accept_offers'),
    path('perform_final_discharge/', perform_final_discharge, name='perform_final_discharge'),
    path('victim_request/<int:pk>/', get_victim_request, name='get_victim_request'),
    path('get_victim_request_questions/<int:pk>/', get_victim_request_questions, name='get_victim_request_questions'),
    path('victim_info/<int:victim_id>/', victim_info, name='victim_info'),
    path('', index, name='index'),
]
