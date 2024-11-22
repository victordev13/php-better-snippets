# Contribution guide:

To simplify the creation of new snippets and the maintenance of existing ones, certain repeated code segments have been extracted to new customized variables. For example, the regex used to generate the namespace has been extracted into $CUSTOM_NAMESPACE_REGEX. This variable is replaced during the extension packaging process (vsce package) by the bash script [./build.sh](./build.sh), which is executed in the `vscode:prepublish` script.

The custom variables are defined in [`./custom-variables.json`](./custom-variables.json) and be replaced automatically by [`./build.sh`](./build.sh)

The currently available variables are:
  - `$CUSTOM_NAMESPACE_REGEX`
  - `$PHP_VARIABLE_TYPE`
  - `$PHP_FUNCTION_RETURN_TYPE`
  - `$PHP_POSSIBLE_EXCEPTIONS`
