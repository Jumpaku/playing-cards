export interface Clock {
  now(): Date;
}

export class RealClock implements Clock {
  now(): Date {
    return new Date();
  }
}

export class FixShiftClock implements Clock {
  constructor(private fixed?: Date, private shiftMilliSecond: number = 0) {}
  now(): Date {
    return new Date(
      (this.fixed ?? new Date()).getTime() + this.shiftMilliSecond
    );
  }
  fix(fixed: Date): this {
    this.fixed = fixed;
    return this;
  }
  shift(shiftMilliSecond: number): this {
    this.shiftMilliSecond = shiftMilliSecond;
    return this;
  }
}
