import Vue from 'vue';
import VueRouter from 'vue-router';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Create from '../../../../../src/Component/Page/Pet/Create.vue';
import PetRequest from '../../../../../src/Model/Pet/PetRequest';
import UnprocessableEntity from '../../../../../src/Model/Error/UnprocessableEntity';

let mockCreatePet = (pet: PetRequest) => { };

jest.mock('../../../../../src/ApiClient/Pet', () => {
    return {
        CreatePet: (pet: PetRequest) => {
            return mockCreatePet(pet);
        }
    };
});

beforeEach(() => {
    mockCreatePet = (pet: PetRequest) => { };
});

test('default', () => {
    const localVue = createLocalVue();

    localVue.use(VueRouter);

    const router = new VueRouter();

    router.replace('/pet/create');

    const wrapper = shallowMount(Create, {
        localVue,
        router
    });

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <div>
            <!---->
            <h1>Create Pet</h1>
            <pet-form-stub submitpet="function () { [native code] }"></pet-form-stub>
            <router-link-stub to="/pet" tag="a" ariacurrentvalue="page" event="click" class="btn-gray mb-4">List</router-link-stub>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('unprocessable entity', async () => {
    mockCreatePet = async (pet: PetRequest) => {
        return new Promise((resolve) => resolve(new UnprocessableEntity({ title: 'title' })));
    };

    const localVue = createLocalVue();

    localVue.use(VueRouter);

    const router = new VueRouter();

    router.replace('/pet/create');

    const wrapper = shallowMount(Create, {
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

    const submitButton = wrapper.find('[data-testid="test-button"]');

    submitButton.trigger('click');

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <div>
            <http-error-partial-stub httperror="[object Object]"></http-error-partial-stub>
            <h1>Create Pet</h1>
            <button data-testid="test-button" unprocessableentity="[object Object]"></button>
            <router-link-stub to="/pet" tag="a" ariacurrentvalue="page" event="click" class="btn-gray mb-4">List</router-link-stub>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('successful', async () => {
    mockCreatePet = async (pet: PetRequest) => {
        return new Promise((resolve) => resolve(pet));
    };

    const localVue = createLocalVue();

    localVue.use(VueRouter);

    const router = new VueRouter();

    router.replace('/pet/create');

    const wrapper = shallowMount(Create, {
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

    expect(router.currentRoute.fullPath).toBe('/pet/create');

    const submitButton = wrapper.find('[data-testid="test-button"]');

    submitButton.trigger('click');

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(router.currentRoute.fullPath).toBe('/pet');
});
