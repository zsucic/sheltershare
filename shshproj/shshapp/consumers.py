
from channels.generic.websocket import AsyncWebsocketConsumer


import json
class ShShConsumer(AsyncWebsocketConsumer):
    def getUser(self):
        for entry in self.scope["headers"]:
            try:
                if entry[0].decode() == "cookie":
                    csrftokenstr,sessionidstr=entry[1].decode().split(";")
                    csrf=csrftokenstr.split("=")[1]
                    sessionid=sessionidstr.split("=")[1]
                    from django.contrib.sessions.models import Session
                    from django.contrib.auth.models import User

                    session = Session.objects.get(session_key=sessionid)
                    session_data = session.get_decoded()
                    print(session_data)
                    uid = session_data.get('_auth_user_id')
                    user = User.objects.get(id=uid)
                    return user
            except Exception as ex:
                print(ex)
        return None
    async def getCsrfAndSessionKey(self):
        csrf=None
        sessionid=None
        for entry in self.scope["headers"]:
            #print(f"processing header: {entry}")
            try:
                if entry[0].decode() == "cookie":
                    for subentry in entry[1].decode().split(";"):
                        subentry=subentry.strip()
                        #print(f"processing subentry: {subentry}")
                        if(subentry.lower().startswith("csrftoken")):
                            csrf = subentry.split("=")[1]
                        elif (subentry.lower().startswith("sessionid")):
                            sessionid = subentry.split("=")[1]

                    return csrf,sessionid
            except Exception as ex:
                print(ex)
        return None,None
    async def connect(self):

        #user = self.scope["client"][0]+"_"+str(self.scope["client"][1])

        csrf,sessionid= await self.getCsrfAndSessionKey()
        # user=sync_to_async(self.getUser())()
        user=sessionid
        if user:

            print(f"CONNECTED {user}")
            #self.group_name = 'job-user-{}'.format(user)
            self.group_name = 'allUsers'

            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )

            await self.accept()
        else:
            await self.disconnect(404)



    async def disconnect(self, close_code):
        user = self.scope["client"][0] + "_" + str(self.scope["client"][1])
        print(f"DISCONNECTED {user}")
        pass


    async def send_message(self, event):
        message = event['text']
        print(f"2EVENT! {event}")
        # Send message to WebSocket
        await self.send(text_data=json.dumps(
            message
        ))