import { shallowMount } from '@vue/test-utils';
import HttpError from '../../../../src/Component/Partial/HttpError.vue';
import HttpErrorWithInvalidArguments from '../../../../src/Model/Error/HttpErrorWithInvalidArguments';

test('minimal', () => {
    const httpError = new HttpErrorWithInvalidArguments({
        title: 'This is the title'
    });

    const wrapper = shallowMount(HttpError, {
        propsData: { httpError: httpError }
    });

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '')).toBe(`
        <div id="httpError">
            <p>This is the title</p>
            <!---->
            <!---->
            <ul></ul>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('maximal', () => {
    const httpError = new HttpErrorWithInvalidArguments({
        title: 'This is the title',
        detail: 'This is the detail',
        instance: 'This is the instance',
        invalidParameters: [
            { name: 'Invalid Parameter Name', reason: 'Invalid Parameter Reason' }
        ]
    });

    const wrapper = shallowMount(HttpError, {
        propsData: { httpError: httpError }
    });

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '')).toBe(`
        <div id="httpError">
            <p>This is the title</p>
            <p>This is the detail</p>
            <p>This is the instance</p>
            <ul>
                <li><strong>Invalid Parameter Name</strong>: Invalid Parameter Reason</li>
            </ul>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});
