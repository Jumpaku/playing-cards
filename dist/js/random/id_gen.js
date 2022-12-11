import crypto from "crypto";
export class IncrementIdGen {
    current;
    constructor(current) {
        this.current = current;
    }
    value() {
        return `id-${this.current}`;
    }
    next() {
        const v = this.value();
        this.current++;
        return v;
    }
}
export class CryptoIdGen {
    current;
    constructor(current = crypto.randomUUID()) {
        this.current = current;
    }
    value() {
        return this.current;
    }
    next() {
        const v = this.value();
        this.current = crypto.randomUUID();
        return v;
    }
}
