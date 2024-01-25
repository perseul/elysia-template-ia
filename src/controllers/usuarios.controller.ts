import { Elysia, t} from 'elysia';
import Usuario, { IUsuario } from '../entities/usuario.schema';
import { jwt } from '@elysiajs/jwt';

export const usuariosController = (app: Elysia) => 
    app.group('/usuarios', (app: Elysia) => 
        app
        .use(
            jwt({
                name: 'jwt',
                secret: process.env.JWT_SECRET as string,
            })
        )
        .guard({
            body: t.Object({
                nomeUsuario: t.String(),
                email: t.String(),
                senha: t.String()
            })
        }, (app: Elysia) => app
        .post('/', async (handler: Elysia.Handler) => {
            try {

              const novoUsuario = new Usuario();
              novoUsuario.nomeUsuario = handler.body.nomeUsuario;
              novoUsuario.email = handler.body.email;
              novoUsuario.senha = handler.body.senha;

              const usuarioSalvo = await novoUsuario.save();

              // JWT payload is based off user id
              const accessToken = await handler.jwt.sign({
                userId: usuarioSalvo._id
              });

              // Returning JTW to the client (via headers)
              handler.set.headers = {
                'X-Authorization': accessToken,
              };
              handler.set.status = 201;

              return novoUsuario;
            } catch (e: any) {
              // If unique mongoose constraint (for username or email) is violated
              if (e.name === 'MongoServerError' && e.code === 11000) {
                handler.set.status = 422;
                return {
                  message: 'Resource already exists!',
                  status: 422,
                };
              }

              handler.set.status = 500;
              return {
                message: 'Unable to save entry to the database!',
                status: 500,
              };
            }
            }, {
                onError(handler: Elysia.Handler) {
                    console.log(`wwwwwww  Handler - Status Code: ${handler.set.status}`);
                }
            })
        )
        .get('/', async ({set}: Elysia.Set) => {
            try{
                const usuarios = await Usuario.find({});
                return usuarios;
            } catch (e: unknown) {
                set.status = 500;
                return {
                    message: 'Não foi possivel obter os arquivos no banco!',
                    status: 500,
                };
            }
        })

        .get('/:id', async (handler: Elysia.Handler) => {
            try {
                const { id } = handler.params;

                const usuarioExistente = await Usuario.findById(id);

                if(!usuarioExistente) {
                    handler.set.status = 404;
                    return {
                        message: 'Recurso solicitado nao encontrado!',
                        status: 404,
                    };
                }
                return usuarioExistente;
            } catch (e: unknown) {
                handler.set.status = 500;
                return {
                    message: 'Não foi possivel obter o recurso!',
                    status: 500,
                };
            }
        })

        .patch('/:id', async (handler: Elysia.Handler) => {
            try {
                const { id } = handler.params;

                const changes: Partial<IUsuario> = handler.body;

                const usuarioAtualizado = await Usuario.findOneAndUpdate(
                    { _id: id},
                    { $set: { ...changes } },
                    { new: true }
                );

                if(!usuarioAtualizado) {
                    handler.set.status = 404;
                    return {
                        message: `Usuario com id:${id} não foi encontrado.`,
                        status: 404,
                    };
                }
                return usuarioAtualizado;
            } catch (e: unknown) {

                handler.set.status = 500;
                return {
                    message: 'Não foi possivel atualizar o recurso!',
                    status:500,
                };
            }
        })

        .delete('/:id', async (handler: Elysia.Handler) => {
            try {
              const { id } = handler.params;
    
              const usuarioExistente = await Usuario.findById(id);
    
              if (!usuarioExistente) {
                handler.set.status = 404;
                return {
                  message: `Usuario com id: ${id} não foi encontrado.`,
                  status: 404,
                };
              }
    
              await Usuario.findOneAndDelete({ _id: id });
    
              return {
                message: `Recurso deletado com sucesso!`,
                status: 200,
              };
            } catch (e: unknown) {
              handler.set.status = 500;
              return {
                message: 'Não foi possivel deletar o recurso.',
                status: 500,
              };
            }
        })
    );