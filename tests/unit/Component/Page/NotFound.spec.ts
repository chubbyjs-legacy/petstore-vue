import { shallowMount } from '@vue/test-utils';
import NotFound from '../../../../src/Component/Page/NotFound.vue';

test('default', () => {
    const wrapper = shallowMount(NotFound, {});

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <div>
            <h1>Not Found</h1>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});
