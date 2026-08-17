.PHONY: install build watch typecheck test test-watch pack publish publish-pre \
        release-patch release-minor release-major release clean

help: ## show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-24s\033[0m %s\n", $$1, $$2}'

install: ## install dependencies
	npm install

build: clean ## build the project
	npm run compile

watch: ## npm run watch
	npm run watch

typecheck: ## npx tsc --noEmit
	npx tsc --noEmit

test: ## run tests
	npm test

test-watch: ## run tests in watch mode
	npm run test:watch

## Bumps version, updates CHANGELOG.md, runs typecheck/tests/build, commits and tags.
release-patch: ## bump patch version (e.g. 1.2.3 -> 1.2.4)
	npm run release -- patch

release-minor: ## bump minor version (e.g. 1.2.3 -> 1.3.0)
	npm run release -- minor

release-major: ## bump major version (e.g. 1.2.3 -> 2.0.0)
	npm run release -- major

## Explicit version: make release VERSION=1.2.3
release: ## release a specific version
	@if [ -z "$(VERSION)" ]; then echo "Usage: make release VERSION=x.y.z"; exit 1; fi
	npm run release -- $(VERSION)

pack: build ## create a .vsix package
	npm run pack

publish: build ## publish the package to vscode marketplace
	npm run publish

publish-pre: build ## publish the package to vscode marketplace as a pre-release
	npm run publish:pre-release

clean: ## remove build artifacts
	rm -rf dist *.vsix
