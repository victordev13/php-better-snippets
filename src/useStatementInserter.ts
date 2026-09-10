/**
 * Determines where to insert a `use` statement if it's not already present,
 * and returns the insertion point and text. Returns undefined if the `use`
 * statement already exists or cannot be inserted (e.g., no <?php tag).
 *
 * Insertion point priority:
 * 1. After an existing block of `use` statements
 * 2. After a `namespace` declaration
 * 3. After `<?php` tag (and optional `declare(strict_types=1);`)
 * 4. Undefined if no <?php tag (required for valid PHP files)
 */
export function computeUseInsertion(
  documentText: string,
  requiredUse: string
): { line: number; character: number; text: string } | undefined {
  const lines = documentText.split('\n');
  const normalizedRequiredUse = requiredUse.trim();

  // First, check if the use statement already exists (exact match, ignoring spaces)
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('use ') && trimmed.endsWith(';')) {
      // Extract content between 'use ' and ';', normalizing whitespace
      const existingUse = trimmed.slice(4, -1).trim().replace(/\s+/g, ' ');
      const normalizedCheck = normalizedRequiredUse.replace(/\s+/g, ' ');
      if (existingUse === normalizedCheck) {
        return undefined; // Use already exists
      }
    }
  }

  // Verify that the file has a <?php tag first (required for valid PHP)
  let phpTagLineIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === '<?php' || trimmed.startsWith('<?php')) {
      phpTagLineIndex = i;
      break;
    }
  }

  if (phpTagLineIndex === -1) {
    // No <?php tag found, cannot safely insert use statement
    return undefined;
  }

  // 1. Find an existing block of use statements
  let useBlockEndLine: number | undefined;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith('use ') && trimmed.endsWith(';')) {
      useBlockEndLine = i;
    } else if (useBlockEndLine !== undefined && (trimmed === '' || !trimmed.startsWith('use '))) {
      // End of use block found
      break;
    }
  }

  if (useBlockEndLine !== undefined) {
    // Insert after the last use statement
    const lastUseStatement = lines[useBlockEndLine];
    const newUse = `use ${normalizedRequiredUse};`;
    return {
      line: useBlockEndLine,
      character: lastUseStatement.length,
      text: `\n${newUse}`
    };
  }

  // 2. Find namespace declaration
  let namespaceLineIndex: number | undefined;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith('namespace ') && trimmed.endsWith(';')) {
      namespaceLineIndex = i;
      break;
    }
  }

  if (namespaceLineIndex !== undefined) {
    const namespaceLine = lines[namespaceLineIndex];
    const newUse = `use ${normalizedRequiredUse};`;
    return {
      line: namespaceLineIndex,
      character: namespaceLine.length,
      text: `\n\n${newUse}`
    };
  }

  // 3. Find <?php tag and optional declare(strict_types=1) that follows
  let lastRelevantLine = phpTagLineIndex;
  for (let i = phpTagLineIndex + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === '' || trimmed.startsWith('declare(strict_types=1)')) {
      if (trimmed.startsWith('declare(strict_types=1)')) {
        lastRelevantLine = i;
      }
      // Continue looking for declare or empty lines
    } else {
      // Stop at first non-empty, non-declare line
      break;
    }
  }

  const insertAfterLine = lines[lastRelevantLine];
  const newUse = `use ${normalizedRequiredUse};`;
  return {
    line: lastRelevantLine,
    character: insertAfterLine.length,
    text: `\n\n${newUse}`
  };
}
