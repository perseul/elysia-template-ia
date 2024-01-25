import { Elysia } from 'elysia';
import { html } from '@elysiajs/html'; 

export const staticDataController = (app: Elysia) =>
app
    .use(html())
    .get('/html', () => {
        return(
            `<html lang="en">
                <head>
                    <title>Elysia HTML Page</title>
                </head>
                <body>
                    <h1>Hello World!</h1>
                </body>
            </html>`
        )
    })
    .get('/error/test', () => {
        throw new Error('Algo deu errado');
    },
    {
        beforeHandle(handler: Elysia.handler) {
            console.log(`Before Handler - Status Code: ${handler.set.status}`);
        }
    }
)