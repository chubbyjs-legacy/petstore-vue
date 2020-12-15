import Vue from 'vue';
import VueRouter from 'vue-router';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import BadRequest from '../../../../../src/Model/Error/BadRequest';
import Embedded from '../../../../../src/Model/Pet/Embedded';
import Link from '../../../../../src/Model/Link';
import List from '../../../../../src/Component/Page/Pet/List.vue';
import NotFound from '../../../../../src/Model/Error/NotFound';
import PetList from '../../../../../src/Model/Pet/PetList';
import PetResponse from '../../../../../src/Model/Pet/PetResponse';
import Vaccination from '../../../../../src/Model/Pet/Vaccination';

let mockListPets = (queryString: string) => { };
let mockDeletePet = (id: string) => { };

jest.mock('../../../../../src/ApiClient/Pet', () => {
    return {
        ListPets: (queryString: string) => {
            return mockListPets(queryString);
        },
        DeletePet: (id: string) => {
            return mockDeletePet(id);
        }
    };
});

beforeEach(() => {
    mockListPets = (queryString: string) => { };
    mockDeletePet = (id: string) => { };
});

test('bad request', async () => {
    mockListPets = async (queryString: string) => {
        return new Promise<BadRequest>((resolve) => resolve(new BadRequest({ title: 'title' })));
    };

    const localVue = createLocalVue();

    localVue.use(VueRouter);

    const router = new VueRouter();

    router.replace('/pet');

    const wrapper = shallowMount(List, {
        localVue,
        router
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <div>
            <http-error-partial-stub httperror="[object Object]"></http-error-partial-stub>
            <h1>List Pets</h1>
            <!---->
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('default', async () => {
    const petList = new PetList({
        offset: 0,
        limit: 1,
        count: 2,
        _embedded: new Embedded({
            items: [
                new PetResponse({
                    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
                    createdAt: '2005-08-15T15:52:01+00:00',
                    updatedAt: '2005-08-15T15:55:01+00:00',
                    name: 'Brownie',
                    tag: '0001-000',
                    vaccinations: [
                        new Vaccination({ name: 'Rabies' })
                    ],
                    _links: {
                        "read": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "GET"
                            }
                        }),
                        "update": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "PUT"
                            }
                        }),
                        "delete": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "DELETE"
                            }
                        })
                    }
                })
            ]
        }),
        "_links": {
            "create": new Link({
                "href": "/api/pets",
                "templated": false,
                "rel": [],
                "attributes": {
                    "method": "POST"
                }
            })
        }
    });

    mockListPets = async (queryString: string) => {
        return new Promise<PetList>((resolve) => resolve(petList));
    };

    const localVue = createLocalVue();

    localVue.use(VueRouter);

    const router = new VueRouter();

    router.replace('/pet');

    const wrapper = shallowMount(List, {
        localVue,
        router
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <div>
            <!---->
            <h1>List Pets</h1>
            <div>
                <router-link-stub to="/pet/create" tag="a" ariacurrentvalue="page" event="click" class="btn-green mb-4">Create</router-link-stub>
                <pet-filter-form-stub submitpetfilter="function () { [native code] }" defaultpetfilters="[object Object]"></pet-filter-form-stub>
                <table class="my-4">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>CreatedAt</th>
                            <th>UpdatedAt</th>
                            <th>
                                Name (
                                    &nbsp;
                                    <router-link-stub to="/pet?page=1&amp;sort%5Bname%5D=asc" tag="a" ariacurrentvalue="page" event="click" data-testid="sort-pet-name-asc">A-Z</router-link-stub>
                                    &nbsp;
                                    |
                                    <router-link-stub to="/pet?page=1&amp;sort%5Bname%5D=desc" tag="a" ariacurrentvalue="page" event="click" data-testid="sort-pet-name-desc">Z-A</router-link-stub>
                                    &nbsp;
                                    |
                                    <router-link-stub to="/pet?page=1" tag="a" ariacurrentvalue="page" event="click" data-testid="sort-pet-name--">---</router-link-stub>
                                    &nbsp;
                                )
                            </th>
                            <th>Tag</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>4d783b77-eb09-4603-b99b-f590b605eaa9</td>
                            <td>15.08.2005 - 17:52:01</td>
                            <td>15.08.2005 - 17:55:01</td>
                            <td>Brownie</td>
                            <td>0001-000</td>
                            <td>
                                <router-link-stub to="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9" tag="a" ariacurrentvalue="page" event="click" class="btn-gray mr-4">Read</router-link-stub>
                                <router-link-stub to="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update" tag="a" ariacurrentvalue="page" event="click" class="btn-gray mr-4">Update</router-link-stub>
                                <button data-testid="remove-pet-0" class="btn-red">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <pagination-stub submitpage="function () { [native code] }" currentpage="1" totalpages="2" maxpages="7"></pagination-stub>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('no actions', async () => {
    const petList = new PetList({
        offset: 0,
        limit: 1,
        count: 2,
        _embedded: new Embedded({
            items: [
                new PetResponse({
                    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
                    createdAt: '2005-08-15T15:52:01+00:00',
                    name: 'Brownie',
                    tag: '0001-000',
                    vaccinations: [
                        new Vaccination({ name: 'Rabies' })
                    ],
                    _links: {}
                })
            ]
        }),
        "_links": {}
    });

    mockListPets = async (queryString: string) => {
        return new Promise<PetList>((resolve) => resolve(petList));
    };

    const localVue = createLocalVue();

    localVue.use(VueRouter);

    const router = new VueRouter();

    router.replace('/pet');

    const wrapper = shallowMount(List, {
        localVue,
        router
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <div>
            <!---->
            <h1>List Pets</h1>
            <div>
                <!---->
                <pet-filter-form-stub submitpetfilter="function () { [native code] }" defaultpetfilters="[object Object]"></pet-filter-form-stub>
                <table class="my-4">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>CreatedAt</th>
                            <th>UpdatedAt</th>
                            <th>
                                Name (
                                    &nbsp;
                                    <router-link-stub to="/pet?page=1&amp;sort%5Bname%5D=asc" tag="a" ariacurrentvalue="page" event="click" data-testid="sort-pet-name-asc">A-Z</router-link-stub>
                                    &nbsp;
                                    |
                                    <router-link-stub to="/pet?page=1&amp;sort%5Bname%5D=desc" tag="a" ariacurrentvalue="page" event="click" data-testid="sort-pet-name-desc">Z-A</router-link-stub>
                                    &nbsp;
                                    |
                                    <router-link-stub to="/pet?page=1" tag="a" ariacurrentvalue="page" event="click" data-testid="sort-pet-name--">---</router-link-stub>
                                    &nbsp;
                                )
                            </th>
                            <th>Tag</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>4d783b77-eb09-4603-b99b-f590b605eaa9</td>
                            <td>15.08.2005 - 17:52:01</td>
                            <td></td>
                            <td>Brownie</td>
                            <td>0001-000</td>
                            <td>
                                <!---->
                                <!---->
                                <!---->
                            </td>
                        </tr>
                    </tbody>
                </table>
                <pagination-stub submitpage="function () { [native code] }" currentpage="1" totalpages="2" maxpages="7"></pagination-stub>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('submit bad request', async () => {
    const petList = new PetList({
        offset: 0,
        limit: 1,
        count: 2,
        _embedded: new Embedded({
            items: [
                new PetResponse({
                    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
                    createdAt: '2005-08-15T15:52:01+00:00',
                    updatedAt: '2005-08-15T15:55:01+00:00',
                    name: 'Brownie',
                    tag: '0001-000',
                    vaccinations: [
                        new Vaccination({ name: 'Rabies' })
                    ],
                    _links: {
                        "read": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "GET"
                            }
                        }),
                        "update": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "PUT"
                            }
                        }),
                        "delete": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "DELETE"
                            }
                        })
                    }
                })
            ]
        }),
        "_links": {
            "create": new Link({
                "href": "/api/pets",
                "templated": false,
                "rel": [],
                "attributes": {
                    "method": "POST"
                }
            })
        }
    });

    mockListPets = async (queryString: string) => {
        return new Promise<PetList>((resolve) => resolve(petList));
    };

    const localVue = createLocalVue();

    localVue.use(VueRouter);

    const router = new VueRouter();

    router.replace('/pet');

    const wrapper = shallowMount(List, {
        localVue,
        router,
        stubs: {
            "pet-filter-form": Vue.component('PetFilterForm', {
                props: {
                    submitPetFilter: Function
                },
                methods: {
                    onSubmit(): void {
                        this.submitPetFilter({ name: undefined });
                    },
                },
                template: '<button data-testid="test-filter-button" v-on:click="onSubmit"></button>'
            })
        },
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    mockListPets = async (queryString: string) => {
        return new Promise<BadRequest>((resolve) => resolve(new BadRequest({ title: 'title' })));
    };

    const submitButton = wrapper.find('[data-testid="test-filter-button"]');

    submitButton.trigger('click');

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <div>
            <http-error-partial-stub httperror="[object Object]"></http-error-partial-stub>
            <h1>List Pets</h1>
            <div>
                <router-link-stub to="/pet/create" tag="a" ariacurrentvalue="page" event="click" class="btn-green mb-4">Create</router-link-stub>
                <button data-testid="test-filter-button" defaultpetfilters="[object Object]" badrequest="[object Object]"></button>
                <table class="my-4">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>CreatedAt</th>
                            <th>UpdatedAt</th>
                            <th>
                                Name (
                                    &nbsp;
                                    <router-link-stub to="/pet?page=1&amp;sort%5Bname%5D=asc" tag="a" ariacurrentvalue="page" event="click" data-testid="sort-pet-name-asc">A-Z</router-link-stub>
                                    &nbsp;
                                    |
                                    <router-link-stub to="/pet?page=1&amp;sort%5Bname%5D=desc" tag="a" ariacurrentvalue="page" event="click" data-testid="sort-pet-name-desc">Z-A</router-link-stub>
                                    &nbsp;
                                    |
                                    <router-link-stub to="/pet?page=1" tag="a" ariacurrentvalue="page" event="click" data-testid="sort-pet-name--">---</router-link-stub>
                                    &nbsp;
                                )
                            </th>
                            <th>Tag</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>4d783b77-eb09-4603-b99b-f590b605eaa9</td>
                            <td>15.08.2005 - 17:52:01</td>
                            <td>15.08.2005 - 17:55:01</td>
                            <td>Brownie</td>
                            <td>0001-000</td>
                            <td>
                                <router-link-stub to="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9" tag="a" ariacurrentvalue="page" event="click" class="btn-gray mr-4">Read</router-link-stub>
                                <router-link-stub to="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update" tag="a" ariacurrentvalue="page" event="click" class="btn-gray mr-4">Update</router-link-stub>
                                <button data-testid="remove-pet-0" class="btn-red">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <pagination-stub submitpage="function () { [native code] }" currentpage="1" totalpages="2" maxpages="7"></pagination-stub>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('submit filter', async () => {
    const petList = new PetList({
        offset: 0,
        limit: 1,
        count: 2,
        _embedded: new Embedded({
            items: [
                new PetResponse({
                    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
                    createdAt: '2005-08-15T15:52:01+00:00',
                    updatedAt: '2005-08-15T15:55:01+00:00',
                    name: 'Brownie',
                    tag: '0001-000',
                    vaccinations: [
                        new Vaccination({ name: 'Rabies' })
                    ],
                    _links: {
                        "read": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "GET"
                            }
                        }),
                        "update": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "PUT"
                            }
                        }),
                        "delete": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "DELETE"
                            }
                        })
                    }
                })
            ]
        }),
        "_links": {
            "create": new Link({
                "href": "/api/pets",
                "templated": false,
                "rel": [],
                "attributes": {
                    "method": "POST"
                }
            })
        }
    });

    mockListPets = async (queryString: string) => {
        return new Promise<PetList>((resolve) => resolve(petList));
    };

    const localVue = createLocalVue();

    localVue.use(VueRouter);

    const router = new VueRouter();

    router.replace('/pet');

    const wrapper = shallowMount(List, {
        localVue,
        router,
        stubs: {
            "pet-filter-form": Vue.component('PetFilterForm', {
                props: {
                    submitPetFilter: Function
                },
                methods: {
                    onSubmit(): void {
                        this.submitPetFilter({ name: 'Bro' });
                    },
                },
                template: '<button data-testid="test-filter-button" v-on:click="onSubmit"></button>'
            })
        },
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(router.currentRoute.fullPath).toBe('/pet');

    const submitButton = wrapper.find('[data-testid="test-filter-button"]');

    submitButton.trigger('click');

    expect(router.currentRoute.fullPath).toBe('/pet?page=1&filters%5Bname%5D=Bro');
});

test('sort', async () => {
    const petList = new PetList({
        offset: 0,
        limit: 1,
        count: 2,
        _embedded: new Embedded({
            items: [
                new PetResponse({
                    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
                    createdAt: '2005-08-15T15:52:01+00:00',
                    updatedAt: '2005-08-15T15:55:01+00:00',
                    name: 'Brownie',
                    tag: '0001-000',
                    vaccinations: [
                        new Vaccination({ name: 'Rabies' })
                    ],
                    _links: {
                        "read": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "GET"
                            }
                        }),
                        "update": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "PUT"
                            }
                        }),
                        "delete": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "DELETE"
                            }
                        })
                    }
                })
            ]
        }),
        "_links": {
            "create": new Link({
                "href": "/api/pets",
                "templated": false,
                "rel": [],
                "attributes": {
                    "method": "POST"
                }
            })
        }
    });

    mockListPets = async (queryString: string) => {
        return new Promise<PetList>((resolve) => resolve(petList));
    };

    const localVue = createLocalVue();

    localVue.use(VueRouter);

    const router = new VueRouter();

    router.replace('/pet');

    const wrapper = shallowMount(List, {
        localVue,
        router,
        stubs: {
            "router-link": Vue.component('RouterLink', {
                props: {
                    to: String
                },
                methods: {
                    onSubmit(): void {
                        router.push(this.to);
                    },
                },
                template: '<button v-on:click="onSubmit"></button>'
            })
        },
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(router.currentRoute.fullPath).toBe('/pet');

    const sortButton = wrapper.find('[data-testid="sort-pet-name-desc"]');

    sortButton.trigger('click');

    expect(router.currentRoute.fullPath).toBe('/pet?page=1&sort%5Bname%5D=desc');
});

test('next', async () => {
    const petList = new PetList({
        offset: 0,
        limit: 1,
        count: 2,
        _embedded: new Embedded({
            items: [
                new PetResponse({
                    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
                    createdAt: '2005-08-15T15:52:01+00:00',
                    updatedAt: '2005-08-15T15:55:01+00:00',
                    name: 'Brownie',
                    tag: '0001-000',
                    vaccinations: [
                        new Vaccination({ name: 'Rabies' })
                    ],
                    _links: {
                        "read": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "GET"
                            }
                        }),
                        "update": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "PUT"
                            }
                        }),
                        "delete": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "DELETE"
                            }
                        })
                    }
                })
            ]
        }),
        "_links": {
            "create": new Link({
                "href": "/api/pets",
                "templated": false,
                "rel": [],
                "attributes": {
                    "method": "POST"
                }
            })
        }
    });

    mockListPets = async (queryString: string) => {
        return new Promise<PetList>((resolve) => resolve(petList));
    };

    const localVue = createLocalVue();

    localVue.use(VueRouter);

    const router = new VueRouter();

    router.replace('/pet');

    const wrapper = shallowMount(List, {
        localVue,
        router,
        stubs: {
            pagination: Vue.component('RouterLink', {
                props: {
                    submitPage: Function
                },
                template: '<button data-testid="test-pagination-button" v-on:click="submitPage(2)"></button>'
            })
        },
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(router.currentRoute.fullPath).toBe('/pet');

    const nextButton = wrapper.find('[data-testid="test-pagination-button"]');

    nextButton.trigger('click');

    expect(router.currentRoute.fullPath).toBe('/pet?page=2');
});

test('delete not found', async () => {
    const petList = new PetList({
        offset: 0,
        limit: 1,
        count: 2,
        _embedded: new Embedded({
            items: [
                new PetResponse({
                    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
                    createdAt: '2005-08-15T15:52:01+00:00',
                    updatedAt: '2005-08-15T15:55:01+00:00',
                    name: 'Brownie',
                    tag: '0001-000',
                    vaccinations: [
                        new Vaccination({ name: 'Rabies' })
                    ],
                    _links: {
                        "read": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "GET"
                            }
                        }),
                        "update": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "PUT"
                            }
                        }),
                        "delete": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "DELETE"
                            }
                        })
                    }
                })
            ]
        }),
        "_links": {
            "create": new Link({
                "href": "/api/pets",
                "templated": false,
                "rel": [],
                "attributes": {
                    "method": "POST"
                }
            })
        }
    });

    mockListPets = async (queryString: string) => {
        return new Promise<PetList>((resolve) => resolve(petList));
    };

    const localVue = createLocalVue();

    localVue.use(VueRouter);

    const router = new VueRouter();

    router.replace('/pet');

    const wrapper = shallowMount(List, {
        localVue,
        router
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    mockDeletePet = async (id: string) => {
        return new Promise<NotFound>((resolve) => resolve(new NotFound({ title: 'title' })));
    };

    const removeButton = wrapper.find('[data-testid="remove-pet-0"]');

    removeButton.trigger('click');

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <div>
            <http-error-partial-stub httperror="[object Object]"></http-error-partial-stub>
            <h1>List Pets</h1>
            <div>
                <router-link-stub to="/pet/create" class="btn-green mb-4">Create</router-link-stub>
                <pet-filter-form-stub submitpetfilter="function () { [native code] }" defaultpetfilters="[object Object]"></pet-filter-form-stub>
                <table class="my-4">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>CreatedAt</th>
                            <th>UpdatedAt</th>
                            <th>
                                Name (
                                    &nbsp;
                                    <router-link-stub to="/pet?page=1&amp;sort%5Bname%5D=asc" data-testid="sort-pet-name-asc">A-Z</router-link-stub>
                                    &nbsp;
                                    |
                                    <router-link-stub to="/pet?page=1&amp;sort%5Bname%5D=desc" data-testid="sort-pet-name-desc">Z-A</router-link-stub>
                                    &nbsp;
                                    |
                                    <router-link-stub to="/pet?page=1" data-testid="sort-pet-name--">---</router-link-stub>
                                    &nbsp;
                                )
                            </th>
                            <th>Tag</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>4d783b77-eb09-4603-b99b-f590b605eaa9</td>
                            <td>15.08.2005 - 17:52:01</td>
                            <td>15.08.2005 - 17:55:01</td>
                            <td>Brownie</td>
                            <td>0001-000</td>
                            <td>
                                <router-link-stub to="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9" class="btn-gray mr-4">Read</router-link-stub>
                                <router-link-stub to="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update" class="btn-gray mr-4">Update</router-link-stub>
                                <button data-testid="remove-pet-0" class="btn-red">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <pagination-stub submitpage="function () { [native code] }" currentpage="1" totalpages="2" maxpages="7"></pagination-stub>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('delete success', async () => {
    const petList = new PetList({
        offset: 0,
        limit: 1,
        count: 2,
        _embedded: new Embedded({
            items: [
                new PetResponse({
                    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
                    createdAt: '2005-08-15T15:52:01+00:00',
                    updatedAt: '2005-08-15T15:55:01+00:00',
                    name: 'Brownie',
                    tag: '0001-000',
                    vaccinations: [
                        new Vaccination({ name: 'Rabies' })
                    ],
                    _links: {
                        "read": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "GET"
                            }
                        }),
                        "update": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "PUT"
                            }
                        }),
                        "delete": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "DELETE"
                            }
                        })
                    }
                })
            ]
        }),
        "_links": {
            "create": new Link({
                "href": "/api/pets",
                "templated": false,
                "rel": [],
                "attributes": {
                    "method": "POST"
                }
            })
        }
    });

    mockListPets = async (queryString: string) => {
        return new Promise<PetList>((resolve) => resolve(petList));
    };

    const localVue = createLocalVue();

    localVue.use(VueRouter);

    const router = new VueRouter();

    router.replace('/pet');

    const wrapper = shallowMount(List, {
        localVue,
        router
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    mockDeletePet = async (id: string) => {
        return new Promise((resolve) => resolve());
    };

    const petListNoItem = new PetList({
        offset: 0,
        limit: 1,
        count: 2,
        _embedded: new Embedded({
            items: [
            ]
        }),
        "_links": {
            "create": new Link({
                "href": "/api/pets",
                "templated": false,
                "rel": [],
                "attributes": {
                    "method": "POST"
                }
            })
        }
    });

    mockListPets = async (queryString: string) => {
        return new Promise<PetList>((resolve) => resolve(petListNoItem));
    };

    const removeButton = wrapper.find('[data-testid="remove-pet-0"]');

    removeButton.trigger('click');

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <div>
            <!---->
            <h1>List Pets</h1>
            <div>
                <router-link-stub to="/pet/create" class="btn-green mb-4">Create</router-link-stub>
                <pet-filter-form-stub submitpetfilter="function () { [native code] }" defaultpetfilters="[object Object]"></pet-filter-form-stub>
                <table class="my-4">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>CreatedAt</th>
                            <th>UpdatedAt</th>
                            <th>
                                Name (
                                    &nbsp;
                                    <router-link-stub to="/pet?page=1&amp;sort%5Bname%5D=asc" data-testid="sort-pet-name-asc">A-Z</router-link-stub>
                                    &nbsp;
                                    |
                                    <router-link-stub to="/pet?page=1&amp;sort%5Bname%5D=desc" data-testid="sort-pet-name-desc">Z-A</router-link-stub>
                                    &nbsp;
                                    |
                                    <router-link-stub to="/pet?page=1" data-testid="sort-pet-name--">---</router-link-stub>
                                    &nbsp;
                                )
                            </th>
                            <th>Tag</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <pagination-stub submitpage="function () { [native code] }" currentpage="1" totalpages="2" maxpages="7"></pagination-stub>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});
