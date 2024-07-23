from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from . import consumers

application = ProtocolTypeRouter({
    'websocket': URLRouter([
        path('shsh_ws/', consumers.ShShConsumer.as_asgi()),
    ]),
})
