# PHP Better Snippets 🇧🇷

Hi PHP Developers 👋!

This extension provides code snippets and boilerplates for PHP and Symfony framework, enabling you to code faster and be more productive.

## Features

The snippets follow the fluent interfaces and Type declarations standard.

### PHP Snippets:

 - `php`: PHP open tag
 - `#`: PHP Attribute
 - `ex`: New 'execute' function
 - `__` / `pubc`: PHP constructor
 - `inv` / `pubinv`: PHP `__invoke` function
 - `set`: Setter
 - `get`: Getter
 - `sg`: Getter and Setter
 - `wget`: Getter without 'get' prefix
 - `wsg`: Getter and Setter without 'get' prefix
 - `fnc`: Function
 - `fnc`: Function without visibility
 - `fn`: Anonymous function
 - `st`: Static function
 - `prf`: Private function
 - `json` / `pubjson`: `jsonSerialize` function
 - `fname`: Current filename
 - `is` / `pubis`: Boolean method
 - `pv`: Private property (old)
 - `pp`: Public property (old)
 - `pvr`: Private readonly property (old)
 - `pbr`: Public readonly property (old)
 - `?`: PHP ternary conditional
 - `c`: PHP constant
 - `c`: PHP typed constant
 - `throw`: PHP throw new Exception
 - `$t`: Access variable in $this (`$this-><name>`)
 - `$t=`: Assign to variable in $this (`$this-><name> = <value>;`)
 - `*`: Start multiline Comment (`/** <your-code> **/`)
 - `pubf`: Public function
 - `privf`: Private function
 - `prof`: Protected function
 - `pubsf`: Public static function
 - `privsf`: Private static function
 - `prosf`: Protected static function
 - `apubf`: Public abstract function
 - `aprof`: Protected abstract function
 - `pubp`: Public property
 - `pubp`: [PHP 8.4] Public `private(set)` property ([asymmetric visibility](https://www.php.net/manual/en/language.oop5.visibility.php#language.oop5.visibility-members-aviz))
 - `pubp`: [PHP 8.4] Public `protected(set)` property ([asymmetric visibility](https://www.php.net/manual/en/language.oop5.visibility.php#language.oop5.visibility-members-aviz))
 - `pubp`: [PHP 8.4] Public property (with get) ([property hooks](https://www.php.net/manual/en/language.oop5.property-hooks.php))
 - `pubp`: [PHP 8.4] Public property (with set) ([property hooks](https://www.php.net/manual/en/language.oop5.property-hooks.php))
 - `pubp`: [PHP 8.4] Public property (with get/set) ([property hooks](https://www.php.net/manual/en/language.oop5.property-hooks.php))
 - `privp`: Private property
 - `privp`: [PHP 8.4] Private property (with get) ([property hooks](https://www.php.net/manual/en/language.oop5.property-hooks.php))
 - `privp`: [PHP 8.4] Private property (with set) ([property hooks](https://www.php.net/manual/en/language.oop5.property-hooks.php))
 - `privp`: [PHP 8.4] Private property (with get/set) ([property hooks](https://www.php.net/manual/en/language.oop5.property-hooks.php))
 - `prop`: Protected property
 - `prop`: [PHP 8.4] Protected `private(set)` property ([asymmetric visibility](https://www.php.net/manual/en/language.oop5.visibility.php#language.oop5.visibility-members-aviz))
 - `prop`: [PHP 8.4] Protected property (with get) ([property hooks](https://www.php.net/manual/en/language.oop5.property-hooks.php))
 - `prop`: [PHP 8.4] Protected property (with set) ([property hooks](https://www.php.net/manual/en/language.oop5.property-hooks.php))
 - `prop`: [PHP 8.4] Protected property (with get/set) ([property hooks](https://www.php.net/manual/en/language.oop5.property-hooks.php))
 - `pubrp`: Public readonly property
 - `privrp`: Private readonly property
 - `prorp`: Protected readonly property
 - `pubsp`: Public static property
 - `privsp`: Private static property
 - `prosp`: Protected static property
 - `class`: PHP class
 - `rclass`: Readonly PHP Class
 - `fclass`: Final PHP Class
 - `abclass`: Abstract PHP Class
 - `pubtest`: PHP public function test (for unit tests)
 - `match`: PHP `match` expression
 - `matchvar`: PHP `match` assignment
 - `returnmatch`: PHP `match` return
 - `pubtostring` / `tostring`: Public `__toString`
 - `phpc`: PHP Class with namespace
 - `phprc`: Readonly PHP Class with namespace
 - `phpfc`: Final PHP Class with namespace
 - `phpac`: Abstract PHP Class with namespace
 - `trait`: New PHP Trait with namespace
 - `service`: New PHP Service with `execute` method, with namespace
 - `name`: PHP Namespace
 - `interface`: New PHP interface, with namespace
 - `enum`: PHP Enum, with namespace
 - `benum`: PHP Backed Enum, with namespace
 - `phpex`: New PHP exception class, with namespace

### Symfony Snippets:

 - `route`: Symfony Route attribute
 - `route`: Symfony Route annotation
 - `dd`: `dd` (alternative to Symfony `dd` function with dump and die)
 - `controller`: Symfony Controller (annotations)
 - `controllerJson`: Symfony Controller and return Json (annotations)
 - `controller`: Symfony Controller (attributes)
 - `controllerJson`: Symfony Controller and return Json (attributes)
 - `form`: Symfony Form Class
 - `normalizer`: Symfony Custom Normalizer Class (old versions)
 - `normalizer`: Symfony Custom Normalizer Class (Symfony ^6.*)
 - `denormalizer`: Symfony Custom Denormalizer Class (Symfony old versions)
 - `denormalizer`: Symfony Custom Denormalizer Class (Symfony ^6.4)
 - `command`: Symfony Console Command (Symfony ^6.4)
 - `command`: Symfony Console Command (Symfony from 5.X to 6.3)
 - `command`: Symfony Console Command (Symfony old versions)
 - `test`: PHPUnit Test class

### Symfony Attributes:

 - `asCommand`: Symfony `AsCommand` attribute
 - `isGranted`: Symfony `IsGranted` attribute
 - `isCsrfTokenValid`: Symfony `IsCsrfTokenValid` check
 - `autowire`: Symfony `Autowire` attribute
 - `autowireParam`: Symfony `Autowire` attribute (param)
 - `autowireEnv`: Symfony `Autowire` attribute (env)
 - `when`: Symfony `When` attribute
 - `asTaggedItem`: Symfony `AsTaggedItem` attribute

### Symfony Doctrine Snippets:

 - `ormCol`: Symfony Doctrine ORM Column (attributes)
 - `ormCol`: Symfony Doctrine ORM Column (annotations)
 - `ormId`: Symfony Doctrine ORM auto generated id column (annotations)
 - `ormId`: Symfony Doctrine ORM auto generated id column (attributes)
 - `ormManyTo`: Symfony Doctrine ORM Many To[One|Many] Relation (attributes)
 - `ormManyTo`: Symfony Doctrine ORM Many To[One|Many] Relation (annotations)
 - `ormOneTo`: Symfony Doctrine ORM One To[One|Many] Relation (attributes)
 - `ormOneTo`: Symfony Doctrine ORM One To[One|Many] Relation (annotations)
 - `ormJoinCol`: Symfony Doctrine ORM Relation Join Column (annotations)
 - `ormJoinCol`: Symfony Doctrine ORM Relation Join Column (attributes)
 - `orm`: Import Doctrine ORM Mapping class
 - `embeddable`: Embeddable (annotations)
 - `embeddable`: Embeddable (attributes)
 - `embedded`: Embedded (annotations)
 - `embedded`: Embedded (attributes)
 - `ormRepo`: Symfony Doctrine ORM repository, with namespace
 - `ormEntity`: Symfony Doctrine ORM Entity class (attributes), with namespace
 - `ormEntity`: Symfony Doctrine ORM Entity class (annotations), with namespace

### Symfony Messenger Snippets:

 - `asMessageHandler`: Symfony Messenger `AsMessageHandler` attribute
 - `asMessage`: Symfony Messenger `AsMessage` attribute
 - `message`: Symfony Messenger Message class (readonly), with namespace
 - `messageHandler`: Symfony Messenger Message Handler class, with namespace

### Symfony Scheduler Snippets:

 - `cronTask`: Symfony Scheduler Cron Task (`AsCronTask`), with namespace
 - `periodicTask`: Symfony Scheduler Periodic Task (`AsPeriodicTask`), with namespace
 - `scheduleProvider`: Symfony Scheduler Schedule Provider (`AsSchedule`), with namespace

### About namespace generation:

The namespace is dynamically resolved at runtime based on the project's `composer.json` PSR-4 autoload configuration. The extension searches for the nearest ancestor `composer.json`, then locates the `autoload.psr-4` or `autoload-dev.psr-4` entry whose directory-base is the most specific ancestor of the current file. The namespace is then composed as: `PSR4Prefix + relativePathFromEntry`.

If no `composer.json` exists or no PSR-4 entry covers the file, the namespace field in the snippet is left empty for manual editing — there is no fallback to folder-based heuristics.

Since the namespace is filled in automatically, it's never where the cursor lands first when a snippet expands — it's always the last tab stop, after every other parameter (class name, method body, etc.), so you can just start typing.

## Release notes:
See [./CHANGELOG.md](./CHANGELOG.md)

---

## Contribution guide:
See [./CONTRIBUTING.md](./CONTRIBUTING.md)

---

By PHP Developer for PHP Developers 🐘
