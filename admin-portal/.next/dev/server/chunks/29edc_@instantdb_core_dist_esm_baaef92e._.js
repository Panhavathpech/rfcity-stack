module.exports = [
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/weakHash.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 *
 * Unique Hashing implementation inspired by djb2/fnv1a algorithms,
 * where we are not concerned with the hash being decoded.
 * Focuses on speed while maintaining good hash distribution
 *
 * Note: We could also use something like Murmurhash instead
 * https://github.com/jensyt/imurmurhash-js/blob/master/imurmurhash.js
 *
 * @param {any} input - Value to hash
 * @returns {string} - Hash in hex format
 */ __turbopack_context__.s([
    "default",
    ()=>weakHash
]);
function weakHash(input) {
    // Handle primitives without JSON stringify for better performance
    if (typeof input === 'number') {
        // Use a larger number space for numeric values
        return (Math.abs(input * 2654435761) >>> 0).toString(16);
    }
    if (typeof input === 'boolean') return input ? '1' : '0';
    if (input === null) return 'null';
    if (input === undefined) return 'undefined';
    // For strings, use FNV-1a algorithm
    if (typeof input === 'string') {
        let hash = 0x811c9dc5; // FNV offset basis (32 bit)
        for(let i = 0; i < input.length; i++){
            hash ^= input.charCodeAt(i);
            hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
            hash = hash >>> 0; // Convert to unsigned 32-bit after each iteration
        }
        return hash.toString(16);
    }
    // For arrays, hash elements directly
    if (Array.isArray(input)) {
        let hash = 0x811c9dc5;
        for(let i = 0; i < input.length; i++){
            // Add array position to hash calculation
            hash ^= (i + 1) * 2654435761;
            // Recursively hash array elements
            const elementHash = weakHash(input[i]);
            // Mix the element hash into the running hash
            for(let j = 0; j < elementHash.length; j++){
                hash ^= elementHash.charCodeAt(j);
                hash *= 16777619; // FNV prime (32 bit)
                hash = hash >>> 0;
            }
        }
        return hash.toString(16);
    }
    // For objects, hash keys and values
    if (typeof input === 'object') {
        let hash = 0x811c9dc5;
        const keys = Object.keys(input).sort(); // Sort for consistency
        for(let i = 0; i < keys.length; i++){
            const key = keys[i];
            // Hash the key using string hash
            const keyHash = weakHash(key);
            hash ^= parseInt(keyHash, 16);
            hash *= 16777619;
            hash = hash >>> 0;
            // Hash the value recursively
            const valueHash = weakHash(input[key]);
            hash ^= parseInt(valueHash, 16);
            hash *= 16777619;
            hash = hash >>> 0;
        }
        return hash.toString(16);
    }
    // Fallback for other types
    return weakHash(String(input));
} //# sourceMappingURL=weakHash.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/object.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "areObjectKeysEqual",
    ()=>areObjectKeysEqual,
    "areObjectsDeepEqual",
    ()=>areObjectsDeepEqual,
    "areObjectsShallowEqual",
    ()=>areObjectsShallowEqual,
    "assocInMutative",
    ()=>assocInMutative,
    "dissocInMutative",
    ()=>dissocInMutative,
    "immutableDeepMerge",
    ()=>immutableDeepMerge,
    "immutableDeepReplace",
    ()=>immutableDeepReplace,
    "immutableOmitValue",
    ()=>immutableOmitValue,
    "immutableRemoveUndefined",
    ()=>immutableRemoveUndefined,
    "insertInMutative",
    ()=>insertInMutative,
    "isObject",
    ()=>isObject
]);
function areObjectKeysEqual(a, b) {
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    return ak.length === bk.length && Object.keys(a).every((k)=>b.hasOwnProperty(k));
}
function areObjectsShallowEqual(obj1, obj2) {
    return Object.keys(obj1).length === Object.keys(obj2).length && Object.keys(obj1).every((key)=>obj2.hasOwnProperty(key) && obj1[key] === obj2[key]);
}
function areObjectsDeepEqual(obj1, obj2) {
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
        return obj1 === obj2;
    }
    if (!areObjectKeysEqual(obj1, obj2)) {
        return false;
    }
    return Object.keys(obj1).every((key)=>areObjectsDeepEqual(obj1[key], obj2[key]));
}
function immutableRemoveUndefined(obj) {
    if (!isObject(obj)) {
        return obj;
    }
    const result = {};
    for (const [key, value] of Object.entries(obj)){
        if (value === undefined) continue;
        result[key] = value;
    }
    return result;
}
function immutableDeepMerge(target, source) {
    if (!isObject(target) || !isObject(source)) {
        return source;
    }
    const result = Object.assign({}, target);
    for (const key of Object.keys(source)){
        if (source[key] === undefined) continue;
        if (source[key] === null) {
            delete result[key];
            continue;
        }
        const areBothObjects = isObject(target[key]) && isObject(source[key]);
        result[key] = areBothObjects ? immutableDeepMerge(target[key], source[key]) : source[key];
    }
    return result;
}
function immutableDeepReplace(target, replaceValue, replacementValue) {
    if (!isObject(target)) {
        return target;
    }
    const result = {};
    for (const [key, value] of Object.entries(target)){
        result[key] = isObject(value) ? immutableDeepReplace(value, replaceValue, replacementValue) : value === replaceValue ? replacementValue : value;
    }
    return result;
}
function isObject(val) {
    return typeof val === 'object' && val !== null && !Array.isArray(val);
}
function immutableOmitValue(obj, v) {}
function insertInMutative(obj, path, value) {
    if (!obj) {
        return;
    }
    if (path.length === 0) {
        return;
    }
    let current = obj || {};
    for(let i = 0; i < path.length - 1; i++){
        const key = path[i];
        if (!(key in current) || typeof current[key] !== 'object') {
            current[key] = typeof path[i + 1] === 'number' ? [] : {};
        }
        current = current[key];
    }
    const key = path[path.length - 1];
    if (Array.isArray(current) && typeof key === 'number') {
        current.splice(key, 0, value);
    } else {
        current[key] = value;
    }
}
function assocInMutative(obj, path, value) {
    if (!obj) {
        return;
    }
    if (path.length === 0) {
        return;
    }
    let current = obj || {};
    for(let i = 0; i < path.length - 1; i++){
        const key = path[i];
        if (!(key in current) || typeof current[key] !== 'object') {
            current[key] = typeof path[i + 1] === 'number' ? [] : {};
        }
        current = current[key];
    }
    current[path[path.length - 1]] = value;
}
function dissocInMutative(obj, path) {
    if (!obj) {
        return;
    }
    if (path.length === 0) {
        return;
    }
    const [key, ...restPath] = path;
    if (!(key in obj)) {
        return;
    }
    if (restPath.length === 0) {
        if (Array.isArray(obj)) {
            obj.splice(key, 1);
        } else {
            delete obj[key];
        }
        return;
    }
    dissocInMutative(obj[key], restPath);
    if (isEmpty(obj[key])) {
        delete obj[key];
    }
}
function isEmpty(obj) {
    return obj && Object.keys(obj).length === 0;
} //# sourceMappingURL=object.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/pgtime.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "pgTimezoneAbbrevs",
    ()=>pgTimezoneAbbrevs,
    "pgTimezoneMatch",
    ()=>pgTimezoneMatch
]);
const pgTimezoneMatch = /ZULU|YEKT|YEKST|YAPT|YAKT|YAKST|XJT|WGT|WGST|WFT|WETDST|WET|WDT|WAT|WAST|WAKT|WADT|VUT|VOLT|VLAT|VLAST|VET|UZT|UZST|UYT|UYST|UTC|UT|ULAT|ULAST|UCT|TVT|TRUT|TOT|TMT|TKT|TJT|TFT|TAHT|SGT|SCT|SAST|SADT|RET|PYT|PYST|PWT|PST|PONT|PMST|PMDT|PKT|PKST|PHT|PGT|PETT|PETST|PET|PDT|OMST|OMSST|NZT|NZST|NZDT|NUT|NST|NPT|NOVT|NOVST|NFT|NDT|MYT|MVT|MUT|MUST|MST|MSK|MSD|MPT|MMT|MHT|MEZ|METDST|MET|MESZ|MEST|MDT|MAWT|MART|MAGT|MAGST|LKT|LINT|LIGT|LHST|LHDT|KST|KRAT|KRAST|KOST|KGT|KGST|KDT|JST|JAYT|IST|IRT|IRKT|IRKST|IOT|IDT|ICT|HST|HKT|GYT|GMT|GILT|GFT|GET|GEST|GAMT|GALT|FNT|FNST|FKT|FKST|FJT|FJST|FET|EST|EGT|EGST|EETDST|EET|EEST|EDT|EAT|EAST|EASST|DDUT|DAVT|CXT|CST|COT|CLT|CLST|CKT|CHUT|CHAST|CHADT|CETDST|CET|CEST|CDT|CCT|CAST|CADT|BTT|BST|BRT|BRST|BRA|BOT|BORT|BNT|BDT|BDST|AZT|AZST|AZOT|AZOST|AWST|AWSST|AST|ART|ARST|ANAT|ANAST|AMT|AMST|ALMT|ALMST|AKST|AKDT|AFT|AEST|AESST|AEDT|ADT|ACWST|ACT|ACST|ACSST|ACDT$/;
const pgTimezoneAbbrevs = {
    ZULU: 0,
    YEKT: 18000,
    YEKST: 21600,
    YAPT: 36000,
    YAKT: 32400,
    YAKST: 32400,
    XJT: 21600,
    WGT: -10800,
    WGST: -7200,
    WFT: 43200,
    WETDST: 3600,
    WET: 0,
    WDT: 32400,
    WAT: 3600,
    WAST: 25200,
    WAKT: 43200,
    WADT: 28800,
    VUT: 39600,
    VOLT: 10800,
    VLAT: 36000,
    VLAST: 36000,
    VET: -14400,
    UZT: 18000,
    UZST: 21600,
    UYT: -10800,
    UYST: -7200,
    UTC: 0,
    UT: 0,
    ULAT: 28800,
    ULAST: 32400,
    UCT: 0,
    TVT: 43200,
    TRUT: 36000,
    TOT: 46800,
    TMT: 18000,
    TKT: 46800,
    TJT: 18000,
    TFT: 18000,
    TAHT: -36000,
    SGT: 28800,
    SCT: 14400,
    SAST: 7200,
    SADT: 37800,
    RET: 14400,
    PYT: -14400,
    PYST: -10800,
    PWT: 32400,
    PST: -28800,
    PONT: 39600,
    PMST: -10800,
    PMDT: -7200,
    PKT: 18000,
    PKST: 21600,
    PHT: 28800,
    PGT: 36000,
    PETT: 43200,
    PETST: 43200,
    PET: -18000,
    PDT: -25200,
    OMST: 21600,
    OMSST: 21600,
    NZT: 43200,
    NZST: 43200,
    NZDT: 46800,
    NUT: -39600,
    NST: -12600,
    NPT: 20700,
    NOVT: 25200,
    NOVST: 25200,
    NFT: -12600,
    NDT: -9000,
    MYT: 28800,
    MVT: 18000,
    MUT: 14400,
    MUST: 18000,
    MST: -25200,
    MSK: 10800,
    MSD: 14400,
    MPT: 36000,
    MMT: 23400,
    MHT: 43200,
    MEZ: 3600,
    METDST: 7200,
    MET: 3600,
    MESZ: 7200,
    MEST: 7200,
    MDT: -21600,
    MAWT: 18000,
    MART: -34200,
    MAGT: 39600,
    MAGST: 39600,
    LKT: 19800,
    LINT: 50400,
    LIGT: 36000,
    LHST: 37800,
    LHDT: 37800,
    KST: 32400,
    KRAT: 25200,
    KRAST: 25200,
    KOST: 39600,
    KGT: 21600,
    KGST: 21600,
    KDT: 36000,
    JST: 32400,
    JAYT: 32400,
    IST: 7200,
    IRT: 12600,
    IRKT: 28800,
    IRKST: 28800,
    IOT: 21600,
    IDT: 10800,
    ICT: 25200,
    HST: -36000,
    HKT: 28800,
    GYT: -14400,
    GMT: 0,
    GILT: 43200,
    GFT: -10800,
    GET: 14400,
    GEST: 14400,
    GAMT: -32400,
    GALT: -21600,
    FNT: -7200,
    FNST: -3600,
    FKT: -10800,
    FKST: -10800,
    FJT: 43200,
    FJST: 46800,
    FET: 10800,
    EST: -18000,
    EGT: -3600,
    EGST: 0,
    EETDST: 10800,
    EET: 7200,
    EEST: 10800,
    EDT: -14400,
    EAT: 10800,
    EAST: -21600,
    EASST: -21600,
    DDUT: 36000,
    DAVT: 25200,
    CXT: 25200,
    CST: -21600,
    COT: -18000,
    CLT: -14400,
    CLST: -10800,
    CKT: -36000,
    CHUT: 36000,
    CHAST: 45900,
    CHADT: 49500,
    CETDST: 7200,
    CET: 3600,
    CEST: 7200,
    CDT: -18000,
    CCT: 28800,
    CAST: 34200,
    CADT: 37800,
    BTT: 21600,
    BST: 3600,
    BRT: -10800,
    BRST: -7200,
    BRA: -10800,
    BOT: -14400,
    BORT: 28800,
    BNT: 28800,
    BDT: 21600,
    BDST: 7200,
    AZT: 14400,
    AZST: 14400,
    AZOT: -3600,
    AZOST: 0,
    AWST: 28800,
    AWSST: 32400,
    AST: -14400,
    ART: -10800,
    ARST: -10800,
    ANAT: 43200,
    ANAST: 43200,
    AMT: -14400,
    AMST: 14400,
    ALMT: 21600,
    ALMST: 25200,
    AKST: -32400,
    AKDT: -28800,
    AFT: 16200,
    AEST: 36000,
    AESST: 39600,
    AEDT: 39600,
    ADT: -10800,
    ACWST: 31500,
    ACT: -18000,
    ACST: 34200,
    ACSST: 37800,
    ACDT: 37800
}; //# sourceMappingURL=pgtime.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/dates.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "coerceToDate",
    ()=>coerceToDate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$pgtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/pgtime.js [app-route] (ecmascript)");
;
// Date parsing functions
function zonedDateTimeStrToInstant(s) {
    return new Date(s);
}
function localDateTimeStrToInstant(s) {
    // Parse as UTC since there's no timezone info
    return new Date(s + 'Z');
}
const localDateStrRe = /^(\d+)[\./-](\d+)[\./-](\d+)$/;
function localDateStrToInstant(s) {
    const match = s.match(localDateStrRe);
    if (!match) {
        return null;
    }
    const [_, part1, part2, part3] = match;
    if (part1 <= 0 || part2 <= 0 || part3 <= 0) {
        return null;
    }
    if (part1 > 999) {
        return new Date(Date.UTC(part1, part2 - 1, part3, 0, 0, 0, 0));
    }
    return new Date(Date.UTC(part3, part1 - 1, part2, 0, 0, 0, 0));
}
// Custom date formatters
function offioDateStrToInstant(s) {
    // Format: "yyyy-MM-dd HH:mm:ss"
    // Treat as UTC
    const [datePart, timePart] = s.split(' ');
    return new Date(datePart + 'T' + timePart + 'Z');
}
function zenecaDateStrToInstant(s) {
    // Format: "yyyy-MM-dd HH:mm:ss.n"
    // Treat as UTC
    const [datePart, timeWithNanos] = s.split(' ');
    // JavaScript Date can handle fractional seconds
    return new Date(datePart + 'T' + timeWithNanos + 'Z');
}
function rfc1123ToInstant(s) {
    // RFC 1123 format is natively supported by Date constructor
    return new Date(s);
}
function dowMonDayYearStrToInstant(s) {
    // Format: "EEE MMM dd yyyy" (e.g., "Wed Jan 15 2025")
    //Only parse if the string is in the correct format
    const regex = /^(\w{3}) (\w{3}) (\d{2}) (\d{4})$/;
    const match = s.match(regex);
    if (!match) {
        throw new Error(`Unable to parse \`${s}\` as a date.`);
    }
    const date = new Date(s + ' UTC'); // Force UTC parsing
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
}
function iso8601IncompleteOffsetToInstant(s) {
    // Format: "2025-01-02T00:00:00-08" (missing minutes in timezone offset)
    // Convert to proper ISO 8601 format by adding ":00" to the timezone offset
    const regex = /^(.+T.+)([+-])(\d{2})$/;
    const match = s.match(regex);
    if (match) {
        const [, dateTimePart, sign, hours] = match;
        const correctedString = `${dateTimePart}${sign}${hours}:00`;
        return new Date(correctedString);
    }
    return null;
}
function usDateTimeStrToInstant(s) {
    // Format: "M/d/yyyy, h:mm:ss a" (e.g., "8/4/2025, 11:02:31 PM")
    const [datePart, timePart] = s.split(', ');
    const [month, day, year] = datePart.split('/').map(Number);
    // Parse time with AM/PM
    const timeMatch = timePart.match(/(\d{1,2}):(\d{2}):(\d{2}) (AM|PM)/);
    if (!timeMatch) {
        throw new Error(`Unable to parse time from: ${s}`);
    }
    let [, hours, minutes, seconds, ampm] = timeMatch;
    hours = Number(hours);
    minutes = Number(minutes);
    seconds = Number(seconds);
    // Convert 12-hour to 24-hour format
    if (ampm === 'PM' && hours !== 12) {
        hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
        hours = 0;
    }
    // Create date in UTC
    return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
}
// https://www.postgresql.org/docs/17/datatype-datetime.html#DATATYPE-DATETIME-SPECIAL-VALUES
function specialStrToInstant(s) {
    switch(s){
        case 'epoch':
            return new Date(0);
        // These are not implemented yet because we need some way for the
        // client and server to aggree on the values
        case 'infinity':
        case '-infinity':
        case 'today':
        case 'tomorrow':
        case 'yesterday':
            return null;
    }
}
function pgTimezoneStrToInstant(s) {
    const match = s.match(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$pgtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTimezoneMatch"]);
    if (!match) {
        return null;
    }
    const [tz] = match;
    const offset = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$pgtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTimezoneAbbrevs"][tz];
    const baseDate = new Date(s.replace(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$pgtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTimezoneMatch"], 'Z'));
    return new Date(baseDate.getTime() - offset * 1000);
}
// Array of parsers
const dateParsers = [
    localDateStrToInstant,
    zenecaDateStrToInstant,
    dowMonDayYearStrToInstant,
    usDateTimeStrToInstant,
    rfc1123ToInstant,
    localDateTimeStrToInstant,
    iso8601IncompleteOffsetToInstant,
    offioDateStrToInstant,
    zonedDateTimeStrToInstant,
    specialStrToInstant,
    pgTimezoneStrToInstant
];
// Try to parse with a specific parser
function tryParseDateString(parser, s) {
    try {
        const result = parser(s);
        // Check if result is valid date
        if (result instanceof Date && !isNaN(result.getTime())) {
            return result;
        }
        return null;
    } catch (e) {
        return null;
    }
}
// Try all parsers until one succeeds
function dateStrToInstant(s) {
    for (const parser of dateParsers){
        const instant = tryParseDateString(parser, s);
        if (instant) {
            return instant;
        }
    }
    return null;
}
// Parse JSON string and then try date parsing
function jsonStrToInstant(maybeJson) {
    try {
        const s = JSON.parse(maybeJson);
        if (typeof s === 'string') {
            return dateStrToInstant(s);
        }
        return null;
    } catch (e) {
        return null;
    }
}
function coerceToDate(x) {
    if (x === undefined) {
        return undefined;
    }
    if (x === null) {
        return null;
    }
    if (x instanceof Date) {
        return x;
    }
    if (typeof x === 'string') {
        const result = dateStrToInstant(x) || jsonStrToInstant(x) || dateStrToInstant(x.trim());
        if (!result) {
            throw new Error(`Unable to parse \`${x}\` as a date.`);
        }
        return result;
    } else if (typeof x === 'number') {
        return new Date(x);
    }
    throw new Error(`Invalid date value \`${x}\`. Expected a date, number, or string, got type ${typeof x}.`);
} //# sourceMappingURL=dates.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/store.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addTriple",
    ()=>addTriple,
    "allMapValues",
    ()=>allMapValues,
    "createStore",
    ()=>createStore,
    "fromJSON",
    ()=>fromJSON,
    "getAsObject",
    ()=>getAsObject,
    "getAttrByFwdIdentName",
    ()=>getAttrByFwdIdentName,
    "getAttrByReverseIdentName",
    ()=>getAttrByReverseIdentName,
    "getBlobAttrs",
    ()=>getBlobAttrs,
    "getInMap",
    ()=>getInMap,
    "getPrimaryKeyAttr",
    ()=>getPrimaryKeyAttr,
    "getTriples",
    ()=>getTriples,
    "hasEntity",
    ()=>hasEntity,
    "hasTriple",
    ()=>hasTriple,
    "isBlob",
    ()=>isBlob,
    "retractTriple",
    ()=>retractTriple,
    "toJSON",
    ()=>toJSON,
    "transact",
    ()=>transact
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$mutative$2f$dist$2f$mutative$2e$esm$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/mutative/dist/mutative.esm.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/object.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$dates$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/dates.js [app-route] (ecmascript)");
;
;
;
function hasEA(attr) {
    return attr['cardinality'] === 'one';
}
function isRef(attr) {
    return attr['value-type'] === 'ref';
}
function isBlob(attr) {
    return attr['value-type'] === 'blob';
}
function getAttr(attrs, attrId) {
    return attrs[attrId];
}
function getInMap(obj, path) {
    return path.reduce((acc, key)=>acc && acc.get(key), obj);
}
function deleteInMap(m, path) {
    if (path.length === 0) throw new Error('path must have at least one element');
    if (path.length === 1) {
        m.delete(path[0]);
        return;
    }
    const [head, ...tail] = path;
    if (!m.has(head)) return;
    deleteInMap(m.get(head), tail);
}
function setInMap(m, path, value) {
    if (path.length === 0) throw new Error('path must have at least one element');
    if (path.length === 1) {
        m.set(path[0], value);
        return;
    }
    const [head, ...tail] = path;
    let nextM = m.get(head);
    if (!nextM) {
        nextM = new Map();
        m.set(head, nextM);
    }
    setInMap(nextM, tail, value);
}
function isDateAttr(attr) {
    return attr['checked-data-type'] === 'date';
}
function createTripleIndexes(attrs, triples, useDateObjects) {
    const eav = new Map();
    const aev = new Map();
    const vae = new Map();
    for (const triple of triples){
        let [eid, aid, v, t] = triple;
        const attr = getAttr(attrs, aid);
        if (!attr) {
            console.warn('no such attr', eid, attrs);
            continue;
        }
        if (attr['checked-data-type'] === 'date' && useDateObjects) {
            v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$dates$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["coerceToDate"])(v);
            triple[2] = v;
        }
        if (isRef(attr)) {
            setInMap(vae, [
                v,
                aid,
                eid
            ], triple);
        }
        setInMap(eav, [
            eid,
            aid,
            v
        ], triple);
        setInMap(aev, [
            aid,
            eid,
            v
        ], triple);
    }
    return {
        eav,
        aev,
        vae
    };
}
function createAttrIndexes(attrs) {
    const blobAttrs = new Map();
    const primaryKeys = new Map();
    const forwardIdents = new Map();
    const revIdents = new Map();
    for (const attr of Object.values(attrs)){
        const fwdIdent = attr['forward-identity'];
        const [_, fwdEtype, fwdLabel] = fwdIdent;
        const revIdent = attr['reverse-identity'];
        setInMap(forwardIdents, [
            fwdEtype,
            fwdLabel
        ], attr);
        if (isBlob(attr)) {
            setInMap(blobAttrs, [
                fwdEtype,
                fwdLabel
            ], attr);
        }
        if (attr['primary?']) {
            setInMap(primaryKeys, [
                fwdEtype
            ], attr);
        }
        if (revIdent) {
            const [_, revEtype, revLabel] = revIdent;
            setInMap(revIdents, [
                revEtype,
                revLabel
            ], attr);
        }
    }
    return {
        blobAttrs,
        primaryKeys,
        forwardIdents,
        revIdents
    };
}
function toJSON(store) {
    return {
        __type: store.__type,
        attrs: store.attrs,
        triples: allMapValues(store.eav, 3),
        cardinalityInference: store.cardinalityInference,
        linkIndex: store.linkIndex,
        useDateObjects: store.useDateObjects
    };
}
function fromJSON(storeJSON) {
    return createStore(storeJSON.attrs, storeJSON.triples, storeJSON.cardinalityInference, storeJSON.linkIndex, storeJSON.useDateObjects);
}
function hasTriple(store, [e, a, v]) {
    return getInMap(store.eav, [
        e,
        a,
        v
    ]) !== undefined;
}
function hasEntity(store, e) {
    return getInMap(store.eav, [
        e
    ]) !== undefined;
}
function resetAttrIndexes(store) {
    store.attrIndexes = createAttrIndexes(store.attrs);
}
function createStore(attrs, triples, enableCardinalityInference, linkIndex, useDateObjects) {
    const store = createTripleIndexes(attrs, triples, useDateObjects);
    store.useDateObjects = useDateObjects;
    store.attrs = attrs;
    store.attrIndexes = createAttrIndexes(attrs);
    store.cardinalityInference = enableCardinalityInference;
    store.linkIndex = linkIndex;
    store.__type = 'store';
    return store;
}
// We may have local triples with lookup refs in them,
// we need to convert those lookup refs to eids to insert them
// into the store. If we can't find the lookup ref locally,
// then we drop the triple and have to wait for the server response
// to see the optimistic updates.
function resolveLookupRefs(store, triple) {
    var _a, _b;
    let eid;
    // Check if `e` is a lookup ref
    if (Array.isArray(triple[0])) {
        const [a, v] = triple[0];
        const eMaps = store.aev.get(a);
        if (!eMaps) {
            // We don't have the attr, so don't try to add the
            // triple to the store
            return null;
        }
        // This would be a lot more efficient with a ave index
        const triples = allMapValues(eMaps, 2);
        eid = (_a = triples.find((x)=>x[2] === v)) === null || _a === void 0 ? void 0 : _a[0];
    } else {
        eid = triple[0];
    }
    if (!eid) {
        // We don't know the eid that the ref refers to, so
        // we can't add the triple to the store.
        return null;
    }
    // Check if v is a lookup ref
    const lookupV = triple[2];
    if (Array.isArray(lookupV) && lookupV.length === 2 && store.aev.get(lookupV[0])) {
        const [a, v] = lookupV;
        const eMaps = store.aev.get(a);
        if (!eMaps) {
            // We don't have the attr, so don't try to add the
            // triple to the store
            return null;
        }
        const triples = allMapValues(eMaps, 2);
        const value = (_b = triples.find((x)=>x[2] === v)) === null || _b === void 0 ? void 0 : _b[0];
        if (!value) {
            return null;
        }
        const [_e, aid, _v, ...rest] = triple;
        return [
            eid,
            aid,
            value,
            ...rest
        ];
    } else {
        const [_, ...rest] = triple;
        return [
            eid,
            ...rest
        ];
    }
}
function retractTriple(store, rawTriple) {
    const triple = resolveLookupRefs(store, rawTriple);
    if (!triple) {
        return;
    }
    const [eid, aid, v] = triple;
    const attr = getAttr(store.attrs, aid);
    if (!attr) {
        return;
    }
    deleteInMap(store.eav, [
        eid,
        aid,
        v
    ]);
    deleteInMap(store.aev, [
        aid,
        eid,
        v
    ]);
    if (isRef(attr)) {
        deleteInMap(store.vae, [
            v,
            aid,
            eid
        ]);
    }
}
let _seed = 0;
function getCreatedAt(store, attr, triple) {
    const [eid, aid, v] = triple;
    let createdAt;
    const t = getInMap(store.ea, [
        eid,
        aid,
        v
    ]);
    if (t) {
        createdAt = t[3];
    }
    /**
     * (XXX)
     * Two hacks here, for generating a `createdAt`
     *
     * 1. We multiply Date.now() by 10, to make sure that
     *  `createdAt` is always greater than anything the server
     *   could return
     *
     *   We do this because right now we know we _only_ insert
     *   triples as optimistic updates.
     *
     * 2. We increment by `_seed`, to make sure there are no
     *    two triples with the same `createdAt`. This is
     *    done to make tests more predictable.
     *
     * We may need to rethink this. Because we * 10, we can't
     * use this value as an _actual_ `createdAt` timestamp.
     * Eventually we may want too though; For example, we could
     * use `createdAt` for each triple, to infer a `createdAt` and
     * `updatedAt` value for each object.
     */ return createdAt || Date.now() * 10 + _seed++;
}
function addTriple(store, rawTriple) {
    var _a;
    const triple = resolveLookupRefs(store, rawTriple);
    if (!triple) {
        return;
    }
    let [eid, aid, v] = triple;
    const attr = getAttr(store.attrs, aid);
    if (!attr) {
        // (XXX): Due to the way we're handling attrs, it's
        // possible to enter a state where we receive a triple without an attr.
        // See: https://github.com/jsventures/instant-local/pull/132 for details.
        // For now, if we receive a command without an attr, we no-op.
        return;
    }
    if (attr['checked-data-type'] === 'date' && store.useDateObjects) {
        v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$dates$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["coerceToDate"])(v);
    }
    const existingTriple = getInMap(store.eav, [
        eid,
        aid,
        v
    ]);
    // Reuse the created_at for a triple if it's already in the store.
    // Prevents updates from temporarily pushing an entity to the top
    // while waiting for the server response.
    const t = (_a = existingTriple === null || existingTriple === void 0 ? void 0 : existingTriple[3]) !== null && _a !== void 0 ? _a : getCreatedAt(store, attr, triple);
    const enhancedTriple = [
        eid,
        aid,
        v,
        t
    ];
    if (hasEA(attr)) {
        setInMap(store.eav, [
            eid,
            aid
        ], new Map([
            [
                v,
                enhancedTriple
            ]
        ]));
        setInMap(store.aev, [
            aid,
            eid
        ], new Map([
            [
                v,
                enhancedTriple
            ]
        ]));
    } else {
        setInMap(store.eav, [
            eid,
            aid,
            v
        ], enhancedTriple);
        setInMap(store.aev, [
            aid,
            eid,
            v
        ], enhancedTriple);
    }
    if (isRef(attr)) {
        setInMap(store.vae, [
            v,
            aid,
            eid
        ], enhancedTriple);
    }
}
function mergeTriple(store, rawTriple) {
    var _a;
    const triple = resolveLookupRefs(store, rawTriple);
    if (!triple) {
        return;
    }
    const [eid, aid, update] = triple;
    const attr = getAttr(store.attrs, aid);
    if (!attr) return;
    if (!isBlob(attr)) throw new Error('merge operation is not supported for links');
    const eavValuesMap = getInMap(store.eav, [
        eid,
        aid
    ]);
    if (!eavValuesMap) return;
    const currentTriple = (_a = eavValuesMap.values().next()) === null || _a === void 0 ? void 0 : _a.value;
    if (!currentTriple) return;
    const currentValue = currentTriple[2];
    const updatedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["immutableDeepMerge"])(currentValue, update);
    const enhancedTriple = [
        eid,
        aid,
        updatedValue,
        getCreatedAt(store, attr, currentTriple)
    ];
    setInMap(store.eav, [
        eid,
        aid
    ], new Map([
        [
            updatedValue,
            enhancedTriple
        ]
    ]));
}
function deleteEntity(store, args) {
    var _a, _b;
    const [lookup, etype] = args;
    const triple = resolveLookupRefs(store, [
        lookup
    ]);
    if (!triple) {
        return;
    }
    const [id] = triple;
    // delete forward links and attributes + cardinality one links
    const eMap = store.eav.get(id);
    if (eMap) {
        for (const a of eMap.keys()){
            const attr = store.attrs[a];
            // delete cascade refs
            if (attr && attr['on-delete-reverse'] === 'cascade') {
                allMapValues(eMap.get(a), 1).forEach(([e, a, v])=>{
                    var _a;
                    return deleteEntity(store, [
                        v,
                        (_a = attr['reverse-identity']) === null || _a === void 0 ? void 0 : _a[1]
                    ]);
                });
            }
            if (// Fall back to deleting everything if we've rehydrated tx-steps from
            // the store that didn't set `etype` in deleteEntity
            !etype || // If we don't know about the attr, let's just get rid of it
            !attr || // Make sure it matches the etype
            ((_a = attr['forward-identity']) === null || _a === void 0 ? void 0 : _a[1]) === etype) {
                deleteInMap(store.aev, [
                    a,
                    id
                ]);
                deleteInMap(store.eav, [
                    id,
                    a
                ]);
            }
        }
        // Clear out the eav index for `id` if we deleted all of the attributes
        if (eMap.size === 0) {
            deleteInMap(store.eav, [
                id
            ]);
        }
    }
    // delete reverse links
    const vaeTriples = store.vae.get(id) && allMapValues(store.vae.get(id), 2);
    if (vaeTriples) {
        vaeTriples.forEach((triple)=>{
            var _a, _b, _c;
            const [e, a, v] = triple;
            const attr = store.attrs[a];
            if (!etype || !attr || ((_a = attr['reverse-identity']) === null || _a === void 0 ? void 0 : _a[1]) === etype) {
                deleteInMap(store.eav, [
                    e,
                    a,
                    v
                ]);
                deleteInMap(store.aev, [
                    a,
                    e,
                    v
                ]);
                deleteInMap(store.vae, [
                    v,
                    a,
                    e
                ]);
            }
            if (attr && attr['on-delete'] === 'cascade' && ((_b = attr['reverse-identity']) === null || _b === void 0 ? void 0 : _b[1]) === etype) {
                deleteEntity(store, [
                    e,
                    (_c = attr['forward-identity']) === null || _c === void 0 ? void 0 : _c[1]
                ]);
            }
        });
    }
    // Clear out vae index for `id` if we deleted all the reverse attributes
    if (((_b = store.vae.get(id)) === null || _b === void 0 ? void 0 : _b.size) === 0) {
        deleteInMap(store.vae, [
            id
        ]);
    }
}
// (XXX): Whenever we change/delete attrs,
// We indiscriminately reset the index map.
// There are lots of opportunities for optimization:
// * We _only_ need to run this indexes change. We could detect that
// * We could batch this reset at the end
// * We could add an ave index for all triples, so removing the
//   right triples is easy and fast.
function resetIndexMap(store, newTriples) {
    const newIndexMap = createTripleIndexes(store.attrs, newTriples, store.useDateObjects);
    Object.keys(newIndexMap).forEach((key)=>{
        store[key] = newIndexMap[key];
    });
}
function addAttr(store, [attr]) {
    store.attrs[attr.id] = attr;
    resetAttrIndexes(store);
}
function getAllTriples(store) {
    return allMapValues(store.eav, 3);
}
function deleteAttr(store, [id]) {
    if (!store.attrs[id]) return;
    const newTriples = getAllTriples(store).filter(([_, aid])=>aid !== id);
    delete store.attrs[id];
    resetAttrIndexes(store);
    resetIndexMap(store, newTriples);
}
function updateAttr(store, [partialAttr]) {
    const attr = store.attrs[partialAttr.id];
    if (!attr) return;
    store.attrs[partialAttr.id] = Object.assign(Object.assign({}, attr), partialAttr);
    resetAttrIndexes(store);
    resetIndexMap(store, getAllTriples(store));
}
function applyTxStep(store, txStep) {
    const [action, ...args] = txStep;
    switch(action){
        case 'add-triple':
            addTriple(store, args);
            break;
        case 'deep-merge-triple':
            mergeTriple(store, args);
            break;
        case 'retract-triple':
            retractTriple(store, args);
            break;
        case 'delete-entity':
            deleteEntity(store, args);
            break;
        case 'add-attr':
            addAttr(store, args);
            break;
        case 'delete-attr':
            deleteAttr(store, args);
            break;
        case 'update-attr':
            updateAttr(store, args);
            break;
        case 'restore-attr':
            break;
        case 'rule-params':
            break;
        default:
            throw new Error(`unhandled transaction action: ${action}`);
    }
}
function allMapValues(m, level, res = []) {
    if (!m) {
        return res;
    }
    if (level === 0) {
        return res;
    }
    if (level === 1) {
        for (const v of m.values()){
            res.push(v);
        }
        return res;
    }
    for (const v of m.values()){
        allMapValues(v, level - 1, res);
    }
    return res;
}
function triplesByValue(store, m, v) {
    var _a, _b;
    const res = [];
    if (v === null || v === void 0 ? void 0 : v.hasOwnProperty('$not')) {
        for (const candidate of m.keys()){
            if (v.$not !== candidate) {
                res.push(m.get(candidate));
            }
        }
        return res;
    }
    if (v === null || v === void 0 ? void 0 : v.hasOwnProperty('$isNull')) {
        const { attrId, isNull, reverse } = v.$isNull;
        if (reverse) {
            for (const candidate of m.keys()){
                const vMap = store.vae.get(candidate);
                const isValNull = !vMap || ((_a = vMap.get(attrId)) === null || _a === void 0 ? void 0 : _a.get(null)) || !vMap.get(attrId);
                if (isNull ? isValNull : !isValNull) {
                    res.push(m.get(candidate));
                }
            }
        } else {
            const aMap = store.aev.get(attrId);
            for (const candidate of m.keys()){
                const isValNull = !aMap || ((_b = aMap.get(candidate)) === null || _b === void 0 ? void 0 : _b.get(null)) || !aMap.get(candidate);
                if (isNull ? isValNull : !isValNull) {
                    res.push(m.get(candidate));
                }
            }
        }
        return res;
    }
    if (v === null || v === void 0 ? void 0 : v.$comparator) {
        // TODO: A sorted index would be nice here
        return allMapValues(m, 1).filter(v.$op);
    }
    const values = v.in || v.$in || [
        v
    ];
    for (const value of values){
        const triple = m.get(value);
        if (triple) {
            res.push(triple);
        }
    }
    return res;
}
// A poor man's pattern matching
// Returns either eav, ea, ev, av, v, or ''
function whichIdx(e, a, v) {
    let res = '';
    if (e !== undefined) {
        res += 'e';
    }
    if (a !== undefined) {
        res += 'a';
    }
    if (v !== undefined) {
        res += 'v';
    }
    return res;
}
function getTriples(store, [e, a, v]) {
    var _a, _b;
    const idx = whichIdx(e, a, v);
    switch(idx){
        case 'e':
            {
                const eMap = store.eav.get(e);
                return allMapValues(eMap, 2);
            }
        case 'ea':
            {
                const aMap = (_a = store.eav.get(e)) === null || _a === void 0 ? void 0 : _a.get(a);
                return allMapValues(aMap, 1);
            }
        case 'eav':
            {
                const aMap = (_b = store.eav.get(e)) === null || _b === void 0 ? void 0 : _b.get(a);
                if (!aMap) {
                    return [];
                }
                return triplesByValue(store, aMap, v);
            }
        case 'ev':
            {
                const eMap = store.eav.get(e);
                if (!eMap) {
                    return [];
                }
                const res = [];
                for (const aMap of eMap.values()){
                    res.push(...triplesByValue(store, aMap, v));
                }
                return res;
            }
        case 'a':
            {
                const aMap = store.aev.get(a);
                return allMapValues(aMap, 2);
            }
        case 'av':
            {
                const aMap = store.aev.get(a);
                if (!aMap) {
                    return [];
                }
                const res = [];
                for (const eMap of aMap.values()){
                    res.push(...triplesByValue(store, eMap, v));
                }
                return res;
            }
        case 'v':
            {
                const res = [];
                for (const eMap of store.eav.values()){
                    for (const aMap of eMap.values()){
                        res.push(...triplesByValue(store, aMap, v));
                    }
                }
                return res;
            }
        default:
            {
                return allMapValues(store.eav, 3);
            }
    }
}
function getAsObject(store, attrs, e) {
    var _a;
    const obj = {};
    for (const [label, attr] of attrs.entries()){
        const aMap = (_a = store.eav.get(e)) === null || _a === void 0 ? void 0 : _a.get(attr.id);
        const triples = allMapValues(aMap, 1);
        for (const triple of triples){
            obj[label] = triple[2];
        }
    }
    return obj;
}
function getAttrByFwdIdentName(store, inputEtype, inputLabel) {
    var _a;
    return (_a = store.attrIndexes.forwardIdents.get(inputEtype)) === null || _a === void 0 ? void 0 : _a.get(inputLabel);
}
function getAttrByReverseIdentName(store, inputEtype, inputLabel) {
    var _a;
    return (_a = store.attrIndexes.revIdents.get(inputEtype)) === null || _a === void 0 ? void 0 : _a.get(inputLabel);
}
function getBlobAttrs(store, etype) {
    return store.attrIndexes.blobAttrs.get(etype);
}
function getPrimaryKeyAttr(store, etype) {
    var _a;
    const fromPrimary = store.attrIndexes.primaryKeys.get(etype);
    if (fromPrimary) {
        return fromPrimary;
    }
    return (_a = store.attrIndexes.forwardIdents.get(etype)) === null || _a === void 0 ? void 0 : _a.get('id');
}
function findTriple(store, rawTriple) {
    const triple = resolveLookupRefs(store, rawTriple);
    if (!triple) {
        return;
    }
    const [eid, aid, v] = triple;
    const attr = getAttr(store.attrs, aid);
    if (!attr) {
        // (XXX): Due to the way we're handling attrs, it's
        // possible to enter a state where we receive a triple without an attr.
        // See: https://github.com/jsventures/instant-local/pull/132 for details.
        // For now, if we receive a command without an attr, we no-op.
        return;
    }
    return getInMap(store.eav, [
        eid,
        aid
    ]);
}
function transact(store, txSteps) {
    const txStepsFiltered = txSteps.filter(([action, eid, attrId, value, opts])=>{
        if (action !== 'add-triple' && action !== 'deep-merge-triple') {
            return true;
        }
        const mode = opts === null || opts === void 0 ? void 0 : opts.mode;
        if (mode !== 'create' && mode !== 'update') {
            return true;
        }
        let exists = false;
        const attr = getAttr(store.attrs, attrId);
        if (attr) {
            const idAttr = getPrimaryKeyAttr(store, attr['forward-identity'][1]);
            exists = !!findTriple(store, [
                eid,
                idAttr.id,
                eid
            ]);
        }
        if (mode === 'create' && exists) {
            return false;
        }
        if (mode === 'update' && !exists) {
            return false;
        }
        return true;
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$mutative$2f$dist$2f$mutative$2e$esm$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["create"])(store, (draft)=>{
        txStepsFiltered.forEach((txStep)=>{
            applyTxStep(draft, txStep);
        });
    });
} //# sourceMappingURL=store.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/datalog.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// 1. patternMatch
__turbopack_context__.s([
    "matchPattern",
    ()=>matchPattern,
    "query",
    ()=>query,
    "querySingle",
    ()=>querySingle,
    "queryWhere",
    ()=>queryWhere
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/store.js [app-route] (ecmascript)");
;
function isVariable(x) {
    return typeof x === 'string' && x.startsWith('?');
}
function matchVariable(variable, triplePart, context) {
    if (context.hasOwnProperty(variable)) {
        const bound = context[variable];
        return matchPart(bound, triplePart, context);
    }
    return Object.assign(Object.assign({}, context), {
        [variable]: triplePart
    });
}
function matchExact(patternPart, triplePart, context) {
    return patternPart === triplePart ? context : null;
}
function matcherForPatternPart(patternPart) {
    switch(typeof patternPart){
        case 'string':
            return patternPart.startsWith('?') ? matchVariable : matchExact;
        default:
            return matchExact;
    }
}
const validArgMapProps = [
    'in',
    '$in',
    '$not',
    '$isNull',
    '$comparator'
];
// Checks if an object is an args map
function isArgsMap(patternPart) {
    for (const prop of validArgMapProps){
        if (patternPart.hasOwnProperty(prop)) {
            return true;
        }
    }
    return false;
}
function matchPart(patternPart, triplePart, context) {
    if (!context) return null;
    if (typeof patternPart === 'object') {
        // This is an args map, so we'll have already fitered the triples
        // in `getRelevantTriples`
        if (isArgsMap(patternPart)) {
            return context;
        }
        return null;
    }
    const matcher = matcherForPatternPart(patternPart);
    return matcher(patternPart, triplePart, context);
}
function matchPattern(pattern, triple, context) {
    return pattern.reduce((context, patternPart, idx)=>{
        const triplePart = triple[idx];
        return matchPart(patternPart, triplePart, context);
    }, context);
}
function querySingle(store, pattern, context) {
    return relevantTriples(store, pattern, context).map((triple)=>matchPattern(pattern, triple, context)).filter((x)=>x);
}
// 3. queryWhere
function queryPattern(store, pattern, contexts) {
    if (pattern.or) {
        return pattern.or.patterns.flatMap((patterns)=>{
            return queryWhere(store, patterns, contexts);
        });
    }
    if (pattern.and) {
        return pattern.and.patterns.reduce((contexts, patterns)=>{
            return queryWhere(store, patterns, contexts);
        }, contexts);
    }
    return contexts.flatMap((context)=>querySingle(store, pattern, context));
}
function queryWhere(store, patterns, contexts = [
    {}
]) {
    return patterns.reduce((contexts, pattern)=>{
        return queryPattern(store, pattern, contexts);
    }, contexts);
}
// 4. query
function actualize(context, find) {
    if (Array.isArray(find)) {
        return find.map((findPart)=>actualize(context, findPart));
    }
    return isVariable(find) ? context[find] : find;
}
function query(store, { find, where }) {
    const contexts = queryWhere(store, where);
    return contexts.map((context)=>actualize(context, find));
}
// 5. Index
function relevantTriples(store, pattern, context) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTriples"])(store, actualize(context, pattern));
} //# sourceMappingURL=datalog.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/uuid.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "uuidCompare",
    ()=>uuidCompare
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$uuid$2f$dist$2f$esm$2f$v4$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/uuid/dist/esm/v4.js [app-route] (ecmascript) <export default as v4>");
;
function uuidToByteArray(uuid) {
    const hex = uuid.replace(/-/g, '');
    const bytes = [];
    for(let i = 0; i < hex.length; i += 2){
        bytes.push(parseInt(hex.substring(i, i + 2), 16));
    }
    return bytes;
}
function compareByteArrays(a, b) {
    for(let i = 0; i < a.length; i++){
        if (a[i] < b[i]) return -1;
        if (a[i] > b[i]) return 1;
    }
    return 0;
}
function uuidCompare(uuid_a, uuid_b) {
    return compareByteArrays(uuidToByteArray(uuid_a), uuidToByteArray(uuid_b));
}
function id() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$uuid$2f$dist$2f$esm$2f$v4$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])();
}
const __TURBOPACK__default__export__ = id;
 //# sourceMappingURL=uuid.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/strings.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "stringCompare",
    ()=>stringCompare
]);
function fallbackCompareStrings(a, b) {
    return a.localeCompare(b);
}
function makeCompareStringsFn() {
    let compareStrings = fallbackCompareStrings;
    if (typeof Intl === 'object' && Intl.hasOwnProperty('Collator')) {
        try {
            const collator = Intl.Collator('en-US');
            compareStrings = collator.compare;
        } catch (_e) {}
    }
    return compareStrings;
}
const stringCompare = makeCompareStringsFn(); //# sourceMappingURL=strings.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/instaql.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compareOrder",
    ()=>compareOrder,
    "default",
    ()=>query
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$datalog$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/datalog.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/uuid.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$strings$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/strings.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/store.js [app-route] (ecmascript)");
;
;
;
;
// Pattern variables
// -----------------
let _seed = 0;
function wildcard(friendlyName) {
    return makeVarImpl(`_${friendlyName}`, _seed++);
}
function makeVarImpl(x, level) {
    return `?${x}-${level}`;
}
// Where
// -----------------
class AttrNotFoundError extends Error {
    constructor(message){
        super(message);
        this.name = 'AttrNotFoundError';
    }
}
function idAttr(store, ns) {
    const attr = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPrimaryKeyAttr"](store, ns);
    if (!attr) {
        throw new AttrNotFoundError(`Could not find id attr for ${ns}`);
    }
    return attr;
}
function defaultWhere(makeVar, store, etype, level) {
    return [
        eidWhere(makeVar, store, etype, level)
    ];
}
function eidWhere(makeVar, store, etype, level) {
    return [
        makeVar(etype, level),
        idAttr(store, etype).id,
        makeVar(etype, level),
        makeVar('time', level)
    ];
}
function replaceInAttrPat(attrPat, needle, v) {
    return attrPat.map((x)=>x === needle ? v : x);
}
function refAttrPat(makeVar, store, etype, level, label) {
    const fwdAttr = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAttrByFwdIdentName"](store, etype, label);
    const revAttr = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAttrByReverseIdentName"](store, etype, label);
    const attr = fwdAttr || revAttr;
    if (!attr) {
        throw new AttrNotFoundError(`Could not find attr for ${[
            etype,
            label
        ]}`);
    }
    if (attr['value-type'] !== 'ref') {
        throw new Error(`Attr ${attr.id} is not a ref`);
    }
    const [_f, fwdEtype] = attr['forward-identity'];
    const [_r, revEtype] = attr['reverse-identity'];
    const nextLevel = level + 1;
    const attrPat = fwdAttr ? [
        makeVar(fwdEtype, level),
        attr.id,
        makeVar(revEtype, nextLevel),
        wildcard('time')
    ] : [
        makeVar(fwdEtype, nextLevel),
        attr.id,
        makeVar(revEtype, level),
        wildcard('time')
    ];
    const nextEtype = fwdAttr ? revEtype : fwdEtype;
    const isForward = Boolean(fwdAttr);
    return [
        nextEtype,
        nextLevel,
        attrPat,
        attr,
        isForward
    ];
}
function makeLikeMatcher(caseSensitive, pattern) {
    if (typeof pattern !== 'string') {
        return function likeMatcher(_value) {
            return false;
        };
    }
    const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexPattern = escapedPattern.replace(/%/g, '.*').replace(/_/g, '.');
    const regex = new RegExp(`^${regexPattern}$`, caseSensitive ? undefined : 'i');
    return function likeMatcher(value) {
        if (typeof value !== 'string') {
            return false;
        }
        return regex.test(value);
    };
}
function parseValue(attr, v) {
    if (typeof v !== 'object' || v.hasOwnProperty('$in') || v.hasOwnProperty('in')) {
        return v;
    }
    const isDate = attr['checked-data-type'] === 'date';
    if (v.hasOwnProperty('$gt')) {
        return {
            $comparator: true,
            $op: isDate ? function gtDate(triple) {
                return new Date(triple[2]) > new Date(v.$gt);
            } : function gt(triple) {
                return triple[2] > v.$gt;
            }
        };
    }
    if (v.hasOwnProperty('$gte')) {
        return {
            $comparator: true,
            $op: isDate ? function gteDate(triple) {
                return new Date(triple[2]) >= new Date(v.$gte);
            } : function gte(triple) {
                return triple[2] >= v.$gte;
            }
        };
    }
    if (v.hasOwnProperty('$lt')) {
        return {
            $comparator: true,
            $op: isDate ? function ltDate(triple) {
                return new Date(triple[2]) < new Date(v.$lt);
            } : function lt(triple) {
                return triple[2] < v.$lt;
            }
        };
    }
    if (v.hasOwnProperty('$lte')) {
        return {
            $comparator: true,
            $op: isDate ? function lteDate(triple) {
                return new Date(triple[2]) <= new Date(v.$lte);
            } : function lte(triple) {
                return triple[2] <= v.$lte;
            }
        };
    }
    if (v.hasOwnProperty('$like')) {
        const matcher = makeLikeMatcher(true, v.$like);
        return {
            $comparator: true,
            $op: function like(triple) {
                return matcher(triple[2]);
            }
        };
    }
    if (v.hasOwnProperty('$ilike')) {
        const matcher = makeLikeMatcher(false, v.$ilike);
        return {
            $comparator: true,
            $op: function ilike(triple) {
                return matcher(triple[2]);
            }
        };
    }
    return v;
}
function valueAttrPat(makeVar, store, valueEtype, valueLevel, valueLabel, v) {
    const fwdAttr = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAttrByFwdIdentName"](store, valueEtype, valueLabel);
    const revAttr = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAttrByReverseIdentName"](store, valueEtype, valueLabel);
    const attr = fwdAttr || revAttr;
    if (!attr) {
        throw new AttrNotFoundError(`No attr for etype = ${valueEtype} label = ${valueLabel}`);
    }
    if (v === null || v === void 0 ? void 0 : v.hasOwnProperty('$isNull')) {
        const idAttr = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAttrByFwdIdentName"](store, valueEtype, 'id');
        if (!idAttr) {
            throw new AttrNotFoundError(`No attr for etype = ${valueEtype} label = id`);
        }
        return [
            makeVar(valueEtype, valueLevel),
            idAttr.id,
            {
                $isNull: {
                    attrId: attr.id,
                    isNull: v.$isNull,
                    reverse: !fwdAttr
                }
            },
            wildcard('time')
        ];
    }
    if (fwdAttr) {
        return [
            makeVar(valueEtype, valueLevel),
            attr.id,
            parseValue(attr, v),
            wildcard('time')
        ];
    }
    return [
        v,
        attr.id,
        makeVar(valueEtype, valueLevel),
        wildcard('time')
    ];
}
function refAttrPats(makeVar, store, etype, level, refsPath) {
    const [lastEtype, lastLevel, attrPats] = refsPath.reduce((acc, label)=>{
        const [etype, level, attrPats] = acc;
        const [nextEtype, nextLevel, attrPat] = refAttrPat(makeVar, store, etype, level, label);
        return [
            nextEtype,
            nextLevel,
            [
                ...attrPats,
                attrPat
            ]
        ];
    }, [
        etype,
        level,
        []
    ]);
    return [
        lastEtype,
        lastLevel,
        attrPats
    ];
}
function whereCondAttrPats(makeVar, store, etype, level, path, v) {
    const refsPath = path.slice(0, path.length - 1);
    const valueLabel = path[path.length - 1];
    const [lastEtype, lastLevel, refPats] = refAttrPats(makeVar, store, etype, level, refsPath);
    const valuePat = valueAttrPat(makeVar, store, lastEtype, lastLevel, valueLabel, v);
    return refPats.concat([
        valuePat
    ]);
}
function withJoin(where, join) {
    return join ? [
        join
    ].concat(where) : where;
}
function isOrClauses([k, v]) {
    return k === 'or' && Array.isArray(v);
}
function isAndClauses([k, v]) {
    return k === 'and' && Array.isArray(v);
}
// Creates a makeVar that will namespace symbols for or clauses
// to prevent conflicts, except for the base etype
function genMakeVar(baseMakeVar, joinSym, orIdx) {
    return (x, lvl)=>{
        const base = baseMakeVar(x, lvl);
        if (joinSym == base) {
            return base;
        }
        return `${base}-${orIdx}`;
    };
}
function parseWhereClauses(makeVar, clauseType /* 'or' | 'and' */ , store, etype, level, whereValue) {
    const joinSym = makeVar(etype, level);
    const patterns = whereValue.map((w, i)=>{
        const makeNamespacedVar = genMakeVar(makeVar, joinSym, i);
        return parseWhere(makeNamespacedVar, store, etype, level, w);
    });
    return {
        [clauseType]: {
            patterns,
            joinSym
        }
    };
}
// Given a path, returns a list of paths leading up to this path:
// growPath([1, 2, 3]) -> [[1], [1, 2], [1, 2, 3]]
function growPath(path) {
    const ret = [];
    for(let i = 1; i <= path.length; i++){
        ret.push(path.slice(0, i));
    }
    return ret;
}
// Returns array of pattern arrays that should be grouped in OR
// to capture any intermediate nulls
function whereCondAttrPatsForNullIsTrue(makeVar, store, etype, level, path) {
    return growPath(path).map((path)=>whereCondAttrPats(makeVar, store, etype, level, path, {
            $isNull: true
        }));
}
function parseWhere(makeVar, store, etype, level, where) {
    return Object.entries(where).flatMap(([k, v])=>{
        if (isOrClauses([
            k,
            v
        ])) {
            return parseWhereClauses(makeVar, 'or', store, etype, level, v);
        }
        if (isAndClauses([
            k,
            v
        ])) {
            return parseWhereClauses(makeVar, 'and', store, etype, level, v);
        }
        // Temporary hack until we have support for a uuid index on `id`
        if (k === '$entityIdStartsWith') {
            return [];
        }
        const path = k.split('.');
        // Normalize $ne to $not
        if (v === null || v === void 0 ? void 0 : v.hasOwnProperty('$ne')) {
            v = Object.assign(Object.assign({}, v), {
                $not: v.$ne
            });
            delete v.$ne;
        }
        if (v === null || v === void 0 ? void 0 : v.hasOwnProperty('$not')) {
            // `$not` won't pick up entities that are missing the attr, so we
            // add in a `$isNull` to catch those too.
            const notPats = whereCondAttrPats(makeVar, store, etype, level, path, v);
            const nilPats = whereCondAttrPatsForNullIsTrue(makeVar, store, etype, level, path);
            return [
                {
                    or: {
                        patterns: [
                            notPats,
                            ...nilPats
                        ],
                        joinSym: makeVar(etype, level)
                    }
                }
            ];
        }
        if ((v === null || v === void 0 ? void 0 : v.hasOwnProperty('$isNull')) && v.$isNull === true && path.length > 1) {
            // Make sure we're capturing all of the intermediate paths that might be null
            // by checking for null at each step along the path
            return [
                {
                    or: {
                        patterns: whereCondAttrPatsForNullIsTrue(makeVar, store, etype, level, path),
                        joinSym: makeVar(etype, level)
                    }
                }
            ];
        }
        return whereCondAttrPats(makeVar, store, etype, level, path, v);
    });
}
function makeWhere(store, etype, level, where) {
    const makeVar = makeVarImpl;
    if (!where) {
        return defaultWhere(makeVar, store, etype, level);
    }
    const parsedWhere = parseWhere(makeVar, store, etype, level, where);
    return parsedWhere.concat(defaultWhere(makeVar, store, etype, level));
}
// Find
// -----------------
function makeFind(makeVar, etype, level) {
    return [
        makeVar(etype, level),
        makeVar('time', level)
    ];
}
// extendObjects
// -----------------
function makeJoin(makeVar, store, etype, level, label, eid) {
    const [nextEtype, nextLevel, pat, attr, isForward] = refAttrPat(makeVar, store, etype, level, label);
    const actualized = replaceInAttrPat(pat, makeVar(etype, level), eid);
    return [
        nextEtype,
        nextLevel,
        actualized,
        attr,
        isForward
    ];
}
function extendObjects(makeVar, store, { etype, level, form }, objects) {
    const childQueries = Object.keys(form).filter((c)=>c !== '$');
    if (!childQueries.length) {
        return Object.values(objects);
    }
    return Object.entries(objects).map(function extendChildren([eid, parent]) {
        const childResults = childQueries.map(function getChildResult(label) {
            var _a, _b, _c;
            const isSingular = Boolean(store.cardinalityInference && ((_c = (_b = (_a = store.linkIndex) === null || _a === void 0 ? void 0 : _a[etype]) === null || _b === void 0 ? void 0 : _b[label]) === null || _c === void 0 ? void 0 : _c.isSingular));
            try {
                const [nextEtype, nextLevel, join] = makeJoin(makeVar, store, etype, level, label, eid);
                const childrenArray = queryOne(store, {
                    etype: nextEtype,
                    level: nextLevel,
                    form: form[label],
                    join
                });
                const childOrChildren = isSingular ? childrenArray[0] : childrenArray;
                return {
                    [label]: childOrChildren
                };
            } catch (e) {
                if (e instanceof AttrNotFoundError) {
                    return {
                        [label]: isSingular ? undefined : []
                    };
                }
                throw e;
            }
        });
        return childResults.reduce(function reduceChildren(parent, child) {
            return Object.assign(Object.assign({}, parent), child);
        }, parent);
    });
}
// resolveObjects
// -----------------
function shouldIgnoreAttr(attrs, id) {
    const attr = attrs[id];
    return attr['value-type'] === 'ref' && attr['forward-identity'][2] !== 'id';
}
// Compares values where we already know that the two values are distinct
// and not null.
// Takes into account the data type.
function compareDisparateValues(a, b, dataType) {
    if (dataType === 'string') {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$strings$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringCompare"])(a, b);
    }
    if (a > b) {
        return 1;
    }
    return -1;
}
function compareOrder(id_a, v_a, id_b, v_b, dataType) {
    if (v_a === v_b || v_a == null && v_b == null) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuidCompare"])(id_a, id_b);
    }
    if (v_b == null) {
        return 1;
    }
    if (v_a == null) {
        return -1;
    }
    return compareDisparateValues(v_a, v_b, dataType);
}
function compareOrderTriples([id_a, v_a], [id_b, v_b], dataType) {
    return compareOrder(id_a, v_a, id_b, v_b, dataType);
}
function comparableDate(x) {
    if (x == null) {
        return x;
    }
    return new Date(x).getTime();
}
function isBefore(startCursor, orderAttr, direction, idVec) {
    var _a;
    const [c_e, _c_a, c_v, c_t] = startCursor;
    const compareVal = direction === 'desc' ? 1 : -1;
    if (((_a = orderAttr['forward-identity']) === null || _a === void 0 ? void 0 : _a[2]) === 'id') {
        return compareOrderTriples(idVec, [
            c_e,
            c_t
        ], null) === compareVal;
    }
    const [e, v] = idVec;
    const dataType = orderAttr['checked-data-type'];
    const v_new = dataType === 'date' ? comparableDate(v) : v;
    const c_v_new = dataType === 'date' ? comparableDate(c_v) : c_v;
    return compareOrderTriples([
        e,
        v_new
    ], [
        c_e,
        c_v_new
    ], dataType) === compareVal;
}
function orderAttrFromCursor(store, cursor) {
    const cursorAttrId = cursor[1];
    return store.attrs[cursorAttrId];
}
function orderAttrFromOrder(store, etype, order) {
    const label = Object.keys(order)[0];
    return __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAttrByFwdIdentName"](store, etype, label);
}
function getOrderAttr(store, etype, cursor, order) {
    if (cursor) {
        return orderAttrFromCursor(store, cursor);
    }
    if (order) {
        return orderAttrFromOrder(store, etype, order);
    }
}
function objectAttrs(store, etype, dq) {
    var _a, _b;
    if (!Array.isArray(dq.fields)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBlobAttrs"](store, etype);
    }
    const attrs = new Map();
    for (const field of dq.fields){
        const attr = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAttrByFwdIdentName"](store, etype, field);
        const label = (_a = attr === null || attr === void 0 ? void 0 : attr['forward-identity']) === null || _a === void 0 ? void 0 : _a[2];
        if (label && __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isBlob"](attr)) {
            attrs.set(label, attr);
        }
    }
    // Ensure we add the id field to avoid empty objects
    if (!attrs.has('id')) {
        const attr = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAttrByFwdIdentName"](store, etype, 'id');
        const label = (_b = attr === null || attr === void 0 ? void 0 : attr['forward-identity']) === null || _b === void 0 ? void 0 : _b[2];
        if (label) {
            attrs.set(label, attr);
        }
    }
    return attrs;
}
function runDataloadAndReturnObjects(store, { etype, pageInfo, dq, form }) {
    var _a, _b;
    const order = (_a = form === null || form === void 0 ? void 0 : form.$) === null || _a === void 0 ? void 0 : _a.order;
    const isLeadingQuery = isLeading(form);
    const direction = determineDirection(form);
    let idVecs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$datalog$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(store, dq);
    const startCursor = pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo['start-cursor'];
    const orderAttr = getOrderAttr(store, etype, startCursor, order);
    if (orderAttr && ((_b = orderAttr === null || orderAttr === void 0 ? void 0 : orderAttr['forward-identity']) === null || _b === void 0 ? void 0 : _b[2]) !== 'id') {
        const isDate = orderAttr['checked-data-type'] === 'date';
        const a = orderAttr.id;
        idVecs = idVecs.map(([id])=>{
            var _a, _b, _c, _d, _e;
            // order attr is required to be cardinality one, so there will
            // be at most one value here
            let v = (_e = (_d = (_c = (_b = (_a = store.eav.get(id)) === null || _a === void 0 ? void 0 : _a.get(a)) === null || _b === void 0 ? void 0 : _b.values()) === null || _c === void 0 ? void 0 : _c.next()) === null || _d === void 0 ? void 0 : _d.value) === null || _e === void 0 ? void 0 : _e[2];
            if (isDate) {
                v = comparableDate(v);
            }
            return [
                id,
                v
            ];
        });
    }
    idVecs.sort(direction === 'asc' ? function compareIdVecs(a, b) {
        return compareOrderTriples(a, b, orderAttr === null || orderAttr === void 0 ? void 0 : orderAttr['checked-data-type']);
    } : function compareIdVecs(a, b) {
        return compareOrderTriples(b, a, orderAttr === null || orderAttr === void 0 ? void 0 : orderAttr['checked-data-type']);
    });
    let objects = {};
    const attrs = objectAttrs(store, etype, dq);
    for (const idVec of idVecs){
        const [id] = idVec;
        if (objects[id]) {
            continue;
        }
        if (!isLeadingQuery && startCursor && orderAttr && isBefore(startCursor, orderAttr, direction, idVec)) {
            continue;
        }
        const obj = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAsObject"](store, attrs, id);
        if (obj) {
            objects[id] = obj;
        }
    }
    return objects;
}
function determineDirection(form) {
    var _a;
    const orderOpts = (_a = form.$) === null || _a === void 0 ? void 0 : _a.order;
    if (!orderOpts) {
        return 'asc';
    }
    return orderOpts[Object.keys(orderOpts)[0]] || 'asc';
}
/**
 * A "leading" query has no `offset`, `before`, or `after`
 *
 * It is at the 'beginning' of the order
 */ function isLeading(form) {
    var _a, _b, _c;
    const offset = (_a = form.$) === null || _a === void 0 ? void 0 : _a.offset;
    const before = (_b = form.$) === null || _b === void 0 ? void 0 : _b.before;
    const after = (_c = form.$) === null || _c === void 0 ? void 0 : _c.after;
    return !offset && !before && !after;
}
/**
 * Given a query like:
 *
 * {
 *   users: {
 *     $: { where: { name: "Joe" } },
 *   },
 * };
 *
 * `resolveObjects`, turns where clause: `{ name: "Joe" }`
 * into a datalog query. We then run the datalog query,
 * and reduce all the triples into objects.
 */ function resolveObjects(store, { etype, level, form, join, pageInfo }) {
    var _a, _b, _c, _d, _e;
    // Wait for server to tell us where we start if we don't start from the beginning
    if (!isLeading(form) && (!pageInfo || !pageInfo['start-cursor'])) {
        return [];
    }
    const where = withJoin(makeWhere(store, etype, level, (_a = form.$) === null || _a === void 0 ? void 0 : _a.where), join);
    const find = makeFind(makeVarImpl, etype, level);
    const fields = (_b = form.$) === null || _b === void 0 ? void 0 : _b.fields;
    const objs = runDataloadAndReturnObjects(store, {
        etype,
        pageInfo,
        form,
        dq: {
            where,
            find,
            fields
        }
    });
    const limit = ((_c = form.$) === null || _c === void 0 ? void 0 : _c.limit) || ((_d = form.$) === null || _d === void 0 ? void 0 : _d.first) || ((_e = form.$) === null || _e === void 0 ? void 0 : _e.last);
    if (limit != null) {
        if (level > 0) {
            console.warn('WARNING: Limits in child queries are only run client-side. Data returned from the server will not have a limit.');
        }
        const entries = Object.entries(objs);
        if (entries.length <= limit) {
            return objs;
        }
        return Object.fromEntries(entries.slice(0, limit));
    }
    return objs;
}
/**
 * It's possible that we query
 * for an attribute that doesn't exist yet.
 *
 * { users: { $: { where: { nonExistentProperty: "foo" } } } }
 *
 * This swallows the missing attr error and returns
 * an empty result instead
 */ function guardedResolveObjects(store, opts) {
    try {
        return resolveObjects(store, opts);
    } catch (e) {
        if (e instanceof AttrNotFoundError) {
            return {};
        }
        throw e;
    }
}
/**
 * Given a query like:
 *
 * {
 *   users: {
 *     $: { where: { name: "Joe" } },
 *     posts: {},
 *   },
 * };
 *
 * `guardResolveObjects` will return the relevant `users` objects
 * `extendObjects` will then extend each `user` object with relevant `posts`.
 */ function queryOne(store, opts) {
    const objects = guardedResolveObjects(store, opts);
    return extendObjects(makeVarImpl, store, opts, objects);
}
function formatPageInfo(pageInfo) {
    const res = {};
    for (const [k, v] of Object.entries(pageInfo)){
        res[k] = {
            startCursor: v['start-cursor'],
            endCursor: v['end-cursor'],
            hasNextPage: v['has-next-page?'],
            hasPreviousPage: v['has-previous-page?']
        };
    }
    return res;
}
function query({ store, pageInfo, aggregate }, q) {
    const data = Object.keys(q).reduce(function reduceResult(res, k) {
        if ((aggregate === null || aggregate === void 0 ? void 0 : aggregate[k]) || '$$ruleParams' === k) {
            // Aggregate doesn't return any join rows and has no children,
            // so don't bother querying further
            return res;
        }
        res[k] = queryOne(store, {
            etype: k,
            form: q[k],
            level: 0,
            pageInfo: pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo[k]
        });
        return res;
    }, {});
    const result = {
        data
    };
    if (pageInfo) {
        result.pageInfo = formatPageInfo(pageInfo);
    }
    if (aggregate) {
        result.aggregate = aggregate;
    }
    return result;
} //# sourceMappingURL=instaql.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/instatx.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getOps",
    ()=>getOps,
    "isLookup",
    ()=>isLookup,
    "lookup",
    ()=>lookup,
    "parseLookup",
    ()=>parseLookup,
    "tx",
    ()=>tx,
    "txInit",
    ()=>txInit
]);
function getAllTransactionChunkKeys() {
    const v = 1;
    const _dummy = {
        __etype: v,
        __ops: v,
        create: v,
        update: v,
        link: v,
        unlink: v,
        delete: v,
        merge: v,
        ruleParams: v
    };
    return new Set(Object.keys(_dummy));
}
const allTransactionChunkKeys = getAllTransactionChunkKeys();
function transactionChunk(etype, id, prevOps) {
    const target = {
        __etype: etype,
        __ops: prevOps
    };
    return new Proxy(target, {
        get: (_target, cmd)=>{
            if (cmd === '__ops') return prevOps;
            if (cmd === '__etype') return etype;
            if (!allTransactionChunkKeys.has(cmd)) {
                return undefined;
            }
            return (args, opts)=>{
                return transactionChunk(etype, id, [
                    ...prevOps,
                    opts ? [
                        cmd,
                        etype,
                        id,
                        args,
                        opts
                    ] : [
                        cmd,
                        etype,
                        id,
                        args
                    ]
                ]);
            };
        }
    });
}
function lookup(attribute, value) {
    return `lookup__${attribute}__${JSON.stringify(value)}`;
}
function isLookup(k) {
    return k.startsWith('lookup__');
}
function parseLookup(k) {
    const [_, attribute, ...vJSON] = k.split('__');
    return [
        attribute,
        JSON.parse(vJSON.join('__'))
    ];
}
function etypeChunk(etype) {
    return new Proxy({
        __etype: etype
    }, {
        get (_target, cmd) {
            if (cmd === '__etype') return etype;
            const id = cmd;
            if (isLookup(id)) {
                return transactionChunk(etype, parseLookup(id), []);
            }
            return transactionChunk(etype, id, []);
        }
    });
}
function txInit() {
    return new Proxy({}, {
        get (_target, ns) {
            return etypeChunk(ns);
        }
    });
}
const tx = txInit();
function getOps(x) {
    return x.__ops;
} //# sourceMappingURL=instatx.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/instaml.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAttrByFwdIdentName",
    ()=>getAttrByFwdIdentName,
    "getAttrByReverseIdentName",
    ()=>getAttrByReverseIdentName,
    "rewriteStep",
    ()=>rewriteStep,
    "transform",
    ()=>transform
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/store.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instatx$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/instatx.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/object.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$dates$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/dates.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/uuid.js [app-route] (ecmascript)");
;
;
;
;
;
function rewriteStep(attrMapping, txStep) {
    const { attrIdMap, refSwapAttrIds } = attrMapping;
    const rewritten = [];
    for (const part of txStep){
        const newValue = attrIdMap[part];
        if (newValue) {
            // Rewrites attr id
            rewritten.push(newValue);
        } else if (Array.isArray(part) && part.length == 2 && attrIdMap[part[0]]) {
            // Rewrites attr id in lookups
            const [aid, value] = part;
            rewritten.push([
                attrIdMap[aid],
                value
            ]);
        } else {
            rewritten.push(part);
        }
    }
    const [action] = txStep;
    if ((action === 'add-triple' || action === 'retract-triple') && refSwapAttrIds.has(txStep[2])) {
        // Reverse links if the optimistic link attr is backwards
        const tmp = rewritten[1];
        rewritten[1] = rewritten[3];
        rewritten[3] = tmp;
    }
    return rewritten;
}
function getAttrByFwdIdentName(attrs, inputEtype, inputIdentName) {
    return Object.values(attrs).find((attr)=>{
        const [_id, etype, label] = attr['forward-identity'];
        return etype === inputEtype && label === inputIdentName;
    });
}
function getAttrByReverseIdentName(attrs, inputEtype, inputIdentName) {
    return Object.values(attrs).find((attr)=>{
        const revIdent = attr['reverse-identity'];
        if (!revIdent) return false;
        const [_id, etype, label] = revIdent;
        return etype === inputEtype && label === inputIdentName;
    });
}
function explodeLookupRef(eid) {
    if (Array.isArray(eid)) {
        return eid;
    }
    const entries = Object.entries(eid);
    if (entries.length !== 1) {
        throw new Error('lookup must be an object with a single unique attr and value.');
    }
    return entries[0];
}
function isRefLookupIdent(attrs, etype, identName) {
    return identName.indexOf('.') !== -1 && // attr names can have `.` in them, so use the attr we find with a `.`
    // before assuming it's a ref lookup.
    !getAttrByFwdIdentName(attrs, etype, identName);
}
function extractRefLookupFwdName(identName) {
    const [fwdName, idIdent, ...rest] = identName.split('.');
    if (rest.length > 0 || idIdent !== 'id') {
        throw new Error(`${identName} is not a valid lookup attribute.`);
    }
    return fwdName;
}
function lookupIdentToAttr(attrs, etype, identName) {
    if (!isRefLookupIdent(attrs, etype, identName)) {
        return getAttrByFwdIdentName(attrs, etype, identName);
    }
    const fwdName = extractRefLookupFwdName(identName);
    const refAttr = getAttrByFwdIdentName(attrs, etype, fwdName) || getAttrByReverseIdentName(attrs, etype, fwdName);
    if (refAttr && refAttr['value-type'] !== 'ref') {
        throw new Error(`${identName} does not reference a valid link attribute.`);
    }
    return refAttr;
}
// Returns [attr, value] for the eid if the eid is a lookup.
// If it's a regular eid, returns null
function lookupPairOfEid(eid) {
    if (typeof eid === 'string' && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instatx$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isLookup"])(eid)) {
        return null;
    }
    return typeof eid === 'string' && (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instatx$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isLookup"])(eid) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instatx$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseLookup"])(eid) : explodeLookupRef(eid);
}
function extractLookup(attrs, etype, eid) {
    const lookupPair = lookupPairOfEid(eid);
    if (lookupPair === null) {
        return eid;
    }
    const [identName, value] = lookupPair;
    const attr = lookupIdentToAttr(attrs, etype, identName);
    if (!attr || !attr['unique?']) {
        throw new Error(`${identName} is not a unique attribute.`);
    }
    return [
        attr.id,
        value
    ];
}
function withIdAttrForLookup(attrs, etype, eidA, txSteps) {
    const lookup = extractLookup(attrs, etype, eidA);
    if (!Array.isArray(lookup)) {
        return txSteps;
    }
    const idTuple = [
        'add-triple',
        lookup,
        getAttrByFwdIdentName(attrs, etype, 'id').id,
        lookup
    ];
    return [
        idTuple
    ].concat(txSteps);
}
function expandLink({ attrs }, [etype, eidA, obj]) {
    const addTriples = Object.entries(obj).flatMap(([label, eidOrEids])=>{
        const eids = Array.isArray(eidOrEids) ? eidOrEids : [
            eidOrEids
        ];
        const fwdAttr = getAttrByFwdIdentName(attrs, etype, label);
        const revAttr = getAttrByReverseIdentName(attrs, etype, label);
        return eids.map((eidB)=>{
            const txStep = fwdAttr ? [
                'add-triple',
                extractLookup(attrs, etype, eidA),
                fwdAttr.id,
                extractLookup(attrs, fwdAttr['reverse-identity'][1], eidB)
            ] : [
                'add-triple',
                extractLookup(attrs, revAttr['forward-identity'][1], eidB),
                revAttr.id,
                extractLookup(attrs, etype, eidA)
            ];
            return txStep;
        });
    });
    return withIdAttrForLookup(attrs, etype, eidA, addTriples);
}
function expandUnlink({ attrs }, [etype, eidA, obj]) {
    const retractTriples = Object.entries(obj).flatMap(([label, eidOrEids])=>{
        const eids = Array.isArray(eidOrEids) ? eidOrEids : [
            eidOrEids
        ];
        const fwdAttr = getAttrByFwdIdentName(attrs, etype, label);
        const revAttr = getAttrByReverseIdentName(attrs, etype, label);
        return eids.map((eidB)=>{
            const txStep = fwdAttr ? [
                'retract-triple',
                extractLookup(attrs, etype, eidA),
                fwdAttr.id,
                extractLookup(attrs, fwdAttr['reverse-identity'][1], eidB)
            ] : [
                'retract-triple',
                extractLookup(attrs, revAttr['forward-identity'][1], eidB),
                revAttr.id,
                extractLookup(attrs, etype, eidA)
            ];
            return txStep;
        });
    });
    return withIdAttrForLookup(attrs, etype, eidA, retractTriples);
}
function checkEntityExists(stores, etype, eid) {
    if (Array.isArray(eid)) {
        // lookup ref
        const [entity_a, entity_v] = eid;
        for (const store of stores || []){
            const ev = store === null || store === void 0 ? void 0 : store.aev.get(entity_a);
            if (ev) {
                // This would be a lot more efficient with a ave index
                for (const [e_, a_, v] of (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["allMapValues"])(ev, 2)){
                    if (v === entity_v) {
                        return true;
                    }
                }
            }
        }
    } else {
        // eid
        for (const store of stores || []){
            const av = store === null || store === void 0 ? void 0 : store.eav.get(eid);
            if (av) {
                for (const attr_id of av.keys()){
                    if (store.attrs[attr_id]['forward-identity'][1] == etype) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}
function convertOpts({ stores, attrs }, [etype, eid, obj_, opts]) {
    return (opts === null || opts === void 0 ? void 0 : opts.upsert) === false ? {
        mode: 'update'
    } : (opts === null || opts === void 0 ? void 0 : opts.upsert) === true ? null : checkEntityExists(stores, etype, eid) ? {
        mode: 'update'
    } : null; // auto mode chooses between update and upsert, not update and create, just in case
}
function expandCreate(ctx, step) {
    const { stores, attrs } = ctx;
    const [etype, eid, obj_, opts] = step;
    const obj = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["immutableRemoveUndefined"])(obj_);
    const lookup = extractLookup(attrs, etype, eid);
    // id first so that we don't clobber updates on the lookup field
    const attrTuples = [
        [
            'id',
            lookup
        ]
    ].concat(Object.entries(obj)).map(([identName, value])=>{
        const attr = getAttrByFwdIdentName(attrs, etype, identName);
        if (attr['checked-data-type'] === 'date' && ctx.useDateObjects) {
            value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$dates$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["coerceToDate"])(value);
        }
        return [
            'add-triple',
            lookup,
            attr.id,
            value,
            {
                mode: 'create'
            }
        ];
    });
    return attrTuples;
}
function expandUpdate(ctx, step) {
    const { stores, attrs } = ctx;
    const [etype, eid, obj_, opts] = step;
    const obj = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["immutableRemoveUndefined"])(obj_);
    const lookup = extractLookup(attrs, etype, eid);
    const serverOpts = convertOpts(ctx, [
        etype,
        lookup,
        obj_,
        opts
    ]);
    // id first so that we don't clobber updates on the lookup field
    const attrTuples = [
        [
            'id',
            lookup
        ]
    ].concat(Object.entries(obj)).map(([identName, value])=>{
        const attr = getAttrByFwdIdentName(attrs, etype, identName);
        if (attr['checked-data-type'] === 'date' && ctx.useDateObjects) {
            value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$dates$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["coerceToDate"])(value);
        }
        return [
            'add-triple',
            lookup,
            attr.id,
            value,
            ...serverOpts ? [
                serverOpts
            ] : []
        ];
    });
    return attrTuples;
}
function expandDelete({ attrs }, [etype, eid]) {
    const lookup = extractLookup(attrs, etype, eid);
    return [
        [
            'delete-entity',
            lookup,
            etype
        ]
    ];
}
function expandDeepMerge(ctx, step) {
    const { stores, attrs } = ctx;
    const [etype, eid, obj_, opts] = step;
    const obj = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["immutableRemoveUndefined"])(obj_);
    const lookup = extractLookup(attrs, etype, eid);
    const serverOpts = convertOpts(ctx, [
        etype,
        lookup,
        obj_,
        opts
    ]);
    const attrTuples = Object.entries(obj).map(([identName, value])=>{
        const attr = getAttrByFwdIdentName(attrs, etype, identName);
        return [
            'deep-merge-triple',
            lookup,
            attr.id,
            value,
            ...serverOpts ? [
                serverOpts
            ] : []
        ];
    });
    const idTuple = [
        'add-triple',
        lookup,
        getAttrByFwdIdentName(attrs, etype, 'id').id,
        lookup,
        ...serverOpts ? [
            serverOpts
        ] : []
    ];
    // id first so that we don't clobber updates on the lookup field
    return [
        idTuple
    ].concat(attrTuples);
}
function expandRuleParams({ attrs }, [etype, eid, ruleParams]) {
    const lookup = extractLookup(attrs, etype, eid);
    return [
        [
            'rule-params',
            lookup,
            etype,
            ruleParams
        ]
    ];
}
function removeIdFromArgs(step) {
    const [op, etype, eid, obj, opts] = step;
    if (!obj) {
        return step;
    }
    const newObj = Object.assign({}, obj);
    delete newObj.id;
    return [
        op,
        etype,
        eid,
        newObj,
        ...opts ? [
            opts
        ] : []
    ];
}
function toTxSteps(ctx, step) {
    const [action, ...args] = removeIdFromArgs(step);
    switch(action){
        case 'merge':
            return expandDeepMerge(ctx, args);
        case 'create':
            return expandCreate(ctx, args);
        case 'update':
            return expandUpdate(ctx, args);
        case 'link':
            return expandLink(ctx, args);
        case 'unlink':
            return expandUnlink(ctx, args);
        case 'delete':
            return expandDelete(ctx, args);
        case 'ruleParams':
            return expandRuleParams(ctx, args);
        default:
            throw new Error(`unsupported action ${action}`);
    }
}
// ---------
// transform
function checkedDataTypeOfValueType(valueType) {
    switch(valueType){
        case 'string':
        case 'date':
        case 'boolean':
        case 'number':
            return valueType;
        default:
            return undefined;
    }
}
function objectPropsFromSchema(schema, etype, label) {
    var _a, _b;
    const attr = (_b = (_a = schema.entities[etype]) === null || _a === void 0 ? void 0 : _a.attrs) === null || _b === void 0 ? void 0 : _b[label];
    if (label === 'id') return null;
    if (!attr) {
        throw new Error(`${etype}.${label} does not exist in your schema`);
    }
    const { unique, indexed } = attr === null || attr === void 0 ? void 0 : attr.config;
    const checkedDataType = checkedDataTypeOfValueType(attr === null || attr === void 0 ? void 0 : attr.valueType);
    return {
        'index?': indexed,
        'unique?': unique,
        'checked-data-type': checkedDataType
    };
}
function createObjectAttr(schema, etype, label, props) {
    const schemaObjectProps = schema ? objectPropsFromSchema(schema, etype, label) : null;
    const attrId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    const fwdIdentId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    const fwdIdent = [
        fwdIdentId,
        etype,
        label
    ];
    return Object.assign(Object.assign({
        id: attrId,
        'forward-identity': fwdIdent,
        'value-type': 'blob',
        cardinality: 'one',
        'unique?': false,
        'index?': false,
        isUnsynced: true
    }, schemaObjectProps || {}), props || {});
}
function findSchemaLink(schema, etype, label) {
    const found = Object.values(schema.links).find((x)=>{
        return x.forward.on === etype && x.forward.label === label || x.reverse.on === etype && x.reverse.label === label;
    });
    return found;
}
function refPropsFromSchema(schema, etype, label) {
    const found = findSchemaLink(schema, etype, label);
    if (!found) {
        throw new Error(`Couldn't find the link ${etype}.${label} in your schema`);
    }
    const { forward, reverse } = found;
    return {
        'forward-identity': [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(),
            forward.on,
            forward.label
        ],
        'reverse-identity': [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(),
            reverse.on,
            reverse.label
        ],
        cardinality: forward.has === 'one' ? 'one' : 'many',
        'unique?': reverse.has === 'one',
        'on-delete': forward.onDelete,
        'on-delete-reverse': reverse.onDelete
    };
}
function createRefAttr(schema, etype, label, props) {
    const schemaRefProps = schema ? refPropsFromSchema(schema, etype, label) : null;
    const attrId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    const fwdIdent = [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(),
        etype,
        label
    ];
    const revIdent = [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(),
        label,
        etype
    ];
    return Object.assign(Object.assign({
        id: attrId,
        'forward-identity': fwdIdent,
        'reverse-identity': revIdent,
        'value-type': 'ref',
        cardinality: 'many',
        'unique?': false,
        'index?': false,
        isUnsynced: true
    }, schemaRefProps || {}), props || {});
}
// Actions that have an object, e.g. not delete
const OBJ_ACTIONS = new Set([
    'create',
    'update',
    'merge',
    'link',
    'unlink'
]);
const REF_ACTIONS = new Set([
    'link',
    'unlink'
]);
const UPDATE_ACTIONS = new Set([
    'create',
    'update',
    'merge'
]);
const SUPPORTS_LOOKUP_ACTIONS = new Set([
    'link',
    'unlink',
    'create',
    'update',
    'merge',
    'delete',
    'ruleParams'
]);
const lookupProps = {
    'unique?': true,
    'index?': true
};
const refLookupProps = Object.assign(Object.assign({}, lookupProps), {
    cardinality: 'one'
});
function lookupPairsOfOp(op) {
    const res = [];
    const [action, etype, eid, obj] = op;
    if (!SUPPORTS_LOOKUP_ACTIONS.has(action)) {
        return res;
    }
    const eidLookupPair = lookupPairOfEid(eid);
    if (eidLookupPair) {
        res.push({
            etype: etype,
            lookupPair: eidLookupPair
        });
    }
    if (action === 'link') {
        for (const [label, eidOrEids] of Object.entries(obj)){
            const eids = Array.isArray(eidOrEids) ? eidOrEids : [
                eidOrEids
            ];
            for (const linkEid of eids){
                const linkEidLookupPair = lookupPairOfEid(linkEid);
                if (linkEidLookupPair) {
                    res.push({
                        etype: etype,
                        lookupPair: linkEidLookupPair,
                        linkLabel: label
                    });
                }
            }
        }
    }
    return res;
}
function createMissingAttrs({ attrs: existingAttrs, schema }, ops) {
    var _a, _b;
    const [addedIds, attrs, addOps] = [
        new Set(),
        Object.assign({}, existingAttrs),
        []
    ];
    function addAttr(attr) {
        attrs[attr.id] = attr;
        addOps.push([
            'add-attr',
            attr
        ]);
        addedIds.add(attr.id);
    }
    function addUnsynced(attr) {
        if ((attr === null || attr === void 0 ? void 0 : attr.isUnsynced) && !addedIds.has(attr.id)) {
            addOps.push([
                'add-attr',
                attr
            ]);
            addedIds.add(attr.id);
        }
    }
    // Adds attrs needed for a ref lookup
    function addForRef(etype, label) {
        const fwdAttr = getAttrByFwdIdentName(attrs, etype, label);
        const revAttr = getAttrByReverseIdentName(attrs, etype, label);
        addUnsynced(fwdAttr);
        addUnsynced(revAttr);
        if (!fwdAttr && !revAttr) {
            addAttr(createRefAttr(schema, etype, label, refLookupProps));
        }
    }
    // Create attrs for lookups if we need to
    // Do these first because otherwise we might add a non-unique attr
    // before we get to it
    for (const op of ops){
        for (const { etype, lookupPair, linkLabel } of lookupPairsOfOp(op)){
            const identName = lookupPair[0];
            // We got a link eid that's a lookup, linkLabel is the label of the ident,
            // e.g. `posts` in `link({posts: postIds})`
            if (linkLabel) {
                // Add our ref attr, e.g. users.posts
                addForRef(etype, linkLabel);
                // Figure out the link etype so we can make sure we have the attrs
                // for the link lookup
                const fwdAttr = getAttrByFwdIdentName(attrs, etype, linkLabel);
                const revAttr = getAttrByReverseIdentName(attrs, etype, linkLabel);
                addUnsynced(fwdAttr);
                addUnsynced(revAttr);
                const linkEtype = ((_a = fwdAttr === null || fwdAttr === void 0 ? void 0 : fwdAttr['reverse-identity']) === null || _a === void 0 ? void 0 : _a[1]) || ((_b = revAttr === null || revAttr === void 0 ? void 0 : revAttr['forward-identity']) === null || _b === void 0 ? void 0 : _b[1]) || linkLabel;
                if (isRefLookupIdent(attrs, linkEtype, identName)) {
                    addForRef(linkEtype, extractRefLookupFwdName(identName));
                } else {
                    const attr = getAttrByFwdIdentName(attrs, linkEtype, identName);
                    if (!attr) {
                        addAttr(createObjectAttr(schema, linkEtype, identName, lookupProps));
                    }
                    addUnsynced(attr);
                }
            } else if (isRefLookupIdent(attrs, etype, identName)) {
                addForRef(etype, extractRefLookupFwdName(identName));
            } else {
                const attr = getAttrByFwdIdentName(attrs, etype, identName);
                if (!attr) {
                    addAttr(createObjectAttr(schema, etype, identName, lookupProps));
                }
                addUnsynced(attr);
            }
        }
    }
    // Create object and ref attrs
    for (const op of ops){
        const [action, etype, eid, obj] = op;
        if (OBJ_ACTIONS.has(action)) {
            const idAttr = getAttrByFwdIdentName(attrs, etype, 'id');
            addUnsynced(idAttr);
            if (!idAttr) {
                addAttr(createObjectAttr(schema, etype, 'id', {
                    'unique?': true
                }));
            }
            for (const label of Object.keys(obj)){
                const fwdAttr = getAttrByFwdIdentName(attrs, etype, label);
                addUnsynced(fwdAttr);
                if (UPDATE_ACTIONS.has(action)) {
                    if (!fwdAttr) {
                        addAttr(createObjectAttr(schema, etype, label, label === 'id' ? {
                            'unique?': true
                        } : null));
                    }
                }
                if (REF_ACTIONS.has(action)) {
                    const revAttr = getAttrByReverseIdentName(attrs, etype, label);
                    if (!fwdAttr && !revAttr) {
                        addAttr(createRefAttr(schema, etype, label));
                    }
                    addUnsynced(revAttr);
                }
            }
        }
    }
    return [
        attrs,
        addOps
    ];
}
function transform(ctx, inputChunks) {
    const chunks = Array.isArray(inputChunks) ? inputChunks : [
        inputChunks
    ];
    const ops = chunks.flatMap((tx)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instatx$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOps"])(tx));
    const [newAttrs, addAttrTxSteps] = createMissingAttrs(ctx, ops);
    const newCtx = Object.assign(Object.assign({}, ctx), {
        attrs: newAttrs
    });
    const txSteps = ops.flatMap((op)=>toTxSteps(newCtx, op));
    return [
        ...addAttrTxSteps,
        ...txSteps
    ];
} //# sourceMappingURL=instaml.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/PersistedObject.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// PersistedObjects save data outside of memory.
//
// When we load a persisted object, it's possible we call `set`
// before we finish loading. To address we handle set in two ways:
//
// 1. Before load
// We simply update currentValue in memory
//
// 2. After load
// We update currentValue in memory and in storage
//
// Each PersistedObject provides it's own `onMerge`
// function to handle the merge of data from storage and memory
// on load
__turbopack_context__.s([
    "META_KEY",
    ()=>META_KEY,
    "PersistedObject",
    ()=>PersistedObject,
    "StorageInterface",
    ()=>StorageInterface
]);
// Uses `requestIdleCallback` if available, otherwise calls the
// callback immediately
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$mutative$2f$dist$2f$mutative$2e$esm$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/mutative/dist/mutative.esm.mjs [app-route] (ecmascript)");
var __awaiter = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
;
function safeIdleCallback(cb, timeout) {
    if (typeof requestIdleCallback === 'undefined') {
        cb();
    } else {
        requestIdleCallback(cb, {
            timeout
        });
    }
}
const META_KEY = '__meta';
class StorageInterface {
    constructor(appId, storeName){}
}
class PersistedObject {
    constructor(opts){
        var _a, _b;
        this._subs = [];
        this._nextSave = null;
        this._nextGc = null;
        this._pendingSaveKeys = new Set();
        this._loadedKeys = new Set();
        this._version = 0;
        this._meta = {
            isLoading: true,
            onLoadCbs: [],
            value: null,
            error: null,
            attempts: 0
        };
        this._persister = opts.persister;
        this._merge = opts.merge;
        this.serialize = opts.serialize;
        this.parse = opts.parse;
        this._objectSize = opts.objectSize;
        this._log = opts.logger;
        this._saveThrottleMs = (_a = opts.saveThrottleMs) !== null && _a !== void 0 ? _a : 100;
        this._idleCallbackMaxWaitMs = (_b = opts.idleCallbackMaxWaitMs) !== null && _b !== void 0 ? _b : 1000;
        this._gcOpts = opts.gc;
        this.currentValue = {};
        this._loadedKeys = new Set();
        this._loadingKeys = {};
        this._initMeta();
        if (opts.preloadEntryCount) {
            this._preloadEntries(opts.preloadEntryCount);
        }
    }
    _initMeta() {
        return __awaiter(this, void 0, void 0, function*() {
            var _a, _b, _c;
            if (this._meta.loadingPromise) {
                yield this._meta.loadingPromise;
            }
            try {
                const p = this._persister.getItem(META_KEY);
                this._meta.loadingPromise = p;
                const v = yield p;
                this._meta.isLoading = false;
                this._meta.error = null;
                this._meta.loadingPromise = null;
                this._meta.attempts = 0;
                const existingObjects = (_b = (_a = this._meta.value) === null || _a === void 0 ? void 0 : _a.objects) !== null && _b !== void 0 ? _b : {};
                const value = v !== null && v !== void 0 ? v : {};
                const objects = (_c = value.objects) !== null && _c !== void 0 ? _c : {};
                // Merge the values from storage with in-memory values
                this._meta.value = Object.assign(Object.assign({}, value), {
                    objects: Object.assign(Object.assign({}, existingObjects), objects)
                });
            } catch (e) {
                this._meta.error = e;
                this._meta.attempts++;
                this._meta.loadingPromise = null;
            }
        });
    }
    _getMeta() {
        return __awaiter(this, void 0, void 0, function*() {
            if (this._meta.value) {
                return this._meta.value;
            }
            if (this._meta.loadingPromise) {
                yield this._meta.loadingPromise;
                return this._meta.value;
            }
            this._initMeta();
            yield this._meta.loadingPromise;
            return this._meta.value;
        });
    }
    _refreshMeta() {
        return __awaiter(this, void 0, void 0, function*() {
            yield this._initMeta();
            return this._meta.value;
        });
    }
    _preloadEntries(n) {
        return __awaiter(this, void 0, void 0, function*() {
            const meta = yield this.waitForMetaToLoad();
            if (!meta) return;
            const entries = Object.entries(meta.objects);
            entries.sort(([_k_a, a_meta], [_k_b, b_meta])=>{
                return b_meta.updatedAt - a_meta.updatedAt;
            });
            for (const [k] of entries.slice(0, n)){
                this._loadKey(k);
            }
        });
    }
    _getFromStorage(key) {
        return __awaiter(this, void 0, void 0, function*() {
            try {
                const data = yield this._persister.getItem(key);
                if (!data) {
                    return data;
                }
                const parsed = this.parse(key, data);
                return parsed;
            } catch (e) {
                console.error(`Unable to read from storage for key=${key}`, e);
                return null;
            }
        });
    }
    waitForKeyToLoad(k) {
        return __awaiter(this, void 0, void 0, function*() {
            if (this._loadedKeys.has(k)) {
                return this.currentValue[k];
            }
            yield this._loadingKeys[k] || this._loadKey(k);
            return this.currentValue[k];
        });
    }
    // Used for tests
    waitForMetaToLoad() {
        return __awaiter(this, void 0, void 0, function*() {
            return this._getMeta();
        });
    }
    // Unloads the key so that it can be garbage collected, but does not
    // delete it. Removes the key from currentValue.
    unloadKey(k) {
        this._loadedKeys.delete(k);
        delete this._loadingKeys[k];
        delete this.currentValue[k];
    }
    _loadKey(k) {
        return __awaiter(this, void 0, void 0, function*() {
            if (this._loadedKeys.has(k) || k in this._loadingKeys) return;
            const p = this._getFromStorage(k);
            this._loadingKeys[k] = p;
            const value = yield p;
            delete this._loadingKeys[k];
            this._loadedKeys.add(k);
            if (value) {
                const merged = this._merge(k, value, this.currentValue[k]);
                if (merged) {
                    this.currentValue[k] = merged;
                }
            }
            this.onKeyLoaded && this.onKeyLoaded(k);
        });
    }
    // Returns a promise with a number so that we can wait for flush
    // to finish in the tests. The number is the number of operations
    // it performed, but it's mostly there so that typescript will warn
    // us if we forget to retun the promise from the function.
    _writeToStorage(opts) {
        var _a, _b;
        const promises = [];
        const skipGc = opts === null || opts === void 0 ? void 0 : opts.skipGc;
        if (this._meta.isLoading) {
            // Wait for meta to load and try again, give it a delay so that
            // we don't spend too much time retrying
            const p = new Promise((resolve, reject)=>{
                var _a;
                setTimeout(()=>this._enqueuePersist(opts ? Object.assign(Object.assign({}, opts), {
                        attempts: (opts.attempts || 0) + 1
                    }) : {
                        attempts: 1
                    }).then(resolve).catch(reject), 10 + ((_a = opts === null || opts === void 0 ? void 0 : opts.attempts) !== null && _a !== void 0 ? _a : 0) * 1000);
            });
            promises.push(p);
            return Promise.all(promises).then((vs)=>vs.reduce((acc, x)=>acc + x, 0));
        }
        const metaValue = this._meta.value;
        if (!metaValue) {
            // If it's not loading and we don't have the data, then there
            // must be an error and we're not going to be able to save until
            // the error is resolved elsewhere.
            return Promise.resolve(0);
        }
        const keysToDelete = [];
        const keysToUpdate = [];
        for (const k of this._pendingSaveKeys){
            if (!(k in this.currentValue)) {
                keysToDelete.push(k);
                delete metaValue.objects[k];
            } else {
                keysToUpdate.push(k);
            }
        }
        for (const k of keysToDelete){
            const p = this._persister.removeItem(k);
            promises.push(p.then(()=>1));
            this._loadedKeys.delete(k);
            this._pendingSaveKeys.delete(k);
        }
        const keysToLoad = [];
        const kvPairs = [
            [
                META_KEY,
                metaValue
            ]
        ];
        const metaObjects = (_a = metaValue.objects) !== null && _a !== void 0 ? _a : {};
        metaValue.objects = metaObjects;
        for (const k of keysToUpdate){
            if (this._loadedKeys.has(k)) {
                const serializedV = this.serialize(k, this.currentValue[k]);
                kvPairs.push([
                    k,
                    serializedV
                ]);
                const size = this._objectSize(serializedV);
                const m = (_b = metaObjects[k]) !== null && _b !== void 0 ? _b : {
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    size
                };
                m.updatedAt = Date.now();
                m.size = size;
                metaObjects[k] = m;
                this._pendingSaveKeys.delete(k);
            } else {
                keysToLoad.push(k);
            }
        }
        const p = this._persister.multiSet(kvPairs);
        promises.push(p.then(()=>1));
        // For the keys that haven't loaded, load the key then try
        // persisting again. We don't want to do any async work here
        // or else we might end up saving older copies of the data to
        // the store.
        for (const k of keysToLoad){
            const p = this._loadKey(k).then(()=>this._enqueuePersist(opts));
            promises.push(p);
        }
        if (!skipGc) {
            this.gc();
        }
        return Promise.all(promises).then((vs)=>{
            return vs.reduce((acc, x)=>acc + x, 0);
        });
    }
    flush() {
        return __awaiter(this, void 0, void 0, function*() {
            if (!this._nextSave) {
                return;
            }
            clearTimeout(this._nextSave);
            this._nextSave = null;
            const p = this._writeToStorage();
            return p;
        });
    }
    _gc() {
        return __awaiter(this, void 0, void 0, function*() {
            if (!this._gcOpts) {
                return;
            }
            const keys = new Set((yield this._persister.getAllKeys()));
            keys.delete(META_KEY);
            // Keys we can't delete
            const sacredKeys = new Set(Object.keys(this.currentValue));
            for (const k of Object.keys(this._loadingKeys)){
                sacredKeys.add(k);
            }
            for (const k of this._loadedKeys){
                sacredKeys.add(k);
            }
            // Refresh meta from the store so that we're less likely to
            // clobber data from other tabs
            const meta = yield this._refreshMeta();
            if (!meta) {
                this._log.info('Could not gc because we were not able to load meta');
                return;
            }
            const promises = [];
            const deets = {
                gcOpts: this._gcOpts,
                keys,
                sacredKeys,
                removed: [],
                metaRemoved: [],
                removedMissingCount: 0,
                removedOldCount: 0,
                removedThresholdCount: 0,
                removedSizeCount: 0
            };
            // First, remove all keys we don't know about
            for (const key of keys){
                if (sacredKeys.has(key) || key in meta.objects) {
                    continue;
                }
                this._log.info('Lost track of key in meta', key);
                promises.push(this._persister.removeItem(key));
                deets.removed.push(key);
                deets.removedMissingCount++;
            }
            // Remove anything over the max age
            const now = Date.now();
            for (const [k, m] of Object.entries(meta.objects)){
                if (!sacredKeys.has(k) && m.updatedAt < now - this._gcOpts.maxAgeMs) {
                    promises.push(this._persister.removeItem(k));
                    delete meta.objects[k];
                    deets.removed.push(k);
                    deets.removedOldCount++;
                }
            }
            // Keep queries under max queries
            const maxEntries = Object.entries(meta.objects);
            maxEntries.sort(([_k_a, a_meta], [_k_b, b_meta])=>{
                return a_meta.updatedAt - b_meta.updatedAt;
            });
            const deletableMaxEntries = maxEntries.filter(([x])=>!sacredKeys.has(x));
            if (maxEntries.length > this._gcOpts.maxEntries) {
                for (const [k] of deletableMaxEntries.slice(0, maxEntries.length - this._gcOpts.maxEntries)){
                    promises.push(this._persister.removeItem(k));
                    delete meta.objects[k];
                    deets.removed.push(k);
                    deets.removedThresholdCount++;
                }
            }
            // Remove oldest entries until we are under max size
            const delEntries = Object.entries(meta.objects);
            delEntries.sort(([_k_a, a_meta], [_k_b, b_meta])=>{
                return a_meta.updatedAt - b_meta.updatedAt;
            });
            const deletableDelEntries = delEntries.filter(([x])=>!sacredKeys.has(x));
            let currentSize = delEntries.reduce((acc, [_k, m])=>{
                return acc + m.size;
            }, 0);
            while(currentSize > 0 && currentSize > this._gcOpts.maxSize && deletableDelEntries.length){
                const [[k, m]] = deletableDelEntries.splice(0, 1);
                currentSize -= m.size;
                promises.push(this._persister.removeItem(k));
                delete meta.objects[k];
                deets.removed.push(k);
                deets.removedSizeCount++;
            }
            // Update meta to remove keys that are no longer in the store
            for (const k of Object.keys(meta.objects)){
                if (!keys.has(k) && !sacredKeys.has(k)) {
                    delete meta.objects[k];
                }
            }
            if (deets.removed.length || deets.metaRemoved.length) {
                // Trigger a flush of the meta
                promises.push(this._enqueuePersist({
                    skipGc: true
                }));
            }
            this._log.info('Completed GC', deets);
            yield Promise.all(promises);
            return deets;
        });
    }
    // Schedules a GC to run in one minute (unless it is already scheduled)
    gc() {
        if (this._nextGc) {
            return;
        }
        this._nextGc = setTimeout(()=>{
            safeIdleCallback(()=>{
                this._nextGc = null;
                this._gc();
            }, 30 * 1000);
        }, // 1 minute + some jitter to keep multiple tabs from running at same time
        1000 * 60 + Math.random() * 500);
    }
    _enqueuePersist(opts) {
        return new Promise((resolve, reject)=>{
            if (this._nextSave) {
                resolve(0);
                return;
            }
            this._nextSave = setTimeout(()=>{
                safeIdleCallback(()=>{
                    this._nextSave = null;
                    this._writeToStorage(opts).then(resolve).catch(reject);
                }, this._idleCallbackMaxWaitMs);
            }, this._saveThrottleMs);
        });
    }
    version() {
        return this._version;
    }
    // Takes a function that updates the store in place.
    // Uses `mutative` to get a list of keys that were changed
    // so that we know which entries we need to persist to the store.
    updateInPlace(f) {
        this._version++;
        const [state, patches] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$mutative$2f$dist$2f$mutative$2e$esm$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["create"])(this.currentValue, f, {
            enablePatches: true
        });
        for (const patch of patches){
            const k = patch.path[0];
            if (k && typeof k === 'string') {
                this._pendingSaveKeys.add(k);
                if (!this._loadedKeys.has(k)) {
                    this._loadKey(k);
                }
            }
        }
        for (const k of Object.keys(state)){
            if (!state[k]) {
                debugger;
            }
        }
        this.currentValue = state;
        this._enqueuePersist();
        for (const cb of this._subs){
            cb(this.currentValue);
        }
        return state;
    }
    subscribe(cb) {
        this._subs.push(cb);
        cb(this.currentValue);
        return ()=>{
            this._subs = this._subs.filter((x)=>x !== cb);
        };
    }
} //# sourceMappingURL=PersistedObject.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/IndexedDBStorage.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>IndexedDBStorage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$PersistedObject$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/PersistedObject.js [app-route] (ecmascript)");
var __awaiter = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
;
// Any time these are updates to the data format or new stores are added,
// the version must be updated.
// onupgradeneeded will be called, which is where you can
// move objects from one idb to another.
// We create a new IDB for each version change instead of
// using their built-in versioning because they have no ability
// to roll back and if multiple tabs are active, then you'll just
// be stuck.
const version = 6;
const storeNames = [
    'kv',
    'querySubs',
    'syncSubs'
];
const _exhaustiveCheck = null;
function logErrorCb(source) {
    return function logError(event) {
        console.error('Error in IndexedDB event', {
            source,
            event
        });
    };
}
function existingDb(name) {
    return __awaiter(this, void 0, void 0, function*() {
        return new Promise((resolve)=>{
            const request = indexedDB.open(name);
            request.onerror = (_event)=>{
                resolve(null);
            };
            request.onsuccess = (event)=>{
                const target = event.target;
                const db = target.result;
                resolve(db);
            };
            request.onupgradeneeded = (event)=>{
                var _a;
                const target = event.target;
                (_a = target.transaction) === null || _a === void 0 ? void 0 : _a.abort();
                resolve(null);
            };
        });
    });
}
function upgradeQuerySubs5To6(hash, value, querySubStore) {
    return __awaiter(this, void 0, void 0, function*() {
        const subs = // Backwards compatibility for older versions where we JSON.stringified before storing
        typeof value === 'string' ? JSON.parse(value) : value;
        if (!subs) {
            return;
        }
        const putReqs = new Set();
        return new Promise((resolve, reject)=>{
            var _a, _b, _c, _d;
            const objects = {};
            for (const [hash, v] of Object.entries(subs)){
                const value = typeof v === 'string' ? JSON.parse(v) : v;
                if (value.lastAccessed) {
                    const objectMeta = {
                        createdAt: value.lastAccessed,
                        updatedAt: value.lastAccessed,
                        size: (_d = (_c = (_b = (_a = value.result) === null || _a === void 0 ? void 0 : _a.store) === null || _b === void 0 ? void 0 : _b.triples) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0
                    };
                    objects[hash] = objectMeta;
                }
                const putReq = querySubStore.put(value, hash);
                putReqs.add(putReq);
            }
            const meta = {
                objects
            };
            const metaPutReq = querySubStore.put(meta, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$PersistedObject$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["META_KEY"]);
            putReqs.add(metaPutReq);
            for (const r of putReqs){
                r.onsuccess = ()=>{
                    putReqs.delete(r);
                    if (putReqs.size === 0) {
                        resolve();
                    }
                };
                r.onerror = (event)=>{
                    logErrorCb(`Move ${hash} to querySubs store failed`);
                    reject(event);
                };
            }
        });
    });
}
function moveKvEntry5To6(k, value, kvStore) {
    return __awaiter(this, void 0, void 0, function*() {
        const request = kvStore.put(value, k);
        return new Promise((resolve, reject)=>{
            request.onsuccess = ()=>resolve();
            request.onerror = (event)=>reject(event);
        });
    });
}
function upgrade5To6(appId, v6Db) {
    return __awaiter(this, void 0, void 0, function*() {
        const v5db = yield existingDb(`instant_${appId}_5`);
        if (!v5db) {
            return;
        }
        const data = yield new Promise((resolve, reject)=>{
            const v5Tx = v5db.transaction([
                'kv'
            ], 'readonly');
            const objectStore = v5Tx.objectStore('kv');
            const cursorReq = objectStore.openCursor();
            cursorReq.onerror = (event)=>{
                reject(event);
            };
            const data = [];
            cursorReq.onsuccess = ()=>{
                const cursor = cursorReq.result;
                if (cursor) {
                    const key = cursor.key;
                    const value = cursor.value;
                    data.push([
                        key,
                        value
                    ]);
                    cursor.continue();
                } else {
                    resolve(data);
                }
            };
            cursorReq.onerror = (event)=>{
                reject(event);
            };
        });
        const v6Tx = v6Db.transaction([
            'kv',
            'querySubs'
        ], 'readwrite');
        const kvStore = v6Tx.objectStore('kv');
        const querySubStore = v6Tx.objectStore('querySubs');
        const promises = [];
        const kvMeta = {
            objects: {}
        };
        for (const [key, value] of data){
            switch(key){
                case 'querySubs':
                    {
                        const p = upgradeQuerySubs5To6(key, value, querySubStore);
                        promises.push(p);
                        break;
                    }
                default:
                    {
                        const p = moveKvEntry5To6(key, value, kvStore);
                        promises.push(p);
                        const objectMeta = {
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                            size: 0
                        };
                        kvMeta.objects[key] = objectMeta;
                        break;
                    }
            }
        }
        const p = moveKvEntry5To6(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$PersistedObject$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["META_KEY"], kvMeta, kvStore);
        promises.push(p);
        yield Promise.all(promises);
        yield new Promise((resolve, reject)=>{
            v6Tx.oncomplete = (e)=>resolve(e);
            v6Tx.onerror = (e)=>reject(e);
            v6Tx.onabort = (e)=>reject(e);
        });
    });
}
// We create many IndexedDBStorage instances that talk to the same
// underlying db, but we only get one `onupgradeneeded` event. This holds
// the upgrade promises so that we wait until upgrade finishes before
// we start writing.
const upgradePromises = new Map();
class IndexedDBStorage extends __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$PersistedObject$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StorageInterface"] {
    constructor(appId, storeName){
        super(appId, storeName);
        this.dbName = `instant_${appId}_${version}`;
        this._storeName = storeName;
        this._appId = appId;
        this._dbPromise = this._init();
    }
    _init() {
        return new Promise((resolve, reject)=>{
            let requiresUpgrade = false;
            const request = indexedDB.open(this.dbName, 1);
            request.onerror = (event)=>{
                reject(event);
            };
            request.onsuccess = (event)=>{
                const target = event.target;
                const db = target.result;
                if (!requiresUpgrade) {
                    const p = upgradePromises.get(this.dbName);
                    if (!p) {
                        resolve(db);
                    } else {
                        p.then(()=>resolve(db)).catch(()=>resolve(db));
                    }
                } else {
                    const p = upgrade5To6(this._appId, db).catch((e)=>{
                        logErrorCb('Error upgrading store from version 5 to 6.')(e);
                    });
                    upgradePromises.set(this.dbName, p);
                    p.then(()=>resolve(db)).catch(()=>resolve(db));
                }
            };
            request.onupgradeneeded = (event)=>{
                requiresUpgrade = true;
                this._upgradeStore(event);
            };
        });
    }
    _upgradeStore(event) {
        const target = event.target;
        const db = target.result;
        for (const storeName of storeNames){
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName);
            }
        }
    }
    getItem(k) {
        return __awaiter(this, void 0, void 0, function*() {
            const db = yield this._dbPromise;
            return new Promise((resolve, reject)=>{
                const transaction = db.transaction([
                    this._storeName
                ], 'readonly');
                const objectStore = transaction.objectStore(this._storeName);
                const request = objectStore.get(k);
                request.onerror = (event)=>{
                    reject(event);
                };
                request.onsuccess = (_event)=>{
                    if (request.result) {
                        resolve(request.result);
                    } else {
                        resolve(null);
                    }
                };
            });
        });
    }
    setItem(k, v) {
        return __awaiter(this, void 0, void 0, function*() {
            const db = yield this._dbPromise;
            return new Promise((resolve, reject)=>{
                const transaction = db.transaction([
                    this._storeName
                ], 'readwrite');
                const objectStore = transaction.objectStore(this._storeName);
                const request = objectStore.put(v, k);
                request.onerror = (event)=>{
                    reject(event);
                };
                request.onsuccess = (_event)=>{
                    resolve();
                };
            });
        });
    }
    // Performs all writes in a transaction so that all succeed or none succeed.
    multiSet(keyValuePairs) {
        return __awaiter(this, void 0, void 0, function*() {
            const db = yield this._dbPromise;
            return new Promise((resolve, reject)=>{
                const transaction = db.transaction([
                    this._storeName
                ], 'readwrite');
                const objectStore = transaction.objectStore(this._storeName);
                const requests = new Set();
                for (const [k, v] of keyValuePairs){
                    const request = objectStore.put(v, k);
                    requests.add(request);
                }
                for (const request of requests){
                    request.onerror = (event)=>{
                        transaction.abort();
                        reject(event);
                    };
                    request.onsuccess = (_event)=>{
                        requests.delete(request);
                        // Last request to finish resolves the transaction
                        if (requests.size === 0) {
                            resolve();
                        }
                    };
                }
            });
        });
    }
    removeItem(k) {
        return __awaiter(this, void 0, void 0, function*() {
            const db = yield this._dbPromise;
            return new Promise((resolve, reject)=>{
                const transaction = db.transaction([
                    this._storeName
                ], 'readwrite');
                const objectStore = transaction.objectStore(this._storeName);
                const request = objectStore.delete(k);
                request.onerror = (event)=>{
                    reject(event);
                };
                request.onsuccess = (_event)=>{
                    resolve();
                };
            });
        });
    }
    getAllKeys() {
        return __awaiter(this, void 0, void 0, function*() {
            const db = yield this._dbPromise;
            return new Promise((resolve, reject)=>{
                const transaction = db.transaction([
                    this._storeName
                ], 'readonly');
                const objectStore = transaction.objectStore(this._storeName);
                const request = objectStore.getAllKeys();
                request.onerror = (event)=>{
                    reject(event);
                };
                request.onsuccess = (_event)=>{
                    resolve(request.result.filter((x)=>typeof x === 'string'));
                };
            });
        });
    }
} //# sourceMappingURL=IndexedDBStorage.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/WindowNetworkListener.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WindowNetworkListener
]);
var __awaiter = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class WindowNetworkListener {
    static getIsOnline() {
        return __awaiter(this, void 0, void 0, function*() {
            return navigator.onLine;
        });
    }
    static listen(f) {
        const onOnline = ()=>{
            f(true);
        };
        const onOffline = ()=>{
            f(false);
        };
        addEventListener('online', onOnline);
        addEventListener('offline', onOffline);
        return ()=>{
            removeEventListener('online', onOnline);
            removeEventListener('offline', onOffline);
        };
    }
} //# sourceMappingURL=WindowNetworkListener.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/InstantError.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InstantError",
    ()=>InstantError
]);
class InstantError extends Error {
    constructor(message, hint){
        super(message);
        this.hint = hint;
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(this, actualProto);
        }
        // Maintain proper stack trace for where our error was thrown
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InstantError);
        }
        this.name = 'InstantError';
    }
    get [Symbol.toStringTag]() {
        return 'InstantError';
    }
} //# sourceMappingURL=InstantError.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/fetch.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InstantAPIError",
    ()=>InstantAPIError,
    "jsonFetch",
    ()=>jsonFetch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$InstantError$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/InstantError.js [app-route] (ecmascript)");
var __awaiter = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
;
class InstantAPIError extends __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$InstantError$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InstantError"] {
    constructor(error){
        var _a;
        // Create a descriptive message based on the error
        const message = ((_a = error.body) === null || _a === void 0 ? void 0 : _a.message) || `API Error (${error.status})`;
        super(message, error.body.hint);
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(this, actualProto);
        }
        // Maintain proper stack trace for where our error was thrown
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InstantAPIError);
        }
        this.name = 'InstantAPIError';
        this.status = error.status;
        this.body = error.body;
    }
    get [Symbol.toStringTag]() {
        return 'InstantAPIError';
    }
}
function jsonFetch(input, init) {
    return __awaiter(this, void 0, void 0, function*() {
        const res = yield fetch(input, init);
        const json = yield res.json();
        return res.status === 200 ? Promise.resolve(json) : Promise.reject(new InstantAPIError({
            status: res.status,
            body: json
        }));
    });
} //# sourceMappingURL=fetch.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/authAPI.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "exchangeCodeForToken",
    ()=>exchangeCodeForToken,
    "sendMagicCode",
    ()=>sendMagicCode,
    "signInAsGuest",
    ()=>signInAsGuest,
    "signInWithIdToken",
    ()=>signInWithIdToken,
    "signOut",
    ()=>signOut,
    "verifyMagicCode",
    ()=>verifyMagicCode,
    "verifyRefreshToken",
    ()=>verifyRefreshToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$fetch$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/fetch.js [app-route] (ecmascript)");
var __awaiter = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
;
function sendMagicCode({ apiURI, appId, email }) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$fetch$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonFetch"])(`${apiURI}/runtime/auth/send_magic_code`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            'app-id': appId,
            email
        })
    });
}
function verifyMagicCode(_a) {
    return __awaiter(this, arguments, void 0, function*({ apiURI, appId, email, code, refreshToken }) {
        const res = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$fetch$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonFetch"])(`${apiURI}/runtime/auth/verify_magic_code`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(Object.assign({
                'app-id': appId,
                email,
                code
            }, refreshToken ? {
                'refresh-token': refreshToken
            } : {}))
        });
        return res;
    });
}
function verifyRefreshToken(_a) {
    return __awaiter(this, arguments, void 0, function*({ apiURI, appId, refreshToken }) {
        const res = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$fetch$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonFetch"])(`${apiURI}/runtime/auth/verify_refresh_token`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                'app-id': appId,
                'refresh-token': refreshToken
            })
        });
        return res;
    });
}
function signInAsGuest(_a) {
    return __awaiter(this, arguments, void 0, function*({ apiURI, appId }) {
        const res = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$fetch$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonFetch"])(`${apiURI}/runtime/auth/sign_in_guest`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                'app-id': appId
            })
        });
        return res;
    });
}
function exchangeCodeForToken(_a) {
    return __awaiter(this, arguments, void 0, function*({ apiURI, appId, code, codeVerifier, refreshToken }) {
        const res = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$fetch$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonFetch"])(`${apiURI}/runtime/oauth/token`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                app_id: appId,
                code: code,
                code_verifier: codeVerifier,
                refresh_token: refreshToken
            })
        });
        return res;
    });
}
function signInWithIdToken(_a) {
    return __awaiter(this, arguments, void 0, function*({ apiURI, appId, nonce, idToken, clientName, refreshToken }) {
        const res = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$fetch$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonFetch"])(`${apiURI}/runtime/oauth/id_token`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                app_id: appId,
                nonce,
                id_token: idToken,
                client_name: clientName,
                refresh_token: refreshToken
            })
        });
        return res;
    });
}
function signOut(_a) {
    return __awaiter(this, arguments, void 0, function*({ apiURI, appId, refreshToken }) {
        const res = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$fetch$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonFetch"])(`${apiURI}/runtime/signout`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                app_id: appId,
                refresh_token: refreshToken
            })
        });
        return res;
    });
} //# sourceMappingURL=authAPI.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/StorageAPI.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteFile",
    ()=>deleteFile,
    "getDownloadUrl",
    ()=>getDownloadUrl,
    "getSignedUploadUrl",
    ()=>getSignedUploadUrl,
    "upload",
    ()=>upload,
    "uploadFile",
    ()=>uploadFile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$fetch$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/fetch.js [app-route] (ecmascript)");
var __awaiter = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
;
function uploadFile(_a) {
    return __awaiter(this, arguments, void 0, function*({ apiURI, appId, path, file, refreshToken, contentType, contentDisposition }) {
        const headers = {
            app_id: appId,
            path,
            authorization: `Bearer ${refreshToken}`,
            'content-type': contentType || file.type
        };
        if (contentDisposition) {
            headers['content-disposition'] = contentDisposition;
        }
        const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$fetch$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonFetch"])(`${apiURI}/storage/upload`, {
            method: 'PUT',
            headers,
            body: file
        });
        return data;
    });
}
function deleteFile(_a) {
    return __awaiter(this, arguments, void 0, function*({ apiURI, appId, path, refreshToken }) {
        const { data } = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$fetch$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonFetch"])(`${apiURI}/storage/files?app_id=${appId}&filename=${encodeURIComponent(path)}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${refreshToken}`
            }
        });
        return data;
    });
}
function getSignedUploadUrl(_a) {
    return __awaiter(this, arguments, void 0, function*({ apiURI, appId, fileName, refreshToken, metadata = {} }) {
        const { data } = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$fetch$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonFetch"])(`${apiURI}/storage/signed-upload-url`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${refreshToken}`
            },
            body: JSON.stringify({
                app_id: appId,
                filename: fileName
            })
        });
        return data;
    });
}
function upload(presignedUrl, file) {
    return __awaiter(this, void 0, void 0, function*() {
        const response = yield fetch(presignedUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type
            }
        });
        return response.ok;
    });
}
function getDownloadUrl(_a) {
    return __awaiter(this, arguments, void 0, function*({ apiURI, appId, path, refreshToken }) {
        const { data } = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$fetch$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonFetch"])(`${apiURI}/storage/signed-download-url?app_id=${appId}&filename=${encodeURIComponent(path)}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${refreshToken}`
            }
        });
        return data;
    });
} //# sourceMappingURL=StorageAPI.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/flags.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "devBackend",
    ()=>devBackend,
    "devtoolLocalDashboard",
    ()=>devtoolLocalDashboard,
    "instantLogs",
    ()=>instantLogs
]);
let devBackend = false;
let instantLogs = false;
let devtoolLocalDashboard = false;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
;
 //# sourceMappingURL=flags.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/pick.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "pick",
    ()=>pick
]);
function pick(obj, keys) {
    if (!keys) return obj;
    const ret = {};
    keys.forEach((key)=>{
        ret[key] = obj[key];
    });
    return ret;
} //# sourceMappingURL=pick.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/presence.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildPresenceSlice",
    ()=>buildPresenceSlice,
    "hasPresenceResponseChanged",
    ()=>hasPresenceResponseChanged
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$pick$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/pick.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/object.js [app-route] (ecmascript)");
;
;
function buildPresenceSlice(data, opts, userPeerId) {
    var _a, _b;
    const slice = {
        peers: {}
    };
    const includeUser = opts && 'user' in opts ? opts.user : true;
    if (includeUser) {
        const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$pick$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pick"])((_a = data.user) !== null && _a !== void 0 ? _a : {}, opts === null || opts === void 0 ? void 0 : opts.keys);
        slice.user = Object.assign(Object.assign({}, user), {
            peerId: userPeerId
        });
    }
    for (const id of Object.keys((_b = data.peers) !== null && _b !== void 0 ? _b : {})){
        const shouldIncludeAllPeers = (opts === null || opts === void 0 ? void 0 : opts.peers) === undefined;
        const isPeerIncluded = Array.isArray(opts === null || opts === void 0 ? void 0 : opts.peers) && (opts === null || opts === void 0 ? void 0 : opts.peers.includes(id));
        if (shouldIncludeAllPeers || isPeerIncluded) {
            const peer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$pick$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pick"])(data.peers[id], opts === null || opts === void 0 ? void 0 : opts.keys);
            slice.peers[id] = Object.assign(Object.assign({}, peer), {
                peerId: id
            });
        }
    }
    return slice;
}
function hasPresenceResponseChanged(a, b) {
    if (a.isLoading !== b.isLoading) return true;
    if (a.error !== b.error) return true;
    if (a.user || b.user) {
        if (!a.user || !b.user) return true;
        const same = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["areObjectsShallowEqual"])(a.user, b.user);
        if (!same) return true;
    }
    const sameKeys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["areObjectKeysEqual"])(a.peers, b.peers);
    if (!sameKeys) return true;
    for (const id of Object.keys(a.peers)){
        const same = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["areObjectsShallowEqual"])(a.peers[id], b.peers[id]);
        if (!same) return true;
    }
    return false;
} //# sourceMappingURL=presence.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/Deferred.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Deferred",
    ()=>Deferred
]);
class Deferred {
    constructor(){
        this.promise = new Promise((resolve, reject)=>{
            this._resolve = resolve;
            this._reject = reject;
        });
    }
    resolve(value) {
        this._resolve(value);
    }
    reject(reason) {
        this._reject(reason);
    }
} //# sourceMappingURL=Deferred.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/model/instaqlResult.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractTriples",
    ()=>extractTriples
]);
function _extractTriplesHelper(idNodes, acc = []) {
    idNodes.forEach((idNode)=>{
        const { data } = idNode;
        const { 'datalog-result': datalogResult } = data;
        const { 'join-rows': joinRows } = datalogResult;
        for (const rows of joinRows){
            for (const triple of rows){
                acc.push(triple);
            }
        }
        _extractTriplesHelper(idNode['child-nodes'], acc);
    });
}
function extractTriples(idNodes) {
    const triples = [];
    _extractTriplesHelper(idNodes, triples);
    return triples;
} //# sourceMappingURL=instaqlResult.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/linkIndex.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createLinkIndex",
    ()=>createLinkIndex
]);
function createLinkIndex(schema) {
    return Object.values(schema.links).reduce((linkIndex, link)=>{
        var _a, _b;
        var _c, _d;
        (_a = linkIndex[_c = link.forward.on]) !== null && _a !== void 0 ? _a : linkIndex[_c] = {};
        linkIndex[link.forward.on][link.forward.label] = {
            isForward: true,
            isSingular: link.forward.has === 'one',
            link
        };
        (_b = linkIndex[_d = link.reverse.on]) !== null && _b !== void 0 ? _b : linkIndex[_d] = {};
        linkIndex[link.reverse.on][link.reverse.label] = {
            isForward: false,
            isSingular: link.reverse.has === 'one',
            link
        };
        return linkIndex;
    }, {});
} //# sourceMappingURL=linkIndex.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/version.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$version$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/version/dist/esm/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$version$2f$dist$2f$esm$2f$version$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/version/dist/esm/version.js [app-route] (ecmascript)");
;
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$version$2f$dist$2f$esm$2f$version$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["version"];
 //# sourceMappingURL=version.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/log.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>createLogger
]);
function createLogger(isEnabled, getStats) {
    return {
        info: isEnabled ? (...args)=>console.info(...args, getStats()) : ()=>{},
        debug: isEnabled ? (...args)=>console.debug(...args, getStats()) : ()=>{},
        error: isEnabled ? (...args)=>console.error(...args, getStats()) : ()=>{}
    };
} //# sourceMappingURL=log.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/schemaTypes.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataAttrDef",
    ()=>DataAttrDef,
    "EntityDef",
    ()=>EntityDef,
    "InstantGraph",
    ()=>InstantGraph,
    "InstantSchemaDef",
    ()=>InstantSchemaDef,
    "InstantUnknownSchemaDef",
    ()=>InstantUnknownSchemaDef,
    "LinkAttrDef",
    ()=>LinkAttrDef
]);
class DataAttrDef {
    constructor(valueType, required, isIndexed, config = {
        indexed: false,
        unique: false
    }){
        this.valueType = valueType;
        this.required = required;
        this.isIndexed = isIndexed;
        this.config = config;
        this.metadata = {};
    }
    /**
     * @deprecated Only use this temporarily for attributes that you want
     * to treat as required in frontend code but can’t yet mark as required
     * and enforced for backend
     */ clientRequired() {
        return new DataAttrDef(this.valueType, false, this.isIndexed, this.config);
    }
    optional() {
        return new DataAttrDef(this.valueType, false, this.isIndexed, this.config);
    }
    unique() {
        return new DataAttrDef(this.valueType, this.required, this.isIndexed, Object.assign(Object.assign({}, this.config), {
            unique: true
        }));
    }
    indexed() {
        return new DataAttrDef(this.valueType, this.required, true, Object.assign(Object.assign({}, this.config), {
            indexed: true
        }));
    }
}
class LinkAttrDef {
    constructor(cardinality, entityName){
        this.cardinality = cardinality;
        this.entityName = entityName;
    }
}
class EntityDef {
    constructor(attrs, links){
        this.attrs = attrs;
        this.links = links;
    }
    asType() {
        return new EntityDef(this.attrs, this.links);
    }
}
class InstantSchemaDef {
    constructor(entities, links, rooms){
        this.entities = entities;
        this.links = links;
        this.rooms = rooms;
    }
    /**
     * @deprecated
     * `withRoomSchema` is deprecated. Define your schema in `rooms` directly:
     *
     * @example
     * // Before:
     * const schema = i.schema({
     *   // ...
     * }).withRoomSchema<RoomSchema>()
     *
     * // After
     * const schema = i.schema({
     *  rooms: {
     *    // ...
     *  }
     * })
     *
     * @see https://instantdb.com/docs/presence-and-topics#typesafety
     */ withRoomSchema() {
        return new InstantSchemaDef(this.entities, this.links, {});
    }
}
class InstantGraph {
    constructor(entities, links){
        this.entities = entities;
        this.links = links;
    }
    withRoomSchema() {
        return new InstantGraph(this.entities, this.links);
    }
}
class InstantUnknownSchemaDef extends InstantSchemaDef {
} //# sourceMappingURL=schemaTypes.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/queryValidation.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryValidationError",
    ()=>QueryValidationError,
    "validateQuery",
    ()=>validateQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$schemaTypes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/schemaTypes.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$uuid$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__validate$3e$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/uuid/dist/esm/validate.js [app-route] (ecmascript) <export default as validate>");
;
;
class QueryValidationError extends Error {
    constructor(message, path){
        const fullMessage = path ? `At path '${path}': ${message}` : message;
        super(fullMessage);
        this.name = 'QueryValidationError';
    }
}
const dollarSignKeys = [
    'where',
    'order',
    'limit',
    'last',
    'first',
    'offset',
    'after',
    'before',
    'fields',
    'aggregate'
];
const getAttrType = (attrDef)=>{
    return attrDef.valueType || 'unknown';
};
const isValidValueForType = (value, expectedType, isAnyType = false)=>{
    if (isAnyType) return true;
    if (value === null || value === undefined) return true;
    switch(expectedType){
        case 'string':
            return typeof value === 'string';
        case 'number':
            return typeof value === 'number' && !isNaN(value);
        case 'boolean':
            return typeof value === 'boolean';
        case 'date':
            return value instanceof Date || typeof value === 'string' || typeof value === 'number';
        default:
            return true;
    }
};
const validateOperator = (op, opValue, expectedType, attrName, entityName, attrDef, path)=>{
    const isAnyType = attrDef.valueType === 'json';
    const assertValidValue = (op, expectedType, opValue)=>{
        if (!isValidValueForType(opValue, expectedType, isAnyType)) {
            throw new QueryValidationError(`Invalid value for operator '${op}' on attribute '${attrName}' in entity '${entityName}'. Expected ${expectedType}, but received: ${typeof opValue}`, path);
        }
    };
    switch(op){
        case 'in':
        case '$in':
            if (!Array.isArray(opValue)) {
                throw new QueryValidationError(`Operator '${op}' for attribute '${attrName}' in entity '${entityName}' must be an array, but received: ${typeof opValue}`, path);
            }
            for (const item of opValue){
                assertValidValue(op, expectedType, item);
            }
            break;
        case '$not':
        case '$ne':
        case '$gt':
        case '$lt':
        case '$gte':
        case '$lte':
            assertValidValue(op, expectedType, opValue);
            break;
        case '$like':
        case '$ilike':
            assertValidValue(op, 'string', opValue);
            if (op === '$ilike') {
                if (!attrDef.isIndexed) {
                    throw new QueryValidationError(`Operator '${op}' can only be used with indexed attributes, but '${attrName}' in entity '${entityName}' is not indexed`, path);
                }
            }
            break;
        case '$isNull':
            assertValidValue(op, 'boolean', opValue);
            break;
        default:
            throw new QueryValidationError(`Unknown operator '${op}' for attribute '${attrName}' in entity '${entityName}'`, path);
    }
};
const validateWhereClauseValue = (value, attrName, attrDef, entityName, path)=>{
    const expectedType = getAttrType(attrDef);
    const isAnyType = attrDef.valueType === 'json';
    const isComplexObject = typeof value === 'object' && value !== null && !Array.isArray(value);
    if (isComplexObject) {
        // For any type, allow complex objects without treating them as operators
        if (isAnyType) {
            return; // Any type accepts any value, including complex objects
        }
        const operators = value;
        for (const [op, opValue] of Object.entries(operators)){
            validateOperator(op, opValue, expectedType, attrName, entityName, attrDef, `${path}.${op}`);
        }
    } else {
        if (!isValidValueForType(value, expectedType, isAnyType)) {
            throw new QueryValidationError(`Invalid value for attribute '${attrName}' in entity '${entityName}'. Expected ${expectedType}, but received: ${typeof value}`, path);
        }
    }
};
const validateDotNotationAttribute = (dotPath, value, startEntityName, schema, path)=>{
    const pathParts = dotPath.split('.');
    if (pathParts.length < 2) {
        throw new QueryValidationError(`Invalid dot notation path '${dotPath}'. Must contain at least one dot.`, path);
    }
    let currentEntityName = startEntityName;
    // Traverse all path parts except the last one (which should be an attribute)
    for(let i = 0; i < pathParts.length - 1; i++){
        const linkName = pathParts[i];
        const currentEntity = schema.entities[currentEntityName];
        if (!currentEntity) {
            throw new QueryValidationError(`Entity '${currentEntityName}' does not exist in schema while traversing dot notation path '${dotPath}'.`, path);
        }
        const link = currentEntity.links[linkName];
        if (!link) {
            const availableLinks = Object.keys(currentEntity.links);
            throw new QueryValidationError(`Link '${linkName}' does not exist on entity '${currentEntityName}' in dot notation path '${dotPath}'. Available links: ${availableLinks.length > 0 ? availableLinks.join(', ') : 'none'}`, path);
        }
        currentEntityName = link.entityName;
    }
    // Validate the final attribute
    const finalAttrName = pathParts[pathParts.length - 1];
    const finalEntity = schema.entities[currentEntityName];
    if (!finalEntity) {
        throw new QueryValidationError(`Target entity '${currentEntityName}' does not exist in schema for dot notation path '${dotPath}'.`, path);
    }
    // Handle 'id' field specially - every entity has an id field
    if (finalAttrName === 'id') {
        if (typeof value == 'string' && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$uuid$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__validate$3e$__["validate"])(value)) {
            throw new QueryValidationError(`Invalid value for id field in entity '${currentEntityName}'. Expected a UUID, but received: ${value}`, path);
        }
        validateWhereClauseValue(value, dotPath, new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$schemaTypes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataAttrDef"]('string', false, true), startEntityName, path);
        return;
    }
    const attrDef = finalEntity.attrs[finalAttrName];
    if (Object.keys(finalEntity.links).includes(finalAttrName)) {
        if (typeof value === 'string' && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$uuid$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__validate$3e$__["validate"])(value)) {
            throw new QueryValidationError(`Invalid value for link '${finalAttrName}' in entity '${currentEntityName}'. Expected a UUID, but received: ${value}`, path);
        }
        validateWhereClauseValue(value, dotPath, new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$schemaTypes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataAttrDef"]('string', false, true), startEntityName, path);
        return;
    }
    if (!attrDef) {
        const availableAttrs = Object.keys(finalEntity.attrs);
        throw new QueryValidationError(`Attribute '${finalAttrName}' does not exist on entity '${currentEntityName}' in dot notation path '${dotPath}'. Available attributes: ${availableAttrs.length > 0 ? availableAttrs.join(', ') + ', id' : 'id'}`, path);
    }
    // Validate the value against the attribute type
    validateWhereClauseValue(value, dotPath, attrDef, startEntityName, path);
};
const validateWhereClause = (whereClause, entityName, schema, path)=>{
    for (const [key, value] of Object.entries(whereClause)){
        if (key === 'or' || key === 'and') {
            if (Array.isArray(value)) {
                for (const clause of value){
                    if (typeof clause === 'object' && clause !== null) {
                        validateWhereClause(clause, entityName, schema, `${path}.${key}[${clause}]`);
                    }
                }
            }
            continue;
        }
        if (key === 'id') {
            validateWhereClauseValue(value, 'id', new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$schemaTypes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataAttrDef"]('string', false, true), entityName, `${path}.id`);
            continue;
        }
        if (key.includes('.')) {
            validateDotNotationAttribute(key, value, entityName, schema, `${path}.${key}`);
            continue;
        }
        const entityDef = schema.entities[entityName];
        if (!entityDef) continue;
        const attrDef = entityDef.attrs[key];
        const linkDef = entityDef.links[key];
        if (!attrDef && !linkDef) {
            const availableAttrs = Object.keys(entityDef.attrs);
            const availableLinks = Object.keys(entityDef.links);
            throw new QueryValidationError(`Attribute or link '${key}' does not exist on entity '${entityName}'. Available attributes: ${availableAttrs.length > 0 ? availableAttrs.join(', ') : 'none'}. Available links: ${availableLinks.length > 0 ? availableLinks.join(', ') : 'none'}`, `${path}.${key}`);
        }
        if (attrDef) {
            validateWhereClauseValue(value, key, attrDef, entityName, `${path}.${key}`);
        } else if (linkDef) {
            // For links, we expect the value to be a string (ID of the linked entity)
            // Create a synthetic string attribute definition for validation
            if (typeof value === 'string' && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$uuid$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__validate$3e$__["validate"])(value)) {
                throw new QueryValidationError(`Invalid value for link '${key}' in entity '${entityName}'. Expected a UUID, but received: ${value}`, `${path}.${key}`);
            }
            const syntheticAttrDef = new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$schemaTypes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataAttrDef"]('string', false, true);
            validateWhereClauseValue(value, key, syntheticAttrDef, entityName, `${path}.${key}`);
        }
    }
};
const validateDollarObject = (dollarObj, entityName, schema, path, depth = 0)=>{
    for (const key of Object.keys(dollarObj)){
        if (!dollarSignKeys.includes(key)) {
            throw new QueryValidationError(`Invalid query parameter '${key}' in $ object. Valid parameters are: ${dollarSignKeys.join(', ')}. Found: ${key}`, path);
        }
    }
    // Validate that pagination parameters are only used at top-level
    const paginationParams = [
        // 'limit', // only supported client side
        'offset',
        'before',
        'after',
        'first',
        'last'
    ];
    for (const param of paginationParams){
        if (dollarObj[param] !== undefined && depth > 0) {
            throw new QueryValidationError(`'${param}' can only be used on top-level namespaces. It cannot be used in nested queries.`, path);
        }
    }
    if (dollarObj.where && schema) {
        if (typeof dollarObj.where !== 'object' || dollarObj.where === null) {
            throw new QueryValidationError(`'where' clause must be an object in entity '${entityName}', but received: ${typeof dollarObj.where}`, path ? `${path}.where` : undefined);
        }
        validateWhereClause(dollarObj.where, entityName, schema, path ? `${path}.where` : 'where');
    }
};
const validateEntityInQuery = (queryPart, entityName, schema, path, depth = 0)=>{
    var _a;
    if (!queryPart || typeof queryPart !== 'object') {
        throw new QueryValidationError(`Query part for entity '${entityName}' must be an object, but received: ${typeof queryPart}`, path);
    }
    for (const key of Object.keys(queryPart)){
        if (key !== '$') {
            // Validate link exists
            if (schema && !(key in schema.entities[entityName].links)) {
                const availableLinks = Object.keys(schema.entities[entityName].links);
                throw new QueryValidationError(`Link '${key}' does not exist on entity '${entityName}'. Available links: ${availableLinks.length > 0 ? availableLinks.join(', ') : 'none'}`, `${path}.${key}`);
            }
            // Recursively validate nested query
            const nestedQuery = queryPart[key];
            if (typeof nestedQuery === 'object' && nestedQuery !== null) {
                const linkedEntityName = (_a = schema === null || schema === void 0 ? void 0 : schema.entities[entityName].links[key]) === null || _a === void 0 ? void 0 : _a.entityName;
                if (linkedEntityName) {
                    validateEntityInQuery(nestedQuery, linkedEntityName, schema, `${path}.${key}`, depth + 1);
                }
            }
        } else {
            // Validate $ object
            const dollarObj = queryPart[key];
            if (typeof dollarObj !== 'object' || dollarObj === null) {
                throw new QueryValidationError(`Query parameter '$' must be an object in entity '${entityName}', but received: ${typeof dollarObj}`, `${path}.$`);
            }
            validateDollarObject(dollarObj, entityName, schema, `${path}.$`, depth);
        }
    }
};
const validateQuery = (q, schema)=>{
    if (typeof q !== 'object' || q === null) {
        throw new QueryValidationError(`Query must be an object, but received: ${typeof q}${q === null ? ' (null)' : ''}`);
    }
    if (Array.isArray(q)) {
        throw new QueryValidationError(`Query must be an object, but received: ${typeof q}`);
    }
    const queryObj = q;
    for (const topLevelKey of Object.keys(queryObj)){
        if (Array.isArray(q[topLevelKey])) {
            throw new QueryValidationError(`Query keys must be strings, but found key of type: ${typeof topLevelKey}`, topLevelKey);
        }
        if (typeof topLevelKey !== 'string') {
            throw new QueryValidationError(`Query keys must be strings, but found key of type: ${typeof topLevelKey}`, topLevelKey);
        }
        if (topLevelKey === '$$ruleParams') {
            continue;
        }
        // Check if the key is top level entity
        if (schema) {
            if (!schema.entities[topLevelKey]) {
                const availableEntities = Object.keys(schema.entities);
                throw new QueryValidationError(`Entity '${topLevelKey}' does not exist in schema. Available entities: ${availableEntities.length > 0 ? availableEntities.join(', ') : 'none'}`, topLevelKey);
            }
        }
        validateEntityInQuery(queryObj[topLevelKey], topLevelKey, schema, topLevelKey, 0);
    }
}; //# sourceMappingURL=queryValidation.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/transactionValidation.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TransactionValidationError",
    ()=>TransactionValidationError,
    "isValidEntityId",
    ()=>isValidEntityId,
    "validateTransactions",
    ()=>validateTransactions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instatx$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/instatx.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$uuid$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__validate$3e$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/uuid/dist/esm/validate.js [app-route] (ecmascript) <export default as validate>");
;
;
const isValidEntityId = (value)=>{
    if (typeof value !== 'string') {
        return false;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instatx$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isLookup"])(value)) {
        return true;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$uuid$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__validate$3e$__["validate"])(value);
};
class TransactionValidationError extends Error {
    constructor(message){
        super(message);
        this.name = 'TransactionValidationError';
    }
}
const formatAvailableOptions = (items)=>items.length > 0 ? items.join(', ') : 'none';
const createEntityNotFoundError = (entityName, availableEntities)=>new TransactionValidationError(`Entity '${entityName}' does not exist in schema. Available entities: ${formatAvailableOptions(availableEntities)}`);
const TYPE_VALIDATORS = {
    string: (value)=>typeof value === 'string',
    number: (value)=>typeof value === 'number' && !isNaN(value),
    boolean: (value)=>typeof value === 'boolean',
    date: (value)=>value instanceof Date || typeof value === 'string' || typeof value === 'number',
    json: ()=>true
};
const isValidValueForAttr = (value, attrDef)=>{
    var _a, _b;
    if (value === null || value === undefined) return true;
    return (_b = (_a = TYPE_VALIDATORS[attrDef.valueType]) === null || _a === void 0 ? void 0 : _a.call(TYPE_VALIDATORS, value)) !== null && _b !== void 0 ? _b : false;
};
const validateEntityExists = (entityName, schema)=>{
    const entityDef = schema.entities[entityName];
    if (!entityDef) {
        throw createEntityNotFoundError(entityName, Object.keys(schema.entities));
    }
    return entityDef;
};
const validateDataOperation = (entityName, data, schema)=>{
    const entityDef = validateEntityExists(entityName, schema);
    if (typeof data !== 'object' || data === null) {
        throw new TransactionValidationError(`Arguments for data operation on entity '${entityName}' must be an object, but received: ${typeof data}`);
    }
    for (const [attrName, value] of Object.entries(data)){
        if (attrName === 'id') continue; // id is handled specially
        const attrDef = entityDef.attrs[attrName];
        if (attrDef) {
            if (!isValidValueForAttr(value, attrDef)) {
                throw new TransactionValidationError(`Invalid value for attribute '${attrName}' in entity '${entityName}'. Expected ${attrDef.valueType}, but received: ${typeof value}`);
            }
        }
    }
};
const validateLinkOperation = (entityName, links, schema)=>{
    const entityDef = validateEntityExists(entityName, schema);
    if (typeof links !== 'object' || links === null) {
        throw new TransactionValidationError(`Arguments for link operation on entity '${entityName}' must be an object, but received: ${typeof links}`);
    }
    for (const [linkName, linkValue] of Object.entries(links)){
        const link = entityDef.links[linkName];
        if (!link) {
            const availableLinks = Object.keys(entityDef.links);
            throw new TransactionValidationError(`Link '${linkName}' does not exist on entity '${entityName}'. Available links: ${formatAvailableOptions(availableLinks)}`);
        }
        // Validate UUID format for link values
        if (linkValue !== null && linkValue !== undefined) {
            if (Array.isArray(linkValue)) {
                // Handle array of UUIDs
                for (const linkReference of linkValue){
                    if (!isValidEntityId(linkReference)) {
                        throw new TransactionValidationError(`Invalid entity ID in link '${linkName}' for entity '${entityName}'. Expected a UUID or a lookup, but received: ${linkReference}`);
                    }
                }
            } else {
                // Handle single UUID
                if (!isValidEntityId(linkValue)) {
                    throw new TransactionValidationError(`Invalid UUID in link '${linkName}' for entity '${entityName}'. Expected a UUID, but received: ${linkValue}`);
                }
            }
        }
    }
};
const VALIDATION_STRATEGIES = {
    create: validateDataOperation,
    update: validateDataOperation,
    merge: validateDataOperation,
    link: validateLinkOperation,
    unlink: validateLinkOperation,
    delete: ()=>{}
};
const validateOp = (op, schema)=>{
    if (!schema) return;
    const [action, entityName, _id, args] = op;
    // _id should be a uuid
    if (!Array.isArray(_id)) {
        const isUuid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$uuid$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__validate$3e$__["validate"])(_id);
        if (!isUuid) {
            throw new TransactionValidationError(`Invalid id for entity '${entityName}'. Expected a UUID, but received: ${_id}`);
        }
    }
    if (typeof entityName !== 'string') {
        throw new TransactionValidationError(`Entity name must be a string, but received: ${typeof entityName}`);
    }
    const validator = VALIDATION_STRATEGIES[action];
    if (validator && args !== undefined) {
        validator(entityName, args, schema);
    }
};
const validateTransactions = (inputChunks, schema)=>{
    const chunks = Array.isArray(inputChunks) ? inputChunks : [
        inputChunks
    ];
    for (const txStep of chunks){
        if (!txStep || typeof txStep !== 'object') {
            throw new TransactionValidationError(`Transaction chunk must be an object, but received: ${typeof txStep}`);
        }
        if (!Array.isArray(txStep.__ops)) {
            throw new TransactionValidationError(`Transaction chunk must have __ops array, but received: ${typeof txStep.__ops}`);
        }
        for (const op of txStep.__ops){
            if (!Array.isArray(op)) {
                throw new TransactionValidationError(`Transaction operation must be an array, but received: ${typeof op}`);
            }
            validateOp(op, schema);
        }
    }
}; //# sourceMappingURL=transactionValidation.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/Connection.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SSEConnection",
    ()=>SSEConnection,
    "WSConnection",
    ()=>WSConnection
]);
var __awaiter = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let _connId = 0;
class WSConnection {
    constructor(url){
        this.type = 'ws';
        this.id = `${this.type}_${_connId++}`;
        this.conn = new WebSocket(url);
        this.conn.onopen = (_e)=>{
            if (this.onopen) {
                this.onopen({
                    target: this
                });
            }
        };
        this.conn.onmessage = (e)=>{
            if (this.onmessage) {
                this.onmessage({
                    target: this,
                    message: JSON.parse(e.data.toString())
                });
            }
        };
        this.conn.onclose = (_e)=>{
            if (this.onclose) {
                this.onclose({
                    target: this
                });
            }
        };
        this.conn.onerror = (_e)=>{
            if (this.onerror) {
                this.onerror({
                    target: this
                });
            }
        };
    }
    close() {
        this.conn.close();
    }
    isOpen() {
        var _a;
        return this.conn.readyState === ((_a = WebSocket.OPEN) !== null && _a !== void 0 ? _a : 1);
    }
    isConnecting() {
        var _a;
        return this.conn.readyState === ((_a = WebSocket.CONNECTING) !== null && _a !== void 0 ? _a : 0);
    }
    send(msg) {
        return this.conn.send(JSON.stringify(msg));
    }
}
class SSEConnection {
    constructor(ES, url){
        this.type = 'sse';
        this.initParams = null;
        this.sendQueue = [];
        this.closeFired = false;
        this.sseInitTimeout = undefined;
        this.id = `${this.type}_${_connId++}`;
        this.url = url;
        this.ES = ES;
        this.conn = new ES(url);
        // Close the connection if we didn't get an init within 10 seconds
        this.sseInitTimeout = setTimeout(()=>{
            if (!this.initParams) {
                this.handleError();
            }
        }, 10000);
        this.conn.onmessage = (e)=>{
            const msg = JSON.parse(e.data);
            if (msg.op === 'sse-init') {
                this.initParams = {
                    machineId: msg['machine-id'],
                    sessionId: msg['session-id'],
                    sseToken: msg['sse-token']
                };
                if (this.onopen) {
                    this.onopen({
                        target: this
                    });
                }
                clearTimeout(this.sseInitTimeout);
                return;
            }
            if (this.onmessage) {
                this.onmessage({
                    target: this,
                    message: msg
                });
            }
        };
        this.conn.onerror = (e)=>{
            this.handleError();
        };
    }
    // Runs the onerror and closes the connection
    handleError() {
        try {
            if (this.onerror) {
                this.onerror({
                    target: this
                });
            }
        } finally{
            this.handleClose();
        }
    }
    handleClose() {
        this.conn.close();
        if (this.onclose && !this.closeFired) {
            this.closeFired = true;
            this.onclose({
                target: this
            });
        }
    }
    postMessages(messages) {
        return __awaiter(this, void 0, void 0, function*() {
            var _a, _b, _c;
            try {
                const resp = yield fetch(this.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        machine_id: (_a = this.initParams) === null || _a === void 0 ? void 0 : _a.machineId,
                        session_id: (_b = this.initParams) === null || _b === void 0 ? void 0 : _b.sessionId,
                        sse_token: (_c = this.initParams) === null || _c === void 0 ? void 0 : _c.sseToken,
                        messages
                    })
                });
                if (!resp.ok) {
                    this.handleError();
                }
            } catch (e) {
                this.handleError();
            }
        });
    }
    flushQueue() {
        return __awaiter(this, void 0, void 0, function*() {
            if (this.sendPromise || !this.sendQueue.length) return;
            const messages = this.sendQueue;
            this.sendQueue = [];
            const sendPromise = this.postMessages(messages);
            this.sendPromise = sendPromise;
            sendPromise.then(()=>{
                this.sendPromise = null;
                this.flushQueue();
            });
        });
    }
    send(msg) {
        if (!this.isOpen() || !this.initParams) {
            if (this.isConnecting()) {
                throw new Error(`Failed to execute 'send' on 'EventSource': Still in CONNECTING state.`);
            }
            if (this.conn.readyState === this.ES.CLOSED) {
                throw new Error(`EventSource is already in CLOSING or CLOSED state.`);
            }
            throw new Error(`EventSource is in invalid state.`);
        }
        this.sendQueue.push(msg);
        this.flushQueue();
    }
    isOpen() {
        return this.conn.readyState === this.ES.OPEN && this.initParams !== null;
    }
    isConnecting() {
        return this.conn.readyState === this.ES.CONNECTING || this.conn.readyState === this.ES.OPEN && this.initParams === null;
    }
    close() {
        this.handleClose();
    }
} //# sourceMappingURL=Connection.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/SyncTable.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CallbackEventType",
    ()=>CallbackEventType,
    "SyncTable",
    ()=>SyncTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$PersistedObject$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/PersistedObject.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/store.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$weakHash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/weakHash.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/uuid.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instaql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/instaql.js [app-route] (ecmascript)");
var __awaiter = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
;
;
;
;
;
// Modifies the data in place because it comes directly from storage
function syncSubFromStorage(sub, useDateObjects) {
    const values = sub.values;
    if (values) {
        for (const e of values.entities || []){
            e.store.useDateObjects = useDateObjects;
            e.store.attrs = values.attrs;
            e.store = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fromJSON"](e.store);
        }
    }
    return sub;
}
function syncSubToStorage(_k, sub) {
    var _a, _b;
    if ((_a = sub.values) === null || _a === void 0 ? void 0 : _a.entities) {
        const entities = [];
        for (const e of (_b = sub.values) === null || _b === void 0 ? void 0 : _b.entities){
            const store = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toJSON"](e.store);
            // We'll store the attrs once on values, and put the
            // attrs back into the store on hydration
            delete store['attrs'];
            entities.push(Object.assign(Object.assign({}, e), {
                store
            }));
        }
        return Object.assign(Object.assign({}, sub), {
            values: Object.assign(Object.assign({}, sub.values), {
                entities
            })
        });
    } else {
        return sub;
    }
}
function onMergeSub(_key, storageSub, inMemorySub) {
    var _a, _b;
    const storageTxId = (_a = storageSub === null || storageSub === void 0 ? void 0 : storageSub.state) === null || _a === void 0 ? void 0 : _a.txId;
    const memoryTxId = (_b = inMemorySub === null || inMemorySub === void 0 ? void 0 : inMemorySub.state) === null || _b === void 0 ? void 0 : _b.txId;
    if (storageTxId && (!memoryTxId || storageTxId > memoryTxId)) {
        return storageSub;
    }
    if (memoryTxId && (!storageTxId || memoryTxId > storageTxId)) {
        return inMemorySub;
    }
    return storageSub || inMemorySub;
}
function queryEntity(sub, store) {
    const res = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instaql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
        store,
        pageInfo: null,
        aggregate: null
    }, sub.query);
    return res.data[sub.table][0];
}
function getServerCreatedAt(sub, store, entityId) {
    var _a;
    const aid = (_a = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAttrByFwdIdentName"](store, sub.table, 'id')) === null || _a === void 0 ? void 0 : _a.id;
    if (!aid) {
        return -1;
    }
    const t = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getInMap"](store.eav, [
        entityId,
        aid,
        entityId
    ]);
    if (!t) {
        return -1;
    }
    return t[3];
}
function applyChangesToStore(store, changes) {
    for (const { action, triple } of changes){
        switch(action){
            case 'added':
                __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addTriple"](store, triple);
                break;
            case 'removed':
                __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["retractTriple"](store, triple);
                break;
        }
    }
}
function changedFieldsOfChanges(store, changes) {
    var _a, _b, _c, _d;
    // This will be more complicated when we include links, we can either add a
    // changedLinks field or we can have something like 'bookshelves.title`
    const changedFields = {};
    for (const { action, triple } of changes){
        const [e, a, v] = triple;
        const field = (_b = (_a = store.attrs[a]) === null || _a === void 0 ? void 0 : _a['forward-identity']) === null || _b === void 0 ? void 0 : _b[2];
        if (!field) continue;
        const fields = (_c = changedFields[e]) !== null && _c !== void 0 ? _c : {};
        changedFields[e] = fields;
        const oldNew = (_d = fields[field]) !== null && _d !== void 0 ? _d : {};
        fields[field] = oldNew;
        switch(action){
            case 'added':
                oldNew.newValue = v;
                break;
            case 'removed':
                // Only take the first thing that was removed, in case we modified things in the middle
                if (oldNew.oldValue === undefined) {
                    oldNew.oldValue = v;
                }
                break;
        }
    }
    for (const k of Object.keys(changedFields)){
        const { oldValue, newValue } = changedFields[k];
        if (oldValue === newValue) {
            delete changedFields[k];
        }
    }
    return changedFields;
}
function subData(sub, entities) {
    return {
        [sub.table]: entities.map((e)=>e.entity)
    };
}
// Updates the sub order field type if it hasn't been set
// and returns the type. We have to wait until the attrs
// are loaded before we can determine the type.
function orderFieldTypeMutative(sub, createStore) {
    var _a;
    if (sub.orderFieldType) {
        return sub.orderFieldType;
    }
    const orderFieldType = sub.orderField === 'serverCreatedAt' ? 'number' : (_a = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAttrByFwdIdentName"](createStore([]), sub.table, sub.orderField)) === null || _a === void 0 ? void 0 : _a['checked-data-type'];
    sub.orderFieldType = orderFieldType;
    return orderFieldType;
}
function sortEntitiesInPlace(sub, orderFieldType, entities) {
    const dataType = orderFieldType;
    if (sub.orderField === 'serverCreatedAt') {
        entities.sort(sub.orderDirection === 'asc' ? function compareEntities(a, b) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instaql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compareOrder"])(a.entity.id, a.serverCreatedAt, b.entity.id, b.serverCreatedAt, dataType);
        } : function compareEntities(b, a) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instaql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compareOrder"])(a.entity.id, a.serverCreatedAt, b.entity.id, b.serverCreatedAt, dataType);
        });
        return;
    }
    const field = sub.orderField;
    entities.sort(sub.orderDirection === 'asc' ? function compareEntities(a, b) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instaql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compareOrder"])(a.entity.id, a.entity[field], b.entity.id, b.entity[field], dataType);
    } : function compareEntities(b, a) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instaql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compareOrder"])(a.entity.id, a.entity[field], b.entity.id, b.entity[field], dataType);
    });
}
var CallbackEventType;
(function(CallbackEventType) {
    CallbackEventType["InitialSyncBatch"] = "InitialSyncBatch";
    CallbackEventType["InitialSyncComplete"] = "InitialSyncComplete";
    CallbackEventType["LoadFromStorage"] = "LoadFromStorage";
    CallbackEventType["SyncTransaction"] = "SyncTransaction";
    CallbackEventType["Error"] = "Error";
})(CallbackEventType || (CallbackEventType = {}));
class SyncTable {
    constructor(trySend, storage, config, log, createStore){
        // Using any for the SyncCallback because we'd need Reactor to be typed
        this.callbacks = {};
        this.idToHash = {};
        this.trySend = trySend;
        this.config = config;
        this.log = log;
        this.createStore = createStore;
        this.subs = new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$PersistedObject$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PersistedObject"]({
            persister: storage,
            merge: onMergeSub,
            serialize: syncSubToStorage,
            parse: (_key, x)=>syncSubFromStorage(x, this.config.useDateObjects),
            objectSize: (sub)=>{
                var _a;
                return ((_a = sub.values) === null || _a === void 0 ? void 0 : _a.entities.length) || 0;
            },
            logger: log,
            gc: {
                maxAgeMs: 1000 * 60 * 60 * 24 * 7 * 52,
                maxEntries: 1000,
                // Size of each sub is the number of entity
                maxSize: 1000000
            }
        });
    }
    beforeUnload() {
        this.subs.flush();
    }
    subscribe(q, cb) {
        const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$weakHash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(q);
        this.callbacks[hash] = this.callbacks[hash] || [];
        this.callbacks[hash].push(cb);
        this.initSubscription(q, hash, cb);
        return (opts)=>{
            this.unsubscribe(hash, cb, opts === null || opts === void 0 ? void 0 : opts.keepSubscription);
        };
    }
    unsubscribe(hash, cb, keepSubscription) {
        const cbs = (this.callbacks[hash] || []).filter((x)=>x !== cb);
        this.callbacks[hash] = cbs;
        if (!cbs.length) {
            delete this.callbacks[hash];
            const sub = this.subs.currentValue[hash];
            if (sub === null || sub === void 0 ? void 0 : sub.state) {
                this.clearSubscriptionData(sub.state.subscriptionId, !!keepSubscription);
            }
            if (!keepSubscription) {
                this.subs.updateInPlace((prev)=>{
                    delete prev[hash];
                });
            }
        }
    }
    sendStart(query) {
        this.trySend((0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(), {
            op: 'start-sync',
            q: query
        });
    }
    sendResync(sub, state, txId) {
        // Make sure we can find the hash from the subscriptionId
        this.idToHash[state.subscriptionId] = sub.hash;
        this.trySend(state.subscriptionId, {
            op: 'resync-table',
            'subscription-id': state.subscriptionId,
            'tx-id': txId,
            token: state.token
        });
    }
    sendRemove(state, keepSubscription) {
        this.trySend((0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(), {
            op: 'remove-sync',
            'subscription-id': state.subscriptionId,
            'keep-subscription': keepSubscription
        });
    }
    initSubscription(query, hash, cb) {
        return __awaiter(this, void 0, void 0, function*() {
            var _a, _b, _c, _d;
            // Wait for storage to load so that we know if we already have an existing subscription
            yield this.subs.waitForKeyToLoad(hash);
            const existingSub = this.subs.currentValue[hash];
            if (existingSub && existingSub.state && existingSub.state.txId) {
                this.sendResync(existingSub, existingSub.state, existingSub.state.txId);
                if (((_a = existingSub.values) === null || _a === void 0 ? void 0 : _a.entities) && cb) {
                    cb({
                        type: CallbackEventType.LoadFromStorage,
                        data: subData(existingSub, (_b = existingSub.values) === null || _b === void 0 ? void 0 : _b.entities)
                    });
                }
                return;
            }
            const table = Object.keys(query)[0];
            const orderBy = ((_d = (_c = query[table]) === null || _c === void 0 ? void 0 : _c.$) === null || _d === void 0 ? void 0 : _d.order) || {
                serverCreatedAt: 'asc'
            };
            const [orderField, orderDirection] = Object.entries(orderBy)[0];
            this.subs.updateInPlace((prev)=>{
                prev[hash] = {
                    query,
                    hash: hash,
                    table,
                    orderDirection,
                    orderField,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                };
            });
            this.sendStart(query);
        });
    }
    flushPending() {
        return __awaiter(this, void 0, void 0, function*() {
            for (const hash of Object.keys(this.callbacks)){
                yield this.subs.waitForKeyToLoad(hash);
                const sub = this.subs.currentValue[hash];
                if (sub) {
                    yield this.initSubscription(sub.query, sub.hash);
                } else {
                    this.log.error('Missing sub for hash in flushPending', hash);
                }
            }
        });
    }
    onStartSyncOk(msg) {
        const subscriptionId = msg['subscription-id'];
        const q = msg.q;
        const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$weakHash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(q);
        this.idToHash[subscriptionId] = hash;
        this.subs.updateInPlace((prev)=>{
            const sub = prev[hash];
            if (!sub) {
                this.log.error('Missing sub for hash', hash, 'subscription-id', subscriptionId, 'query', q);
                return prev;
            }
            sub.state = {
                subscriptionId: subscriptionId,
                token: msg.token
            };
        });
    }
    notifyCbs(hash, event) {
        for (const cb of this.callbacks[hash] || []){
            cb(event);
        }
    }
    onSyncLoadBatch(msg) {
        var _a;
        const subscriptionId = msg['subscription-id'];
        const joinRows = msg['join-rows'];
        const hash = this.idToHash[subscriptionId];
        if (!hash) {
            this.log.error('Missing hash for subscription', msg);
            return;
        }
        const batch = [];
        const sub = this.subs.currentValue[hash];
        if (!sub) {
            this.log.error('Missing sub for hash', hash, msg);
            return;
        }
        const values = (_a = sub.values) !== null && _a !== void 0 ? _a : {
            entities: [],
            attrs: this.createStore([]).attrs
        };
        sub.values = values;
        const entities = values.entities;
        for (const entRows of joinRows){
            const store = this.createStore(entRows);
            values.attrs = store.attrs;
            const entity = queryEntity(sub, store);
            entities.push({
                store,
                entity,
                serverCreatedAt: getServerCreatedAt(sub, store, entity.id)
            });
            batch.push(entity);
        }
        this.subs.updateInPlace((prev)=>{
            prev[hash] = sub;
            // Make sure we write a field or mutative won't
            // see the change because sub === prev[hash]
            prev[hash].updatedAt = Date.now();
        });
        if (sub.values) {
            this.notifyCbs(hash, {
                type: CallbackEventType.InitialSyncBatch,
                data: subData(sub, sub.values.entities),
                batch
            });
        }
    }
    onSyncInitFinish(msg) {
        var _a;
        const subscriptionId = msg['subscription-id'];
        const hash = this.idToHash[subscriptionId];
        if (!hash) {
            this.log.error('Missing hash for subscription', msg);
            return;
        }
        this.subs.updateInPlace((prev)=>{
            const sub = prev[hash];
            if (!sub) {
                this.log.error('Missing sub for hash', hash, msg);
                return;
            }
            const state = sub.state;
            if (!state) {
                this.log.error('Sub never set init, missing result', sub, msg);
                return prev;
            }
            state.txId = msg['tx-id'];
            sub.updatedAt = Date.now();
        });
        const sub = this.subs.currentValue[hash];
        if (sub) {
            this.notifyCbs(hash, {
                type: CallbackEventType.InitialSyncComplete,
                data: subData(sub, ((_a = sub.values) === null || _a === void 0 ? void 0 : _a.entities) || [])
            });
        }
    }
    onSyncUpdateTriples(msg) {
        var _a, _b, _c;
        const subscriptionId = msg['subscription-id'];
        const hash = this.idToHash[subscriptionId];
        if (!hash) {
            this.log.error('Missing hash for subscription', msg);
            return;
        }
        const sub = this.subs.currentValue[hash];
        if (!sub) {
            this.log.error('Missing sub for hash', hash, msg);
            return;
        }
        const state = sub.state;
        if (!state) {
            this.log.error('Missing state for sub', sub, msg);
            return;
        }
        for (const tx of msg.txes){
            if (state.txId && state.txId >= tx['tx-id']) {
                continue;
            }
            state.txId = tx['tx-id'];
            const idxesToDelete = [];
            // Note: this won't work as well when links are involved
            const byEid = {};
            for (const change of tx.changes){
                const eidChanges = (_a = byEid[change.triple[0]]) !== null && _a !== void 0 ? _a : [];
                byEid[change.triple[0]] = eidChanges;
                eidChanges.push(change);
            }
            const values = (_b = sub.values) !== null && _b !== void 0 ? _b : {
                entities: [],
                attrs: this.createStore([]).attrs
            };
            const entities = values.entities;
            sub.values = values;
            const updated = [];
            // Update the existing stores, if we already know about this entity
            eidLoop: for (const [eid, changes] of Object.entries(byEid)){
                for(let i = 0; i < entities.length; i++){
                    const ent = entities[i];
                    if (__TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasEntity"](ent.store, eid)) {
                        applyChangesToStore(ent.store, changes);
                        const entity = queryEntity(sub, ent.store);
                        const changedFields = changedFieldsOfChanges(ent.store, changes)[eid];
                        if (entity) {
                            updated.push({
                                oldEntity: ent.entity,
                                newEntity: entity,
                                changedFields: changedFields || {}
                            });
                            ent.entity = entity;
                        } else {
                            idxesToDelete.push(i);
                        }
                        delete byEid[eid];
                        continue eidLoop;
                    }
                }
            }
            const added = [];
            // If we have anything left in byEid, then this must be a new entity we don't know about
            for (const [_eid, changes] of Object.entries(byEid)){
                const store = this.createStore([]);
                values.attrs = store.attrs;
                applyChangesToStore(store, changes);
                const entity = queryEntity(sub, store);
                if (!entity) {
                    this.log.error('No entity found after applying change', {
                        sub,
                        changes,
                        store
                    });
                    continue;
                }
                entities.push({
                    store,
                    entity,
                    serverCreatedAt: getServerCreatedAt(sub, store, entity.id)
                });
                added.push(entity);
            }
            const removed = [];
            for (const idx of idxesToDelete.sort().reverse()){
                removed.push(entities[idx].entity);
                entities.splice(idx, 1);
            }
            const orderFieldType = orderFieldTypeMutative(sub, this.createStore);
            sortEntitiesInPlace(sub, orderFieldType, entities);
            this.notifyCbs(hash, {
                type: CallbackEventType.SyncTransaction,
                data: subData(sub, (_c = sub.values) === null || _c === void 0 ? void 0 : _c.entities),
                added,
                removed,
                updated
            });
        }
        this.subs.updateInPlace((prev)=>{
            prev[hash] = sub;
            // Make sure we write a field or mutative won't
            // see the change because sub === prev[hash]
            prev[hash].updatedAt = Date.now();
        });
    }
    clearSubscriptionData(subscriptionId, keepSubscription) {
        const hash = this.idToHash[subscriptionId];
        if (hash) {
            delete this.idToHash[subscriptionId];
            const sub = this.subs.currentValue[hash];
            if (sub.state) {
                this.sendRemove(sub.state, keepSubscription);
            }
            if (keepSubscription) {
                this.subs.unloadKey(hash);
            } else {
                this.subs.updateInPlace((prev)=>{
                    delete prev[hash];
                });
            }
            if (sub) {
                return sub;
            }
        }
    }
    onStartSyncError(msg) {
        const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$weakHash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(msg['original-event']['q']);
        const error = {
            message: msg.message || 'Uh-oh, something went wrong. Ping Joe & Stopa.',
            status: msg.status,
            type: msg.type,
            hint: msg.hint
        };
        const k = Object.keys(msg['original-event']['q'])[0];
        this.notifyCbs(hash, {
            type: CallbackEventType.Error,
            data: {
                [k]: []
            },
            error
        });
    }
    onResyncError(msg) {
        // Clear the subscription and start from scrath on any resync error
        // This can happen if the auth changed and we need to refetch with the
        // new auth or if the subscription is too far behind.
        const subscriptionId = msg['original-event']['subscription-id'];
        const removedSub = this.clearSubscriptionData(subscriptionId, false);
        if (removedSub) {
            this.initSubscription(removedSub.query, removedSub.hash);
        }
    }
} //# sourceMappingURL=SyncTable.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/Reactor.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Reactor
]);
// @ts-check
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$weakHash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/weakHash.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instaql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/instaql.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instaml$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/instaml.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/store.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/uuid.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$IndexedDBStorage$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/IndexedDBStorage.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$WindowNetworkListener$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/WindowNetworkListener.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$authAPI$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/authAPI.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$StorageAPI$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/StorageAPI.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$flags$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/flags.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$presence$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/presence.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$Deferred$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/Deferred.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$PersistedObject$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/PersistedObject.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$model$2f$instaqlResult$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/model/instaqlResult.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/object.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$linkIndex$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/linkIndex.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$version$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/version.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$mutative$2f$dist$2f$mutative$2e$esm$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/mutative/dist/mutative.esm.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$log$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/log.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$queryValidation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/queryValidation.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$transactionValidation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/transactionValidation.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$InstantError$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/InstantError.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$fetch$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/fetch.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$uuid$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__validate$3e$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/uuid/dist/esm/validate.js [app-route] (ecmascript) <export default as validate>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$Connection$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/Connection.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$SyncTable$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/SyncTable.js [app-route] (ecmascript)");
var __awaiter = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__rest || function(s, e) {
    var t = {};
    for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for(var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++){
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
};
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
/** @typedef {import('./utils/log.ts').Logger} Logger */ /** @typedef {import('./Connection.ts').Connection} Connection */ /** @typedef {import('./Connection.ts').TransportType} TransportType */ /** @typedef {import('./Connection.ts').EventSourceConstructor} EventSourceConstructor */ const STATUS = {
    CONNECTING: 'connecting',
    OPENED: 'opened',
    AUTHENTICATED: 'authenticated',
    CLOSED: 'closed',
    ERRORED: 'errored'
};
const QUERY_ONCE_TIMEOUT = 30000;
const PENDING_TX_CLEANUP_TIMEOUT = 30000;
const PENDING_MUTATION_CLEANUP_THRESHOLD = 200;
const defaultConfig = {
    apiURI: 'https://api.instantdb.com',
    websocketURI: 'wss://api.instantdb.com/runtime/session'
};
// Param that the backend adds if this is an oauth redirect
const OAUTH_REDIRECT_PARAM = '_instant_oauth_redirect';
const currentUserKey = `currentUser`;
/**
 * @param {Object} config
 * @param {TransportType} config.transportType
 * @param {string} config.appId
 * @param {string} config.apiURI
 * @param {string} config.wsURI
 * @param {EventSourceConstructor} config.EventSourceImpl
 * @returns {WSConnection | SSEConnection}
 */ function createTransport({ transportType, appId, apiURI, wsURI, EventSourceImpl }) {
    if (!EventSourceImpl) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$Connection$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["WSConnection"](`${wsURI}?app_id=${appId}`);
    }
    switch(transportType){
        case 'ws':
            return new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$Connection$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["WSConnection"](`${wsURI}?app_id=${appId}`);
        case 'sse':
            return new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$Connection$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SSEConnection"](EventSourceImpl, `${apiURI}/runtime/sse?app_id=${appId}`);
        default:
            throw new Error('Unknown transport type ' + transportType);
    }
}
function isClient() {
    const hasWindow = ("TURBOPACK compile-time value", "undefined") !== 'undefined';
    // this checks if we are running in a chrome extension
    // @ts-expect-error
    const isChrome = typeof chrome !== 'undefined';
    return hasWindow || isChrome;
}
const ignoreLogging = {
    'set-presence': true,
    'set-presence-ok': true,
    'refresh-presence': true,
    'patch-presence': true
};
function querySubFromStorage(x, useDateObjects) {
    var _a;
    const v = typeof x === 'string' ? JSON.parse(x) : x;
    if ((_a = v === null || v === void 0 ? void 0 : v.result) === null || _a === void 0 ? void 0 : _a.store) {
        const storeJSON = v.result.store;
        v.result.store = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fromJSON"](Object.assign(Object.assign({}, storeJSON), {
            useDateObjects: useDateObjects
        }));
    }
    return v;
}
function querySubToStorage(_key, sub) {
    var _a;
    const jsonSub = Object.assign({}, sub);
    if ((_a = sub.result) === null || _a === void 0 ? void 0 : _a.store) {
        jsonSub.result = Object.assign(Object.assign({}, sub.result), {
            store: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toJSON"](sub.result.store)
        });
    }
    return jsonSub;
}
function kvFromStorage(key, x) {
    switch(key){
        case 'pendingMutations':
            return new Map(typeof x === 'string' ? JSON.parse(x) : x);
        default:
            return x;
    }
}
function kvToStorage(key, x) {
    switch(key){
        case 'pendingMutations':
            return [
                ...x.entries()
            ];
        default:
            return x;
    }
}
function onMergeQuerySub(_k, storageSub, inMemorySub) {
    const storageResult = storageSub === null || storageSub === void 0 ? void 0 : storageSub.result;
    const memoryResult = inMemorySub === null || inMemorySub === void 0 ? void 0 : inMemorySub.result;
    if (storageResult && !memoryResult && inMemorySub) {
        inMemorySub.result = storageResult;
    }
    return inMemorySub || storageSub;
}
function sortedMutationEntries(entries) {
    return [
        ...entries
    ].sort((a, b)=>{
        const [ka, muta] = a;
        const [kb, mutb] = b;
        const a_order = muta.order || 0;
        const b_order = mutb.order || 0;
        if (a_order == b_order) {
            return ka < kb ? -1 : ka > kb ? 1 : 0;
        }
        return a_order - b_order;
    });
}
class Reactor {
    constructor(config, Storage = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$IndexedDBStorage$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"], NetworkListener = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$WindowNetworkListener$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"], versions, EventSourceConstructor){
        var _a, _b, _c;
        this._isOnline = true;
        this._isShutdown = false;
        this.status = STATUS.CONNECTING;
        /** @type {Record<string, Array<{ q: any, cb: (data: any) => any }>>} */ this.queryCbs = {};
        /** @type {Record<string, Array<{ q: any, eventId: string, dfd: Deferred }>>} */ this.queryOnceDfds = {};
        this.authCbs = [];
        this.attrsCbs = [];
        this.mutationErrorCbs = [];
        this.connectionStatusCbs = [];
        this.mutationDeferredStore = new Map();
        this._reconnectTimeoutId = null;
        this._reconnectTimeoutMs = 0;
        /** @type {TransportType} */ this._transportType = 'ws';
        /** @type {boolean | null} */ this._wsOk = null;
        this._localIdPromises = {};
        this._errorMessage = null;
        /** @type {Promise<null | {error: {message: string}}> | null}**/ this._oauthCallbackResponse = null;
        /** @type {null | import('./utils/linkIndex.ts').LinkIndex}} */ this._linkIndex = null;
        /** @type {Record<string, {isConnected: boolean; error: any}>} */ this._rooms = {};
        /** @type {Record<string, boolean>} */ this._roomsPendingLeave = {};
        this._presence = {};
        this._broadcastQueue = [];
        this._broadcastSubs = {};
        /** @type {{isLoading: boolean; error: any | undefined, user: any | undefined}} */ this._currentUserCached = {
            isLoading: true,
            error: undefined,
            user: undefined
        };
        this._beforeUnloadCbs = [];
        this._dataForQueryCache = {};
        this._inFlightMutationEventIds = new Set();
        this._onMergeKv = (key, storageV, inMemoryV)=>{
            var _a, _b;
            switch(key){
                case 'pendingMutations':
                    {
                        const storageEntries = (_a = storageV === null || storageV === void 0 ? void 0 : storageV.entries()) !== null && _a !== void 0 ? _a : [];
                        const inMemoryEntries = (_b = inMemoryV === null || inMemoryV === void 0 ? void 0 : inMemoryV.entries()) !== null && _b !== void 0 ? _b : [];
                        const muts = new Map([
                            ...storageEntries,
                            ...inMemoryEntries
                        ]);
                        const rewrittenStorageMuts = storageV ? this._rewriteMutationsSorted(this.attrs, storageV) : [];
                        rewrittenStorageMuts.forEach(([k, mut])=>{
                            var _a;
                            if (!((_a = inMemoryV === null || inMemoryV === void 0 ? void 0 : inMemoryV.pendingMutations) === null || _a === void 0 ? void 0 : _a.has(k)) && !mut['tx-id']) {
                                this._sendMutation(k, mut);
                            }
                        });
                        return muts;
                    }
                default:
                    return inMemoryV || storageV;
            }
        };
        // ---------------------------
        // Queries
        this.getPreviousResult = (q)=>{
            const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$weakHash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(q);
            return this.dataForQuery(hash);
        };
        /** Re-run instaql and call all callbacks with new data */ this.notifyOne = (hash)=>{
            var _a, _b;
            const cbs = (_a = this.queryCbs[hash]) !== null && _a !== void 0 ? _a : [];
            const prevData = (_b = this._dataForQueryCache[hash]) === null || _b === void 0 ? void 0 : _b.data;
            const data = this.dataForQuery(hash);
            if (!data) return;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["areObjectsDeepEqual"])(data, prevData)) return;
            cbs.forEach((r)=>r.cb(data));
        };
        this.notifyOneQueryOnce = (hash)=>{
            var _a;
            const dfds = (_a = this.queryOnceDfds[hash]) !== null && _a !== void 0 ? _a : [];
            const data = this.dataForQuery(hash);
            dfds.forEach((r)=>{
                this._completeQueryOnce(r.q, hash, r.dfd);
                r.dfd.resolve(data);
            });
        };
        this.notifyQueryError = (hash, error)=>{
            const cbs = this.queryCbs[hash] || [];
            cbs.forEach((r)=>r.cb({
                    error
                }));
        };
        /** Applies transactions locally and sends transact message to server */ this.pushTx = (chunks)=>{
            // Throws if transactions are invalid
            if (!this.config.disableValidation) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$transactionValidation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateTransactions"])(chunks, this.config.schema);
            }
            try {
                const txSteps = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instaml$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transform"]({
                    attrs: this.optimisticAttrs(),
                    schema: this.config.schema,
                    stores: Object.values(this.querySubs.currentValue).map((sub)=>{
                        var _a;
                        return (_a = sub === null || sub === void 0 ? void 0 : sub.result) === null || _a === void 0 ? void 0 : _a.store;
                    }),
                    useDateObjects: this.config.useDateObjects
                }, chunks);
                return this.pushOps(txSteps);
            } catch (e) {
                return this.pushOps([], e);
            }
        };
        /**
         * @param {*} txSteps
         * @param {*} [error]
         * @returns
         */ this.pushOps = (txSteps, error)=>{
            const eventId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
            const mutations = [
                ...this._pendingMutations().values()
            ];
            const order = Math.max(0, ...mutations.map((mut)=>mut.order || 0)) + 1;
            const mutation = {
                op: 'transact',
                'tx-steps': txSteps,
                created: Date.now(),
                error,
                order
            };
            this._updatePendingMutations((prev)=>{
                prev.set(eventId, mutation);
            });
            const dfd = new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$Deferred$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Deferred"]();
            this.mutationDeferredStore.set(eventId, dfd);
            this._sendMutation(eventId, mutation);
            this.notifyAll();
            return dfd.promise;
        };
        this._transportOnOpen = (e)=>{
            const targetTransport = e.target;
            if (this._transport !== targetTransport) {
                this._log.info('[socket][open]', targetTransport.id, 'skip; this is no longer the current transport');
                return;
            }
            this._log.info('[socket][open]', this._transport.id);
            this._setStatus(STATUS.OPENED);
            this.getCurrentUser().then((resp)=>{
                var _a;
                this._trySend((0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(), {
                    op: 'init',
                    'app-id': this.config.appId,
                    'refresh-token': (_a = resp.user) === null || _a === void 0 ? void 0 : _a['refresh_token'],
                    versions: this.versions,
                    // If an admin token is provided for an app, we will
                    // skip all permission checks. This is an advanced feature,
                    // to let users write internal tools
                    // This option is not exposed in `Config`, as it's
                    // not ready for prime time
                    '__admin-token': this.config.__adminToken
                });
            }).catch((e)=>{
                this._log.error('[socket][error]', targetTransport.id, e);
            });
        };
        this._transportOnMessage = (e)=>{
            const targetTransport = e.target;
            const m = e.message;
            if (this._transport !== targetTransport) {
                this._log.info('[socket][message]', targetTransport.id, m, 'skip; this is no longer the current transport');
                return;
            }
            if (!this._wsOk && targetTransport.type === 'ws') {
                this._wsOk = true;
            }
            // Try to reconnect via websocket the next time we connect
            this._transportType = 'ws';
            this._handleReceive(targetTransport.id, e.message);
        };
        this._transportOnError = (e)=>{
            const targetTransport = e.target;
            if (this._transport !== targetTransport) {
                this._log.info('[socket][error]', targetTransport.id, 'skip; this is no longer the current transport');
                return;
            }
            this._log.error('[socket][error]', targetTransport.id, e);
        };
        this._scheduleReconnect = ()=>{
            // If we couldn't connect with a websocket last time, try sse
            if (!this._wsOk && this._transportType !== 'sse') {
                this._transportType = 'sse';
                this._reconnectTimeoutMs = 0;
            }
            setTimeout(()=>{
                this._reconnectTimeoutMs = Math.min(this._reconnectTimeoutMs + 1000, 10000);
                if (!this._isOnline) {
                    this._log.info('[socket][close]', this._transport.id, 'we are offline, no need to start socket');
                    return;
                }
                this._startSocket();
            }, this._reconnectTimeoutMs);
        };
        this._transportOnClose = (e)=>{
            const targetTransport = e.target;
            if (this._transport !== targetTransport) {
                this._log.info('[socket][close]', targetTransport.id, 'skip; this is no longer the current transport');
                return;
            }
            this._setStatus(STATUS.CLOSED);
            for (const room of Object.values(this._rooms)){
                room.isConnected = false;
            }
            if (this._isShutdown) {
                this._log.info('[socket][close]', targetTransport.id, 'Reactor has been shut down and will not reconnect');
                return;
            }
            this._log.info('[socket][close]', targetTransport.id, 'schedule reconnect, ms =', this._reconnectTimeoutMs);
            this._scheduleReconnect();
        };
        this._EventSource = EventSourceConstructor;
        this.config = Object.assign(Object.assign({}, defaultConfig), config);
        this.queryCacheLimit = (_a = this.config.queryCacheLimit) !== null && _a !== void 0 ? _a : 10;
        this._pendingTxCleanupTimeout = (_b = this.config.pendingTxCleanupTimeout) !== null && _b !== void 0 ? _b : PENDING_TX_CLEANUP_TIMEOUT;
        this._pendingMutationCleanupThreshold = (_c = this.config.pendingMutationCleanupThreshold) !== null && _c !== void 0 ? _c : PENDING_MUTATION_CLEANUP_THRESHOLD;
        this._log = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$log$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(config.verbose || __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$flags$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["devBackend"] || __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$flags$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["instantLogs"], ()=>this._reactorStats());
        this.versions = Object.assign(Object.assign({}, versions || {}), {
            '@instantdb/core': __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$version$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
        });
        if (this.config.schema) {
            this._linkIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$linkIndex$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createLinkIndex"])(this.config.schema);
        }
        // This is to protect us against running
        // server-side.
        if (!isClient()) {
            return;
        }
        if (!config.appId) {
            throw new Error('Instant must be initialized with an appId.');
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$uuid$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__validate$3e$__["validate"])(config.appId)) {
            throw new Error(`Instant must be initialized with a valid appId. \`${config.appId}\` is not a valid uuid.`);
        }
        if (typeof BroadcastChannel === 'function') {
            this._broadcastChannel = new BroadcastChannel('@instantdb');
            this._broadcastChannel.addEventListener('message', (e)=>__awaiter(this, void 0, void 0, function*() {
                    var _a;
                    try {
                        if (((_a = e.data) === null || _a === void 0 ? void 0 : _a.type) === 'auth') {
                            const res = yield this.getCurrentUser();
                            this.updateUser(res.user);
                        }
                    } catch (e) {
                        this._log.error('[error] handle broadcast channel', e);
                    }
                }));
        }
        this._initStorage(Storage);
        this._syncTable = new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$SyncTable$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SyncTable"](this._trySendAuthed.bind(this), new Storage(this.config.appId, 'syncSubs'), {
            useDateObjects: this.config.useDateObjects
        }, this._log, (triples)=>__TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createStore"](this.attrs, triples, this.config.enableCardinalityInference, this._linkIndex, this.config.useDateObjects));
        this._oauthCallbackResponse = this._oauthLoginInit();
        // kick off a request to cache it
        this.getCurrentUser();
        NetworkListener.getIsOnline().then((isOnline)=>{
            this._isOnline = isOnline;
            this._startSocket();
            NetworkListener.listen((isOnline)=>{
                // We do this because react native's NetInfo
                // fires multiple online events.
                // We only want to handle one state change
                if (isOnline === this._isOnline) {
                    return;
                }
                this._log.info('[network] online =', isOnline);
                this._isOnline = isOnline;
                if (this._isOnline) {
                    this._startSocket();
                } else {
                    this._log.info('Changing status from', this.status, 'to', STATUS.CLOSED);
                    this._setStatus(STATUS.CLOSED);
                }
            });
        });
        if (typeof addEventListener !== 'undefined') {
            this._beforeUnload = this._beforeUnload.bind(this);
            addEventListener('beforeunload', this._beforeUnload);
        }
    }
    updateSchema(schema) {
        this.config = Object.assign(Object.assign({}, this.config), {
            schema: schema,
            cardinalityInference: Boolean(schema)
        });
        this._linkIndex = schema ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$linkIndex$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createLinkIndex"])(this.config.schema) : null;
    }
    _reactorStats() {
        return {
            inFlightMutationCount: this._inFlightMutationEventIds.size,
            pendingMutationCount: this._pendingMutations().size,
            transportType: this._transportType
        };
    }
    _onQuerySubLoaded(hash) {
        this.kv.waitForKeyToLoad('pendingMutations').then(()=>this.notifyOne(hash));
    }
    _initStorage(Storage) {
        this.querySubs = new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$PersistedObject$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PersistedObject"]({
            persister: new Storage(this.config.appId, 'querySubs'),
            merge: onMergeQuerySub,
            serialize: querySubToStorage,
            parse: (_key, x)=>querySubFromStorage(x, this.config.useDateObjects),
            // objectSize
            objectSize: (x)=>{
                var _a, _b, _c, _d;
                return (_d = (_c = (_b = (_a = x.result) === null || _a === void 0 ? void 0 : _a.store) === null || _b === void 0 ? void 0 : _b.triples) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0;
            },
            logger: this._log,
            preloadEntryCount: 10,
            gc: {
                maxAgeMs: 1000 * 60 * 60 * 24 * 7 * 52,
                maxEntries: 1000,
                // Size of each query is the number of triples
                maxSize: 1000000
            }
        });
        this.querySubs.onKeyLoaded = (k)=>this._onQuerySubLoaded(k);
        this.kv = new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$PersistedObject$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PersistedObject"]({
            persister: new Storage(this.config.appId, 'kv'),
            merge: this._onMergeKv,
            serialize: kvToStorage,
            parse: kvFromStorage,
            objectSize: ()=>0,
            logger: this._log,
            saveThrottleMs: 100,
            idleCallbackMaxWaitMs: 100,
            // Don't GC the kv store
            gc: null
        });
        this.kv.onKeyLoaded = (k)=>{
            if (k === 'pendingMutations') {
                this.notifyAll();
            }
        };
        // Trigger immediate load for pendingMutations and currentUser
        this.kv.waitForKeyToLoad('pendingMutations');
        this.kv.waitForKeyToLoad(currentUserKey);
        this._beforeUnloadCbs.push(()=>{
            this.kv.flush();
            this.querySubs.flush();
        });
    }
    _beforeUnload() {
        for (const cb of this._beforeUnloadCbs){
            cb();
        }
        this._syncTable.beforeUnload();
    }
    /**
     * @param {'enqueued' | 'pending' | 'synced' | 'timeout' |  'error' } status
     * @param {string} eventId
     * @param {{message?: string, type?: string, status?: number, hint?: unknown}} [errorMsg]
     */ _finishTransaction(status, eventId, errorMsg) {
        const dfd = this.mutationDeferredStore.get(eventId);
        this.mutationDeferredStore.delete(eventId);
        const ok = status !== 'error' && status !== 'timeout';
        if (!dfd && !ok) {
            // console.erroring here, as there are no listeners to let know
            console.error('Mutation failed', Object.assign({
                status,
                eventId
            }, errorMsg));
        }
        if (!dfd) {
            return;
        }
        if (ok) {
            dfd.resolve({
                status,
                eventId
            });
        } else {
            // Check if error comes from server or client
            if (errorMsg === null || errorMsg === void 0 ? void 0 : errorMsg.type) {
                const { status } = errorMsg, body = __rest(errorMsg, [
                    "status"
                ]);
                dfd.reject(new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$fetch$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InstantAPIError"]({
                    // @ts-expect-error body.type is not constant typed
                    body,
                    status: status !== null && status !== void 0 ? status : 0
                }));
            } else {
                dfd.reject(new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$InstantError$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InstantError"]((errorMsg === null || errorMsg === void 0 ? void 0 : errorMsg.message) || 'Unknown error', errorMsg === null || errorMsg === void 0 ? void 0 : errorMsg.hint));
            }
        }
    }
    _setStatus(status, err) {
        this.status = status;
        this._errorMessage = err;
        this.notifyConnectionStatusSubs(status);
    }
    _flushEnqueuedRoomData(roomId) {
        var _a, _b;
        const enqueuedUserPresence = (_b = (_a = this._presence[roomId]) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.user;
        const enqueuedBroadcasts = this._broadcastQueue[roomId];
        this._broadcastQueue[roomId] = [];
        if (enqueuedUserPresence) {
            this._trySetPresence(roomId, enqueuedUserPresence);
        }
        if (enqueuedBroadcasts) {
            for (const item of enqueuedBroadcasts){
                const { topic, roomType, data } = item;
                this._tryBroadcast(roomId, roomType, topic, data);
            }
        }
    }
    _handleReceive(connId, msg) {
        var _a, _b, _c, _d, _e, _f;
        // opt-out, enabled by default if schema
        const enableCardinalityInference = Boolean(this.config.schema) && ('cardinalityInference' in this.config ? Boolean(this.config.cardinalityInference) : true);
        if (!ignoreLogging[msg.op]) {
            this._log.info('[receive]', connId, msg.op, msg);
        }
        switch(msg.op){
            case 'init-ok':
                {
                    this._setStatus(STATUS.AUTHENTICATED);
                    this._reconnectTimeoutMs = 0;
                    this._setAttrs(msg.attrs);
                    this._flushPendingMessages();
                    // (EPH): set session-id, so we know
                    // which item is us
                    this._sessionId = msg['session-id'];
                    for (const roomId of Object.keys(this._rooms)){
                        const enqueuedUserPresence = (_b = (_a = this._presence[roomId]) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.user;
                        this._tryJoinRoom(roomId, enqueuedUserPresence);
                    }
                    break;
                }
            case 'add-query-exists':
                {
                    this.notifyOneQueryOnce((0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$weakHash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(msg.q));
                    break;
                }
            case 'add-query-ok':
                {
                    const { q, result } = msg;
                    const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$weakHash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(q);
                    if (!this._hasQueryListeners() && !this.querySubs.currentValue[hash]) {
                        break;
                    }
                    const pageInfo = (_d = (_c = result === null || result === void 0 ? void 0 : result[0]) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d['page-info'];
                    const aggregate = (_f = (_e = result === null || result === void 0 ? void 0 : result[0]) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f['aggregate'];
                    const triples = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$model$2f$instaqlResult$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractTriples"])(result);
                    const store = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createStore"](this.attrs, triples, enableCardinalityInference, this._linkIndex, this.config.useDateObjects);
                    this.querySubs.updateInPlace((prev)=>{
                        if (!prev[hash]) {
                            this._log.info('Missing value in querySubs', {
                                hash,
                                q
                            });
                            return;
                        }
                        prev[hash].result = {
                            store,
                            pageInfo,
                            aggregate,
                            processedTxId: msg['processed-tx-id']
                        };
                    });
                    this._cleanupPendingMutationsQueries();
                    this.notifyOne(hash);
                    this.notifyOneQueryOnce(hash);
                    this._cleanupPendingMutationsTimeout();
                    break;
                }
            case 'start-sync-ok':
                {
                    this._syncTable.onStartSyncOk(msg);
                    break;
                }
            case 'sync-load-batch':
                {
                    this._syncTable.onSyncLoadBatch(msg);
                    break;
                }
            case 'sync-init-finish':
                {
                    this._syncTable.onSyncInitFinish(msg);
                    break;
                }
            case 'sync-update-triples':
                {
                    this._syncTable.onSyncUpdateTriples(msg);
                    break;
                }
            case 'refresh-ok':
                {
                    const { computations, attrs } = msg;
                    const processedTxId = msg['processed-tx-id'];
                    if (attrs) {
                        this._setAttrs(attrs);
                    }
                    this._cleanupPendingMutationsTimeout();
                    const rewrittenMutations = this._rewriteMutations(this.attrs, this._pendingMutations(), processedTxId);
                    if (rewrittenMutations !== this._pendingMutations()) {
                        // We know we've changed the mutations to fix the attr ids and removed
                        // processed attrs, so we'll persist those changes to prevent optimisticAttrs
                        // from using old attr definitions
                        this.kv.updateInPlace((prev)=>{
                            prev.pendingMutations = rewrittenMutations;
                        });
                    }
                    const mutations = sortedMutationEntries(rewrittenMutations.entries());
                    const updates = computations.map((x)=>{
                        var _a, _b, _c, _d;
                        const q = x['instaql-query'];
                        const result = x['instaql-result'];
                        const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$weakHash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(q);
                        const triples = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$model$2f$instaqlResult$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractTriples"])(result);
                        const store = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createStore"](this.attrs, triples, enableCardinalityInference, this._linkIndex, this.config.useDateObjects);
                        const newStore = this._applyOptimisticUpdates(store, mutations, processedTxId);
                        const pageInfo = (_b = (_a = result === null || result === void 0 ? void 0 : result[0]) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b['page-info'];
                        const aggregate = (_d = (_c = result === null || result === void 0 ? void 0 : result[0]) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d['aggregate'];
                        return {
                            q,
                            hash,
                            store: newStore,
                            pageInfo,
                            aggregate
                        };
                    });
                    updates.forEach(({ hash, q, store, pageInfo, aggregate })=>{
                        this.querySubs.updateInPlace((prev)=>{
                            if (!prev[hash]) {
                                this._log.error('Missing value in querySubs', {
                                    hash,
                                    q
                                });
                                return;
                            }
                            prev[hash].result = {
                                store,
                                pageInfo,
                                aggregate,
                                processedTxId
                            };
                        });
                    });
                    this._cleanupPendingMutationsQueries();
                    updates.forEach(({ hash })=>{
                        this.notifyOne(hash);
                    });
                    break;
                }
            case 'transact-ok':
                {
                    const { 'client-event-id': eventId, 'tx-id': txId } = msg;
                    this._inFlightMutationEventIds.delete(eventId);
                    const muts = this._rewriteMutations(this.attrs, this._pendingMutations());
                    const prevMutation = muts.get(eventId);
                    if (!prevMutation) {
                        break;
                    }
                    // update pendingMutation with server-side tx-id
                    this._updatePendingMutations((prev)=>{
                        prev.set(eventId, Object.assign(Object.assign({}, prev.get(eventId)), {
                            'tx-id': txId,
                            confirmed: Date.now()
                        }));
                    });
                    const newAttrs = prevMutation['tx-steps'].filter(([action, ..._args])=>action === 'add-attr').map(([_action, attr])=>attr).concat(Object.values(this.attrs));
                    this._setAttrs(newAttrs);
                    this._finishTransaction('synced', eventId);
                    this._cleanupPendingMutationsTimeout();
                    break;
                }
            case 'patch-presence':
                {
                    const roomId = msg['room-id'];
                    this._trySetRoomConnected(roomId, true);
                    this._patchPresencePeers(roomId, msg['edits']);
                    this._notifyPresenceSubs(roomId);
                    break;
                }
            case 'refresh-presence':
                {
                    const roomId = msg['room-id'];
                    this._trySetRoomConnected(roomId, true);
                    this._setPresencePeers(roomId, msg['data']);
                    this._notifyPresenceSubs(roomId);
                    break;
                }
            case 'server-broadcast':
                {
                    const room = msg['room-id'];
                    const topic = msg.topic;
                    this._trySetRoomConnected(room, true);
                    this._notifyBroadcastSubs(room, topic, msg);
                    break;
                }
            case 'join-room-ok':
                {
                    const loadingRoomId = msg['room-id'];
                    const joinedRoom = this._rooms[loadingRoomId];
                    if (!joinedRoom) {
                        if (this._roomsPendingLeave[loadingRoomId]) {
                            this._tryLeaveRoom(loadingRoomId);
                            delete this._roomsPendingLeave[loadingRoomId];
                        }
                        break;
                    }
                    this._trySetRoomConnected(loadingRoomId, true);
                    this._flushEnqueuedRoomData(loadingRoomId);
                    break;
                }
            case 'leave-room-ok':
                {
                    const roomId = msg['room-id'];
                    this._trySetRoomConnected(roomId, false);
                    break;
                }
            case 'join-room-error':
                const errorRoomId = msg['room-id'];
                const errorRoom = this._rooms[errorRoomId];
                if (errorRoom) {
                    errorRoom.error = msg['error'];
                }
                this._notifyPresenceSubs(errorRoomId);
                break;
            case 'error':
                this._handleReceiveError(msg);
                break;
            default:
                this._log.info('Uknown op', msg.op, msg);
                break;
        }
    }
    _pendingMutations() {
        var _a;
        return (_a = this.kv.currentValue.pendingMutations) !== null && _a !== void 0 ? _a : new Map();
    }
    _updatePendingMutations(f) {
        this.kv.updateInPlace((prev)=>{
            var _a;
            const muts = (_a = prev.pendingMutations) !== null && _a !== void 0 ? _a : new Map();
            prev.pendingMutations = muts;
            f(muts);
        });
    }
    /**
     * @param {'timeout' | 'error'} status
     * @param {string} eventId
     * @param {{message?: string, type?: string, status?: number, hint?: unknown}} errorMsg
     */ _handleMutationError(status, eventId, errorMsg) {
        const mut = this._pendingMutations().get(eventId);
        if (mut && (status !== 'timeout' || !mut['tx-id'])) {
            this._updatePendingMutations((prev)=>{
                prev.delete(eventId);
                return prev;
            });
            this._inFlightMutationEventIds.delete(eventId);
            const errDetails = {
                message: errorMsg.message,
                hint: errorMsg.hint
            };
            this.notifyAll();
            this.notifyAttrsSubs();
            this.notifyMutationErrorSubs(errDetails);
            this._finishTransaction(status, eventId, errorMsg);
        }
    }
    _handleReceiveError(msg) {
        var _a, _b, _c, _d, _e, _f, _g;
        console.log('error', msg);
        const eventId = msg['client-event-id'];
        // This might not be a mutation, but it can't hurt to delete it
        this._inFlightMutationEventIds.delete(eventId);
        const prevMutation = this._pendingMutations().get(eventId);
        const errorMessage = {
            message: msg.message || 'Uh-oh, something went wrong. Ping Joe & Stopa.'
        };
        if (msg.hint) {
            errorMessage.hint = msg.hint;
        }
        if (prevMutation) {
            this._handleMutationError('error', eventId, msg);
            return;
        }
        if (((_a = msg['original-event']) === null || _a === void 0 ? void 0 : _a.hasOwnProperty('q')) && ((_b = msg['original-event']) === null || _b === void 0 ? void 0 : _b.op) === 'add-query') {
            const q = (_c = msg['original-event']) === null || _c === void 0 ? void 0 : _c.q;
            const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$weakHash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(q);
            this.notifyQueryError((0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$weakHash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(q), errorMessage);
            this.notifyQueryOnceError(q, hash, eventId, errorMessage);
            return;
        }
        const isInitError = ((_d = msg['original-event']) === null || _d === void 0 ? void 0 : _d.op) === 'init';
        if (isInitError) {
            if (msg.type === 'record-not-found' && ((_e = msg.hint) === null || _e === void 0 ? void 0 : _e['record-type']) === 'app-user') {
                // User has been logged out
                this.changeCurrentUser(null);
                return;
            }
            // We failed to init
            this._setStatus(STATUS.ERRORED, errorMessage);
            this.notifyAll();
            return;
        }
        if (((_f = msg['original-event']) === null || _f === void 0 ? void 0 : _f.op) === 'resync-table') {
            this._syncTable.onResyncError(msg);
            return;
        }
        if (((_g = msg['original-event']) === null || _g === void 0 ? void 0 : _g.op) === 'start-sync') {
            this._syncTable.onStartSyncError(msg);
            return;
        }
        // We've caught some error which has no corresponding listener.
        // Let's console.error to let the user know.
        const errorObj = Object.assign({}, msg);
        delete errorObj.message;
        delete errorObj.hint;
        console.error(msg.message, errorObj);
        if (msg.hint) {
            console.error('This error comes with some debugging information. Here it is: \n', msg.hint);
        }
    }
    notifyQueryOnceError(q, hash, eventId, e) {
        var _a;
        const r = (_a = this.queryOnceDfds[hash]) === null || _a === void 0 ? void 0 : _a.find((r)=>r.eventId === eventId);
        if (!r) return;
        r.dfd.reject(e);
        this._completeQueryOnce(q, hash, r.dfd);
    }
    _setAttrs(attrs) {
        this.attrs = attrs.reduce((acc, attr)=>{
            acc[attr.id] = attr;
            return acc;
        }, {});
        this.notifyAttrsSubs();
    }
    _startQuerySub(q, hash) {
        const eventId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        this.querySubs.updateInPlace((prev)=>{
            prev[hash] = prev[hash] || {
                q,
                result: null,
                eventId
            };
            prev[hash].lastAccessed = Date.now();
        });
        this._trySendAuthed(eventId, {
            op: 'add-query',
            q
        });
        return eventId;
    }
    subscribeTable(q, cb) {
        return this._syncTable.subscribe(q, cb);
    }
    /**
     *  When a user subscribes to a query the following side effects occur:
     *
     *  - We update querySubs to include the new query
     *  - We update queryCbs to include the new cb
     *  - If we already have a result for the query we call cb immediately
     *  - We send the server an `add-query` message
     *
     *  Returns an unsubscribe function
     */ subscribeQuery(q, cb, opts) {
        var _a;
        if (!this.config.disableValidation) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$queryValidation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateQuery"])(q, this.config.schema);
        }
        if (opts && 'ruleParams' in opts) {
            q = Object.assign({
                $$ruleParams: opts['ruleParams']
            }, q);
        }
        const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$weakHash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(q);
        const prevResult = this.getPreviousResult(q);
        if (prevResult) {
            cb(prevResult);
        }
        this.queryCbs[hash] = (_a = this.queryCbs[hash]) !== null && _a !== void 0 ? _a : [];
        this.queryCbs[hash].push({
            q,
            cb
        });
        this._startQuerySub(q, hash);
        return ()=>{
            this._unsubQuery(q, hash, cb);
        };
    }
    queryOnce(q, opts) {
        var _a;
        if (!this.config.disableValidation) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$queryValidation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateQuery"])(q, this.config.schema);
        }
        if (opts && 'ruleParams' in opts) {
            q = Object.assign({
                $$ruleParams: opts['ruleParams']
            }, q);
        }
        const dfd = new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$Deferred$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Deferred"]();
        if (!this._isOnline) {
            dfd.reject(new Error("We can't run `queryOnce`, because the device is offline."));
            return dfd.promise;
        }
        if (!this.querySubs) {
            dfd.reject(new Error("We can't run `queryOnce` on the backend. Use adminAPI.query instead: https://www.instantdb.com/docs/backend#query"));
            return dfd.promise;
        }
        const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$weakHash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(q);
        const eventId = this._startQuerySub(q, hash);
        this.queryOnceDfds[hash] = (_a = this.queryOnceDfds[hash]) !== null && _a !== void 0 ? _a : [];
        this.queryOnceDfds[hash].push({
            q,
            dfd,
            eventId
        });
        setTimeout(()=>dfd.reject(new Error('Query timed out')), QUERY_ONCE_TIMEOUT);
        return dfd.promise;
    }
    _completeQueryOnce(q, hash, dfd) {
        if (!this.queryOnceDfds[hash]) return;
        this.queryOnceDfds[hash] = this.queryOnceDfds[hash].filter((r)=>r.dfd !== dfd);
        this._cleanupQuery(q, hash);
    }
    _unsubQuery(q, hash, cb) {
        if (!this.queryCbs[hash]) return;
        this.queryCbs[hash] = this.queryCbs[hash].filter((r)=>r.cb !== cb);
        this._cleanupQuery(q, hash);
    }
    _hasQueryListeners(hash) {
        var _a, _b;
        return !!(((_a = this.queryCbs[hash]) === null || _a === void 0 ? void 0 : _a.length) || ((_b = this.queryOnceDfds[hash]) === null || _b === void 0 ? void 0 : _b.length));
    }
    _cleanupQuery(q, hash) {
        const hasListeners = this._hasQueryListeners(hash);
        if (hasListeners) return;
        delete this.queryCbs[hash];
        delete this.queryOnceDfds[hash];
        delete this._dataForQueryCache[hash];
        this.querySubs.unloadKey(hash);
        this._trySendAuthed((0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(), {
            op: 'remove-query',
            q
        });
    }
    // When we `pushTx`, it's possible that we don't yet have `this.attrs`
    // This means that `tx-steps` in `pendingMutations` will include `add-attr`
    // commands for attrs that already exist.
    //
    // This will also affect `add-triple` and `retract-triple` which
    // reference attr-ids that do not match the server.
    //
    // We fix this by rewriting `tx-steps` in each `pendingMutation`.
    // We remove `add-attr` commands for attrs that already exist.
    // We update `add-triple` and `retract-triple` commands to use the
    // server attr-ids.
    _rewriteMutations(attrs, muts, processedTxId) {
        if (!attrs) return muts;
        if (!muts) return new Map();
        const findExistingAttr = (attr)=>{
            const [_, etype, label] = attr['forward-identity'];
            const existing = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instaml$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAttrByFwdIdentName"](attrs, etype, label);
            return existing;
        };
        const findReverseAttr = (attr)=>{
            const [_, etype, label] = attr['forward-identity'];
            const revAttr = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instaml$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAttrByReverseIdentName"](attrs, etype, label);
            return revAttr;
        };
        const mapping = {
            attrIdMap: {},
            refSwapAttrIds: new Set()
        };
        let mappingChanged = false;
        const rewriteTxSteps = (txSteps, txId)=>{
            const retTxSteps = [];
            for (const txStep of txSteps){
                const [action] = txStep;
                // Handles add-attr
                // If existing, we drop it, and track it
                // to update add/retract triples
                if (action === 'add-attr') {
                    const [_action, attr] = txStep;
                    const existing = findExistingAttr(attr);
                    if (existing && attr.id !== existing.id) {
                        mapping.attrIdMap[attr.id] = existing.id;
                        mappingChanged = true;
                        continue;
                    }
                    if (attr['value-type'] === 'ref') {
                        const revAttr = findReverseAttr(attr);
                        if (revAttr) {
                            mapping.attrIdMap[attr.id] = revAttr.id;
                            mapping.refSwapAttrIds.add(attr.id);
                            mappingChanged = true;
                            continue;
                        }
                    }
                }
                if (processedTxId && txId && processedTxId >= txId && action === 'add-attr' || action === 'update-attr' || action === 'delete-attr') {
                    mappingChanged = true;
                    continue;
                }
                // Handles add-triple|retract-triple
                // If in mapping, we update the attr-id
                const newTxStep = mappingChanged ? __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instaml$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rewriteStep"](mapping, txStep) : txStep;
                retTxSteps.push(newTxStep);
            }
            return mappingChanged ? retTxSteps : txSteps;
        };
        const rewritten = new Map();
        for (const [k, mut] of muts.entries()){
            rewritten.set(k, Object.assign(Object.assign({}, mut), {
                'tx-steps': rewriteTxSteps(mut['tx-steps'], mut['tx-id'])
            }));
        }
        if (!mappingChanged) {
            return muts;
        }
        return rewritten;
    }
    _rewriteMutationsSorted(attrs, muts) {
        return sortedMutationEntries(this._rewriteMutations(attrs, muts).entries());
    }
    // ---------------------------
    // Transact
    optimisticAttrs() {
        var _a;
        const pendingMutationSteps = [
            ...this._pendingMutations().values()
        ] // hack due to Map()
        .flatMap((x)=>x['tx-steps']);
        const deletedAttrIds = new Set(pendingMutationSteps.filter(([action, _attr])=>action === 'delete-attr').map(([_action, id])=>id));
        const pendingAttrs = [];
        for (const [_action, attr] of pendingMutationSteps){
            if (_action === 'add-attr') {
                pendingAttrs.push(attr);
            } else if (_action === 'update-attr' && attr.id && ((_a = this.attrs) === null || _a === void 0 ? void 0 : _a[attr.id])) {
                const fullAttr = Object.assign(Object.assign({}, this.attrs[attr.id]), attr);
                pendingAttrs.push(fullAttr);
            }
        }
        const attrsWithoutDeleted = [
            ...Object.values(this.attrs || {}),
            ...pendingAttrs
        ].filter((a)=>!deletedAttrIds.has(a.id));
        const attrsRecord = Object.fromEntries(attrsWithoutDeleted.map((a)=>[
                a.id,
                a
            ]));
        return attrsRecord;
    }
    /** Runs instaql on a query and a store */ dataForQuery(hash) {
        const errorMessage = this._errorMessage;
        if (errorMessage) {
            return {
                error: errorMessage
            };
        }
        if (!this.querySubs) return;
        if (!this.kv.currentValue.pendingMutations) return;
        const querySubVersion = this.querySubs.version();
        const querySubs = this.querySubs.currentValue;
        const pendingMutationsVersion = this.kv.version();
        const pendingMutations = this._pendingMutations();
        const { q, result } = querySubs[hash] || {};
        if (!result) return;
        const cached = this._dataForQueryCache[hash];
        if (cached && querySubVersion === cached.querySubVersion && pendingMutationsVersion === cached.pendingMutationsVersion) {
            return cached.data;
        }
        const { store, pageInfo, aggregate, processedTxId } = result;
        const mutations = this._rewriteMutationsSorted(store.attrs, pendingMutations);
        const newStore = this._applyOptimisticUpdates(store, mutations, processedTxId);
        const resp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instaql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            store: newStore,
            pageInfo,
            aggregate
        }, q);
        this._dataForQueryCache[hash] = {
            querySubVersion,
            pendingMutationsVersion,
            data: resp
        };
        return resp;
    }
    _applyOptimisticUpdates(store, mutations, processedTxId) {
        for (const [_, mut] of mutations){
            if (!mut['tx-id'] || processedTxId && mut['tx-id'] > processedTxId) {
                store = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$store$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transact"](store, mut['tx-steps']);
            }
        }
        return store;
    }
    /** Re-compute all subscriptions */ notifyAll() {
        Object.keys(this.queryCbs).forEach((hash)=>{
            this.querySubs.waitForKeyToLoad(hash).then(()=>this.notifyOne(hash)).catch(()=>this.notifyOne(hash));
        });
    }
    loadedNotifyAll() {
        this.kv.waitForKeyToLoad('pendingMutations').then(()=>this.notifyAll()).catch(()=>this.notifyAll());
    }
    shutdown() {
        var _a;
        this._log.info('[shutdown]', this.config.appId);
        this._isShutdown = true;
        (_a = this._transport) === null || _a === void 0 ? void 0 : _a.close();
    }
    /**
     * Sends mutation to server and schedules a timeout to cancel it if
     * we don't hear back in time.
     * Note: If we're offline we don't schedule a timeout, we'll schedule it
     * later once we're back online and send the mutation again
     *
     */ _sendMutation(eventId, mutation) {
        if (mutation.error) {
            this._handleMutationError('error', eventId, {
                message: mutation.error.message
            });
            return;
        }
        if (this.status !== STATUS.AUTHENTICATED) {
            this._finishTransaction('enqueued', eventId);
            return;
        }
        const timeoutMs = Math.max(6000, Math.min(this._inFlightMutationEventIds.size + 1, // Defensive code in case we don't clean up in flight mutation event ids
        this._pendingMutations().size + 1) * 6000);
        if (!this._isOnline) {
            this._finishTransaction('enqueued', eventId);
        } else {
            this._trySend(eventId, mutation);
            setTimeout(()=>{
                if (!this._isOnline) {
                    return;
                }
                // If we are here, this means that we have sent this mutation, we are online
                // but we have not received a response. If it's this long, something must be wrong,
                // so we error with a timeout.
                this._handleMutationError('timeout', eventId, {
                    message: 'transaction timed out'
                });
            }, timeoutMs);
        }
    }
    // ---------------------------
    // Websocket
    /** Send messages we accumulated while we were connecting */ _flushPendingMessages() {
        const subs = Object.keys(this.queryCbs).map((hash)=>{
            return this.querySubs.currentValue[hash];
        });
        // Note: we should not have any nulls in subs, but we're
        // doing this defensively just in case.
        const safeSubs = subs.filter((x)=>x);
        safeSubs.forEach(({ eventId, q })=>{
            this._trySendAuthed(eventId, {
                op: 'add-query',
                q
            });
        });
        Object.values(this.queryOnceDfds).flat().forEach(({ eventId, q })=>{
            this._trySendAuthed(eventId, {
                op: 'add-query',
                q
            });
        });
        const muts = this._rewriteMutationsSorted(this.attrs, this._pendingMutations());
        muts.forEach(([eventId, mut])=>{
            if (!mut['tx-id']) {
                this._sendMutation(eventId, mut);
            }
        });
        this._syncTable.flushPending();
    }
    /**
     * Clean up pendingMutations that all queries have seen
     */ _cleanupPendingMutationsQueries() {
        let minProcessedTxId = Number.MAX_SAFE_INTEGER;
        for (const { result } of Object.values(this.querySubs.currentValue)){
            if (result === null || result === void 0 ? void 0 : result.processedTxId) {
                minProcessedTxId = Math.min(minProcessedTxId, result === null || result === void 0 ? void 0 : result.processedTxId);
            }
        }
        this._updatePendingMutations((prev)=>{
            for (const [eventId, mut] of Array.from(prev.entries())){
                if (mut['tx-id'] && mut['tx-id'] <= minProcessedTxId) {
                    prev.delete(eventId);
                }
            }
        });
    }
    /**
     * After mutations is confirmed by server, we give each query 30 sec
     * to update its results. If that doesn't happen, we assume query is
     * unaffected by this mutation and it’s safe to delete it from local queue
     */ _cleanupPendingMutationsTimeout() {
        if (this._pendingMutations().size < this._pendingMutationCleanupThreshold) {
            return;
        }
        const now = Date.now();
        this._updatePendingMutations((prev)=>{
            for (const [eventId, mut] of Array.from(prev.entries())){
                if (mut.confirmed && mut.confirmed + this._pendingTxCleanupTimeout < now) {
                    prev.delete(eventId);
                }
            }
        });
    }
    _trySendAuthed(...args) {
        if (this.status !== STATUS.AUTHENTICATED) {
            return;
        }
        this._trySend(...args);
    }
    _trySend(eventId, msg, opts) {
        if (!this._transport.isOpen()) {
            return;
        }
        if (!ignoreLogging[msg.op]) {
            this._log.info('[send]', this._transport.id, msg.op, msg);
        }
        switch(msg.op){
            case 'transact':
                {
                    this._inFlightMutationEventIds.add(eventId);
                    break;
                }
            case 'init':
                {
                    // New connection, so we can't have any mutations in flight
                    this._inFlightMutationEventIds.clear();
                }
        }
        this._transport.send(Object.assign({
            'client-event-id': eventId
        }, msg));
    }
    _startSocket() {
        // Reset whether we support websockets each time we connect
        // new networks may not support websockets
        this._wsOk = null;
        if (this._isShutdown) {
            this._log.info('[socket][start]', this.config.appId, 'Reactor has been shut down and will not start a new socket');
            return;
        }
        if (this._transport && this._transport.isConnecting()) {
            // Our current websocket is in a 'connecting' state.
            // There's no need to start another one, as the socket is
            // effectively fresh.
            this._log.info('[socket][start]', this._transport.id, 'maintained as current transport, we were still in a connecting state');
            return;
        }
        const prevTransport = this._transport;
        this._transport = createTransport({
            transportType: this._transportType,
            appId: this.config.appId,
            apiURI: this.config.apiURI,
            wsURI: this.config.websocketURI,
            EventSourceImpl: this._EventSource
        });
        this._transport.onopen = this._transportOnOpen;
        this._transport.onmessage = this._transportOnMessage;
        this._transport.onclose = this._transportOnClose;
        this._transport.onerror = this._transportOnError;
        this._log.info('[socket][start]', this._transport.id);
        if (prevTransport === null || prevTransport === void 0 ? void 0 : prevTransport.isOpen()) {
            // When the network dies, it doesn't always mean that our
            // socket connection will fire a close event.
            //
            // We _could_ re-use the old socket, if the network drop was a
            // few seconds. But, to be safe right now we always create a new socket.
            //
            // This means that we have to make sure to kill the previous one ourselves.
            // c.f https://issues.chromium.org/issues/41343684
            this._log.info('[socket][start]', this._transport.id, 'close previous transport id = ', prevTransport.id);
            prevTransport.close();
        }
    }
    /**
     * Given a key, returns a stable local id, unique to this device and app.
     *
     * This can be useful if you want to create guest ids for example.
     *
     * Note: If the user deletes their local storage, this id will change.
     *
     */ getLocalId(name) {
        return __awaiter(this, void 0, void 0, function*() {
            const k = `localToken_${name}`;
            if (this.kv.currentValue[k]) {
                return this.kv.currentValue[k];
            }
            const current = yield this.kv.waitForKeyToLoad(k);
            if (current) {
                return current;
            }
            const newId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
            this.kv.updateInPlace((prev)=>{
                if (prev[k]) return;
                prev[k] = newId;
            });
            return yield this.kv.waitForKeyToLoad(k);
        });
    }
    // ----
    // Auth
    _replaceUrlAfterOAuth() {
        if (typeof URL === 'undefined') {
            return;
        }
        const url = new URL(window.location.href);
        if (url.searchParams.get(OAUTH_REDIRECT_PARAM)) {
            const startUrl = url.toString();
            url.searchParams.delete(OAUTH_REDIRECT_PARAM);
            url.searchParams.delete('code');
            url.searchParams.delete('error');
            const newPath = url.pathname + (url.searchParams.size ? '?' + url.searchParams : '') + url.hash;
            // Note: In next.js, this will revert to the old state if user navigates
            //       back. We would need to allow framework specific routing to work
            //       around that problem.
            history.replaceState(history.state, '', newPath);
            // navigation is part of the HTML spec, but not supported by Safari
            // or Firefox yet:
            // https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API#browser_compatibility
            if (// @ts-ignore (waiting for ts support)
            typeof navigation === 'object' && // @ts-ignore (waiting for ts support)
            typeof navigation.addEventListener === 'function' && // @ts-ignore (waiting for ts support)
            typeof navigation.removeEventListener === 'function') {
                let ran = false;
                // The next.js app router will reset the URL when the router loads.
                // This puts it back after the router loads.
                const listener = (e)=>{
                    var _a;
                    if (!ran) {
                        ran = true;
                        // @ts-ignore (waiting for ts support)
                        navigation.removeEventListener('navigate', listener);
                        if (!e.userInitiated && e.navigationType === 'replace' && ((_a = e.destination) === null || _a === void 0 ? void 0 : _a.url) === startUrl) {
                            history.replaceState(history.state, '', newPath);
                        }
                    }
                };
                // @ts-ignore (waiting for ts support)
                navigation.addEventListener('navigate', listener);
            }
        }
    }
    /**
     *
     * @returns Promise<null | {error: {message: string}}>
     */ _oauthLoginInit() {
        return __awaiter(this, void 0, void 0, function*() {
            var _a, _b, _c, _d;
            if ("TURBOPACK compile-time truthy", 1) {
                return null;
            }
            //TURBOPACK unreachable
            ;
            const params = undefined;
            const error = undefined;
            const code = undefined;
        });
    }
    _waitForOAuthCallbackResponse() {
        return __awaiter(this, void 0, void 0, function*() {
            return yield this._oauthCallbackResponse;
        });
    }
    __subscribeMutationErrors(cb) {
        this.mutationErrorCbs.push(cb);
        return ()=>{
            this.mutationErrorCbs = this.mutationErrorCbs.filter((x)=>x !== cb);
        };
    }
    subscribeAuth(cb) {
        this.authCbs.push(cb);
        const currUserCached = this._currentUserCached;
        if (!currUserCached.isLoading) {
            cb(this._currentUserCached);
        }
        let unsubbed = false;
        this.getCurrentUser().then((resp)=>{
            if (unsubbed) return;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["areObjectsDeepEqual"])(resp, currUserCached)) return;
            cb(resp);
        });
        return ()=>{
            unsubbed = true;
            this.authCbs = this.authCbs.filter((x)=>x !== cb);
        };
    }
    getAuth() {
        return __awaiter(this, void 0, void 0, function*() {
            const { user, error } = yield this.getCurrentUser();
            if (error) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$InstantError$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InstantError"]('Could not get current user: ' + error.message);
            }
            return user;
        });
    }
    subscribeConnectionStatus(cb) {
        this.connectionStatusCbs.push(cb);
        return ()=>{
            this.connectionStatusCbs = this.connectionStatusCbs.filter((x)=>x !== cb);
        };
    }
    subscribeAttrs(cb) {
        this.attrsCbs.push(cb);
        if (this.attrs) {
            cb(this.attrs);
        }
        return ()=>{
            this.attrsCbs = this.attrsCbs.filter((x)=>x !== cb);
        };
    }
    notifyAuthSubs(user) {
        this.authCbs.forEach((cb)=>cb(user));
    }
    notifyMutationErrorSubs(error) {
        this.mutationErrorCbs.forEach((cb)=>cb(error));
    }
    notifyAttrsSubs() {
        if (!this.attrs) return;
        const oas = this.optimisticAttrs();
        this.attrsCbs.forEach((cb)=>cb(oas));
    }
    notifyConnectionStatusSubs(status) {
        this.connectionStatusCbs.forEach((cb)=>cb(status));
    }
    setCurrentUser(user) {
        return __awaiter(this, void 0, void 0, function*() {
            this.kv.updateInPlace((prev)=>{
                prev[currentUserKey] = user;
            });
            yield this.kv.waitForKeyToLoad(currentUserKey);
        });
    }
    getCurrentUserCached() {
        return this._currentUserCached;
    }
    _getCurrentUser() {
        return __awaiter(this, void 0, void 0, function*() {
            const user = yield this.kv.waitForKeyToLoad(currentUserKey);
            return typeof user === 'string' ? JSON.parse(user) : user;
        });
    }
    getCurrentUser() {
        return __awaiter(this, void 0, void 0, function*() {
            const oauthResp = yield this._waitForOAuthCallbackResponse();
            if (oauthResp === null || oauthResp === void 0 ? void 0 : oauthResp.error) {
                const errorV = {
                    error: oauthResp.error,
                    user: undefined
                };
                this._currentUserCached = Object.assign({
                    isLoading: false
                }, errorV);
                return errorV;
            }
            try {
                const user = yield this._getCurrentUser();
                const userV = {
                    user: user,
                    error: undefined
                };
                this._currentUserCached = Object.assign({
                    isLoading: false
                }, userV);
                return userV;
            } catch (e) {
                return {
                    user: undefined,
                    isLoading: false,
                    error: {
                        message: (e === null || e === void 0 ? void 0 : e.message) || 'Error loading user'
                    }
                };
            }
        });
    }
    _hasCurrentUser() {
        return __awaiter(this, void 0, void 0, function*() {
            const user = yield this.kv.waitForKeyToLoad(currentUserKey);
            return typeof user === 'string' ? JSON.parse(user) != null : user != null;
        });
    }
    changeCurrentUser(newUser) {
        return __awaiter(this, void 0, void 0, function*() {
            var _a;
            const { user: oldUser } = yield this.getCurrentUser();
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["areObjectsDeepEqual"])(oldUser, newUser)) {
                // We were already logged in as the newUser, don't
                // bother updating
                return;
            }
            yield this.setCurrentUser(newUser);
            // We need to remove all `result` from querySubs,
            // as they are no longer valid for the new user
            this.updateUser(newUser);
            try {
                (_a = this._broadcastChannel) === null || _a === void 0 ? void 0 : _a.postMessage({
                    type: 'auth'
                });
            } catch (error) {
                console.error('Error posting message to broadcast channel', error);
            }
        });
    }
    updateUser(newUser) {
        const newV = {
            error: undefined,
            user: newUser
        };
        this._currentUserCached = Object.assign({
            isLoading: false
        }, newV);
        this._dataForQueryCache = {};
        this.querySubs.updateInPlace((prev)=>{
            Object.keys(prev).forEach((k)=>{
                delete prev[k].result;
            });
        });
        this._reconnectTimeoutMs = 0;
        this._transport.close();
        this._oauthCallbackResponse = null;
        this.notifyAuthSubs(newV);
    }
    sendMagicCode({ email }) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$authAPI$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendMagicCode"]({
            apiURI: this.config.apiURI,
            appId: this.config.appId,
            email: email
        });
    }
    signInWithMagicCode(_a) {
        return __awaiter(this, arguments, void 0, function*({ email, code }) {
            var _b;
            const currentUser = yield this.getCurrentUser();
            const isGuest = ((_b = currentUser === null || currentUser === void 0 ? void 0 : currentUser.user) === null || _b === void 0 ? void 0 : _b.type) === 'guest';
            const res = yield __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$authAPI$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyMagicCode"]({
                apiURI: this.config.apiURI,
                appId: this.config.appId,
                email,
                code,
                refreshToken: isGuest ? currentUser.user.refresh_token : undefined
            });
            yield this.changeCurrentUser(res.user);
            return res;
        });
    }
    signInWithCustomToken(authToken) {
        return __awaiter(this, void 0, void 0, function*() {
            const res = yield __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$authAPI$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyRefreshToken"]({
                apiURI: this.config.apiURI,
                appId: this.config.appId,
                refreshToken: authToken
            });
            yield this.changeCurrentUser(res.user);
            return res;
        });
    }
    signInAsGuest() {
        return __awaiter(this, void 0, void 0, function*() {
            const res = yield __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$authAPI$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["signInAsGuest"]({
                apiURI: this.config.apiURI,
                appId: this.config.appId
            });
            yield this.changeCurrentUser(res.user);
            return res;
        });
    }
    potentiallyInvalidateToken(currentUser, opts) {
        var _a;
        const refreshToken = (_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser.user) === null || _a === void 0 ? void 0 : _a.refresh_token;
        if (!refreshToken) {
            return;
        }
        const wantsToSkip = opts.invalidateToken === false;
        if (wantsToSkip) {
            this._log.info('[auth-invalidate] skipped invalidateToken');
            return;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$authAPI$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["signOut"]({
            apiURI: this.config.apiURI,
            appId: this.config.appId,
            refreshToken
        }).then(()=>{
            this._log.info('[auth-invalidate] completed invalidateToken');
        }).catch((e)=>{});
    }
    signOut(opts) {
        return __awaiter(this, void 0, void 0, function*() {
            const currentUser = yield this.getCurrentUser();
            this.potentiallyInvalidateToken(currentUser, opts);
            yield this.changeCurrentUser(null);
        });
    }
    /**
     * Creates an OAuth authorization URL.
     *
     * @param {Object} params - The parameters to create the authorization URL.
     * @param {string} params.clientName - The name of the client requesting authorization.
     * @param {string} params.redirectURL - The URL to redirect users to after authorization.
     * @returns {string} The created authorization URL.
     */ createAuthorizationURL({ clientName, redirectURL }) {
        const { apiURI, appId } = this.config;
        return `${apiURI}/runtime/oauth/start?app_id=${appId}&client_name=${clientName}&redirect_uri=${redirectURL}`;
    }
    /**
     * @param {Object} params
     * @param {string} params.code - The code received from the OAuth service.
     * @param {string} [params.codeVerifier] - The code verifier used to generate the code challenge.
     */ exchangeCodeForToken(_a) {
        return __awaiter(this, arguments, void 0, function*({ code, codeVerifier }) {
            var _b;
            const currentUser = yield this.getCurrentUser();
            const isGuest = ((_b = currentUser === null || currentUser === void 0 ? void 0 : currentUser.user) === null || _b === void 0 ? void 0 : _b.type) === 'guest';
            const res = yield __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$authAPI$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["exchangeCodeForToken"]({
                apiURI: this.config.apiURI,
                appId: this.config.appId,
                code: code,
                codeVerifier,
                refreshToken: isGuest ? currentUser.user.refresh_token : undefined
            });
            yield this.changeCurrentUser(res.user);
            return res;
        });
    }
    issuerURI() {
        const { apiURI, appId } = this.config;
        return `${apiURI}/runtime/${appId}`;
    }
    /**
     * @param {Object} params
     * @param {string} params.clientName - The name of the client requesting authorization.
     * @param {string} params.idToken - The id_token from the external service
     * @param {string | null | undefined} [params.nonce] - The nonce used when requesting the id_token from the external service
     */ signInWithIdToken(_a) {
        return __awaiter(this, arguments, void 0, function*({ idToken, clientName, nonce }) {
            var _b;
            const currentUser = yield this.getCurrentUser();
            const refreshToken = (_b = currentUser === null || currentUser === void 0 ? void 0 : currentUser.user) === null || _b === void 0 ? void 0 : _b.refresh_token;
            const res = yield __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$authAPI$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["signInWithIdToken"]({
                apiURI: this.config.apiURI,
                appId: this.config.appId,
                idToken,
                clientName,
                nonce,
                refreshToken
            });
            yield this.changeCurrentUser(res.user);
            return res;
        });
    }
    // --------
    // Rooms
    /**
     * @param {string} roomId
     * @param {any | null | undefined} [initialPresence] -- initial presence data to send when joining the room
     * @returns () => void
     */ joinRoom(roomId, initialPresence) {
        let needsToSendJoin = false;
        if (!this._rooms[roomId]) {
            needsToSendJoin = true;
            this._rooms[roomId] = {
                isConnected: false,
                error: undefined
            };
        }
        this._presence[roomId] = this._presence[roomId] || {};
        const previousResult = this._presence[roomId].result;
        if (initialPresence && !previousResult) {
            this._presence[roomId].result = this._presence[roomId].result || {};
            this._presence[roomId].result.user = initialPresence;
            this._notifyPresenceSubs(roomId);
        }
        if (needsToSendJoin) {
            this._tryJoinRoom(roomId, initialPresence);
        }
        return ()=>{
            this._cleanupRoom(roomId);
        };
    }
    _cleanupRoom(roomId) {
        var _a, _b, _c, _d;
        if (!((_b = (_a = this._presence[roomId]) === null || _a === void 0 ? void 0 : _a.handlers) === null || _b === void 0 ? void 0 : _b.length) && !Object.keys((_c = this._broadcastSubs[roomId]) !== null && _c !== void 0 ? _c : {}).length) {
            const isConnected = (_d = this._rooms[roomId]) === null || _d === void 0 ? void 0 : _d.isConnected;
            delete this._rooms[roomId];
            delete this._presence[roomId];
            delete this._broadcastSubs[roomId];
            if (isConnected) {
                this._tryLeaveRoom(roomId);
            } else {
                this._roomsPendingLeave[roomId] = true;
            }
        }
    }
    // --------
    // Presence
    // TODO: look into typing again
    getPresence(roomType, roomId, opts = {}) {
        const room = this._rooms[roomId];
        const presence = this._presence[roomId];
        if (!room || !presence || !presence.result) return null;
        return Object.assign(Object.assign({}, (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$presence$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildPresenceSlice"])(presence.result, opts, this._sessionId)), {
            isLoading: !room.isConnected,
            error: room.error
        });
    }
    // TODO: look into typing again
    publishPresence(roomType, roomId, partialData) {
        const room = this._rooms[roomId];
        const presence = this._presence[roomId];
        if (!room || !presence) {
            return;
        }
        presence.result = presence.result || {};
        const data = Object.assign(Object.assign({}, presence.result.user), partialData);
        presence.result.user = data;
        if (!room.isConnected) {
            return;
        }
        this._trySetPresence(roomId, data);
        this._notifyPresenceSubs(roomId);
    }
    _trySetPresence(roomId, data) {
        this._trySendAuthed((0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(), {
            op: 'set-presence',
            'room-id': roomId,
            data
        });
    }
    _tryJoinRoom(roomId, data) {
        this._trySendAuthed((0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(), {
            op: 'join-room',
            'room-id': roomId,
            data
        });
        delete this._roomsPendingLeave[roomId];
    }
    _tryLeaveRoom(roomId) {
        this._trySendAuthed((0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(), {
            op: 'leave-room',
            'room-id': roomId
        });
    }
    _trySetRoomConnected(roomId, isConnected) {
        const room = this._rooms[roomId];
        if (room) {
            room.isConnected = isConnected;
        }
    }
    // TODO: look into typing again
    subscribePresence(roomType, roomId, opts, cb) {
        const leaveRoom = this.joinRoom(roomId, // Oct 28, 2025
        // Note: initialData is deprecated.
        // Keeping here for backwards compatibility
        opts.initialPresence || opts.initialData);
        const handler = Object.assign(Object.assign({}, opts), {
            roomId,
            cb,
            prev: null
        });
        this._presence[roomId] = this._presence[roomId] || {};
        this._presence[roomId].handlers = this._presence[roomId].handlers || [];
        this._presence[roomId].handlers.push(handler);
        this._notifyPresenceSub(roomId, handler);
        return ()=>{
            var _a, _b, _c;
            this._presence[roomId].handlers = (_c = (_b = (_a = this._presence[roomId]) === null || _a === void 0 ? void 0 : _a.handlers) === null || _b === void 0 ? void 0 : _b.filter((x)=>x !== handler)) !== null && _c !== void 0 ? _c : [];
            leaveRoom();
        };
    }
    _notifyPresenceSubs(roomId) {
        var _a, _b;
        (_b = (_a = this._presence[roomId]) === null || _a === void 0 ? void 0 : _a.handlers) === null || _b === void 0 ? void 0 : _b.forEach((handler)=>{
            this._notifyPresenceSub(roomId, handler);
        });
    }
    _notifyPresenceSub(roomId, handler) {
        const slice = this.getPresence('', roomId, handler);
        if (!slice) {
            return;
        }
        if (handler.prev && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$presence$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasPresenceResponseChanged"])(slice, handler.prev)) {
            return;
        }
        handler.prev = slice;
        handler.cb(slice);
    }
    _patchPresencePeers(roomId, edits) {
        var _a, _b, _c;
        const peers = ((_b = (_a = this._presence[roomId]) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.peers) || {};
        let sessions = Object.fromEntries(Object.entries(peers).map(([k, v])=>[
                k,
                {
                    data: v
                }
            ]));
        const myPresence = (_c = this._presence[roomId]) === null || _c === void 0 ? void 0 : _c.result;
        const newSessions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$mutative$2f$dist$2f$mutative$2e$esm$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["create"])(sessions, (draft)=>{
            for (let [path, op, value] of edits){
                switch(op){
                    case '+':
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["insertInMutative"])(draft, path, value);
                        break;
                    case 'r':
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assocInMutative"])(draft, path, value);
                        break;
                    case '-':
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dissocInMutative"])(draft, path);
                        break;
                }
            }
            // Ignore our own edits
            delete draft[this._sessionId];
        });
        this._setPresencePeers(roomId, newSessions);
    }
    _setPresencePeers(roomId, data) {
        const sessions = Object.assign({}, data);
        // no need to keep track of `user`
        delete sessions[this._sessionId];
        const peers = Object.fromEntries(Object.entries(sessions).map(([k, v])=>[
                k,
                v.data
            ]));
        this._presence = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$mutative$2f$dist$2f$mutative$2e$esm$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["create"])(this._presence, (draft)=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assocInMutative"])(draft, [
                roomId,
                'result',
                'peers'
            ], peers);
        });
    }
    // --------
    // Broadcast
    publishTopic({ roomType, roomId, topic, data }) {
        var _a;
        const room = this._rooms[roomId];
        if (!room) {
            return;
        }
        if (!room.isConnected) {
            this._broadcastQueue[roomId] = (_a = this._broadcastQueue[roomId]) !== null && _a !== void 0 ? _a : [];
            this._broadcastQueue[roomId].push({
                topic,
                roomType,
                data
            });
            return;
        }
        this._tryBroadcast(roomId, roomType, topic, data);
    }
    _tryBroadcast(roomId, roomType, topic, data) {
        this._trySendAuthed((0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(), {
            op: 'client-broadcast',
            'room-id': roomId,
            roomType,
            topic,
            data
        });
    }
    subscribeTopic(roomId, topic, cb) {
        const leaveRoom = this.joinRoom(roomId);
        this._broadcastSubs[roomId] = this._broadcastSubs[roomId] || {};
        this._broadcastSubs[roomId][topic] = this._broadcastSubs[roomId][topic] || [];
        this._broadcastSubs[roomId][topic].push(cb);
        this._presence[roomId] = this._presence[roomId] || {};
        return ()=>{
            this._broadcastSubs[roomId][topic] = this._broadcastSubs[roomId][topic].filter((x)=>x !== cb);
            if (!this._broadcastSubs[roomId][topic].length) {
                delete this._broadcastSubs[roomId][topic];
            }
            leaveRoom();
        };
    }
    _notifyBroadcastSubs(room, topic, msg) {
        var _a, _b, _c;
        (_c = (_b = (_a = this._broadcastSubs) === null || _a === void 0 ? void 0 : _a[room]) === null || _b === void 0 ? void 0 : _b[topic]) === null || _c === void 0 ? void 0 : _c.forEach((cb)=>{
            var _a, _b, _c, _d, _e, _f;
            const data = (_a = msg.data) === null || _a === void 0 ? void 0 : _a.data;
            const peer = msg.data['peer-id'] === this._sessionId ? (_c = (_b = this._presence[room]) === null || _b === void 0 ? void 0 : _b.result) === null || _c === void 0 ? void 0 : _c.user : (_f = (_e = (_d = this._presence[room]) === null || _d === void 0 ? void 0 : _d.result) === null || _e === void 0 ? void 0 : _e.peers) === null || _f === void 0 ? void 0 : _f[msg.data['peer-id']];
            return cb(data, peer);
        });
    }
    // --------
    // Storage
    uploadFile(path, file, opts) {
        return __awaiter(this, void 0, void 0, function*() {
            var _a;
            const currentUser = yield this.getCurrentUser();
            const refreshToken = (_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser.user) === null || _a === void 0 ? void 0 : _a.refresh_token;
            return __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$StorageAPI$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uploadFile"](Object.assign(Object.assign({}, opts), {
                apiURI: this.config.apiURI,
                appId: this.config.appId,
                path: path,
                file,
                refreshToken: refreshToken
            }));
        });
    }
    deleteFile(path) {
        return __awaiter(this, void 0, void 0, function*() {
            var _a;
            const currentUser = yield this.getCurrentUser();
            const refreshToken = (_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser.user) === null || _a === void 0 ? void 0 : _a.refresh_token;
            const result = yield __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$StorageAPI$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteFile"]({
                apiURI: this.config.apiURI,
                appId: this.config.appId,
                path,
                refreshToken: refreshToken
            });
            return result;
        });
    }
    // Deprecated Storage API (Jan 2025)
    // ---------------------------------
    upload(path, file) {
        return __awaiter(this, void 0, void 0, function*() {
            var _a;
            const currentUser = yield this.getCurrentUser();
            const refreshToken = (_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser.user) === null || _a === void 0 ? void 0 : _a.refresh_token;
            const fileName = path || file.name;
            const url = yield __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$StorageAPI$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSignedUploadUrl"]({
                apiURI: this.config.apiURI,
                appId: this.config.appId,
                fileName: fileName,
                refreshToken: refreshToken
            });
            const isSuccess = yield __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$StorageAPI$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["upload"](url, file);
            return isSuccess;
        });
    }
    getDownloadUrl(path) {
        return __awaiter(this, void 0, void 0, function*() {
            var _a;
            const currentUser = yield this.getCurrentUser();
            const refreshToken = (_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser.user) === null || _a === void 0 ? void 0 : _a.refresh_token;
            const url = yield __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$StorageAPI$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDownloadUrl"]({
                apiURI: this.config.apiURI,
                appId: this.config.appId,
                path: path,
                refreshToken: refreshToken
            });
            return url;
        });
    }
} //# sourceMappingURL=Reactor.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/schema.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "i",
    ()=>i
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$schemaTypes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/schemaTypes.js [app-route] (ecmascript)");
;
// ==========
// API
/**
 * @deprecated
 * `i.graph` is deprecated. Use `i.schema` instead.
 *
 * @example
 * // Before
 * i.graph(entities, links).withRoomSchema<RoomType>();
 *
 * // After
 * i.schema({ entities, links, rooms })
 *
 * @see
 * https://instantdb.com/docs/modeling-data
 */ function graph(entities, links) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$schemaTypes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InstantSchemaDef"](enrichEntitiesWithLinks(entities, links), // (XXX): LinksDef<any> stems from TypeScript’s inability to reconcile the
    // type EntitiesWithLinks<EntitiesWithoutLinks, Links> with
    // EntitiesWithoutLinks. TypeScript is strict about ensuring that types are
    // correctly aligned and does not allow for substituting a type that might
    // be broader or have additional properties.
    links, undefined);
}
/**
 * Creates an entity definition, to be used in conjunction with `i.graph`.
 *
 * @see https://instantdb.com/docs/modeling-data
 * @example
 *   {
 *     posts: i.entity({
 *       title: i.string(),
 *       body: i.string(),
 *     }),
 *     comments: i.entity({
 *       body: i.string(),
 *     })
 *   }
 */ function entity(attrs) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$schemaTypes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EntityDef"](attrs, {});
}
function string() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$schemaTypes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataAttrDef"]('string', true, false);
}
function number() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$schemaTypes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataAttrDef"]('number', true, false);
}
function boolean() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$schemaTypes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataAttrDef"]('boolean', true, false);
}
function date() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$schemaTypes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataAttrDef"]('date', true, false);
}
function json() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$schemaTypes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataAttrDef"]('json', true, false);
}
function any() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$schemaTypes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataAttrDef"]('json', true, false);
}
// ==========
// internal
function enrichEntitiesWithLinks(entities, links) {
    var _a, _b, _c, _d;
    const linksIndex = {
        fwd: {},
        rev: {}
    };
    for (const linkDef of Object.values(links)){
        (_a = linksIndex.fwd)[_b = linkDef.forward.on] || (_a[_b] = {});
        (_c = linksIndex.rev)[_d = linkDef.reverse.on] || (_c[_d] = {});
        linksIndex.fwd[linkDef.forward.on][linkDef.forward.label] = {
            entityName: linkDef.reverse.on,
            cardinality: linkDef.forward.has
        };
        linksIndex.rev[linkDef.reverse.on][linkDef.reverse.label] = {
            entityName: linkDef.forward.on,
            cardinality: linkDef.reverse.has
        };
    }
    const enrichedEntities = Object.fromEntries(Object.entries(entities).map(([name, def])=>[
            name,
            new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$schemaTypes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EntityDef"](def.attrs, Object.assign(Object.assign({}, linksIndex.fwd[name]), linksIndex.rev[name]))
        ]));
    return enrichedEntities;
}
/**
 * Lets you define a schema for your database.
 *
 * You can define entities, links between entities, and if you use
 * presence, you can define rooms.
 *
 * You can push this schema to your database with the CLI,
 * or use it inside `init`, to get typesafety and autocompletion.
 *
 * @see https://instantdb.com/docs/modeling-data
 * @example
 *   i.schema({
 *     entities: { },
 *     links: { },
 *     rooms: { }
 *   });
 */ function schema({ entities, links, rooms }) {
    const linksDef = links !== null && links !== void 0 ? links : {};
    const roomsDef = rooms !== null && rooms !== void 0 ? rooms : {};
    return new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$schemaTypes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InstantSchemaDef"](enrichEntitiesWithLinks(entities, linksDef), // (XXX): LinksDef<any> stems from TypeScript's inability to reconcile the
    // type EntitiesWithLinks<EntitiesWithoutLinks, Links> with
    // EntitiesWithoutLinks. TypeScript is strict about ensuring that types are
    // correctly aligned and does not allow for substituting a type that might
    // be broader or have additional properties.
    linksDef, roomsDef);
}
const i = {
    // constructs
    graph,
    schema,
    entity,
    // value types
    string,
    number,
    boolean,
    date,
    json,
    any
}; //# sourceMappingURL=schema.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/devtool.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createDevtool",
    ()=>createDevtool
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$flags$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/flags.js [app-route] (ecmascript)");
;
let currentDevtool;
function createDevtool(appId, config) {
    currentDevtool === null || currentDevtool === void 0 ? void 0 : currentDevtool.dispose();
    const iframeContrainer = createIframeContainer(config);
    const toggler = createToggler(config, toggleView);
    const iframe = createIframe(getSrc(appId));
    function onPostMessage(event) {
        var _a;
        if (event.source !== iframe.element.contentWindow) return;
        if (((_a = event.data) === null || _a === void 0 ? void 0 : _a.type) === 'close' && iframeContrainer.isVisible()) {
            toggleView();
        }
    }
    function onKeyDown(event) {
        const isToggleShortcut = event.shiftKey && event.ctrlKey && event.key === '0';
        const isEsc = event.key === 'Escape' || event.key === 'Esc';
        if (isToggleShortcut) {
            toggleView();
        } else if (isEsc && iframeContrainer.isVisible()) {
            toggleView();
        }
    }
    function toggleView() {
        if (iframeContrainer.isVisible()) {
            iframeContrainer.element.style.display = 'none';
        } else {
            iframeContrainer.element.style.display = 'block';
            // lazily render iframe on first open
            if (!iframeContrainer.element.contains(iframe.element)) {
                iframeContrainer.element.appendChild(iframe.element);
            }
        }
    }
    function dispose() {
        iframeContrainer.element.remove();
        toggler.element.remove();
        removeEventListener('keydown', onKeyDown);
        removeEventListener('message', onPostMessage);
    }
    function create() {
        document.body.appendChild(iframeContrainer.element);
        document.body.appendChild(toggler.element);
        addEventListener('keydown', onKeyDown);
        addEventListener('message', onPostMessage);
        currentDevtool = {
            dispose
        };
    }
    return create();
}
function getSrc(appId) {
    const useLocalDashboard = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$flags$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["devBackend"] || __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$flags$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["devtoolLocalDashboard"];
    const src = `${useLocalDashboard ? 'http://localhost:3000' : 'https://instantdb.com'}/_devtool?appId=${appId}`;
    return src;
}
function createIframe(src) {
    const element = document.createElement('iframe');
    element.src = src;
    element.className = 'instant-devtool-iframe';
    Object.assign(element.style, {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        border: 'none'
    });
    return {
        element
    };
}
function createToggler(config, onClick) {
    const logoSVG = `
    <svg width="32" height="32" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="black"/>
      <rect x="97.0973" y="91.3297" width="140" height="330" fill="white"/>
    </svg>
  `;
    const element = document.createElement('button');
    element.innerHTML = logoSVG;
    element.className = 'instant-devtool-toggler';
    Object.assign(element.style, Object.assign(Object.assign({
        // pos
        position: 'fixed'
    }, cssPositionForToggler(config.position)), {
        height: '32px',
        width: '32px',
        // layout
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '9010',
        // look
        padding: '0',
        margin: '0',
        border: 'none',
        cursor: 'pointer'
    }));
    element.addEventListener('click', onClick);
    return {
        element
    };
}
function cssPositionForToggler(position) {
    switch(position){
        case 'bottom-left':
            return {
                bottom: '24px',
                left: '24px'
            };
        case 'bottom-right':
            return {
                bottom: '24px',
                right: '24px'
            };
        case 'top-right':
            return {
                top: '24px',
                right: '24px'
            };
        case 'top-left':
            return {
                top: '24px',
                left: '24px'
            };
    }
}
function cssPositionForIframeContainer(position) {
    switch(position){
        case 'bottom-left':
            return {
                bottom: '24px',
                right: '24px',
                left: '60px',
                top: '72px'
            };
        case 'bottom-right':
            return {
                bottom: '24px',
                left: '24px',
                right: '60px',
                top: '72px'
            };
        case 'top-right':
            return {
                top: '24px',
                left: '24px',
                right: '60px',
                bottom: '72px'
            };
        case 'top-left':
            return {
                top: '24px',
                right: '24px',
                left: '60px',
                bottom: '72px'
            };
    }
}
function createIframeContainer(config) {
    const element = document.createElement('div');
    Object.assign(element.style, Object.assign(Object.assign({
        position: 'fixed'
    }, cssPositionForIframeContainer(config.position)), {
        display: 'block',
        borderRadius: '4px',
        border: '1px #ccc solid',
        boxShadow: '0px 0px 8px #00000044',
        backgroundColor: '#eee',
        zIndex: '999990'
    }));
    element.style.display = 'none';
    element.className = 'instant-devtool-container';
    function isVisible() {
        return element.style.display !== 'none';
    }
    return {
        element,
        isVisible
    };
} //# sourceMappingURL=devtool.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/index.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Auth",
    ()=>Auth,
    "InstantCoreDatabase",
    ()=>InstantCoreDatabase,
    "Storage",
    ()=>Storage,
    "coerceQuery",
    ()=>coerceQuery,
    "init",
    ()=>init,
    "init_experimental",
    ()=>init_experimental
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$Reactor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/Reactor.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instatx$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/instatx.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$weakHash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/weakHash.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/uuid.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$IndexedDBStorage$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/IndexedDBStorage.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$dates$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/dates.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$WindowNetworkListener$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/WindowNetworkListener.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/schema.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$devtool$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/devtool.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$version$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/version.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$queryValidation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/queryValidation.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$transactionValidation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/transactionValidation.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$PersistedObject$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/PersistedObject.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$fetch$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/fetch.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$InstantError$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/InstantError.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$SyncTable$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/SyncTable.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const defaultOpenDevtool = true;
// consts
const defaultConfig = {
    apiURI: 'https://api.instantdb.com',
    websocketURI: 'wss://api.instantdb.com/runtime/session'
};
// hmr
function initSchemaHashStore() {
    var _a;
    globalThis.__instantDbSchemaHashStore = (_a = globalThis.__instantDbSchemaHashStore) !== null && _a !== void 0 ? _a : new WeakMap();
    return globalThis.__instantDbSchemaHashStore;
}
function initGlobalInstantCoreStore() {
    var _a;
    globalThis.__instantDbStore = (_a = globalThis.__instantDbStore) !== null && _a !== void 0 ? _a : {};
    return globalThis.__instantDbStore;
}
function reactorKey(config) {
    // @ts-expect-error
    const adminToken = config.__adminToken;
    return config.appId + '_' + (config.websocketURI || 'default_ws_uri') + '_' + (config.apiURI || 'default_api_uri') + '_' + (adminToken || 'client_only') + '_' + config.useDateObjects;
}
const globalInstantCoreStore = initGlobalInstantCoreStore();
const schemaHashStore = initSchemaHashStore();
/**
 * Functions to log users in and out.
 *
 * @see https://instantdb.com/docs/auth
 */ class Auth {
    constructor(db){
        this.db = db;
        /**
         * Sends a magic code to the user's email address.
         *
         * Once you send the magic code, see {@link auth.signInWithMagicCode} to let the
         * user verify.
         *
         * @see https://instantdb.com/docs/auth
         * @example
         *  db.auth.sendMagicCode({email: "example@gmail.com"})
         *    .catch((err) => console.error(err.body?.message))
         */ this.sendMagicCode = (params)=>{
            return this.db.sendMagicCode(params);
        };
        /**
         * Verify a magic code that was sent to the user's email address.
         *
         * @see https://instantdb.com/docs/auth
         *
         * @example
         *  db.auth.signInWithMagicCode({email: "example@gmail.com", code: "123456"})
         *       .catch((err) => console.error(err.body?.message))
         */ this.signInWithMagicCode = (params)=>{
            return this.db.signInWithMagicCode(params);
        };
        /**
         * Sign in a user with a refresh token
         *
         * @see https://instantdb.com/docs/backend#frontend-auth-sign-in-with-token
         *
         * @example
         *   // Get the token from your backend
         *   const token = await fetch('/signin', ...);
         *   //Sign in
         *   db.auth.signInWithToken(token);
         */ this.signInWithToken = (token)=>{
            return this.db.signInWithCustomToken(token);
        };
        /**
         * Sign in as guest, creating a new user without email
         *
         * @see https://instantdb.com/docs/auth
         *
         * @example
         *   db.auth.signInAsGuest();
         */ this.signInAsGuest = ()=>{
            return this.db.signInAsGuest();
        };
        /**
         * Create an authorization url to sign in with an external provider.
         *
         * @see https://instantdb.com/docs/auth
         *
         * @example
         *   // Get the authorization url from your backend
         *   const url = db.auth.createAuthorizationUrl({
         *     clientName: "google",
         *     redirectURL: window.location.href,
         *   });
         *
         *   // Put it in a sign in link
         *   <a href={url}>Log in with Google</a>
         */ this.createAuthorizationURL = (params)=>{
            return this.db.createAuthorizationURL(params);
        };
        /**
         * Sign in with the id_token from an external provider like Google
         *
         * @see https://instantdb.com/docs/auth
         * @example
         *   db.auth
         *  .signInWithIdToken({
         *    // Token from external service
         *    idToken: id_token,
         *    // The name you gave the client when you registered it with Instant
         *    clientName: "google",
         *    // The nonce, if any, that you used when you initiated the auth flow
         *    // with the external service.
         *    nonce: your_nonce
         *  })
         *  .catch((err) => console.error(err.body?.message));
         *
         */ this.signInWithIdToken = (params)=>{
            return this.db.signInWithIdToken(params);
        };
        /**
         * Sign in with the id_token from an external provider like Google
         *
         * @see https://instantdb.com/docs/auth
         * @example
         *   db.auth
         *  .exchangeOAuthCode({
         *    // code received in redirect from OAuth callback
         *    code: code
         *    // The PKCE code_verifier, if any, that you used when you
         *    // initiated the auth flow
         *    codeVerifier: your_code_verifier
         *  })
         *  .catch((err) => console.error(err.body?.message));
         *
         */ this.exchangeOAuthCode = (params)=>{
            return this.db.exchangeCodeForToken(params);
        };
        /**
         * OpenID Discovery path for use with tools like
         * expo-auth-session that use auto-discovery of
         * OAuth parameters.
         *
         * @see https://instantdb.com/docs/auth
         * @example
         *   const discovery = useAutoDiscovery(
         *     db.auth.issuerURI()
         *   );
         */ this.issuerURI = ()=>{
            return this.db.issuerURI();
        };
        /**
         * Sign out the current user
         */ this.signOut = (opts = {
            invalidateToken: true
        })=>{
            return this.db.signOut(opts);
        };
    }
}
/**
 * Functions to manage file storage.
 */ class Storage {
    constructor(db){
        this.db = db;
        /**
         * Uploads file at the provided path.
         *
         * @see https://instantdb.com/docs/storage
         * @example
         *   const [file] = e.target.files; // result of file input
         *   const data = await db.storage.uploadFile('photos/demo.png', file);
         */ this.uploadFile = (path, file, opts = {})=>{
            return this.db.uploadFile(path, file, opts);
        };
        /**
         * Deletes a file by path name.
         *
         * @see https://instantdb.com/docs/storage
         * @example
         *   await db.storage.delete('photos/demo.png');
         */ this.delete = (pathname)=>{
            return this.db.deleteFile(pathname);
        };
        // Deprecated Storage API (Jan 2025)
        // ---------------------------------
        /**
         * @deprecated. Use `db.storage.uploadFile` instead
         * remove in the future.
         */ this.upload = (pathname, file)=>{
            return this.db.upload(pathname, file);
        };
        /**
         * @deprecated Use `db.storage.uploadFile` instead
         */ this.put = this.upload;
        /**
         * @deprecated. getDownloadUrl will be removed in the future.
         * Use `useQuery` instead to query and fetch for valid urls
         *
         * db.useQuery({
         *   $files: {
         *     $: {
         *       where: {
         *         path: "moop.png"
         *       }
         *     }
         *   }
         * })
         */ this.getDownloadUrl = (pathname)=>{
            return this.db.getDownloadUrl(pathname);
        };
    }
}
// util
function coerceQuery(o) {
    // stringify and parse to remove undefined values
    return JSON.parse(JSON.stringify(o));
}
class InstantCoreDatabase {
    constructor(reactor){
        this.tx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$instatx$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["txInit"])();
        this._reactor = reactor;
        this.auth = new Auth(this._reactor);
        this.storage = new Storage(this._reactor);
    }
    /**
     * Use this to write data! You can create, update, delete, and link objects
     *
     * @see https://instantdb.com/docs/instaml
     *
     * @example
     *   // Create a new object in the `goals` namespace
     *   const goalId = id();
     *   db.transact(db.tx.goals[goalId].update({title: "Get fit"}))
     *
     *   // Update the title
     *   db.transact(db.tx.goals[goalId].update({title: "Get super fit"}))
     *
     *   // Delete it
     *   db.transact(db.tx.goals[goalId].delete())
     *
     *   // Or create an association:
     *   todoId = id();
     *   db.transact([
     *    db.tx.todos[todoId].update({ title: 'Go on a run' }),
     *    db.tx.goals[goalId].link({todos: todoId}),
     *  ])
     */ transact(chunks) {
        return this._reactor.pushTx(chunks);
    }
    getLocalId(name) {
        return this._reactor.getLocalId(name);
    }
    /**
     * Use this to query your data!
     *
     * @see https://instantdb.com/docs/instaql
     *
     * @example
     *  // listen to all goals
     *  db.subscribeQuery({ goals: {} }, (resp) => {
     *    console.log(resp.data.goals)
     *  })
     *
     *  // goals where the title is "Get Fit"
     *  db.subscribeQuery(
     *    { goals: { $: { where: { title: "Get Fit" } } } },
     *    (resp) => {
     *      console.log(resp.data.goals)
     *    }
     *  )
     *
     *  // all goals, _alongside_ their todos
     *  db.subscribeQuery({ goals: { todos: {} } }, (resp) => {
     *    console.log(resp.data.goals)
     *  });
     */ subscribeQuery(query, cb, opts) {
        return this._reactor.subscribeQuery(query, cb, opts);
    }
    /**
     * Listen for the logged in state. This is useful
     * for deciding when to show a login screen.
     *
     * @see https://instantdb.com/docs/auth
     * @example
     *   const unsub = db.subscribeAuth((auth) => {
     *     if (auth.user) {
     *     console.log('logged in as', auth.user.email)
     *    } else {
     *      console.log('logged out')
     *    }
     *  })
     */ subscribeAuth(cb) {
        return this._reactor.subscribeAuth(cb);
    }
    /**
     * One time query for the logged in state. This is useful
     * for scenarios where you want to know the current auth
     * state without subscribing to changes.
     *
     * @see https://instantdb.com/docs/auth
     * @example
     *   const user = await db.getAuth();
     *   console.log('logged in as', user.email)
     */ getAuth() {
        return this._reactor.getAuth();
    }
    /**
     * Listen for connection status changes to Instant. This is useful
     * for building things like connectivity indicators
     *
     * @see https://www.instantdb.com/docs/patterns#connection-status
     * @example
     *   const unsub = db.subscribeConnectionStatus((status) => {
     *     const connectionState =
     *       status === 'connecting' || status === 'opened'
     *         ? 'authenticating'
     *       : status === 'authenticated'
     *         ? 'connected'
     *       : status === 'closed'
     *         ? 'closed'
     *       : status === 'errored'
     *         ? 'errored'
     *       : 'unexpected state';
     *
     *     console.log('Connection status:', connectionState);
     *   });
     */ subscribeConnectionStatus(cb) {
        return this._reactor.subscribeConnectionStatus(cb);
    }
    /**
     * Join a room to publish and subscribe to topics and presence.
     *
     * @see https://instantdb.com/docs/presence-and-topics
     * @example
     * // init
     * const db = init();
     * const room = db.joinRoom(roomType, roomId);
     * // usage
     * const unsubscribeTopic = room.subscribeTopic("foo", console.log);
     * const unsubscribePresence = room.subscribePresence({}, console.log);
     * room.publishTopic("hello", { message: "hello world!" });
     * room.publishPresence({ name: "joe" });
     * // later
     * unsubscribePresence();
     * unsubscribeTopic();
     * room.leaveRoom();
     */ joinRoom(roomType = '_defaultRoomType', roomId = '_defaultRoomId', opts) {
        const leaveRoom = this._reactor.joinRoom(roomId, opts === null || opts === void 0 ? void 0 : opts.initialPresence);
        return {
            leaveRoom,
            subscribeTopic: (topic, onEvent)=>this._reactor.subscribeTopic(roomId, topic, onEvent),
            subscribePresence: (opts, onChange)=>this._reactor.subscribePresence(roomType, roomId, opts, onChange),
            publishTopic: (topic, data)=>this._reactor.publishTopic({
                    roomType,
                    roomId,
                    topic,
                    data
                }),
            publishPresence: (data)=>this._reactor.publishPresence(roomType, roomId, data),
            getPresence: (opts)=>this._reactor.getPresence(roomType, roomId, opts)
        };
    }
    shutdown() {
        delete globalInstantCoreStore[reactorKey(this._reactor.config)];
        this._reactor.shutdown();
    }
    /**
     * Use this for one-off queries.
     * Returns local data if available, otherwise fetches from the server.
     * Because we want to avoid stale data, this method will throw an error
     * if the user is offline or there is no active connection to the server.
     *
     * @see https://instantdb.com/docs/instaql
     *
     * @example
     *
     *  const resp = await db.queryOnce({ goals: {} });
     *  console.log(resp.data.goals)
     */ queryOnce(query, opts) {
        return this._reactor.queryOnce(query, opts);
    }
    /**
     * @deprecated This is an experimental function that is not yet ready for production use.
     * Use this function to sync an entire namespace.
     * It has many limitations that will be removed in the future:
     * 1. Must be used with an admin token
     * 2. Does not support permissions
     * 3. Does not support where clauses
     * 4. Does not support links
     * It also does not support multiple top-level namespaces. For example,
     *  {posts: {}, users: {}} is invalid. Only `posts` or `users` is allowed, but not both.
     */ _syncTableExperimental(query, cb) {
        return this._reactor.subscribeTable(query, cb);
    }
}
function schemaHash(schema) {
    if (!schema) {
        return '0';
    }
    const fromStore = schemaHashStore.get(schema);
    if (fromStore) {
        return fromStore;
    }
    const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$weakHash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(schema);
    schemaHashStore.set(schema, hash);
    return hash;
}
function schemaChanged(existingClient, newSchema) {
    return schemaHash(existingClient._reactor.config.schema) !== schemaHash(newSchema);
}
/**
 *
 * The first step: init your application!
 *
 * Visit https://instantdb.com/dash to get your `appId` :)
 *
 * @example
 *  import { init } from "@instantdb/core"
 *
 *  const db = init({ appId: "my-app-id" })
 *
 *  // You can also provide a schema for type safety and editor autocomplete!
 *
 *  import { init } from "@instantdb/core"
 *  import schema from ""../instant.schema.ts";
 *
 *  const db = init({ appId: "my-app-id", schema })
 *
 *  // To learn more: https://instantdb.com/docs/modeling-data
 */ function init(config, Storage, NetworkListener, versions, EventSourceImpl) {
    const existingClient = globalInstantCoreStore[reactorKey(config)];
    if (existingClient) {
        if (schemaChanged(existingClient, config.schema)) {
            existingClient._reactor.updateSchema(config.schema);
        }
        return existingClient;
    }
    const reactor = new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$Reactor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"](Object.assign(Object.assign(Object.assign({}, defaultConfig), config), {
        cardinalityInference: config.schema ? true : false
    }), Storage || __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$IndexedDBStorage$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"], NetworkListener || __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$WindowNetworkListener$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"], Object.assign(Object.assign({}, versions || {}), {
        '@instantdb/core': __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$version$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
    }), EventSourceImpl);
    const client = new InstantCoreDatabase(reactor);
    globalInstantCoreStore[reactorKey(config)] = client;
    handleDevtool(config.appId, config.devtool);
    return client;
}
function handleDevtool(appId, devtool) {
    if ("TURBOPACK compile-time truthy", 1) {
        return;
    }
    //TURBOPACK unreachable
    ;
    const config = undefined;
}
/**
 * @deprecated
 * `init_experimental` is deprecated. You can replace it with `init`.
 *
 * @example
 *
 * // Before
 * import { init_experimental } from "@instantdb/core"
 * const db = init_experimental({  ...  });
 *
 * // After
 * import { init } from "@instantdb/core"
 * const db = init({ ...  });
 */ const init_experimental = init;
;
 //# sourceMappingURL=index.js.map
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/uuid.js [app-route] (ecmascript) <export default as id>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "id",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/uuid.js [app-route] (ecmascript)");
}),
"[project]/admin-portal/node_modules/@instantdb/core/dist/esm/version.js [app-route] (ecmascript) <export default as version>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "version",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$version$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$version$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/version.js [app-route] (ecmascript)");
}),
];

//# sourceMappingURL=29edc_%40instantdb_core_dist_esm_baaef92e._.js.map