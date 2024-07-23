from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(ShelterProvider)
admin.site.register(VictimRequest)
admin.site.register(Victim)
admin.site.register(GroupStatusMapping)

admin.site.register(ShelterRequestType)
admin.site.register(VictimRequestStatus)
admin.site.register(VictimGender)
admin.site.register(ShelterOfferStatus)
admin.site.register(ShelterRequestOffer)