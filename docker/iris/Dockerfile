FROM intersystemsdc/iris-community

EXPOSE 52773
EXPOSE 1972

# COPY ./requirements.txt /home/irisowner/django-todo/

ENV PATH=/home/irisowner/.local/bin:${PATH}
#
# RUN \
#   cd /home/irisowner/django-todo && \
#   pip3 install -r requirements.txt

COPY ./ /home/irisowner/

ENTRYPOINT [ "/tini", "--", "/home/irisowner/entrypoint.sh" ]