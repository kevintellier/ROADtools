# it's a good idea to pin this, but for demo purposes we'll leave it as is
FROM debian:latest as builder

COPY . /app

# automatically creates the dir and sets it as the current working dir
WORKDIR /app

RUN apt update && apt install -y python3 python3-pip

RUN pip3 install --break-system-packages -r requirements.txt

ENTRYPOINT [ "python3","/app/roadtools/roadrecon/server.py","--debug" ]