export function getBinaryBit(num, n) {
    const mask = 1 << n;
    return (num & mask) !== 0 ? 1 : 0;
}