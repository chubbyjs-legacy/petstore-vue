import { shallowMount } from '@vue/test-utils';
import InvalidParameter from '../../../../src/Model/Error/InvalidParameter';
import TextField from '../../../../src/Component/Form/TextField.vue';

test('default', () => {
    const invalidParameters: Array<InvalidParameter> = [
        { name: 'name', reason: 'Should not be empty' }
    ];

    const wrapper = shallowMount(TextField, {
        propsData: {
            label: 'Name',
            value: 'Brownie',
            invalidParameters
        }
    });

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <div class="form-field error">
            <label>Name</label>
            <input type="text">
            <ul>
                <li>Should not be empty</li>
            </ul>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});
