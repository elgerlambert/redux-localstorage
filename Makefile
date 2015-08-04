BIN=node_modules/.bin

build:
	$(BIN)/babel src --out-dir lib

clean:
	rm -rf lib

lint:
	$(BIN)/eslint src test

test:
	$(BIN)/mocha --compilers js:babel/register --recursive

.PHONY: build clean lint test
