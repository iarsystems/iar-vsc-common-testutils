# iar-vsc-common-testutils

This package contains testing- and development code that is shared between IAR VS Code extensions.

This package is not meant to be published to a package registry; rather, it should be used by adding a `package.json`
dependency on this repository:
```json
"dependencies": {
    ...
    "iar-vsc-common-testutils": "git@github.com:IARSystems/iar-vsc-common-testutils.git#<tag>"
}
```
The typescript source code is transpiled on installation.

For development, it is practical to use a local version of this repository. Simply clone this repository next to the extension repositories. Then, in the extension directory, run:
```sh
npm link <path-to>/iar-vsc-common-testutils
```
The link stays active until you next run `npm install` or `npm unlink`

To use your changes in the extensions, commit your changes, then create and push a tag:
```sh
git tag v1.1.1
git push origin tag v1.1.1
```

In the extension(s) `package.json` file, update the dependency to the new tag.

```json
"dependencies": {
    ...
    "iar-vsc-common-testutils": "git@github.com:IARSystems/iar-vsc-common-testutils.git#v1.1.1"
}
```

