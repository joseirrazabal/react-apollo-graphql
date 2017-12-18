FROM alpine:3.6
#FROM caarlos0/alpine-go

ENV GOROOT=/usr/lib/go \
    GOPATH=/gopath \
    GOBIN=/gopath/bin \
    PATH=$PATH:$GOROOT/bin:$GOPATH/bin

ADD fly /gopath/src

RUN apk add --update alpine-sdk
RUN apk add -U git go
RUN go get -v server
RUN apk del git go
RUN rm -rf /gopath/pkg
RUN rm -rf /gopath/src
RUN rm -rf /var/cache/apk/*

COPY fly/server/route_fly_db.json  /gopath/bin

WORKDIR /gopath/bin
ENTRYPOINT ["/gopath/bin/server"]
#EXPOSE 8080
