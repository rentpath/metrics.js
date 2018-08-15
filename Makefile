LIB_NAME := metrics
BUILD_NAME := metrics-alpine
LOCAL_BUILD_DIR := dist

all: build

build:
	docker build -t $(LIB_NAME) --rm=true .
	docker rm -fv $(LIB_NAME)-run; true
	docker run -it -d --name $(LIB_NAME)-run $(LIB_NAME)
	docker cp $(LIB_NAME)-run:/metrics/$(BUILD_NAME) .
	docker stop $(LIB_NAME)-run
	docker rm -fv $(LIB_NAME)-run

cli:
	docker build -t $(LIB_NAME) --rm=true .
	docker run -it --name $(LIB_NAME)-run $(LIB_NAME) /bin/sh
