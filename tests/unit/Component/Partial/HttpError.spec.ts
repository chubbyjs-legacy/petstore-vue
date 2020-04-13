import { shallowMount } from '@vue/test-utils';
import HttpError from '../../../../src/Model/Error/HttpError';
import HttpErrorPartial from '../../../../src/Component/Partial/HttpError.vue';
import HttpErrorWithInvalidParameters from '../../../../src/Model/Error/HttpErrorWithInvalidParameters';

test('minimal', () => {
    const httpError = new HttpError({
        title: 'This is the title'
    });

    const wrapper = shallowMount(HttpErrorPartial, {
        propsData: { httpError: httpError }
    });

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <div id="httpError">
            <p>This is the title</p>
            <!---->
            <!---->
            <!---->
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('maximal', () => {
    const httpError = new HttpErrorWithInvalidParameters({
        title: 'This is the title',
        detail: 'This is the detail',
        instance: 'This is the instance',
        invalidParameters: [
            { name: 'Invalid Parameter Name', reason: 'Invalid Parameter Reason' }
        ]
    });

    const wrapper = shallowMount(HttpErrorPartial, {
        propsData: { httpError: httpError }
    });

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <div id="httpError">
            <p>This is the title</p>
            <p>This is the detail</p>
            <p>This is the instance</p>
            <ul>
                <li><strong>Invalid Parameter Name</strong>: Invalid Parameter Reason</li>
            </ul>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});
