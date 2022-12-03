.DEFAULT_GOAL := help

.PHONY: init
init: ## install dependencies
	npm install

.PHONY: build
build: ## build all scripts
	make clean && make build_js

.PHONY: clean
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
start: ## run server
	node dist/index.bundle.js

.PHONY: test
test: ## run test
	echo 'test not implemented'

.PHONY: check
check: ## check lint, compile, and test
	eslint src/ts/**/*.ts && tsc --dry && make test

.PHONY: help
help: ## show this help
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
