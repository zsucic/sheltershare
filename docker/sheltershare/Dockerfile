FROM python:3.10-bullseye
ENV PYTHONUNBUFFERED 1
RUN mkdir /code

# COPY ../../requirements.txt /code/
COPY ./requirements.txt /code/
COPY ./shshproj/ /code/
RUN ls -althr /code
WORKDIR /code
RUN pip install --upgrade pip && pip install -r requirements.txt
