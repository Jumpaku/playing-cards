import crypto from "crypto";

export interface IdGen {
  next(): string;
}

export class IncrementIdGen implements IdGen {
  constructor(private current: number) {}
  next(): string {
    const v = `id-${this.current}`;
    this.current++;
    return v;
  }
}

export class CryptoIdGen implements IdGen {
  constructor(private current: string = crypto.randomUUID()) {}
  next(): string {
    const v = this.current;
    this.current = crypto.randomUUID();
    return v;
  }
}
