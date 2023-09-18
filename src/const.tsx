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
    }
];

const packageListFake: IPackage[] = [
    {
        id: 1,
        name: "Sleep when driving",
        author: "Dat Doan",
        description: "A package to notify user to wake up and concentrate to the road",
        likeNumber: 52,
        warningNumber: 30,
        download: 100,
        img: "https://th.bing.com/th/id/R.05b0f67bc783659ebf8d9c9d32f14100?rik=54ppBeT8IxipbQ&riu=http%3a%2f%2fi.huffpost.com%2fgen%2f1241183%2fimages%2fo-SLEEP-DRIVING-facebook.jpg&ehk=tkAzRgqRmfWOLvTNFumkveKG1hpVgKJcJMHtQKfGY4w%3d&risl=&pid=ImgRaw&r=0",
        version: "1.1.0",
        mode: "public",
        slug: "ddgy-88hy",
        imgDetail: [
            {
                url: "https://s32891.pcdn.co/wp-content/uploads/2020/01/sleepy-driver.jpg"
            },
            {
                url: "https://th.bing.com/th/id/OIP.cleXqm-lKmTH4uGho1jB5gHaDt?pid=ImgDet&rs=1"
            },
            {
                url: "https://www.fortbehavioral.com/wp-content/uploads/2020/03/AdobeStock_290724913_0415a639f948eea0e1af9af461b1dd81.jpg"
            }
        ]
    },
    {
        id: 2,
        name: "Wallet detection",
        author: "Nhan Luong",
        description: "A package to noitfy when you forget wallet in your car",
        likeNumber: 52,
        warningNumber: 28,
        download: 120,
        img: "https://th.bing.com/th/id/R.c15db627f355cfcd1aa70991ef1c0eda?rik=%2fG4YSBslyrcvpw&riu=http%3a%2f%2fwww.dayinsure.com%2fwp-content%2fuploads%2f2019%2f09%2fWallet-on-car-seat.jpg&ehk=uWlXFHJXqP2IfK0aMFRssPJbDnVH1EzW4bRpgrGiwAY%3d&risl=&pid=ImgRaw&r=0",
        version: "1.1.0",
        mode: "public",
        slug: "abgd-18sd",
        imgDetail: [
            {
                url: "https://assets.telegraphindia.com/telegraph/2021/Jun/1623093554_wallet.jpg"
            },
            {
                url: "https://d356qujqspw52j.cloudfront.net/img/full/2015-09-19-Forgot-wallet.jpg"
            },
        ]
    },
    {
        id: 3,
        name: "Auto Headlight",
        author: "Hien Phan",
        description: "Just a simple prototype to solve existing problem, with existing solution: forget turning on headlight while driving in the dark condition (city night, or tunnel, or similar conditions) or during daylight in raining condition is dangerous in traffic, and forget turning it off during daylight is waste of energy, as well as disturbing other vehicle.",
        likeNumber: 52,
        warningNumber: 28,
        download: 120,
        img: "https://th.bing.com/th/id/OIP.sULyUxgwjhbTvCTDJJRsSwHaFj?pid=ImgDet&rs=1",
        version: '1.0.0',
        mode: "public",
        slug: "hgec-33df",
        imgDetail: [
            {
                url: "https://images.wheels.ca/wp-content/uploads/2018/12/shutterstock_554722975.jpg",
            },
            {
                url: "https://th.bing.com/th/id/OIP.q4pjSnUbxNu4ig44Je5JygHaDk?pid=ImgDet&rs=1"
            },
            {
                url: "https://th.bing.com/th/id/R.ace2fe471a6e91bd55b4813ce764b543?rik=1nIvXgI4UMl5RA&riu=http%3a%2f%2fstatic.businessinsider.com%2fimage%2f535a9035eab8eaaf3d505e1a%2fimage.jpg&ehk=lnijYdEIgvAuYQvzEEv9x9TzIIZ7uNTDCbxNKOUgJMY%3d&risl=&pid=ImgRaw&r=0"
            }
        ]
    },
]

export default {
    pageList,
    packageListFake
}