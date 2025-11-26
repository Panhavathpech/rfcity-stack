module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/admin-portal/src/lib/env.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "env",
    ()=>env
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
;
const envSchema = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    INSTANT_APP_ID: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "INSTANT_APP_ID is required"),
    INSTANT_ADMIN_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "INSTANT_ADMIN_TOKEN is required"),
    RESEND_API_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "RESEND_API_KEY is required"),
    CONTACT_ALERT_RECIPIENT: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email("CONTACT_ALERT_RECIPIENT must be a valid email"),
    SUPPORT_FROM_EMAIL: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email("SUPPORT_FROM_EMAIL must be a valid email"),
    NEXTAUTH_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "NEXTAUTH_SECRET is required"),
    NEXTAUTH_URL: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    PASSWORD_PEPPER: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "PASSWORD_PEPPER is required"),
    CONTACT_ALLOWED_ORIGIN: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default("*"),
    SITE_BASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url("SITE_BASE_URL must be a valid URL").default("http://localhost:3000")
});
const env = envSchema.parse({
    INSTANT_APP_ID: process.env.INSTANT_APP_ID,
    INSTANT_ADMIN_TOKEN: process.env.INSTANT_ADMIN_TOKEN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_ALERT_RECIPIENT: process.env.CONTACT_ALERT_RECIPIENT,
    SUPPORT_FROM_EMAIL: process.env.SUPPORT_FROM_EMAIL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    PASSWORD_PEPPER: process.env.PASSWORD_PEPPER,
    CONTACT_ALLOWED_ORIGIN: process.env.CONTACT_ALLOWED_ORIGIN,
    SITE_BASE_URL: process.env.SITE_BASE_URL
});
}),
"[project]/admin-portal/src/lib/instantdb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "archiveUser",
    ()=>archiveUser,
    "createUser",
    ()=>createUser,
    "getUserByEmail",
    ()=>getUserByEmail,
    "getUserById",
    ()=>getUserById,
    "insertContact",
    ()=>insertContact,
    "listContacts",
    ()=>listContacts,
    "listContentBlocks",
    ()=>listContentBlocks,
    "listUsers",
    ()=>listUsers,
    "updateUser",
    ()=>updateUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$admin$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/admin/dist/esm/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__id$3e$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/@instantdb/core/dist/esm/utils/uuid.js [app-route] (ecmascript) <export default as id>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/src/lib/env.ts [app-route] (ecmascript)");
;
;
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$admin$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["init"])({
    appId: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].INSTANT_APP_ID,
    adminToken: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].INSTANT_ADMIN_TOKEN
});
const CONTACTS_PAGE_SIZE = 50;
async function insertContact(payload) {
    const contactId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__id$3e$__["id"])();
    const createdAt = new Date().toISOString();
    await db.transact(db.tx.contacts[contactId].update({
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone ?? "",
        message: payload.message ?? "",
        createdAt
    }));
    return {
        ...payload,
        phone: payload.phone ?? "",
        message: payload.message ?? "",
        id: contactId,
        createdAt
    };
}
async function listContacts() {
    const result = await db.query({
        contacts: {
            $: {
                order: {
                    createdAt: "desc"
                },
                limit: CONTACTS_PAGE_SIZE
            }
        }
    });
    return result.contacts ?? [];
}
async function listUsers() {
    const result = await db.query({
        users: {
            $: {
                order: {
                    createdAt: "desc"
                },
                limit: 200
            }
        }
    });
    return result.users ?? [];
}
async function getUserByEmail(email) {
    const result = await db.query({
        users: {
            $: {
                where: {
                    email: email.toLowerCase()
                },
                limit: 1
            }
        }
    });
    const [user] = result.users ?? [];
    return user ?? null;
}
async function getUserById(userId) {
    const result = await db.query({
        users: {
            $: {
                where: {
                    id: userId
                },
                limit: 1
            }
        }
    });
    const [user] = result.users ?? [];
    return user ?? null;
}
async function createUser(payload) {
    const userId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f40$instantdb$2f$core$2f$dist$2f$esm$2f$utils$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__id$3e$__["id"])();
    const createdAt = new Date().toISOString();
    await db.transact(db.tx.users[userId].update({
        email: payload.email.toLowerCase(),
        passwordHash: payload.passwordHash,
        role: payload.role,
        status: payload.status,
        createdAt
    }));
    return {
        ...payload,
        email: payload.email.toLowerCase(),
        createdAt,
        id: userId
    };
}
async function updateUser(userId, updates) {
    await db.transact(db.tx.users[userId].update({
        ...updates.role ? {
            role: updates.role
        } : {},
        ...updates.status ? {
            status: updates.status
        } : {},
        ...updates.passwordHash ? {
            passwordHash: updates.passwordHash
        } : {}
    }));
}
async function archiveUser(userId) {
    await db.transact(db.tx.users[userId].update({
        status: "disabled"
    }));
}
async function listContentBlocks() {
    const result = await db.query({
        content_blocks: {
            $: {
                order: {
                    updatedAt: "desc"
                },
                limit: 100
            }
        }
    });
    return result.content_blocks ?? [];
}
}),
"[project]/admin-portal/src/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authOptions",
    ()=>authOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/next-auth/providers/credentials.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/src/lib/env.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$instantdb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/src/lib/instantdb.ts [app-route] (ecmascript)");
;
;
;
;
const authOptions = {
    session: {
        strategy: "jwt"
    },
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize (credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$instantdb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserByEmail"])(credentials.email);
                if (!user || user.status === "disabled") {
                    return null;
                }
                const isValid = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compare"])(`${credentials.password}${__TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].PASSWORD_PEPPER}`, user.passwordHash);
                if (!isValid) {
                    return null;
                }
                return {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    status: user.status
                };
            }
        })
    ],
    callbacks: {
        async jwt ({ token, user }) {
            if (user) {
                const typed = user;
                token.id = typed.id;
                token.role = typed.role;
                token.status = typed.status;
            }
            return token;
        },
        async session ({ session, token }) {
            if (session.user) {
                session.user.id = token.id ?? "";
                session.user.role = token.role ?? "viewer";
                session.user.status = token.status ?? "invited";
            }
            return session;
        }
    },
    pages: {
        signIn: "/login"
    },
    secret: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].NEXTAUTH_SECRET
};
}),
"[project]/admin-portal/src/lib/validation.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "contactSubmissionSchema",
    ()=>contactSubmissionSchema,
    "paginationSchema",
    ()=>paginationSchema,
    "userCreateSchema",
    ()=>userCreateSchema,
    "userUpdateSchema",
    ()=>userUpdateSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
;
const contactSubmissionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    fullName: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(2),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email(),
    phone: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    message: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const paginationSchema = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    cursor: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    limit: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().min(1).max(200).optional()
});
const roleEnum = [
    "owner",
    "admin",
    "editor",
    "viewer"
];
const statusEnum = [
    "active",
    "invited",
    "disabled"
];
const userCreateSchema = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email(),
    role: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(roleEnum),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(statusEnum).default("invited"),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(8).optional()
});
const userUpdateSchema = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(roleEnum).optional(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(statusEnum).optional(),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(8).optional()
});
}),
"[project]/admin-portal/src/lib/emailTemplates.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "contactAlertTemplate",
    ()=>contactAlertTemplate,
    "passwordResetTemplate",
    ()=>passwordResetTemplate,
    "userInviteTemplate",
    ()=>userInviteTemplate
]);
function contactAlertTemplate(contact) {
    const subject = `New contact entry from ${contact.fullName}`;
    const body = `
    <h1 style="font-family: Arial, sans-serif;">New Contact Submission</h1>
    <p><strong>Name:</strong> ${contact.fullName}</p>
    <p><strong>Email:</strong> ${contact.email}</p>
    <p><strong>Phone:</strong> ${contact.phone || "—"}</p>
    <p><strong>Message:</strong></p>
    <p>${contact.message || "No additional message."}</p>
    <hr />
    <p>Submitted at: ${new Date(contact.createdAt).toLocaleString()}</p>
  `;
    return {
        subject,
        html: body,
        text: [
            "New Contact Submission",
            `Name: ${contact.fullName}`,
            `Email: ${contact.email}`,
            `Phone: ${contact.phone || "—"}`,
            `Message: ${contact.message || "No additional message."}`,
            `Submitted at: ${contact.createdAt}`
        ].join("\n")
    };
}
function userInviteTemplate({ email, tempPassword, loginUrl }) {
    const subject = "You're invited to the R&F City admin portal";
    const html = `
    <p>Hello ${email},</p>
    <p>You have been invited to access the R&F City admin portal.</p>
    <p>Temporary password: <strong>${tempPassword}</strong></p>
    <p>Please log in and change your password asap.</p>
    <p><a href="${loginUrl}">Open the portal</a></p>
  `;
    const text = [
        "You have been invited to the R&F City admin portal.",
        `Temporary password: ${tempPassword}`,
        `Login here: ${loginUrl}`
    ].join("\n");
    return {
        subject,
        html,
        text
    };
}
function passwordResetTemplate({ email, tempPassword, loginUrl }) {
    const subject = "Your admin portal password has been reset";
    const html = `
    <p>Hello ${email},</p>
    <p>Your password has been reset by an administrator.</p>
    <p>Temporary password: <strong>${tempPassword}</strong></p>
    <p>Please log in and update your password.</p>
    <p><a href="${loginUrl}">Open the portal</a></p>
  `;
    const text = [
        "Your password has been reset.",
        `Temporary password: ${tempPassword}`,
        `Login here: ${loginUrl}`
    ].join("\n");
    return {
        subject,
        html,
        text
    };
}
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/admin-portal/src/lib/mailer.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "resend",
    ()=>resend,
    "sendEmail",
    ()=>sendEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/resend/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/src/lib/env.ts [app-route] (ecmascript)");
;
;
const resend = new __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Resend"](__TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].RESEND_API_KEY);
async function sendEmail({ to, subject, html, text }) {
    return resend.emails.send({
        from: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].SUPPORT_FROM_EMAIL,
        to,
        subject,
        html,
        text
    });
}
}),
"[project]/admin-portal/src/app/api/contact/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "OPTIONS",
    ()=>OPTIONS,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/node_modules/next-auth/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/src/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/src/lib/validation.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$instantdb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/src/lib/instantdb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$emailTemplates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/src/lib/emailTemplates.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$mailer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/src/lib/mailer.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-portal/src/lib/env.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
const corsHeaders = {
    "Access-Control-Allow-Origin": __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].CONTACT_ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
async function OPTIONS() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({}, {
        headers: corsHeaders
    });
}
async function POST(request) {
    try {
        const json = await request.json();
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["contactSubmissionSchema"].safeParse(json);
        if (!parsed.success) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Invalid payload",
                issues: parsed.error.flatten()
            }, {
                status: 422,
                headers: corsHeaders
            });
        }
        const record = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$instantdb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["insertContact"])(parsed.data);
        const template = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$emailTemplates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["contactAlertTemplate"])(record);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$mailer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])({
            to: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].CONTACT_ALERT_RECIPIENT,
            subject: template.subject,
            html: template.html,
            text: template.text
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            contact: record
        }, {
            headers: corsHeaders
        });
    } catch (error) {
        console.error("contact:POST", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Unable to submit contact entry"
        }, {
            status: 500,
            headers: corsHeaders
        });
    }
}
async function GET() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
    if (!session?.user) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Unauthorized"
        }, {
            status: 401
        });
    }
    if (![
        "owner",
        "admin",
        "editor"
    ].includes(session.user.role)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Forbidden"
        }, {
            status: 403
        });
    }
    try {
        const contacts = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$src$2f$lib$2f$instantdb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listContacts"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            contacts
        });
    } catch (error) {
        console.error("contact:GET", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$portal$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Failed to load contacts"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__06ec16bc._.js.map