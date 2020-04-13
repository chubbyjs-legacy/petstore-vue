import { ListPets, CreatePet, ReadPet, UpdatePet, DeletePet } from '../../../src/ApiClient/Pet';
import BadRequest from '../../../src/Model/Error/BadRequest';
import fetchMock from 'fetch-mock';
import InternalServerError from '../../../src/Model/Error/InternalServerError';
import NotFound from '../../../src/Model/Error/NotFound';
import UnprocessableEntity from '../../../src/Model/Error/UnprocessableEntity';
import NetworkError from '../../../src/Model/Error/NetworkError';
import PetRequest from '../../../src/Model/Pet/PetRequest';
import PetList from '../../../src/Model/Pet/PetList';
import PetResponse from '../../../src/Model/Pet/PetResponse';

beforeEach(() => {
    fetchMock.restore();
});

describe('list pets', () => {
    test('success', async () => {
        fetchMock.get(
            'https://petstore.test/api/pets?sort[name]=asc',
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: { offset: 0, limit: 20, count: 35, _embedded: { items: [] }, _links: { create: {} } }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await ListPets('sort[name]=asc');

        if (response instanceof PetList) {
            expect(response).toHaveProperty('offset');
            expect(response.offset).toEqual(0);

            expect(response).toHaveProperty('limit');
            expect(response.limit).toEqual(20);

            expect(response).toHaveProperty('count');
            expect(response.count).toEqual(35);
        } else {
            throw Error('response expectes to be PetList');
        }
    });

    test('bad request', async () => {
        fetchMock.get(
            'https://petstore.test/api/pets?sort[name]=asc',
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Bad Request',
                    detail: 'Sorting value',
                    instance: '0123456789abcdef',
                    invalidParameters: [
                        { name: 'name', reason: 'unknown field', details: { key: 'value1' } }
                    ]
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await ListPets('sort[name]=asc');

        if (response instanceof BadRequest) {
            expect(response.title).toEqual('Bad Request');
            expect(response.detail).toEqual('Sorting value');
            expect(response.instance).toEqual('0123456789abcdef');
        } else {
            throw Error('response expectes to be BadRequest');
        }
    });

    test('internal server error', async () => {
        fetchMock.get(
            'https://petstore.test/api/pets?sort[name]=asc',
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Internal Server Error',
                    instance: '0123456789abcdef'
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await ListPets('sort[name]=asc');

        if (response instanceof InternalServerError) {
            expect(response.title).toEqual('Internal Server Error');
            expect(response.instance).toEqual('0123456789abcdef');
        } else {
            throw Error('response expectes to be InternalServerError');
        }
    });

    test('network error', async () => {
        fetchMock.get(
            'https://petstore.test/api/pets?sort[name]=asc',
            {
                throws: new TypeError('Failed to fetch')
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await ListPets('sort[name]=asc');

        if (response instanceof NetworkError) {
            expect(response.title).toEqual('Failed to fetch');
        } else {
            throw Error('response expectes to be NetworkError');
        }
    });

    test('unknown response', async () => {
        fetchMock.get(
            'https://petstore.test/api/pets?sort[name]=asc',
            {
                status: 418,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {}
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        expect.assertions(1);

        try {
            await ListPets('sort[name]=asc');
        } catch (e) {
            expect(e).toEqual(new Error('Unknown response'));
        }
    });
});

describe('create pet', () => {
    test('success', async () => {
        const pet = new PetRequest({ name: 'Brownie' });

        fetchMock.post(
            'https://petstore.test/api/pets',
            {
                status: 201,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: { id: '4d783b77-eb09-4603-b99b-f590b605eaa9', name: 'Brownie' }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.parse(JSON.stringify(pet))
            }
        );

        const response = await CreatePet(pet);

        if (response instanceof PetResponse) {
            expect(response).toHaveProperty('id');
            expect(response.id).toEqual('4d783b77-eb09-4603-b99b-f590b605eaa9');
            expect(response).toHaveProperty('name');
            expect(response.name).toEqual('Brownie');
        } else {
            throw Error('response expectes to be PetResponse');
        }
    });

    test('unprocessable entity', async () => {
        const pet = new PetRequest({ name: '' });

        fetchMock.post(
            'https://petstore.test/api/pets',
            {
                status: 422,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Unprocessable Entity',
                    detail: 'name',
                    instance: '0123456789abcdef',
                    invalidParameters: [
                        { name: 'name', reason: 'empty', details: { key: 'value1' } }
                    ]
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.parse(JSON.stringify(pet))
            }
        );

        const response = await CreatePet(pet);

        if (response instanceof UnprocessableEntity) {
            expect(response.title).toEqual('Unprocessable Entity');
            expect(response.detail).toEqual('name');
            expect(response.instance).toEqual('0123456789abcdef');
        } else {
            throw Error('response expectes to be UnprocessableEntity');
        }
    });

    test('internal server error', async () => {
        const pet = new PetRequest({ name: 'Brownie' });

        fetchMock.post(
            'https://petstore.test/api/pets',
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Internal Server Error',
                    instance: '0123456789abcdef'
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.parse(JSON.stringify(pet))
            }
        );

        const response = await CreatePet(pet);

        if (response instanceof InternalServerError) {
            expect(response.title).toEqual('Internal Server Error');
            expect(response.instance).toEqual('0123456789abcdef');
        } else {
            throw Error('response expectes to be InternalServerError');
        }
    });

    test('network error', async () => {
        const pet = new PetRequest({ name: 'Brownie' });

        fetchMock.post(
            'https://petstore.test/api/pets',
            {
                throws: new TypeError('Failed to fetch')
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                },
                body: JSON.parse(JSON.stringify(pet))
            }
        );

        const response = await CreatePet(pet);

        if (response instanceof NetworkError) {
            expect(response.title).toEqual('Failed to fetch');
        } else {
            throw Error('response expectes to be NetworkError');
        }
    });

    test('unknown response', async () => {
        const pet = new PetRequest({ name: 'Brownie' });

        fetchMock.post(
            'https://petstore.test/api/pets',
            {
                status: 418,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {}
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                },
                body: JSON.parse(JSON.stringify(pet))
            }
        );

        expect.assertions(1);

        try {
            await CreatePet(pet);
        } catch (e) {
            expect(e).toEqual(new Error('Unknown response'));
        }
    });
});

describe('read pet', () => {
    test('success', async () => {
        fetchMock.get(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: { id: '4d783b77-eb09-4603-b99b-f590b605eaa9', name: 'Brownie' }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await ReadPet('4d783b77-eb09-4603-b99b-f590b605eaa9');

        if (response instanceof PetResponse) {
            expect(response).toHaveProperty('id');
            expect(response.id).toEqual('4d783b77-eb09-4603-b99b-f590b605eaa9');
            expect(response).toHaveProperty('name');
            expect(response.name).toEqual('Brownie');
        } else {
            throw Error('response expectes to be PetResponse');
        }
    });

    test('not found', async () => {
        fetchMock.get(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Not Found',
                    detail: 'There is no pet with id "4d783b77-eb09-4603-b99b-f590b605eaa9"',
                    instance: '0123456789abcdef'
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await ReadPet('4d783b77-eb09-4603-b99b-f590b605eaa9');

        if (response instanceof NotFound) {
            expect(response.title).toEqual('Not Found');
            expect(response.detail).toEqual('There is no pet with id "4d783b77-eb09-4603-b99b-f590b605eaa9"');
            expect(response.instance).toEqual('0123456789abcdef');
        } else {
            throw Error('response expectes to be NotFound');
        }
    });

    test('internal server error', async () => {
        fetchMock.get(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Internal Server Error',
                    instance: '0123456789abcdef'
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await ReadPet('4d783b77-eb09-4603-b99b-f590b605eaa9');

        if (response instanceof InternalServerError) {
            expect(response.title).toEqual('Internal Server Error');
            expect(response.instance).toEqual('0123456789abcdef');
        } else {
            throw Error('response expectes to be InternalServerError');
        }
    });

    test('network error', async () => {
        fetchMock.get(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                throws: new TypeError('Failed to fetch')
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await ReadPet('4d783b77-eb09-4603-b99b-f590b605eaa9');

        if (response instanceof NetworkError) {
            expect(response.title).toEqual('Failed to fetch');
        } else {
            throw Error('response expectes to be NetworkError');
        }
    });

    test('unknown response', async () => {
        fetchMock.get(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 418,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {}
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        expect.assertions(1);

        try {
            await ReadPet('4d783b77-eb09-4603-b99b-f590b605eaa9');
        } catch (e) {
            expect(e).toEqual(new Error('Unknown response'));
        }
    });
});

describe('update pet', () => {
    test('success', async () => {
        const pet = new PetRequest({ name: 'Brownie' });

        fetchMock.put(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: { id: '4d783b77-eb09-4603-b99b-f590b605eaa9', name: 'Brownie' }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.parse(JSON.stringify(pet))
            }
        );

        const response = await UpdatePet('4d783b77-eb09-4603-b99b-f590b605eaa9', pet);

        if (response instanceof PetResponse) {
            expect(response).toHaveProperty('id');
            expect(response.id).toEqual('4d783b77-eb09-4603-b99b-f590b605eaa9');
            expect(response).toHaveProperty('name');
            expect(response.name).toEqual('Brownie');
        } else {
            throw Error('response expectes to be PetResponse');
        }
    });

    test('not found', async () => {
        const pet = new PetRequest({ name: 'Brownie' });

        fetchMock.put(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Not Found',
                    detail: 'There is no pet with id "4d783b77-eb09-4603-b99b-f590b605eaa9"',
                    instance: '0123456789abcdef'
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.parse(JSON.stringify(pet))
            }
        );

        const response = await UpdatePet('4d783b77-eb09-4603-b99b-f590b605eaa9', pet);

        if (response instanceof NotFound) {
            expect(response.title).toEqual('Not Found');
            expect(response.detail).toEqual('There is no pet with id "4d783b77-eb09-4603-b99b-f590b605eaa9"');
            expect(response.instance).toEqual('0123456789abcdef');
        } else {
            throw Error('response expectes to be NotFound');
        }
    });

    test('unprocessable entity', async () => {
        const pet = new PetRequest({ name: '' });

        fetchMock.put(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 422,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Unprocessable Entity',
                    detail: 'name',
                    instance: '0123456789abcdef',
                    invalidParameters: [
                        { name: 'name', reason: 'empty', details: { key: 'value1' } }
                    ]
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.parse(JSON.stringify(pet))
            }
        );

        const response = await UpdatePet('4d783b77-eb09-4603-b99b-f590b605eaa9', pet);

        if (response instanceof UnprocessableEntity) {
            expect(response.title).toEqual('Unprocessable Entity');
            expect(response.detail).toEqual('name');
            expect(response.instance).toEqual('0123456789abcdef');
        } else {
            throw Error('response expectes to be UnprocessableEntity');
        }
    });

    test('internal server error', async () => {
        const pet = new PetRequest({ name: 'Brownie' });

        fetchMock.put(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Internal Server Error',
                    instance: '0123456789abcdef'
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.parse(JSON.stringify(pet))
            }
        );

        const response = await UpdatePet('4d783b77-eb09-4603-b99b-f590b605eaa9', pet);

        if (response instanceof InternalServerError) {
            expect(response.title).toEqual('Internal Server Error');
            expect(response.instance).toEqual('0123456789abcdef');
        } else {
            throw Error('response expectes to be InternalServerError');
        }
    });

    test('network error', async () => {
        const pet = new PetRequest({ name: 'Brownie' });

        fetchMock.put(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                throws: new TypeError('Failed to fetch')
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                },
                body: JSON.parse(JSON.stringify(pet))
            }
        );

        const response = await UpdatePet('4d783b77-eb09-4603-b99b-f590b605eaa9', pet);

        if (response instanceof NetworkError) {
            expect(response.title).toEqual('Failed to fetch');
        } else {
            throw Error('response expectes to be NetworkError');
        }
    });

    test('unknown response', async () => {
        const pet = new PetRequest({ name: 'Brownie' });

        fetchMock.put(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 418,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {}
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                },
                body: JSON.parse(JSON.stringify(pet))
            }
        );

        expect.assertions(1);

        try {
            await UpdatePet('4d783b77-eb09-4603-b99b-f590b605eaa9', pet);
        } catch (e) {
            expect(e).toEqual(new Error('Unknown response'));
        }
    });
});

describe('delete pet', () => {
    test('success', async () => {
        fetchMock.delete(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 204
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        await DeletePet('4d783b77-eb09-4603-b99b-f590b605eaa9');
    });

    test('not found', async () => {
        fetchMock.delete(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Not Found',
                    detail: 'There is no pet with id "4d783b77-eb09-4603-b99b-f590b605eaa9"',
                    instance: '0123456789abcdef'
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await DeletePet('4d783b77-eb09-4603-b99b-f590b605eaa9');

        if (response instanceof NotFound) {
            expect(response.title).toEqual('Not Found');
            expect(response.detail).toEqual('There is no pet with id "4d783b77-eb09-4603-b99b-f590b605eaa9"');
            expect(response.instance).toEqual('0123456789abcdef');
        } else {
            throw Error('response expectes to be NotFound');
        }
    });

    test('internal server error', async () => {
        fetchMock.delete(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Internal Server Error',
                    instance: '0123456789abcdef'
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await DeletePet('4d783b77-eb09-4603-b99b-f590b605eaa9');

        if (response instanceof InternalServerError) {
            expect(response.title).toEqual('Internal Server Error');
            expect(response.instance).toEqual('0123456789abcdef');
        } else {
            throw Error('response expectes to be InternalServerError');
        }
    });

    test('network error', async () => {
        fetchMock.delete(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                throws: new TypeError('Failed to fetch')
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await DeletePet('4d783b77-eb09-4603-b99b-f590b605eaa9');

        if (response instanceof NetworkError) {
            expect(response.title).toEqual('Failed to fetch');
        } else {
            throw Error('response expectes to be NetworkError');
        }
    });

    test('unknown response', async () => {
        fetchMock.delete(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 418,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {}
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        expect.assertions(1);

        try {
            await DeletePet('4d783b77-eb09-4603-b99b-f590b605eaa9');
        } catch (e) {
            expect(e).toEqual(new Error('Unknown response'));
        }
    });
});
