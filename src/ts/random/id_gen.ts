import crypto from "crypto";

export interface IdGen {
  value(): string;
  next(): string;
}

export class IncrementIdGen implements IdGen {
  constructor(private current: number) {}
  value(): string {
    return `id-${this.current}`;
  }
  next(): string {
    const v = this.value();
    this.current++;
    return v;
  }
}

export class CryptoIdGen implements IdGen {
  constructor(private current: string = crypto.randomUUID()) {}
  value(): string {
    return this.current;
  }
  next(): string {
    const v = this.value();
    this.current = crypto.randomUUID();
    return v;
  }
}
