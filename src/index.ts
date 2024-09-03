export class StructuredRegEx<R extends Record<string, string>> extends RegExp {
  private mapping: Record<string, number>;

  constructor(pattern: RegExp, mapping: Record<keyof R, number>) {
    super(pattern);
    this.mapping = mapping;
  }

  parse(str: string) {
    const match = str.match(this);
    if (!match) return null;

    const ret: Record<string, unknown> = {};
    Object.entries(this.mapping).forEach(([key, index]) => {
      ret[key] = match[index];
    });

    return ret as R;
  }
}
