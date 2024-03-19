# PHP Better Snippets

Hi PHP Developers 👋!

This extension provides code snippets and boilerplates for PHP and Symfony framework, enabling you to code faster and be more productive.

## Features

The snippets follow the fluent interfaces and Type declarations standard.

### PHP Snippets:

 - `php`: PHP open tag
 - `phpc`: New PHP Class
 - `phprc`: New readonly PHP Class
 - `phpac`: New abstract PHP Class
 - `trait`: New PHP Trait
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
 - `?`: PHP ternary conditional
 - `c`: New PHP Constant
 - `throw`: PHP throw new Exception
 - `phpex`: New PHP exception class
 -  `$t`: `$this-><name>`
 -  `$t=`: `$this-><name> = </name>;`
 -  `*`: `/** <your-code> **/`

### Symfony Snippets:

 - `controller`: Symfony Controller (annotations)
 - `controller`: Symfony Controller and return Json (attributes)
 - `controllerJson`: Symfony Controller and return Json (annotations)
 - `controllerJson`: Symfony Controller and return Json (attributes)
 - `route`: Symfony Route attribute
 - `route`: Symfony Route annotation
 - `form`: Symfony Form file
 - `ormRepo`: Symfony Doctrine ORM repository
 - `orm`: Import doctrine ORM mapping annotation
 - `ormEntity`: Symfony Doctrine ORM Entity class (annotations)
 - `ormEntity`: Symfony Doctrine ORM Entity class (attributes)
 - `ormCol`: Symfony Doctrine ORM Column (annotations)
 - `ormCol`: Symfony Doctrine ORM Column (attributes)
 - `ormId`: Symfony Doctrine ORM Id Column (annotations)
 - `ormId`: Symfony Doctrine ORM Id Column (attributes)
 - `ormManyTo`: Symfony Doctrine ORM Many To[One|Many] Relation (annotations)
 - `ormManyTo`: Symfony Doctrine ORM Many To[One|Many] Relation (attributes)
 - `ormOneTo`: Symfony Doctrine ORM One To[One|Many] Relation (annotations)
 - `ormOneTo`: Symfony Doctrine ORM One To[One|Many] Relation (attributes)
 - `ormJoinCol`: Symfony Doctrine ORM Relation Join Column (annotations)
 - `ormJoinCol`: Symfony Doctrine ORM Relation Join Column (attributes)
 - `test`: PHPUnit Test class
 - `normalizer`: Symfony Custom Normalizer Class (^6.*)
 - `normalizer`: Symfony Custom Normalizer Class (old versions)
 - `denormalizer`: Symfony Custom Denormalizer Class (^6.4)
 - `denormalizer`: Symfony Custom Denormalizer Class (old versions)
 - `command`: Symfony Console Command (Symfony ^6.4)
 - `command`: Symfony Console Command (Symfony from 5.X to 6.3)
 - `command`: Symfony Console Command (Symfony old versions)
 - `embedded`: Embedded (annotations)
 - `embedded`: Embedded (attributes)
 - `embeddable`: Embeddable (annotations)
 - `embeddable`: Embeddable (attributes)

### About namespace generation:

The namespace was generated based on the current file directory, considering files in "src", "test", "tests", and "testes"

Example:
  your file is `src/App/Company/Services/CreateAnUserService.php` -> `namespace App\Company\Services;`
  
If your composer.json has a namespace prefix defined that differs from the folder structure, remember to adjust the generated namespace.

## Release notes:
See [./CHANGELOG.md](./CHANGELOG.md)

---

## Contribution guide:
See [./CONTRIBUTING.md](./CONTRIBUTING.md)

---

By PHP Developer for PHP Developers 🐘
