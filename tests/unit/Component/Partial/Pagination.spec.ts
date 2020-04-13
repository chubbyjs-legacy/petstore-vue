import { shallowMount } from '@vue/test-utils';
import Pagination from '../../../../src/Component/Partial/Pagination.vue';

test('max pages 1', () => {
    const submitPage = (page: number): void => {

    };

    const wrapper = shallowMount(Pagination, {
        propsData: {
            currentPage: 1,
            maxPages: 1,
            totalPages: 10,
            submitPage
        }
    });

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('total pages 1', () => {
    const submitPage = (page: number): void => {

    };

    const wrapper = shallowMount(Pagination, {
        propsData: {
            currentPage: 1,
            maxPages: 7,
            totalPages: 1,
            submitPage
        }
    });

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('current 1', () => {
    const submitPage = (page: number): void => {

    };

    const wrapper = shallowMount(Pagination, {
        propsData: {
            currentPage: 1,
            maxPages: 7,
            totalPages: 10,
            submitPage
        }
    });

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <ul class="pagination">
            <!---->
            <!---->
            <li><button class="current">1</button></li>
            <li><button class="">2</button></li>
            <li><button class="">3</button></li>
            <li><button class="">4</button></li>
            <li><button class="">5</button></li>
            <li><button class="">6</button></li>
            <li><button class="">7</button></li>
            <li><button>&gt;</button></li>
            <li><button>»</button></li>
        </ul>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});


test('current 4', () => {
    const submitPage = (page: number): void => {

    };

    const wrapper = shallowMount(Pagination, {
        propsData: {
            currentPage: 4,
            maxPages: 7,
            totalPages: 10,
            submitPage
        }
    });

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <ul class="pagination">
            <li><button>«</button></li>
            <li><button>&lt;</button></li>
            <li><button class="">1</button></li>
            <li><button class="">2</button></li>
            <li><button class="">3</button></li>
            <li><button class="current">4</button></li>
            <li><button class="">5</button></li>
            <li><button class="">6</button></li>
            <li><button class="">7</button></li>
            <li><button>&gt;</button></li>
            <li><button>»</button></li>
        </ul>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});


test('current 7', () => {
    const submitPage = (page: number): void => {

    };

    const wrapper = shallowMount(Pagination, {
        propsData: {
            currentPage: 7,
            maxPages: 7,
            totalPages: 10,
            submitPage
        }
    });

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <ul class="pagination">
            <li><button>«</button></li>
            <li><button>&lt;</button></li>
            <li><button class="">4</button></li>
            <li><button class="">5</button></li>
            <li><button class="">6</button></li>
            <li><button class="current">7</button></li>
            <li><button class="">8</button></li>
            <li><button class="">9</button></li>
            <li><button class="">10</button></li>
            <li><button>&gt;</button></li>
            <li><button>»</button></li>
        </ul>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('current 10', () => {
    const submitPage = (page: number): void => {

    };

    const wrapper = shallowMount(Pagination, {
        propsData: {
            currentPage: 10,
            maxPages: 7,
            totalPages: 10,
            submitPage
        }
    });

    expect(wrapper.html().replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><')).toBe(`
        <ul class="pagination">
            <li><button>«</button></li>
            <li><button>&lt;</button></li>
            <li><button class="">4</button></li>
            <li><button class="">5</button></li>
            <li><button class="">6</button></li>
            <li><button class="">7</button></li>
            <li><button class="">8</button></li>
            <li><button class="">9</button></li>
            <li><button class="current">10</button></li>
            <!---->
            <!---->
        </ul>
    `.replace(/\n/g, '').replace(/ {2,}/g, '').replace(/> </g, '><'));
});

test('buttons', async () => {
    const pages: number[] = [];

    const submitPage = (page: number): void => {
        pages.push(page);
    };

    const wrapper = shallowMount(Pagination, {
        propsData: {
            currentPage: 7,
            maxPages: 7,
            totalPages: 10,
            submitPage
        }
    });

    for (const element of wrapper.findAll('button').wrappers) {
        element.trigger('click');
    }

    expect(pages).toEqual([1, 6, 4, 5, 6, 7, 8, 9, 10, 8, 10]);
});
