"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.containsPattern = containsPattern;
function containsPattern(str, patterns) {
    return patterns.some(pattern => str.includes(pattern));
}
//# sourceMappingURL=utils.js.map