# Change Log

All notable changes to the "php-better-snippets" extension will be documented in this file.

---

## [0.3.1] - 2024-07-18
## [0.3.0] - 2024-07-17 (Pré-release)

### Changed
 - `bnum` changed to `benum` (PHP Backed enum)

### Added
 - new snippets:
  - `fnc`: Function without visibility
  - `pubf`: PHP public function
  - `privf`: PHP private function
  - `prof`: PHP protected function
  - `pubsf`: PHP public static function
  - `privsf`: PHP private static function
  - `prosf`: PHP protected static function
  - `apubf`: PHP abstract public function
  - `aprof`: PHP abstract protected function
  - `pubp`: PHP public property
  - `privp`: PHP private property
  - `prop`: PHP protected property
  - `pubrp`: PHP public readonly property
  - `privrp`: PHP private readonly property
  - `prorp`: PHP protected readonly property
  - `pubsp`: PHP public static property
  - `privsp`: PHP private static property
  - `prosp`: PHP protected static property

## [0.2.4] - 2024-04-24

### Fixed
 - Controller snippets was using a fixed class name as "Controller", changed to use the file name instead.

## [0.2.3] - 2024-04-16

### Fixed
 - removed extra `*` from end in `*` snippet (`/** **/` -> `/** */`)

## [0.2.2] - 2024-04-10

### Added
 - new Symfony snippet `dd` alternative to default `dd` but with dump and die

## [0.2.1] - 2024-03-21

### Added
  - new snippets:
    - PHP:
      - `trait`: New PHP Trait
      - `$t`: Access variable in $this (`$this-><name>`)
      - `$t=`: Assign to variable in $this (`$this-><name> = </name>;`)
      - `*`: Start multiline Comment (`/** <your-code> **/`)

    - Symfony/Doctrine ORM:
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

### Changed
  - separate snippets into different files by context
  - change `ormOneTo` to have `inversedBy` or `mappedBy` and not always require `mappedBy`
  - remove new unnecessary blank lines after functions

## [0.1.1] - 2024-02-15

### Added
  - new snippets:
    - PHP:
      - `throw`: PHP throw new Exception
      - `phpex`: New PHP exception class
  - Added a snippet generation flow based on a template file containing custom variables to allow reusing code that was previously repeated. (See in [./README.md](./README.md#contribution-guide))

## [0.1.0] - 2024-02-10

### Added
  - new snippets:
    - PHP:
      - `php`: PHP open tag
      - `phprc`: New readonly PHP Class
      - `phpac`: New abstract PHP Class
      - `?`: PHP ternary conditional
      - `c`: PHP constant

    - Symfony/Doctrine ORM:
      - `ormId`: Symfony Doctrine ORM Id Column (annotations)
      - `ormId`: Symfony Doctrine ORM Id Column (attributes)
      - `ormManyTo`: Symfony Doctrine ORM Many To[One|Many] Relation (attributes)
      - `ormManyTo`: Symfony Doctrine ORM Many To[One|Many] Relation (annotations)
      - `ormOneTo`: Symfony Doctrine ORM One To[One|Many] Relation (attributes)
      - `ormOneTo`: Symfony Doctrine ORM One To[One|Many] Relation (annotations)
      - `ormJoinCol`: Symfony Doctrine ORM Relation Join Column (attributes)
      - `ormJoinCol`: Symfony Doctrine ORM Relation Join Column (annotations)

  - options for visibility type on `fnc`, `is`, `pv`, `pp`, `pvr`, `pbr`, `__` snippets

### Changed
Some snippets are renamed:
  - `controllerAnnotated` -> `controller`
  - `controllerAnnotatedJson` -> `controllerJson`
  - `php` -> `phpc`
  - `col` -> `ormCol`
  - `entity` -> `ormEntity`
  - `repo` -> `ormRepo`

## [0.0.4] - 2024

---
