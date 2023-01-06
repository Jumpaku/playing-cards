import { FixShiftClock, RealClock } from "../../lib/clock";
describe("FixShiftClock.now", () => {
  it("fix", () => {
    const fix = new Date(Date.parse("2023-01-01T12:34:56.789Z"));
    expect(new FixShiftClock(fix).now().getTime()).toStrictEqual(fix.getTime());
    expect(new FixShiftClock().fix(fix).now().getTime()).toBeCloseTo(
      fix.getTime(),
      -1
    );
  });

  it("shift", () => {
    const shift = 1000;
    const now = new Date();
    expect(new FixShiftClock().shift(shift).now().getTime()).toBeCloseTo(
      now.getTime() + shift,
      -1
    );
    expect(new FixShiftClock(undefined, shift).now().getTime()).toBeCloseTo(
      now.getTime() + shift,
      -1
    );
  });

  it("fix and shift", () => {
    const fix = new Date(Date.parse("2023-01-01T12:34:56.789Z"));
    const shift = 211;
    expect(new FixShiftClock(fix, shift).now().getTime()).toStrictEqual(
      fix.getTime() + shift
    );
    expect(
      new FixShiftClock().fix(fix).shift(shift).now().getTime()
    ).toStrictEqual(fix.getTime() + shift);
  });
});

describe("RealClock", () => {
  it("now", () => {
    const now = Date.now();
    expect(new RealClock().now().getTime()).toBeCloseTo(now, -1);
  });
});
