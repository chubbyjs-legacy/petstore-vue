import { shallowMount } from '@vue/test-utils';
import BadRequest from '../../../../src/Model/Error/BadRequest';
import InvalidParameter from '../../../../src/Model/Error/InvalidParameter';
import PetFilterForm from '../../../../src/Component/Form/PetFilterForm.vue';
import PetFilters from '../../../../src/Model/Pet/PetFilters';

test('without error', () => {
    const submitPetFilter = (filters: PetFilters) => { };

    const defaultPetFilters = new PetFilters({ name: 'aa' });

    const wrapper = shallowMount(PetFilterForm, {
        propsData: {
            submitPetFilter,
            defaultPetFilters
        }
    });

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <form>
            <fieldset>
                <text-field-stub label="Name" value="aa" invalidparameters=""></text-field-stub>
                <button type="submit" data-testid="submit-pet-filter" class="btn-blue">Filter</button>
            </fieldset>
        </form>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('with error', () => {
    const submitPetFilter = (filters: PetFilters) => { };

    const invalidParameters: Array<InvalidParameter> = [
        { name: 'name', reason: 'Should not be empty' },
    ];

    const badRequest = new BadRequest({
        title: 'title',
        invalidParameters: invalidParameters
    });

    const wrapper = shallowMount(PetFilterForm, {
        propsData: {
            submitPetFilter,
            badRequest
        }
    });

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <form>
            <fieldset>
                <text-field-stub label="Name" value="" invalidparameters="[object Object]"></text-field-stub>
                <button type="submit" data-testid="submit-pet-filter" class="btn-blue">Filter</button>
            </fieldset>
        </form>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('submit', async () => {
    const submitPetFilter = jest.fn((filters: PetFilters) => {
        expect(filters.name).toEqual('aa');
    });

    const defaultPetFilters = new PetFilters({ name: 'aa' });

    const wrapper = shallowMount(PetFilterForm, {
        propsData: {
            submitPetFilter,
            defaultPetFilters
        }
    });

    const submitButton = wrapper.find('[data-testid="submit-pet-filter"]');

    submitButton.trigger('submit');

    expect(submitPetFilter.mock.calls.length).toBe(1);
});

test('submit empty', async () => {
    const submitPetFilter = jest.fn((filters: PetFilters) => {
        expect(filters.name).toBeUndefined();
    });

    const defaultPetFilters = new PetFilters({ name: '' });

    const wrapper = shallowMount(PetFilterForm, {
        propsData: {
            submitPetFilter,
            defaultPetFilters
        }
    });

    const submitButton = wrapper.find('[data-testid="submit-pet-filter"]');

    submitButton.trigger('submit');

    expect(submitPetFilter.mock.calls.length).toBe(1);
});
