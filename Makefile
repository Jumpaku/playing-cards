.DEFAULT_GOAL := help

.PHONY: init
init: ## install dependencies
	npm install

.PHONY: build
build: ## build all scripts
	@echo 'Clean js files:'
	make clean

	@echo 'Lint ts files:'
	eslint --fix src/ts/**/*.ts

	@echo 'Format ts files:'
	prettier --write src/ts/**/*.ts

	@echo 'Compile to js files:'
	tsc

	@echo 'Bundle js files:'
	rollup --sourcemap --format umd --file dist/index.bundle.js dist/js/index.js

.PHONY: clean
clean: ## clean built files
	rm -rf ./dist/*

.PHONY: start
start: ## run server
	node dist/index.bundle.js serve --env .env

.PHONY: test
test: ## run test
	jest

.PHONY: check
check: ## check lint, compile, and test
	@echo 'Filename:'
	./scripts/check_ts_file_case.sh

	@echo 'Lint Error:'
	eslint src/ts/**/*.ts
	
	@echo 'Format Error:'
	prettier --check src/ts/*.ts
	
	@echo 'Compile Error:'
	tsc --noEmit

.PHONY: help
help: ## show this help
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
