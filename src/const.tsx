const pageList: IPage[] = [
    {
        id: 1,
        name: 'Shop',
        path: '/',
    },
    {
        id: 2,
        name: 'My package',
        path: '/mypackage'
    },
    {
        id: 3,
        name: 'Widget',
        path: '/packagetype/widget'
    },
    {
        id: 4,
        name: 'Vehicle app',
        path: '/packagetype/vehicalapp'
    }
];

const categoryFake: ICategory[] = [
    {
        id: "1",
        name: "widget",
        textShow: "Widget"
    },
    {
        id: "2",
        name: "vehicalapp",
        textShow: "Vehicle app"
    },
]

export default {
    pageList,
    categoryFake
}