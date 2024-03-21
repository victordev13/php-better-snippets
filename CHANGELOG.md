# Change Log

All notable changes to the "php-better-snippets" extension will be documented in this file.

---

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
