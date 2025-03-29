# DevContainer
We use VSCode DevContainers[^1] to configure VSCode Extensions and system-wide tooling (node, npm). We can add extra

For project-specific tooling we maintain a `package.json` of dependencies using `npm`. Add an npm dependency with `npm install next@latest`.

This configuration is based on documentation at [Create a Dev Container](https://code.visualstudio.com/docs/devcontainers/create-dev-container#_create-a-devcontainerjson-file)

[^1]: Development Containers https://containers.dev/