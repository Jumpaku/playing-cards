import { stringify } from "../../lib/strings";

describe("stringify", () => {
  it("stringifies undefined", () => {
    expect(stringify(undefined)).toBe(`"<undefined>"`);
  });
  it("stringifies Function", () => {
    expect(
      stringify(function f() {
        return 1;
      })
    ).toBe(`"<Function[f]>"`);
  });
  it("stringifies Symbol", () => {
    expect(stringify(Symbol("s"))).toBe(`"<Symbol[s]>"`);
  });
  it("stringifies null", () => {
    expect(stringify(null)).toBe(`null`);
  });
  it("stringifies bigint", () => {
    expect(stringify(12345678901234567890n)).toBe(`"12345678901234567890"`);
  });
  it("stringifies BigInt", () => {
    expect(stringify(BigInt("12345678901234567890"))).toBe(
      `"12345678901234567890"`
    );
  });
  it("stringifies number", () => {
    expect(stringify(1234567890)).toBe(`1234567890`);
  });
  it("stringifies Number", () => {
    expect(stringify(new Number(1234567890))).toBe(`1234567890`);
  });
  it("stringifies boolean", () => {
    expect(stringify(true)).toBe(`true`);
  });
  it("stringifies Boolean", () => {
    expect(stringify(new Boolean(true))).toBe(`true`);
  });
  it("stringifies string", () => {
    expect(stringify('an, f ihfg"hfvf RFG')).toBe(`"an, f ihfg\\"hfvf RFG"`);
  });
  it("stringifies String", () => {
    expect(stringify(new String("an, f ihfghfvf RFG"))).toBe(
      `"an, f ihfghfvf RFG"`
    );
  });
  it("stringifies date", () => {
    expect(stringify(new Date(Date.parse("2022-12-18T04:54:46Z")))).toMatch(
      /^"2022-12-18T04:54:46.*Z"/
    );
  });
  it("stringifies array", () => {
    expect(stringify([1, 2, 3, "x", "y", { v: { w: 10 } }])).toBe(
      `[1,2,3,"x","y",{"v":{"w":10}}]`
    );
  });
  it("stringifies object", () => {
    expect(stringify({ value: { str: "abc", num: 123 } })).toBe(
      `{"value":{"str":"abc","num":123}}`
    );
  });
  it("stringifies cyclic object", () => {
    const x: { x: unknown } = { x: "y" };
    x.x = x;
    expect(stringify(x)).toBe(`{"x":"<Cyclic>"}`);
  });
});
