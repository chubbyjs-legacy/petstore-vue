import { shallowMount } from '@vue/test-utils';
import Home from '../../../../src/Component/Page/Home.vue';

test('default', () => {
    const wrapper = shallowMount(Home, {});

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <div>
            <h1>Home</h1>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});
