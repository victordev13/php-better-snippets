# PHP Better Snippets

Hi PHP Developers 👋!

This extension provides code snippets for PHP and Symfony framework, enabling you to code faster and be more productive.

## Features

The snippets follow the fluent interfaces and Type declarations standard.

### PHP Snippets:

 - `php`: New PHP Class
 - `#`: PHP Attribute
 - `ex`: New 'execute' function
 - `__`: PHP Constructor
 - `inv`: PHP __invoke function
 - `service`: New PHP Service with 'execute' method
 - `set`: Property Setter
 - `get`: Property Getter
 - `sg`: Getter and Setter
 - `wget`: Create a new PHP property setter function
 - `wsg`: Getter and Setter without 'get' prefix
 - `fn`: Create a new PHP anonymous function
 - `fnc`: Create a new PHP function
 - `st`: Create a new PHP static function
 - `prf`: Create a new PHP private function
 - `name`: PHP Namespace
 - `json`: Create a new PHP jsonSerialize function
 - `fname`: Get current filename
 - `is`: Create a new PHP function to return boolean if is something
 - `interface`: New PHP interface
 - `enum`: PHP Enum
 - `bnum`: PHP Backed Enum
 - `pp`: New PHP public property
 - `pv`: New PHP private property
 - `pvr`: New PHP private readonly property
 - `pbr`: Public readonly property

### Symfony Snippets:

 - `controllerAnnotated`: Symfony Controller with PHP annotations
 - `controllerAnnotatedJson`: Symfony Controller with PHP annotations and return Json
 - `controller`: Symfony Controller with PHP attributes and return Json
 - `controllerJson`: Symfony Controller with PHP attributes and return Json
 - `form`: Symfony Form file
 - `repo`: Symfony Doctrine repository
 - `entity`: Symfony Doctrine Entity class with PHP attributes
 - `entity`: Symfony Doctrine Entity class with PHP annotations
 - `col`: Symfony Doctrine Column with PHP attributes
 - `orm`: Import doctrine mapping annotation
 - `test`: PHPUnit Test class

### About namespace generation:

The namespace was generated based on the current file directory, considering files in "src", "test", "tests", and "testes"

Example:
  your file is `src/App/Company/Services/CreateAnUserService.php` -> `namespace App\Company\Services;`
  
If your composer.json has a namespace prefix defined that differs from the folder structure, remember to adjust the generated namespace.

---

By Brazilian PHP Developer 🐘
