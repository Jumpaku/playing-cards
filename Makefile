.PHONY: build
build:
	make clean && make build_js

.PHONY: build
clean:
	rm -rf ./dist/*

.PHONY: build_js
build_js:
	make build_ts_lint && make build_js_compile && make build_js_bundle

.PHONY: build_ts_lint
build_ts_lint:
	eslint --fix src/ts/**/*.ts

.PHONY: build_js_compile
build_js_compile:
	tsc

.PHONY: build_js_bundle
build_js_bundle:
	rollup --sourcemap --format umd --file dist/index.bundle.js dist/js/index.js


.PHONY: start
start:
	node dist/index.bundle.js

.PHONY: test
test: 
	echo 'test not implemented'
