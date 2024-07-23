from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import VictimRequest
import channels.layers
from asgiref.sync import async_to_sync




@receiver(post_save, sender=VictimRequest,dispatch_uid='update_victim_request_listeners')
def update_victim_request_on_save(sender, instance, **kwargs):
    '''
    Sends victim_request to the browser when VictimRequest is modified
    '''

    user = instance.victim
    #group_name = 'job-user-{}'.format(user)
    group_name = 'allUsers'

    message={
        'victim_request_id': instance.id,
        'status': instance.status.code,
        'victim':instance.victim.id
    }


    channel_layer = channels.layers.get_channel_layer()
    print(f"Sending to {group_name} {message}")
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            'type': 'send_message',
            'text': message
        }
    )