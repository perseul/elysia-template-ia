import { describe, expect, it, afterAll } from 'bun:test';
import { app } from '../src/index';

const baseUrl = `${app.server?.hostname}:${app.server?.port}/api/usuarios`; // localhost:3000/api/usuarios

describe('USUARIOS Test suite', () => {

  describe('GET Usuarios suite', () => {

    it('deve retornar a lista de usuarios com sucesso', async () => {
      const req = new Request(baseUrl);
      const res = await app.fetch(req);
      expect(res.status).toEqual(200);
    });

    it('deve retornar um usuario com sucesso utilizando um id', async () => {

      const expected = {
        nomeUsuario: 'nome ficticio',
        email: 'nameficticio@email.com'
      };

      const usuarioId = '65b2bff1d54f80064be79613';

      const req = new Request(`${baseUrl}/${usuarioId}`);
      const res = await app.fetch(req);
      expect(res.status).toEqual(200);

      const responseBody = await res.json();

      expect(responseBody.nomeUsuario).toEqual(expected.nomeUsuario);
      expect(responseBody.email).toEqual(expected.email);
    });

    it('não deve retornar a senha de um usuario', async () => {

      const usuarioId = '65b2bff1d54f80064be79613';

      const req = new Request(`${baseUrl}/${usuarioId}`);
      const res = await app.fetch(req);
      expect(res.status).toEqual(200);

      const responseBody = await res.json();
      expect(responseBody.senha).toEqual(undefined);
    });

    it('deve falhar ao retornar um usuario que nao existe', async () => {

      const usuarioId = 'FAKE-ID-FAKE-ID-FAKE-ID-';

      const req = new Request(`${baseUrl}/${usuarioId}`);
      const res = await app.fetch(req);
      expect(res.status).not.toEqual(200);
    });

  });

  describe('CREATE Usuarios suite', () => {

    it('deve criar um novo usuario com sucesso', async () => {

      const newUser = {
        nomeUsuario: 'BruceWayne',
        email: 'bruce.wayne@gotham.com',
        senha: 'batm4n'
      }

      const expected = {
        nomeUsuario: 'BruceWayne',
        email: 'bruce.wayne@gotham.com'
      }

      const req = new Request(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      const res = await app.fetch(req);
      expect(res.status).toEqual(201);

      const responseBody = await res.json();
      expect(responseBody.nomeUsuario).toEqual(expected.nomeUsuario);
      expect(responseBody.email).toEqual(expected.email);
    });

    it('deve falhar ao criar um usuario já existente', async () => {

      const existingUser = {
        nomeUsuario: 'nome ficticio',
        email: 'nameficticio@email.com',
        senha: 'string'
      }

      const expected = {
        message: 'Resource already exists!'
      };

      const req = new Request(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(existingUser)
      });

      const res = await app.fetch(req);
      expect(res.status).toEqual(422);

      const responseBody = await res.json();
      expect(responseBody.message).toEqual(expected.message);
    });

    it('deve falhar ao criar um usuario com campos obrigatorios nao preenchidos', async () => {

      const newUser = {
        nomeUsuario: 'JamesBond'
      }

      const expected =  {
        message: 'Não pode processar os dados!',
        status: 400,
      };

      const req = new Request(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      const res = await app.fetch(req);
      expect(res.status).toEqual(expected.status);

      const responseBody = await res.json();
      expect(responseBody.message).toEqual(expected.message);
    });

  });

  describe('PATCH Usuarios suite', () => {

    it('deve atualizar um usuario com sucesso', async () => {

      const originalUser = {
        nomeUsuario: 'Nome example',
      }

      const updatedUser = {
        nomeUsuario: 'DarkKnight',
      }

      const usuarioId = '65b2c1ecbf59adc89dd2fb70';

      const req = new Request(`${baseUrl}/${usuarioId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      });

      const res = await app.fetch(req);
      expect(res.status).toEqual(200);

      const responseBody = await res.json();
      expect(responseBody.nomeUsuario).not.toEqual(originalUser.nomeUsuario);
      expect(responseBody.nomeUsuario).toEqual(updatedUser.nomeUsuario);
    });

    it('deve falhar ao atualizar um usuario nao existente', async () => {

      const updatedUser = {
        nomeUsuario: 'DarkKnight',
      }

      const usuarioId = 'FAKE-ID-FAKE-ID-FAKE-ID-';

      const req = new Request(`${baseUrl}/${usuarioId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      });

      const res = await app.fetch(req);
      expect(res.status).not.toEqual(200);
    });

  });

  describe('DELETE Usuarios suite', () => {

    it('deve deletar um usuario com sucesso', async () => {

      const usuarioId = '65b51ba873fbb0cfcf30b192';

      const req = new Request(`${baseUrl}/${usuarioId}`, {
        method: 'DELETE',
      });

      const res = await app.fetch(req);
      expect(res.status).toEqual(200);
    });

    it('deve falhar ao deletar um usuario que nao existe', async () => {

      const usuarioId = 'FAKE-ID-FAKE-ID-FAKE-ID-';

      const req = new Request(`${baseUrl}/${usuarioId}`, {
        method: 'DELETE'
      });

      const res = await app.fetch(req);
      expect(res.status).not.toEqual(200);
    });

  });

  afterAll(() => {
    process.exit(0);
  })

});
