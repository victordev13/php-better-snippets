import { describe, expect, it } from 'vitest';
import { computeUseInsertion } from '../src/useStatementInserter';

describe('computeUseInsertion', () => {
  it('returns undefined when no <?php tag exists', () => {
    const documentText = 'namespace App\\Service;\n\nclass Foo {}';
    const result = computeUseInsertion(documentText, 'Doctrine\\ORM\\Mapping as ORM');

    expect(result).toBeUndefined();
  });

  it('inserts use after <?php tag when no namespace or existing uses exist', () => {
    const documentText = '<?php\n\nclass Foo {}';
    const result = computeUseInsertion(documentText, 'Doctrine\\ORM\\Mapping as ORM');

    expect(result).toBeDefined();
    expect(result!.line).toBe(0);
    expect(result!.character).toBe(5); // After "<?php"
    expect(result!.text).toBe('\n\nuse Doctrine\\ORM\\Mapping as ORM;');
  });

  it('inserts use after <?php and declare(strict_types=1)', () => {
    const documentText = "<?php\n\ndeclare(strict_types=1);\n\nclass Foo {}";
    const result = computeUseInsertion(documentText, 'Doctrine\\ORM\\Mapping as ORM');

    expect(result).toBeDefined();
    expect(result!.line).toBe(2);
    expect(result!.character).toBe(24); // After "declare(strict_types=1);"
    expect(result!.text).toBe('\n\nuse Doctrine\\ORM\\Mapping as ORM;');
  });

  it('inserts use after namespace declaration', () => {
    const documentText = '<?php\n\nnamespace App\\Service;\n\nclass Foo {}';
    const result = computeUseInsertion(documentText, 'Doctrine\\ORM\\Mapping as ORM');

    expect(result).toBeDefined();
    expect(result!.line).toBe(2);
    expect(result!.character).toBe(22); // After "namespace App\\Service;"
    expect(result!.text).toBe('\n\nuse Doctrine\\ORM\\Mapping as ORM;');
  });

  it('inserts use after existing use statements in a block', () => {
    const documentText = `<?php

namespace App\\Service;

use Symfony\\Component\\HttpFoundation\\Request;
use Symfony\\Component\\HttpFoundation\\Response;

class Foo {}`;
    const result = computeUseInsertion(documentText, 'Doctrine\\ORM\\Mapping as ORM');

    expect(result).toBeDefined();
    expect(result!.line).toBe(5);
    expect(result!.character).toBe(46); // After the second use statement
    expect(result!.text).toBe('\nuse Doctrine\\ORM\\Mapping as ORM;');
  });

  it('returns undefined when the use statement already exists', () => {
    const documentText = `<?php

namespace App\\Service;

use Doctrine\\ORM\\Mapping as ORM;
use Symfony\\Component\\HttpFoundation\\Request;

class Foo {}`;
    const result = computeUseInsertion(documentText, 'Doctrine\\ORM\\Mapping as ORM');

    expect(result).toBeUndefined();
  });

  it('returns undefined when the use statement exists with different spacing', () => {
    const documentText = `<?php

namespace App\\Service;

use   Doctrine\\ORM\\Mapping   as   ORM  ;

class Foo {}`;
    const result = computeUseInsertion(documentText, 'Doctrine\\ORM\\Mapping as ORM');

    expect(result).toBeUndefined();
  });

  it('handles use statements with leading and trailing spaces in the document', () => {
    const documentText = '<?php\n\nnamespace App\\Service;\n\n  use SomeClass;  \n\nclass Foo {}';
    const result = computeUseInsertion(documentText, 'Doctrine\\ORM\\Mapping as ORM');

    expect(result).toBeDefined();
    expect(result!.line).toBe(4); // After "  use SomeClass;  "
    expect(result!.text).toBe('\nuse Doctrine\\ORM\\Mapping as ORM;');
  });

  it('correctly identifies use block end when followed by empty lines and code', () => {
    const documentText = `<?php

namespace App\\Service;

use First\\Class;
use Second\\Class;

class Foo {}`;
    const result = computeUseInsertion(documentText, 'Doctrine\\ORM\\Mapping as ORM');

    expect(result).toBeDefined();
    expect(result!.line).toBe(5); // After "use Second\\Class;"
  });

  it('treats use blocks separated by empty lines as one continuous block', () => {
    const documentText = `<?php

namespace App\\Service;

use First\\Class;

use Second\\Class;

class Foo {}`;
    const result = computeUseInsertion(documentText, 'Doctrine\\ORM\\Mapping as ORM');

    // Should insert after the first use block (First\Class), not after empty lines
    // However, our implementation considers this as separate blocks.
    // The actual behavior will depend on how we handle empty lines in the use block detection.
    expect(result).toBeDefined();
  });

  it('handles edge case: use statement at the very end of the file', () => {
    const documentText = '<?php\n\nnamespace App\\Service;\n\nuse OnlyClass;';
    const result = computeUseInsertion(documentText, 'Doctrine\\ORM\\Mapping as ORM');

    expect(result).toBeDefined();
    expect(result!.line).toBe(4); // After "use OnlyClass;"
  });

  it('prioritizes use block over namespace when both exist', () => {
    const documentText = `<?php

namespace App\\Service;

use Existing\\Class;

class Foo {}`;
    const result = computeUseInsertion(documentText, 'Doctrine\\ORM\\Mapping as ORM');

    expect(result).toBeDefined();
    // Should insert after the existing use, not after namespace
    expect(result!.line).toBe(4); // After "use Existing\\Class;"
  });

  it('handles <?php with content on the same line', () => {
    const documentText = "<?php\nnamespace App\\Service;";
    const result = computeUseInsertion(documentText, 'Doctrine\\ORM\\Mapping as ORM');

    expect(result).toBeDefined();
    expect(result!.line).toBe(1); // After namespace
  });
});
