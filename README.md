# PHP Better Snippets 🇧🇷

Hi PHP Developers 👋!

This extension provides code snippets and boilerplates for PHP and Symfony framework, enabling you to code faster and be more productive.

## Features

The snippets follow the fluent interfaces and Type declarations standard.

### PHP Snippets:

 - `php`: PHP open tag
 - `phpc`: PHP Class with namespace
 - `phprc`: Readonly PHP Class with namespace
 - `phpfc`: Final PHP Class with namespace
 - `phpac`: Abstract PHP Class with namespace
 - `trait`: PHP Trait with namespace
 - `#`: PHP Attribute
 - `ex`: New 'execute' function
 - `__`: PHP Constructor
 - `inv`: PHP __invoke function
 - `service`: New PHP Service with 'execute' method
 - `set`: Property Setter
 - `get`: Property Getter
 - `sg`: Getter and Setter
 - `wget`: Getter without 'get' prefix
 - `wsg`: Getter and Setter without 'get' prefix
 - `fn`: PHP anonymous function
 - `fnc`: PHP function
 - `fnc`: PHP function without visibility
 - `st`: PHP static function
 - `prf`: PHP private function
 - `name`: PHP Namespace
 - `json`: PHP jsonSerialize function
 - `fname`: Get current filename
 - `is`: PHP function to return boolean if is something
 - `interface`: New PHP interface
 - `enum`: PHP Enum
 - `benum`: PHP Backed Enum
 - `pp`: New PHP public property
 - `pv`: New PHP private property
 - `pvr`: New PHP private readonly property
 - `pbr`: Public readonly property
 - `?`: PHP ternary conditional
 - `c`: New PHP Constant
 - `c`: New Typed PHP Constant
 - `throw`: PHP throw new Exception
 - `phpex`: New PHP exception class
 - `$t`: Access variable in $this (`$this-><name>`)
 - `$t=`: Assign to variable in $this (`$this-><name> = </name>;`)
 - `*`: Start multiline Comment (`/** <your-code> **/`)
 - `pubf`: PHP public function
 - `privf`: PHP private function
 - `prof`: PHP protected function
 - `pubsf`: PHP public static function
 - `privsf`: PHP private static function
 - `prosf`: PHP protected static function
 - `apubf`: PHP abstract public function
 - `aprof`: PHP abstract protected function
 - `pubp`: PHP public property
 - `pubp`: [PHP 8.4] Public private(set) property ([asymmetric visibility](https://www.php.net/manual/en/language.oop5.visibility.php#language.oop5.visibility-members-aviz))
 - `pubp`: [PHP 8.4] Public protected(set) property ([asymmetric visibility](https://www.php.net/manual/en/language.oop5.visibility.php#language.oop5.visibility-members-aviz))
 - `pubp`: [PHP 8.4] Public property (with get) ([property hooks](https://www.php.net/manual/en/language.oop5.property-hooks.php))
 - `pubp`: [PHP 8.4] Public property (with set) ([property hooks](https://www.php.net/manual/en/language.oop5.property-hooks.php))
 - `pubp`: [PHP 8.4] Public property (with get/set) ([property hooks](https://www.php.net/manual/en/language.oop5.property-hooks.php))
 - `privp`: PHP private property
 - `privp`: [PHP 8.4] Private property (with get) ([property hooks](https://www.php.net/manual/en/language.oop5.property-hooks.php))
 - `privp`: [PHP 8.4] Private property (with set) ([property hooks](https://www.php.net/manual/en/language.oop5.property-hooks.php))
 - `privp`: [PHP 8.4] Private property (with get/set) ([property hooks](https://www.php.net/manual/en/language.oop5.property-hooks.php))
 - `prop`: PHP protected property
 - `prop`: [PHP 8.4] Protected private(set) property ([asymmetric visibility](https://www.php.net/manual/en/language.oop5.visibility.php#language.oop5.visibility-members-aviz))
 - `prop`: [PHP 8.4] Protected property (with get) ([property hooks](https://www.php.net/manual/en/language.oop5.property-hooks.php))
 - `prop`: [PHP 8.4] Protected property (with set) ([property hooks](https://www.php.net/manual/en/language.oop5.property-hooks.php))
 - `prop`: [PHP 8.4] Protected property (with get/set) ([property hooks](https://www.php.net/manual/en/language.oop5.property-hooks.php))
 - `pubrp`: PHP public readonly property
 - `privrp`: PHP private readonly property
 - `prorp`: PHP protected readonly property
 - `pubsp`: PHP public static property
 - `privsp`: PHP private static property
 - `prosp`: PHP protected static property
 - `pubtest`: PHP public function test (for unit tests)
 - `class`: PHP class
 - `rclass`: Readonly PHP Class
 - `fclass`: Final PHP Class
 - `abclass`: Abstract PHP Class

### Symfony Snippets:

 - `controller`: Symfony Controller (annotations)
 - `controller`: Symfony Controller and return Json (attributes)
 - `controllerJson`: Symfony Controller and return Json (annotations)
 - `controllerJson`: Symfony Controller and return Json (attributes)
 - `route`: Symfony Route (attributes)
 - `route`: Symfony Route (annotations)
 - `form`: Symfony Form file
 - `ormRepo`: Symfony Doctrine ORM repository
 - `orm`: Import Doctrine ORM Mapping class
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
 - `normalizer`: Symfony Custom Normalizer Class (Symfony ^6.*)
 - `normalizer`: Symfony Custom Normalizer Class (Symfony old versions)
 - `denormalizer`: Symfony Custom Denormalizer Class (Symfony ^6.4)
 - `denormalizer`: Symfony Custom Denormalizer Class (Symfony old versions)
 - `command`: Symfony Console Command (Symfony ^6.4)
 - `command`: Symfony Console Command (Symfony from 5.X to 6.3)
 - `command`: Symfony Console Command (Symfony old versions)
 - `embedded`: Embedded (annotations)
 - `embedded`: Embedded (attributes)
 - `embeddable`: Embeddable (annotations)
 - `embeddable`: Embeddable (attributes)
 - `dd`: dd (alternative to dd function with dump and die)

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
