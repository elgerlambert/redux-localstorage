BIN=node_modules/.bin

build:
	$(BIN)/babel src --out-dir lib

clean:
	rm -rf lib

lint:
	$(BIN)/eslint src

PHONY: build clean lint