FROM intersystemsdc/iris-community
ENV PYTHONUNBUFFERED 1

EXPOSE 8000
EXPOSE 8001
EXPOSE 52773
EXPOSE 1972

RUN mkdir /usr/irissys/csp/sheltershare

ENV PATH=/usr/irissys/bin:${PATH}
#

COPY --chown=irisowner ./httpd.conf /usr/irissys/httpd/conf/httpd.conf
COPY --chown=irisowner ./module.xml /usr/irissys/csp/sheltershare
COPY --chown=irisowner ./app.xml /usr/irissys/csp/sheltershare
COPY --chown=irisowner ./merge.cpf /usr/irissys/csp/sheltershare
COPY --chown=irisowner ./irissetup.py /usr/irissys/csp/sheltershare
COPY --chown=irisowner ./entrypoint.sh /usr/irissys/csp/sheltershare
COPY --chown=irisowner ./requirements.txt /usr/irissys/csp/sheltershare
COPY --chown=irisowner ./shshproj/ /usr/irissys/csp/sheltershare
WORKDIR /usr/irissys/csp/sheltershare
RUN \
  cd /usr/irissys/csp/sheltershare && \
  iris start IRIS && \
  iris merge IRIS merge.cpf

RUN /usr/irissys/bin/irispython -m pip install --target /usr/irissys/mgr/python -r requirements.txt

ENTRYPOINT [ "/tini", "--", "/usr/irissys/csp/sheltershare/entrypoint.sh" ]