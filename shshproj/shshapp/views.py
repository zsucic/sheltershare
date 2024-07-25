import datetime
import uuid

from django.http import HttpResponse, HttpResponseRedirect
from django.views.decorators.clickjacking import xframe_options_exempt

from faker import Faker

from .models import ShelterRequestOffer, ShelterRequestType, ShelterOfferStatus


from .models import Victim, VictimRequest, GroupStatusMapping, VictimGender, VictimRequestStatus, ShelterProvider, Question,Answer
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from django.shortcuts import redirect
import json
fake = Faker()

from django.contrib.auth import get_user_model
from django.http import JsonResponse

def get_user_full_name(username):
    User = get_user_model()
    try:
        user = User.objects.get(username=username)
        full_name = f"{user.first_name} {user.last_name}"
        return full_name
    except User.DoesNotExist:
        return username

def get_victim_request(request, pk):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Unauthorized"}, status=401)
    user_is_coordinator = False
    if request.user.is_staff:
        statuses=list(VictimRequestStatus.objects.all().values_list('id', flat=True))
        user_is_coordinator=True
    else:
        l = request.user.groups.values_list('name', flat=True)  # QuerySet Object
        ugroups = list(l)
        statuses = list(GroupStatusMapping.objects.filter(group__in=request.user.groups.all()).distinct().values_list('status',flat=True))
        if "Coordinator" in ugroups:
            user_is_coordinator=True



    victim_request = VictimRequest.objects.get(pk=pk)
    if victim_request.status.id not in statuses:
        return JsonResponse({"error": "Unauthorized"}, status=401)

    victim = victim_request.victim




    shelter_provider_offers = ShelterRequestOffer.objects.filter(victim_request=victim_request)
    shelter_provider_accepted_offers = ShelterRequestOffer.objects.filter(victim_request=victim_request, status=ShelterOfferStatus.objects.get(code="Accepted"))
    relevant_received_offers=ShelterRequestOffer.objects.filter(victim_request=victim_request)
    user_is_shelter_provider=None
    try:
        user_is_shelter_provider = ShelterProvider.objects.get(user=request.user).id
        shelter_provider_offers = ShelterRequestOffer.objects.filter(victim_request=victim_request, shelter_provider=user_is_shelter_provider)
    except:
        pass


    data = {
        'victim_id': victim.id,
        'victim_identifier': victim.identifier,
        'victim_first_name': victim.first_name,
        'victim_last_name': victim.last_name,
        'victim_gender': victim.gender.code,
        'victim_dob': victim.date_of_birth,
        'victim_age': victim.age(),
        'victim_residence_region': victim.residence_region,
        'victim_residence_postcode': victim.residence_postcode,
        'victim_residence_street': victim.residence_street,
        'victim_residence_number': victim.residence_number,
        'victim_residence_city': victim.residence_city,
        'victim_residence_country': victim.residence_country,

        'victim_request_id': victim_request.id,
        'discharge_date': victim_request.discharge_date,


        "coordinator": victim_request.coordinator,

        'notes': victim_request.notes,
        "reason_for_visit": victim_request.reason_for_visit,
        "status": victim_request.status.code,
        "status_description": victim_request.status.description,
        "date_of_visit": victim_request.date_of_visit,
        "shelter_request_type": list(victim_request.shelter_request_types.values_list('code', flat=True)),
        "additional_shelter_requests": victim_request.additional_shelter_requests,
        "assessment": None,
        "shelter_provider_offers": [],
        "shelter_provider_accepted_offers": [],
        "relevant_received_offers": [],


        "user_is_shelter_provider":user_is_shelter_provider,
        "user_is_coordinator":user_is_coordinator

    }
    for relevant_received_offer in relevant_received_offers:
        data["relevant_received_offers"].append(
            {
                "shelter_provider": relevant_received_offer.shelter_provider.id,
                "shelter_offer_id": relevant_received_offer.id,
                "shelter_provider_display_name": relevant_received_offer.shelter_provider.display_name,
                "shelter_request_types": list(relevant_received_offer.shelter_request_types.values_list('code', flat=True)),
                "reference_number": relevant_received_offer.reference_number,
                "price": relevant_received_offer.price,
                "shelter_location": relevant_received_offer.shelter_location,
                "notes": relevant_received_offer.notes,
                "status": relevant_received_offer.status.code,
                "status_description": relevant_received_offer.status.description,
                "datetime_of_offer": relevant_received_offer.datetime_of_offer.strftime("%Y-%m-%d %H:%M"),
            }
        )
    for shelter_provider_offer in shelter_provider_offers:
        data["shelter_provider_offers"].append(
            {
                "shelter_provider": shelter_provider_offer.shelter_provider.id,
                "shelter_offer_id": shelter_provider_offer.id,
                "shelter_provider_display_name": shelter_provider_offer.shelter_provider.display_name,
                "shelter_request_types": list(shelter_provider_offer.shelter_request_types.values_list('code', flat=True)),
                "reference_number": shelter_provider_offer.reference_number,
                "price": shelter_provider_offer.price,
                "shelter_location": shelter_provider_offer.shelter_location,
                "notes": shelter_provider_offer.notes,
                "status": shelter_provider_offer.status.code,
                "status_description": shelter_provider_offer.status.description,
                "datetime_of_offer": shelter_provider_offer.datetime_of_offer.strftime("%Y-%m-%d %H:%M"),
            }
        )
    for shelter_provider_accepted_offer in shelter_provider_accepted_offers:
        data["shelter_provider_accepted_offers"].append(
            {
                "shelter_provider": shelter_provider_accepted_offer.shelter_provider.id,
                "shelter_offer_id": shelter_provider_accepted_offer.id,
                "shelter_provider_display_name": shelter_provider_accepted_offer.shelter_provider.display_name,
                "shelter_request_types": list(shelter_provider_accepted_offer.shelter_request_types.values_list('code', flat=True)),
                "reference_number": shelter_provider_accepted_offer.reference_number,
                "price": shelter_provider_accepted_offer.price,
                "shelter_location": shelter_provider_accepted_offer.shelter_location,
                "notes": shelter_provider_accepted_offer.notes,
                "status": shelter_provider_accepted_offer.status.code,
                "status_description": shelter_provider_accepted_offer.status.description,
                "datetime_of_offer": shelter_provider_accepted_offer.datetime_of_offer.strftime("%Y-%m-%d %H:%M"),
            }
        )

    return JsonResponse(data)


def update_user_info(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('login/')
    if request.method == 'POST':
        user = request.user
        user.first_name = request.POST['first_name']
        user.last_name = request.POST['last_name']
        user.email = request.POST['email']
        new_password = request.POST['new_password']
        retype_password = request.POST['retype_password']

        if new_password and new_password == retype_password:
            user.set_password(new_password)

        user.save()

    return redirect('/')


def logout_view(request):
    logout(request)
    # Redirect to a root page.
    return HttpResponseRedirect('/')


def login_view(request):
    if request.user.is_authenticated:
        return HttpResponse("Already logged in!")
    if request.method == "POST":
        user_obj = authenticate(username=request.POST['username'],
                                password=request.POST['password'])
        if user_obj:
            login(request, user_obj)
            return HttpResponseRedirect('/')
    return render(request, 'shshapp/login.html', {})


def index(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('login/')
    shelter_request_types = ShelterRequestType.objects.all()
    genders= VictimGender.objects.all()
    pv_statuses= VictimRequestStatus.objects.all()
    coordinator=None

    if request.user.is_staff:
        victim_requests = VictimRequest.objects.all()
        ugroups = ["ADMIN","Coordinator"]
        coordinator = request.user
    else:
        l = request.user.groups.values_list('name', flat=True)  # QuerySet Object
        ugroups = list(l)
        statuses = list(GroupStatusMapping.objects.filter(group__in=request.user.groups.all()).distinct().values_list('status', flat=True))
        victim_requests = VictimRequest.objects.filter(status__in=statuses).distinct().order_by('-id')
        if "Coordinator" in ugroups or "ADMIN" in ugroups:
            coordinator=request.user
        else:
            coordinator=None

    relevant_offers_received=[]
    if ShelterProvider.objects.filter(user=request.user).exists():
        shelter_provider = ShelterProvider.objects.get(user=request.user)
        shelter_provider_offers = ShelterRequestOffer.objects.filter(shelter_provider=shelter_provider, victim_request__in=victim_requests)
    else:
        shelter_provider = None
        shelter_provider_offers = []
        relevant_offers_received = ShelterRequestOffer.objects.filter(victim_request__in=victim_requests)
    context = {
        'coordinator':coordinator,
        'relevant_offers_received':relevant_offers_received,
        'shelter_provider': shelter_provider,
        'shelter_provider_offers': shelter_provider_offers,
        'victim_requests': victim_requests,
        'shelter_request_types': shelter_request_types,
        'user': request.user,
        'genders':genders,
        'pv_statuses':pv_statuses,
        'ugroups': ugroups
    }
    return render(request, 'shshapp/index.html', context=context)


def submit_offer(request):
    if request.method == 'POST':
        try:
            victim_request_id = request.POST.get("victim_request_id")
            reference_number = request.POST.get("reference_number")
            price = request.POST.get("price")
            shelter_location = request.POST.get("shelter_location")
            notes = request.POST.get("notes")

            shelter_request_offer_type_codes = request.POST.getlist("shelter_request_offer_types")
            shelter_request_offer_types = ShelterRequestType.objects.filter(code__in=shelter_request_offer_type_codes)
            # update the VictimRequest object with new data
            victim_request = VictimRequest.objects.get(id=victim_request_id)
            shelter_provider = ShelterProvider.objects.get(user=request.user)
            shelter_provider_offer=None
            try:
                shelter_provider_offer = ShelterRequestOffer.objects.get(shelter_provider=shelter_provider, victim_request=victim_request)
            except Exception as ex:
                pass

            if shelter_provider_offer:
                shelter_provider_offer.shelter_request_types.set(shelter_request_offer_types)
                shelter_provider_offer.reference_number = reference_number
                shelter_provider_offer.price = price
                shelter_provider_offer.shelter_location = shelter_location
                shelter_provider_offer.notes = notes
                shelter_provider_offer.status = ShelterOfferStatus.objects.get(code="Submitted")
                shelter_provider_offer.save()
            else:
                shelter_provider_offer = ShelterRequestOffer(
                    victim_request=victim_request,
                    shelter_provider=shelter_provider,
                    price=price,
                    shelter_location=shelter_location,
                    notes=notes,
                    status=ShelterOfferStatus.objects.get(code="Submitted")
                )
                shelter_provider_offer.save()
                shelter_provider_offer.shelter_request_types.set(shelter_request_offer_types)
                shelter_provider_offer.save()
            victim_request.save()
            return JsonResponse({'status': 'success'})
        except Exception as ex:
            return JsonResponse({'status': str(ex)})

    return JsonResponse({'status': 'only POST can be used to update victim data!'})


def generate(request):
    victim_genders = list(VictimGender.objects.all())
    victim_visit_status = VictimRequestStatus.objects.get(code="REG")
    shelter_request_types = list(ShelterRequestType.objects.all())

    victim = Victim.objects.create(
        identifier=fake.uuid4(),
        first_name=fake.first_name(),
        last_name=fake.last_name(),
        date_of_birth=fake.date_of_birth(),
        gender=fake.random_element(victim_genders),
        residence_region=fake.state(),
        residence_postcode=fake.postcode(),
        residence_street=fake.street_address(),
        residence_number=fake.building_number(),
        residence_city=fake.city(),
        residence_country=fake.country(),
        contact_phone=fake.phone_number(),
        contact_email=fake.email()
    )

    shelter_request_types = fake.random.sample(shelter_request_types, min(fake.random.randint(0, 3), len(shelter_request_types)))
    victim_request = VictimRequest.objects.create(
        victim=victim,
        status=victim_visit_status,
        date_of_visit=datetime.datetime.today() - datetime.timedelta(days=fake.random.randint(0,10)),
        discharge_date=datetime.datetime.today(),
        hospital=fake.company(),

    )
    victim_request.shelter_request_types.set(shelter_request_types)
    # Save the victim request to the database
    victim_request.save()
    return HttpResponse(200)


def register_victim(request):

    genders = VictimGender.objects.all()
    all_shelter_request_types = ShelterRequestType.objects.all()

    if request.method == 'POST':
        victim = create_and_save_victim(request)
        create_and_save_victim_request(request, victim)

    context = {
        'genders': genders,
        'shelter_request_types': all_shelter_request_types,
    }

    return render(request, 'shshapp/registerVictim.html', context=context)

def create_and_save_victim_request(request, victim):
    shelter_request_types = ShelterRequestType.objects.filter(id__in=request.POST.getlist('victim.shelter_type'))
    victim_visit_status = VictimRequestStatus.objects.get(code="REG")
    victim_request = VictimRequest.objects.create(
        victim=victim,
        status=victim_visit_status,
        date_of_visit=datetime.datetime.today() - datetime.timedelta(days=fake.random.randint(0, 10)),
        discharge_date=datetime.datetime.today(),

    )
    victim_request.shelter_request_types.set(shelter_request_types)
    victim_request.save()


def create_and_save_victim(request):
    identifier = request.POST.get('victim.identifier')
    first_name = request.POST.get('victim.first_name')
    last_name = request.POST.get('victim.last_name')
    date_of_birth = request.POST.get('victim.date_of_birth')
    gender_code = request.POST.get('victim.gender')
    residence_region = request.POST.get('victim.residence_region')
    residence_postcode = request.POST.get('victim.residence_postcode')
    residence_street = request.POST.get('victim.residence_street')
    residence_number = request.POST.get('victim.residence_number')
    residence_city = request.POST.get('victim.residence_city')
    residence_country = request.POST.get('victim.residence_country')
    contact_phone = request.POST.get('victim.contact_phone')
    contact_email = request.POST.get('victim.contact_email')
    verified_by = request.POST.get('victim.verified_by')
    gender = VictimGender.objects.get(id=gender_code) if gender_code else None
    victim = Victim(
        identifier=identifier,
        first_name=first_name,
        last_name=last_name,
        date_of_birth=date_of_birth,
        gender=gender,
        residence_region=residence_region,
        residence_postcode=residence_postcode,
        residence_street=residence_street,
        residence_number=residence_number,
        residence_city=residence_city,
        residence_country=residence_country,
        contact_phone=contact_phone,
        contact_email=contact_email,
        verified_by=verified_by
    )
    victim.save()
    return victim


from django.shortcuts import render
from .models import Victim
from django.contrib.auth.decorators import user_passes_test

from django.contrib.auth.models import Permission

def get_user_permissions(user):
    if user.is_superuser:
        perms = Permission.objects.all()
    else:
        perms = user.user_permissions.all() | Permission.objects.filter(group__user=user)
    return list(perms.values_list('codename',flat=True))


#TODO: make more specific permission checks (e.g. victim request status change for move status, and add assesment check for....
def user_has_view_victim_permission(user):
    perms = get_user_permissions(user)
    return "view_victim" in perms

def user_has_change_victim_permission(user):
    perms = get_user_permissions(user)
    return "change_victim" in perms

def user_has_change_victim_request_permission(user):
    perms=get_user_permissions(user)
    return "change_victimrequest" in perms


@user_passes_test(user_has_change_victim_permission)
def update_victim(request):
    if request.method == 'POST':

        try:
            victim_id = request.POST.get('victim_id')
            victim = Victim.objects.get(id=victim_id)
            victim.first_name = request.POST.get('victim_first_name')
            victim.last_name = request.POST.get('victim_last_name')
            victim.gender = VictimGender.objects.filter(code=request.POST.get('victim_gender')).first()
            victim.date_of_birth = request.POST.get('victim_dob')
            victim.residence_postcode = request.POST.get('victim_residence_postcode')
            victim.residence_region = request.POST.get('victim_residence_region')
            victim.residence_street = request.POST.get('victim_residence_street')
            victim.residence_number = request.POST.get('victim_residence_number')
            victim.residence_city = request.POST.get('victim_residence_city')
            victim.residence_country = request.POST.get('victim_residence_country')
            victim.verified_by=request.user.username
            victim.save()
            victim_requests = VictimRequest.objects.filter(victim=victim)
            for victim_request in victim_requests:
                victim_request.save()
            return JsonResponse({'status': 'success'})
        except Exception as ex:
            return JsonResponse({'status': str(ex)})

    return JsonResponse({'status': 'only POST can be used to update victim data!'})


@user_passes_test(user_has_change_victim_request_permission)
def update_request_discharge(request):
    if request.method == 'POST':

        try:
            victim_request_id = request.POST.get('victim_request_id')
            victim_request = VictimRequest.objects.get(id=victim_request_id)
            victim_request.discharge_date = request.POST.get('discharge_date')
            victim_request.hospital = request.POST.get('hospital')
            victim_request.ward = request.POST.get('ward')
            victim_request.consultant = request.POST.get('consultant')
            victim_request.coordinator = request.POST.get('coordinator')
            victim_request.verified_by = request.user.username
            victim_request.save()
            return JsonResponse({'status': 'success'})
        except Exception as ex:
            return JsonResponse({'status': str(ex)})

    return JsonResponse({'status': 'only POST can be used to update victim data!'})


@user_passes_test(user_has_change_victim_request_permission)
def update_request_shelter(request):
    if request.method == 'POST':
        try:
            victim_request_id = request.POST.get("victim_request_id")
            notes = request.POST.get("notes")
            reason_for_visit = request.POST.get("reason_for_visit")
            status = request.POST.get("status")
            date_of_visit = request.POST.get("date_of_visit")
            discharge_to = request.POST.get("discharge_to")
            discharge_region = request.POST.get("discharge_region")
            shelter_request_type_codes = request.POST.getlist("shelter_request_types")
            shelter_request_types = ShelterRequestType.objects.filter(code__in=shelter_request_type_codes)
            additional_shelter_requests = request.POST.get("additional_shelter_requests")

            # update the VictimRequest object with new data
            victim_request = VictimRequest.objects.get(id=victim_request_id)
            victim_request.notes = notes
            victim_request.reason_for_visit = reason_for_visit
            if status in list(VictimRequestStatus.objects.all().values_list("code", flat=True)):
                victim_request.status = VictimRequestStatus.objects.filter(code=status).first()
            victim_request.date_of_visit = date_of_visit
            victim_request.discharge_to = discharge_to
            victim_request.discharge_region = discharge_region
            victim_request.shelter_request_types.set(shelter_request_types)
            victim_request.additional_shelter_requests = additional_shelter_requests

            victim_request.verified_by = request.user.username
            victim_request.save()
            return JsonResponse({'status': 'success'})
        except Exception as ex:
            return JsonResponse({'status': str(ex)})

    return JsonResponse({'status': 'only POST can be used to update victim data!'})


@user_passes_test(user_has_change_victim_request_permission)
def move_status(request):
    if request.method == 'POST':
        try:
            victim_request_id = request.POST.get("victim_request_id")
            status = request.POST.get("status")
            victim_request = VictimRequest.objects.get(id=victim_request_id)
            victim_request.status = VictimRequestStatus.objects.filter(code=status).first()
            if status == "RFA":
                if not victim_request.victim.verified_by:
                    victim_request.victim.verified_by= request.user.username
                victim_request.verified_by = request.user.username

            victim_request.save()
            return JsonResponse({'status': 'success'})
        except Exception as ex:
            return JsonResponse({'status': str(ex)})

    return JsonResponse({'status': 'only POST can be used to update victim data!'})



@user_passes_test(user_has_change_victim_request_permission)
def accept_offers(request):
    if request.method == 'POST':
        try:
            victim_request_id = request.POST.get('victim_request_id')
            pv_status=request.POST.get('status')
            victim_request = VictimRequest.objects.get(id=victim_request_id)
            accepted_offers = request.POST.get('accepted_shelter_offers').split(",")
            all_pv_sro=ShelterRequestOffer.objects.filter(victim_request=victim_request)
            for offer in all_pv_sro:
                if str(offer.id) in accepted_offers:
                    offer.status = ShelterOfferStatus.objects.get(code="Accepted")
                else:
                    offer.status = ShelterOfferStatus.objects.get(code="Rejected")
                offer.save()
            victim_request.status=VictimRequestStatus.objects.get(code=pv_status)
            victim_request.selected_providers = request.user.username
            victim_request.save()
            return JsonResponse({'status': 'success'})
        except Exception as ex:
            return JsonResponse({'status': str(ex)})

    return JsonResponse({'status': 'only POST can be used to update victim data!'})


@user_passes_test(user_has_change_victim_request_permission)
def perform_final_discharge(request):
    if request.method == 'POST':
        try:
            victim_request_id = request.POST.get('victim_request_id')
            pv_status=request.POST.get('status')
            victim_request = VictimRequest.objects.get(id=victim_request_id)



            shelter_request_type_codes = request.POST.getlist("shelter_request_types")

            victim_request.status = VictimRequestStatus.objects.get(code=pv_status)
            victim_request.discharged_by = request.user.username
            victim_request.discharge_shelter_request_types=shelter_request_type_codes
            victim_request.save()
            return JsonResponse({'status': 'success'})
        except Exception as ex:
            return JsonResponse({'status': str(ex)})

    return JsonResponse({'status': 'only POST can be used to update victim data!'})

@user_passes_test(user_has_view_victim_permission)
@xframe_options_exempt
def victim_info(request, victim_id):
    victim = Victim.objects.get(id=victim_id)
    shelter_provider = ShelterProvider.objects.filter(user=request.user).exists()
    if shelter_provider:
        name="*****"
        dob="*****"
    else:
        name=victim.first_name + " " + victim.last_name
        dob=victim.date_of_birth
    victim_info={
        "identifier": victim.identifier,
        "name": name,
        "date_of_birth": dob,
        "age": victim.age(),
        "gender":victim.gender.description
    }
    return JsonResponse(victim_info)

def submit_question(request):
    if request.method == 'POST':
        try:
            victim_request_id = request.POST.get("victim_request_id")
            new_question = request.POST.get("new_question")

            victim_request = VictimRequest.objects.get(id=victim_request_id)
            shelter_provider = ShelterProvider.objects.get(user=request.user)
            if shelter_provider and victim_request and new_question:
                Question(question=new_question, victim_request=victim_request,shelter_provider=shelter_provider).save()
                victim_request.save() #trigger update of last_updated
                return JsonResponse({'status': 'success'})
            else:
                return JsonResponse({'status': 'Invalid data'})
        except Exception as ex:
            return JsonResponse({'status': str(ex)})

    return JsonResponse({'status': 'only POST can be used to update victim data!'})





def get_victim_request_questions(request, pk):
    victim_request = get_object_or_404(VictimRequest, id=pk)
    current_user = request.user
    data = []
    if ShelterProvider.objects.filter(user=current_user).exists():
        # If the current user is a shelter provider, only return questions that they posted
        # for this victim request and any answers related to those questions
        shelter_provider = ShelterProvider.objects.get(user=current_user)
        questions = Question.objects.filter(victim_request=victim_request, shelter_provider=shelter_provider)

    else:
        # If the current user is not a shelter provider, return all questions and answers
        # related to this victim request
        questions = Question.objects.filter(victim_request=victim_request)

    for question in questions:
        answers = Answer.objects.filter(question=question)
        answer_data = []
        for answer in answers:
            answer_data.append({
                "answer": answer.answer,
                "answer_id": answer.id,
                "answered_by": get_user_full_name(answer.answered_by),
                "acknowledged": answer.acknowledged,
                "last_updated": answer.last_updated
            })
        data.append({
            "question": question.question,
            "question_id": question.id,
            "shelter_provider_name": question.shelter_provider.display_name,
            "last_updated": question.last_updated,
            "answers": answer_data
        })
    return JsonResponse(data, safe=False)


def get_pv_qa_count(request):
    current_user = request.user
    rfoStatus=VictimRequestStatus.objects.get(code="RFO")
    if ShelterProvider.objects.filter(user=current_user).exists():
        shelter_provider=ShelterProvider.objects.get(user=current_user)
    else:
        shelter_provider=None


    requests = VictimRequest.objects.filter(status=rfoStatus)
    # Initialize an empty list to store the result data
    data = []

    # Loop through each RFO request and count the number of answered and unanswered questions
    for request in requests:
        if shelter_provider:
            answered_questions = Question.objects.filter(victim_request=request, shelter_provider=shelter_provider).exclude(answer__isnull=True)
            unanswered_questions = Question.objects.filter(victim_request=request, shelter_provider=shelter_provider, answer__isnull=True)
        else:
            answered_questions = Question.objects.filter(victim_request=request).exclude(answer__isnull=True)
            unanswered_questions = Question.objects.filter(victim_request=request, answer__isnull=True)
        data.append({
            "victim_request_id": request.id,
            "answered_question_count": answered_questions.count(),
            "unanswered_question_count": unanswered_questions.count()
        })

    # Return the result data as a JSON response
    return JsonResponse(data, safe=False)



def submit_answers(request):
    if request.method == 'POST':
        victim_request_id = request.POST.get('victim_request_id')
        new_answers_json = request.POST.get('new_answers')

        # Convert the JSON string to a Python dictionary
        new_answers = json.loads(new_answers_json)

        # Retrieve the victim request object from the database
        victim_request = get_object_or_404(VictimRequest, id=victim_request_id)

        # Loop through the new answers and create/update Answer objects for each question
        for question_id, answer_text in new_answers.items():
            answer_text= answer_text.strip()
            if answer_text:
                # Retrieve the corresponding question object from the database
                question = get_object_or_404(Question, id=question_id, victim_request=victim_request)

                # Check if an answer object already exists for this question
                answer = Answer.objects.create(question=question, answered_by=request.user.username)

                # Update the answer object with the new answer text
                answer.answer = answer_text
                answer.save()

        # return JsonResponse({'success': True})
        victim_request.save() # triggers the signal to update the last_updated field
        return JsonResponse({'status': 'success'})
    else:
        #return JsonResponse({'success': False, 'error': 'Invalid request method'})
        return JsonResponse({'status': 'only POST can be used to update victim data!'})
