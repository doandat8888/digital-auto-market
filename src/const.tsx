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

const statusFake: ICategory[] = [
    {
        id: "1",
        name: "",
        textShow: "All"
    },
    {
        id: "2",
        name: "approved",
        textShow: "Approved"
    },
    {
        id: "3",
        name: "rejected",
        textShow: "Rejected"
    },
    {
        id: "4",
        name: "wait-for-approve",
        textShow: "Wait for approve"
    },
]

export default {
    pageList,
    categoryFake,
    statusFake
}