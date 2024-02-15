#!/bin/bash

SNIPPETS_FILE='snippets/snippets.code-snippets'

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

escape_special () {
  printf '%s\n' "$1" | sed 's/[\&/]/\\&/g'
}

replace() {
  local VAR_NAME="$1"
  local VAR_VALUE="$2"
  sed -i "s@\$$VAR_NAME@$(escape_special $VAR_VALUE)@g" $SNIPPETS_FILE
}

cp $SNIPPETS_FILE.dist $SNIPPETS_FILE

for var in "${variables_list[@]}"; do
    value="${!var}"
    replace "$var" "$value"
done
