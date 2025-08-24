export function getBinaryBit(num: number, n: number) {
    const mask = 1 << n;
    return (num & mask) !== 0 ? 1 : 0;
}

export function setBinaryBit(num: number, n: number, value: 1 | 0) {
    const mask = 1 << n;
    return value ? num | mask : num & ~mask;
}

export function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
