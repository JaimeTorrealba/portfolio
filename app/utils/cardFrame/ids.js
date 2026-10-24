// Unique prefix per instance for filter / clipPath / mask ids, so several cards and
// buttons on one page never pick up each other's defs.
let instanceCount = 0

export const createInstanceId = (prefix, seed) => `${prefix}-${seed}-${(instanceCount += 1)}`
