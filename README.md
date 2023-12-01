# Docker buildx imagetools action

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

This action is a wrapper around `docker buildx imagetools create`

## Usage

See [action.yml](action.yml)

### Example

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

# ...

  - name: Create manifest list
    uses: kphrx/docker-buildx-imagetools-action@v0.1.0
    with:
      sources: |
        sha256:<hash>
        sha256:<hash>
      tags: ghcr.io/<name>/<repo>:latest
```
