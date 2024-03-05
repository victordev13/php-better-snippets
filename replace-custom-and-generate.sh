#!/bin/bash

CUSTOM_NAMESPACE_REGEX='${TM_DIRECTORY/(?:.*[\\/\\\\])(?:src|tests|test|testes)[\\/\\\\]([^\\/\\\\]*)[\\/\\\\]?|[\\/\\\\]([^\\/\\\\]*)/$1\\$2/g}'
PHP_VARIABLE_TYPE='string,int,bool,true,false,null,float,array,iterable,callable,object,mixed'
PHP_FUNCTION_RETURN_TYPE='void,string,int,bool,true,false,null,float,array,iterable,callable,object,never,mixed,static,self'
PHP_POSSIBLE_EXCEPTIONS='\\Exception,\\BadFunctionCallException,\\BadMethodCallException,\\DomainException,\\InvalidArgumentException,\\LengthException,\\LogicException,\\OutOfBoundsException,\\OutOfRangeException,\\OverflowException,\\RangeException,\\RuntimeException,\\UnderflowException,\\UnexpectedValueException'

variables_list=(
  'CUSTOM_NAMESPACE_REGEX'
  'PHP_VARIABLE_TYPE'
  'PHP_FUNCTION_RETURN_TYPE'
  'PHP_POSSIBLE_EXCEPTIONS'
)

# extract snippets list from package.json
snippets_files=$(grep -o '"path": *"[^"]*"' package.json | cut -d '"' -f 4)

escape_special () {
  printf '%s\n' "$1" | sed 's/[\&/]/\\&/g'
}

replace() {
  local SNIPPETS_FILE="$1"
  local VAR_NAME="$2"
  local VAR_VALUE="$3"
  sed -i "s@\$$VAR_NAME@$(escape_special $VAR_VALUE)@g" $SNIPPETS_FILE
}

for snippetFile in ${snippets_files[*]}; do
  cp $snippetFile.dist $snippetFile

  for var in ${variables_list[*]}; do
      value="${!var}"
      replace "$snippetFile" "$var" "$value"
  done
done
