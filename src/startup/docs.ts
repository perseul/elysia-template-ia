import swagger from "@elysiajs/swagger";
import Elysia from "elysia";

export const docsSetup = (app: Elysia) =>
    app
    .use(
        swagger({
            path: '/v1/swagger',
            documentation: {
                info: {
                    title: 'Bun.js API CRUD template + Elysia.js',
                    version: '1.0.0',
                },
            },
        })
    );
