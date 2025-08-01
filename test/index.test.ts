import { describe, expect, it } from 'vitest';

import { StructuredRegEx } from '../src/index.js';

const SEMVER_REGEX = /([0-9]+)(?:\.([0-9]+))?(?:\.([0-9]+))?(-.*)?/;
const SLUG_REGEX = /[a-z0-9-_ ]+/i;

const VERSION_REGEX = new RegExp(`stable|${SEMVER_REGEX.source}`, 'i');
const API_FILENAME_REGEX = new RegExp(`(${SLUG_REGEX.source}.(json|yaml|yml))`, 'i');

describe('StructuredRegEx', () => {
  const uri = '/versions/stable/apis/petstore.json';

  describe('given a an instance of RegExp', () => {
    const API_URI_REGEX = new StructuredRegEx<{ filename: string; version: string }>(
      new RegExp(`/versions/(${VERSION_REGEX.source})/apis/(${API_FILENAME_REGEX.source})`, 'i'),
      {
        version: 1,
        filename: 6,
      },
    );

    it('should allow you to run standard RegExp methods', () => {
      const match = [
        '/versions/stable/apis/petstore.json',
        'stable',
        undefined,
        undefined,
        undefined,
        undefined,
        'petstore.json',
        'petstore.json',
        'json',
      ];

      // biome-ignore lint/style/noNonNullAssertion: this is fine
      expect(Array.from(uri.match(API_URI_REGEX)!)).toStrictEqual(match);
      expect(API_URI_REGEX.test(uri)).toBe(true);

      expect(API_URI_REGEX.source).toBe(
        '\\/versions\\/(stable|([0-9]+)(?:\\.([0-9]+))?(?:\\.([0-9]+))?(-.*)?)\\/apis\\/(([a-z0-9-_ ]+.(json|yaml|yml)))',
      );
    });

    it('should allow you to parse a regex into a grouped object', () => {
      const match = API_URI_REGEX.parse(uri);
      if (!match) {
        throw new Error('Expected a match');
      }

      const { filename, version } = match;
      expect(filename).toBe('petstore.json');
      expect(version).toBe('stable');
    });
  });

  describe('given a plain regex', () => {
    it('should support supplying a plain regex', () => {
      const plainRegex = new StructuredRegEx<{ filename: string; version: string }>(/\/versions\/(.*)\/apis\/(.*)/i, {
        version: 1,
        filename: 2,
      });

      expect(plainRegex.test(uri)).toBe(true);
      expect(plainRegex.parse(uri)).toStrictEqual({
        filename: 'petstore.json',
        version: 'stable',
      });
    });
  });
});
