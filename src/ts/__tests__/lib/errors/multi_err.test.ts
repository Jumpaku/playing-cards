import { Err } from "../../../lib/errors/base_err";
import { combine, MultiErr, MultiErrInfo } from "../../../lib/errors/multi_err";
import { wrapErr } from "../../../lib/errors/utils";

class TestErr extends Err {
  constructor() {
    super("TestErr", "test message", {});
  }
}

describe("combine", () => {
  it("wraps 1 error", () => {
    const err = combine("Error");
    expect(err.name).toStrictEqual("UnknownErr");
  });

  it("wraps 1 non null error", () => {
    const err = combine(undefined, "Error", null);
    expect(err.name).toStrictEqual("UnknownErr");
  });

  it("returns itself if it is an instance of Err", () => {
    const err = combine(new TestErr());
    expect(err.name).toStrictEqual("TestErr");
  });

  it("returns itself if there is one non null instance of Err", () => {
    const err = combine(undefined, new TestErr(), null);
    expect(err.name).toStrictEqual("TestErr");
  });

  it("combines and wraps multiple non null errors", () => {
    const err = combine(undefined, "Error1", null, new TestErr());
    expect(err.name).toStrictEqual("MultiErr");
    const info: MultiErrInfo = err.getInfo() as any;
    expect(info.errors.length).toStrictEqual(2);
    expect(info.errors[0].name).toStrictEqual("UnknownErr");
    expect(info.errors[1].name).toStrictEqual("TestErr");
  });
});
