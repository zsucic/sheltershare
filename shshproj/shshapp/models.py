import uuid
from datetime import date

from django.utils import timezone
from django.db import models
from django.conf import settings
from django.contrib.auth.models import Group


class ShelterProvider(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    display_name = models.CharField(max_length=100)
    contact_address = models.CharField(max_length=400)
    contact_phone = models.CharField(max_length=20)
    contact_email = models.CharField(max_length=200)
    def __str__(self):
        return self.display_name



class VictimGender(models.Model):
    code = models.CharField(max_length=10)
    description = models.CharField(max_length=20)

    def __str__(self):
        return self.description


class Victim(models.Model):
    identifier = models.CharField(max_length=100, blank=True, null=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()

    gender = models.ForeignKey(VictimGender, on_delete=models.SET_NULL, null=True, blank=True)
    residence_region = models.CharField(max_length=200, blank=True, null=True)
    residence_postcode = models.CharField(max_length=200, blank=True, null=True)
    residence_street = models.CharField(max_length=200, blank=True, null=True)
    residence_number = models.CharField(max_length=200, blank=True, null=True)
    residence_city = models.CharField(max_length=200, blank=True, null=True)
    residence_country = models.CharField(max_length=200, null=True, default="UK")

    contact_phone = models.CharField(max_length=30, blank=True, null=True)
    contact_email = models.CharField(max_length=200, blank=True, null=True)
    verified_by = models.CharField(max_length=200, null=True, blank=True, default=None)
    def age(self):
        return int((date.today() - self.date_of_birth).days / 365.25)
    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class VictimRequestStatus(models.Model):
    code = models.CharField(max_length=10)
    description = models.CharField(max_length=25)

    def __str__(self):
        return self.description


class ShelterRequestType(models.Model):
    code = models.CharField(max_length=30)
    description = models.CharField(max_length=250)

    def __str__(self):
        return self.description


class GroupStatusMapping(models.Model):
    status = models.ForeignKey(VictimRequestStatus, on_delete=models.SET_NULL, null=True, blank=True)
    group = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.group.name + " - " + self.status.description



class VictimRequest(models.Model):
    victim = models.ForeignKey(Victim, on_delete=models.CASCADE)
    reason_for_visit = models.CharField(max_length=200, blank=True, null=True)

    status = models.ForeignKey(VictimRequestStatus, on_delete=models.SET_NULL, null=True, blank=True)
    date_of_visit = models.DateField()
    discharge_date = models.DateField()
    hospital = models.CharField(max_length=200, null=True, blank=True)
    coordinator = models.CharField(max_length=200, blank=True, null=True)



    shelter_request_types = models.ManyToManyField(ShelterRequestType)
    additional_shelter_requests = models.CharField(max_length=200, blank=True, null=True)


    notes = models.CharField(max_length=4000, blank=True, null=True)


    shelter_provider = models.ForeignKey(ShelterProvider, on_delete=models.SET_NULL, null=True, blank=True)
    verified_by = models.CharField(max_length=200, null=True, blank=True, default=None)
    selected_providers = models.CharField(max_length=200, null=True, blank=True ,default=None)
    discharged_by = models.CharField(max_length=200, null=True, blank=True ,default=None)
    discharge_shelter_request_types = models.CharField(max_length=500, null=True, blank=True, default=None)
    last_update = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.status.description} - {self.victim} {self.victim.identifier}"

class ShelterOfferStatus(models.Model):
    code = models.CharField(max_length=10)
    description = models.CharField(max_length=250)

    def __str__(self):
        return self.description

class ShelterRequestOffer(models.Model):
    victim_request = models.ForeignKey(VictimRequest, on_delete=models.CASCADE)
    shelter_provider = models.ForeignKey(ShelterProvider, on_delete=models.CASCADE)
    shelter_request_types = models.ManyToManyField(ShelterRequestType)
    reference_number = models.CharField(max_length=100, unique=True, default=uuid.uuid4, editable=False)
    price = models.CharField(max_length=20, null=True, blank=True, default=None)
    shelter_location = models.CharField(max_length=200, null=True, blank=True, default=None)
    notes = models.TextField(blank=True, null=True)
    status = models.ForeignKey(ShelterOfferStatus, on_delete=models.SET_NULL, null=True, blank=True)
    datetime_of_offer = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Shelter Offer for {self.victim_request.victim} by {self.shelter_provider.display_name}"

class Question(models.Model):
    victim_request = models.ForeignKey(VictimRequest, on_delete=models.CASCADE)
    shelter_provider = models.ForeignKey(ShelterProvider, on_delete=models.CASCADE)
    question = models.CharField(max_length=4000, blank=False, null=False)
    last_updated = models.DateTimeField(blank=False, null=False, auto_now_add=True)

class Answer(models.Model):
    question=models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.CharField(max_length=4000, blank=True, null=True)
    answered_by = models.CharField(max_length=200, blank=True, null=True)
    acknowledged = models.BooleanField(default=False)
    last_updated = models.DateTimeField(blank=False, null=False, auto_now_add=True)

# class Question(models.Model):
#     text= models.CharField(max_length=200, blank=True, null=True)
#
# class AssessmentType(models.Model):
#     code = models.CharField(max_length=30)
#     description = models.CharField(max_length=250)
#     questions=models.ManyToManyField(Question)
#
# class Answer(models.Model):
#     value=models.CharField(max_length=200, blank=True, null=True)
#     question=models.ForeignKey(AssessmentType, on_delete=models.CASCADE)
#
# class Assessment(models.Model):
#     type= models.ForeignKey(AssessmentType, on_delete=models.CASCADE)
#     answers=models.ManyToManyField(Answer)


