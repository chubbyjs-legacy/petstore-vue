import Vue from 'vue';
import VueRouter from 'vue-router';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import NotFound from '../../../../../src/Model/Error/NotFound';
import PetResponse from '../../../../../src/Model/Pet/PetResponse';
import Update from '../../../../../src/Component/Page/Pet/Update.vue';
import Vaccination from '../../../../../src/Model/Pet/Vaccination';
import PetRequest from '../../../../../src/Model/Pet/PetRequest';
import UnprocessableEntity from '../../../../../src/Model/Error/UnprocessableEntity';

let mockReadPet = (id: string) => { };
let mockUpdatePet = (id: string, pet: PetRequest) => { };

jest.mock('../../../../../src/ApiClient/Pet', () => {
    return {
        ReadPet: (id: string) => {
            return mockReadPet(id);
        },
        UpdatePet: (id: string, pet: PetRequest) => {
            return mockUpdatePet(id, pet);
        }
    };
});

beforeEach(() => {
    mockReadPet = (id: string) => { };
    mockUpdatePet = (id: string, pet: PetRequest) => { };
});

test('not found', async () => {
    mockReadPet = async (id: string) => {
        return new Promise<NotFound>((resolve) => resolve(new NotFound({ title: 'title' })));
    };

    const localVue = createLocalVue();

    localVue.use(VueRouter);

    const router = new VueRouter();

    router.replace('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update');

    const wrapper = shallowMount(Update, {
        localVue,
        router
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <div>
            <http-error-partial-stub httperror="[object Object]"></http-error-partial-stub>
            <h1>Update Pet</h1>
            <pet-form-stub submitpet="function () { [native code] }"></pet-form-stub>
            <router-link-stub to="/pet" tag="a" ariacurrentvalue="page" event="click" class="btn-gray mb-4">List</router-link-stub>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('minimal', async () => {
    const pet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        name: 'Brownie'
    });

    mockReadPet = async (id: string) => {
        return new Promise<PetResponse>((resolve) => resolve(pet));
    };

    const localVue = createLocalVue();

    localVue.use(VueRouter);

    const router = new VueRouter();

    router.replace('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update');

    const wrapper = shallowMount(Update, {
        localVue,
        router
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <div>
            <!---->
            <h1>Update Pet</h1>
            <pet-form-stub submitpet="function () { [native code] }" defaultpet="[object Object]"></pet-form-stub>
            <router-link-stub to="/pet" tag="a" ariacurrentvalue="page" event="click" class="btn-gray mb-4">List</router-link-stub>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('unprocessable entity', async () => {
    const pet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        updatedAt: '2005-08-15T15:55:01+00:00',
        name: 'Brownie',
        vaccinations: [
            new Vaccination({ name: 'Rabies' })
        ]
    });

    mockReadPet = async (id: string) => {
        return new Promise<PetResponse>((resolve) => resolve(pet));
    };

    mockUpdatePet = async (id: string, pet: PetRequest) => {
        return new Promise<UnprocessableEntity>((resolve) => resolve(new UnprocessableEntity({ title: 'title' })));
    };

    const localVue = createLocalVue();

    localVue.use(VueRouter);

    const router = new VueRouter();

    router.replace('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update');

    const wrapper = shallowMount(Update, {
        localVue,
        router,
        stubs: {
            "pet-form": Vue.component('PetForm', {
                props: {
                    submitPet: Function
                },
                methods: {
                    onSubmit(): void {
                        this.submitPet(new PetRequest({ name: 'Brownie' }));
                    },
                },
                template: '<button data-testid="test-button" v-on:click="onSubmit"></button>'
            })
        }
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const submitButton = wrapper.find('[data-testid="test-button"]');

    submitButton.trigger('click');

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <div>
            <http-error-partial-stub httperror="[object Object]"></http-error-partial-stub>
            <h1>Update Pet</h1>
            <button data-testid="test-button" defaultpet="[object Object]" unprocessableentity="[object Object]"></button>
            <router-link-stub to="/pet" tag="a" ariacurrentvalue="page" event="click" class="btn-gray mb-4">List</router-link-stub>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('successful', async () => {
    const pet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        updatedAt: '2005-08-15T15:55:01+00:00',
        name: 'Brownie',
        vaccinations: [
            new Vaccination({ name: 'Rabies' })
        ]
    });

    mockReadPet = async (id: string) => {
        return new Promise<PetResponse>((resolve) => resolve(pet));
    };

    mockUpdatePet = async (id: string, pet: PetRequest) => {
        return new Promise<PetRequest>((resolve) => resolve(pet));
    };

    const localVue = createLocalVue();

    localVue.use(VueRouter);

    const router = new VueRouter();

    router.replace('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update');

    const wrapper = shallowMount(Update, {
        localVue,
        router,
        stubs: {
            "pet-form": Vue.component('PetForm', {
                props: {
                    submitPet: Function
                },
                methods: {
                    onSubmit(): void {
                        this.submitPet(new PetRequest({ name: 'Brownie' }));
                    },
                },
                template: '<button data-testid="test-button" v-on:click="onSubmit"></button>'
            })
        }
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(router.currentRoute.fullPath).toBe('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update');

    const submitButton = wrapper.find('[data-testid="test-button"]');

    submitButton.trigger('click');

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(router.currentRoute.fullPath).toBe('/pet');
});
