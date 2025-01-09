#!/bin/bash

# extract custom variables from custom-variables.json
declare -A variables_list
while IFS="=" read -r key value; do
  variables_list["$key"]="$value"
done < <(jq -r 'to_entries | .[] | "\(.key)=\(.value)"' custom-variables.json)

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

  # remove comments
  sed -i '/\/\//d' $snippetFile

  for var in "${!variables_list[@]}"; do
    replace "$snippetFile" "$var" "${variables_list[$var]}"
  done
done
