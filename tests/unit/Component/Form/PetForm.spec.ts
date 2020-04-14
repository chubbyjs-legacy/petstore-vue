import { shallowMount } from '@vue/test-utils';
import InvalidParameter from '../../../../src/Model/Error/InvalidParameter';
import PetForm from '../../../../src/Component/Form/PetForm.vue';
import PetRequest from '../../../../src/Model/Pet/PetRequest';
import PetResponse from '../../../../src/Model/Pet/PetResponse';
import UnprocessableEntity from '../../../../src/Model/Error/UnprocessableEntity';
import Vaccination from '../../../../src/Model/Pet/Vaccination';

test('empty', () => {
    const submitPet = (pet: PetRequest): void => { };

    const wrapper = shallowMount(PetForm, {
        propsData: {
            submitPet
        }
    });

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <form>
            <fieldset>
                <text-field-stub label="Name" value="" invalidparameters=""></text-field-stub>
                <text-field-stub label="Tag" invalidparameters=""></text-field-stub>
                <div class="form-field">
                    <label>Vaccanations</label>
                    <div>
                        <button data-testid="add-vaccination" type="button" class="btn-green">Add</button>
                    </div>
                </div>
                <button type="submit" data-testid="submit-pet" class="btn-blue">Save</button>
            </fieldset>
        </form>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('without error', () => {
    const submitPet = (pet: PetRequest): void => { };

    const defaultPet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        name: 'Brownie',
        vaccinations: [
            new Vaccination({ name: 'Rabies' })
        ]
    });

    const wrapper = shallowMount(PetForm, {
        propsData: {
            submitPet,
            defaultPet
        }
    });

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <form>
            <fieldset>
                <text-field-stub label="Name" value="Brownie" invalidparameters=""></text-field-stub>
                <text-field-stub label="Tag" invalidparameters=""></text-field-stub>
                <div class="form-field">
                    <label>Vaccanations</label>
                    <div>
                        <fieldset>
                            <text-field-stub label="Name" value="Rabies" invalidparameters=""></text-field-stub>
                            <button data-testid="remove-vaccination-0" type="button" class="btn-red">Remove</button>
                        </fieldset>
                        <button data-testid="add-vaccination" type="button" class="btn-green">Add</button>
                    </div>
                </div>
                <button type="submit" data-testid="submit-pet" class="btn-blue">Save</button>
            </fieldset>
        </form>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('with error', () => {
    const submitPet = (pet: PetRequest): void => { };

    const defaultPet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        name: '',
        vaccinations: [
            new Vaccination({ name: '' })
        ]
    });

    const invalidParameters: Array<InvalidParameter> = [
        { name: 'name', reason: 'Should not be empty' },
        { name: 'vaccinations[0].name', reason: 'Should not be empty' }
    ];

    const unprocessableEntity = new UnprocessableEntity({
        title: 'title',
        invalidParameters: invalidParameters
    });

    const wrapper = shallowMount(PetForm, {
        propsData: {
            submitPet,
            defaultPet,
            unprocessableEntity
        }
    });

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <form>
            <fieldset>
                <text-field-stub label="Name" value="" invalidparameters="[object Object]"></text-field-stub>
                <text-field-stub label="Tag" invalidparameters=""></text-field-stub>
                <div class="form-field">
                    <label>Vaccanations</label>
                    <div>
                        <fieldset>
                            <text-field-stub label="Name" value="" invalidparameters="[object Object]"></text-field-stub>
                            <button data-testid="remove-vaccination-0" type="button" class="btn-red">Remove</button>
                        </fieldset>
                        <button data-testid="add-vaccination" type="button" class="btn-green">Add</button>
                    </div>
                </div>
                <button type="submit" data-testid="submit-pet" class="btn-blue">Save</button>
            </fieldset>
        </form>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('add vaccination', async () => {
    const submitPet = (pet: PetRequest): void => { };

    const defaultPet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        name: 'Brownie',
        vaccinations: [
            new Vaccination({ name: 'Rabies' })
        ]
    });

    const wrapper = shallowMount(PetForm, {
        propsData: {
            submitPet,
            defaultPet
        }
    });

    const addButton = wrapper.find('[data-testid="add-vaccination"]');

    addButton.trigger('click');

    await wrapper.vm.$nextTick();

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <form>
            <fieldset>
                <text-field-stub label="Name" value="Brownie" invalidparameters=""></text-field-stub>
                <text-field-stub label="Tag" invalidparameters=""></text-field-stub>
                <div class="form-field">
                    <label>Vaccanations</label>
                    <div>
                        <fieldset>
                            <text-field-stub label="Name" value="Rabies" invalidparameters=""></text-field-stub>
                            <button data-testid="remove-vaccination-0" type="button" class="btn-red">Remove</button>
                        </fieldset>
                        <fieldset>
                            <text-field-stub label="Name" value="" invalidparameters=""></text-field-stub>
                            <button data-testid="remove-vaccination-1" type="button" class="btn-red">Remove</button>
                        </fieldset>
                        <button data-testid="add-vaccination" type="button" class="btn-green">Add</button>
                    </div>
                </div>
                <button type="submit" data-testid="submit-pet" class="btn-blue">Save</button>
            </fieldset>
        </form>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('remove vaccination', async () => {
    const submitPet = (pet: PetRequest): void => { };

    const defaultPet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        name: 'Brownie',
        vaccinations: [
            new Vaccination({ name: 'Rabies' })
        ]
    });

    const wrapper = shallowMount(PetForm, {
        propsData: {
            submitPet,
            defaultPet
        }
    });

    const removeButton = wrapper.find('[data-testid="remove-vaccination-0"]');

    removeButton.trigger('click');

    await wrapper.vm.$nextTick();

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <form>
            <fieldset>
                <text-field-stub label="Name" value="Brownie" invalidparameters=""></text-field-stub>
                <text-field-stub label="Tag" invalidparameters=""></text-field-stub>
                <div class="form-field">
                    <label>Vaccanations</label>
                    <div>
                        <button data-testid="add-vaccination" type="button" class="btn-green">Add</button>
                    </div>
                </div>
                <button type="submit" data-testid="submit-pet" class="btn-blue">Save</button>
            </fieldset>
        </form>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('submit minimal', async () => {
    const submitPet = jest.fn((pet: PetRequest) => {
        expect(pet.name).toBe('Brownie');
        expect(pet.tag).toBeUndefined();
    });

    const defaultPet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        name: 'Brownie',
        tag: ''
    });

    const wrapper = shallowMount(PetForm, {
        propsData: {
            submitPet,
            defaultPet
        }
    });

    const submitButton = wrapper.find('[data-testid="submit-pet"]');

    submitButton.trigger('submit');

    expect(submitPet.mock.calls.length).toBe(1);
});

test('submit maximal', async () => {
    const submitPet = jest.fn((pet: PetRequest) => {
        expect(pet.name).toBe('Brownie');
        expect(pet.tag).toBe('0001-000');
        expect(pet.vaccinations).toHaveLength(1);
        expect(pet.vaccinations[0].name).toBe('Rabies');
    });

    const defaultPet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        name: 'Brownie',
        tag: '0001-000',
        vaccinations: [
            new Vaccination({ name: 'Rabies' })
        ]
    });

    const wrapper = shallowMount(PetForm, {
        propsData: {
            submitPet,
            defaultPet
        }
    });

    const submitButton = wrapper.find('[data-testid="submit-pet"]');

    submitButton.trigger('submit');

    expect(submitPet.mock.calls.length).toBe(1);
});
