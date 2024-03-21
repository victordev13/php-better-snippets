# Contribution guide:

To facilitate the creation of new snippets and maintenance of current ones, certain repeated code segments have been extracted into new variables. For instance, the regex that generates the namespace has been extracted into `$CUSTOM_NAMESPACE_REGEX`, which is then replaced during the extension generation (`vsce package`) by the bash script [`./replace-custom-and-generate.sh`](./replace-custom-and-generate.sh) executed in the `vscode:prepublish` script.

The currently available variables are:
  - `$CUSTOM_NAMESPACE_REGEX`
  - `$PHP_VARIABLE_TYPE`
  - `$PHP_FUNCTION_RETURN_TYPE`
  - `$PHP_POSSIBLE_EXCEPTIONS`
