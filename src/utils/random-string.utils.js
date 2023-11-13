function randomString(radix = 15) {
    return Math.random().toString(radix).slice(2);
}

export { randomString };