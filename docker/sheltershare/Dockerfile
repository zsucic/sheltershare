FROM intersystemsdc/iris-community
ENV PYTHONUNBUFFERED 1
EXPOSE 8000
EXPOSE 8001
EXPOSE 52773
EXPOSE 1972

RUN mkdir /home/irisowner/code

ENV PATH=/home/irisowner/.local/bin:${PATH}
#

COPY --chown=irisowner ./sheltersharehttpd.conf /home/irisowner/code/
COPY --chown=irisowner ./entrypoint.sh /home/irisowner/code/
COPY --chown=irisowner ./requirements.txt /home/irisowner/code/
COPY --chown=irisowner ./shshproj/ /home/irisowner/code/
WORKDIR /home/irisowner/code
RUN pip install --upgrade pip && pip install -r requirements.txt

ENTRYPOINT [ "/tini", "--", "/home/irisowner/code/entrypoint.sh" ]