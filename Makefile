.PHONY: install build watch typecheck test test-watch pack publish publish-pre \
        release-patch release-minor release-major release clean

install:
	npm install

build:
	npm run compile

watch:
	npm run watch

typecheck:
	npx tsc --noEmit

test:
	npm test

test-watch:
	npm run test:watch

## Bumps version, updates CHANGELOG.md, runs typecheck/tests/build, commits and tags.
release-patch:
	npm run release -- patch

release-minor:
	npm run release -- minor

release-major:
	npm run release -- major

## Explicit version: make release VERSION=1.2.3
release:
	@if [ -z "$(VERSION)" ]; then echo "Usage: make release VERSION=x.y.z"; exit 1; fi
	npm run release -- $(VERSION)

pack: build
	npm run pack

publish: build
	npm run publish

publish-pre: build
	npm run publish:pre-release

clean:
	rm -rf dist *.vsix
