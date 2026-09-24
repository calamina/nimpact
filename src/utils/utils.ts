export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
export const getRandomInt = (max: number) => Math.floor(Math.random() * max) + 1
