import cors from "@elysiajs/cors";
import Elysia from "elysia";
import { helmet } from "elysia-helmet";

export const securitySetup = (app: Elysia) =>
    app
    .use(cors(/* options */))
    .use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'","'unsafe-line'", "'unpkg.com'"],
                    styleSrc: ["'self'", 'unpkg.com'],
                    imgSrc: ['data'],
                },
            },
        })
    )