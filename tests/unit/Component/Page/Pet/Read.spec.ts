import VueRouter from 'vue-router';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import NotFound from '../../../../../src/Model/Error/NotFound';
import PetResponse from '../../../../../src/Model/Pet/PetResponse';
import Read from '../../../../../src/Component/Page/Pet/Read.vue';
import Vaccination from '../../../../../src/Model/Pet/Vaccination';

let mockReadPet = (id: string) => { };

jest.mock('../../../../../src/ApiClient/Pet', () => {
    return {
        ReadPet: (id: string) => {
            return mockReadPet(id);
        }
    };
});

beforeEach(() => {
    mockReadPet = (id: string) => { };
});

test('not found', async () => {
    mockReadPet = async (id: string) => {
        return new Promise((resolve) => resolve(new NotFound({ title: 'title' })));
    };

    const localVue = createLocalVue();

    localVue.use(VueRouter);

    const router = new VueRouter();

    router.replace('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9');

    const wrapper = shallowMount(Read, {
        localVue,
        router
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <div>
            <http-error-partial-stub httperror="[object Object]"></http-error-partial-stub>
            <h1>Read Pet</h1>
            <!---->
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
        return new Promise((resolve) => resolve(pet));
    };

    const localVue = createLocalVue();

    localVue.use(VueRouter);

    const router = new VueRouter();

    router.replace('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9');

    const wrapper = shallowMount(Read, {
        localVue,
        router
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <div>
            <!---->
            <h1>Read Pet</h1>
            <div>
                <dl>
                    <dt>Id</dt>
                    <dd>4d783b77-eb09-4603-b99b-f590b605eaa9</dd>
                    <dt>CreatedAt</dt>
                    <dd>15.08.2005 - 17:52:01</dd>
                    <dt>UpdatedAt</dt>
                    <dd></dd>
                    <dt>Name</dt>
                    <dd>Brownie</dd>
                    <dt>Tag</dt>
                    <dd></dd>
                    <dt>Vaccinations</dt>
                    <dd><!----></dd>
                </dl>
                <router-link-stub to="/pet" tag="a" event="click" class="btn-gray mb-4">List</router-link-stub>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('maximal', async () => {
    const pet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        updatedAt: '2005-08-15T15:55:01+00:00',
        name: 'Brownie',
        tag: '0001-000',
        vaccinations: [
            new Vaccination({ name: 'Rabies' })
        ]
    });

    mockReadPet = async (id: string) => {
        return new Promise((resolve) => resolve(pet));
    };

    const localVue = createLocalVue();

    localVue.use(VueRouter);

    const router = new VueRouter();

    router.replace('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9');

    const wrapper = shallowMount(Read, {
        localVue,
        router
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <div>
            <!---->
            <h1>Read Pet</h1>
            <div>
                <dl>
                    <dt>Id</dt>
                    <dd>4d783b77-eb09-4603-b99b-f590b605eaa9</dd>
                    <dt>CreatedAt</dt>
                    <dd>15.08.2005 - 17:52:01</dd>
                    <dt>UpdatedAt</dt>
                    <dd>15.08.2005 - 17:55:01</dd>
                    <dt>Name</dt>
                    <dd>Brownie</dd>
                    <dt>Tag</dt>
                    <dd>0001-000</dd>
                    <dt>Vaccinations</dt>
                    <dd>
                        <ul>
                            <li>Rabies</li>
                        </ul>
                    </dd>
                </dl>
                <router-link-stub to="/pet" tag="a" event="click" class="btn-gray mb-4">List</router-link-stub>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});
