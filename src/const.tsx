const pageList: any = [
    {
        id: 1,
        name: 'Shop',
        path: '/'
    },
    {
        id: 2,
        name: 'My package',
        path: 'mypackage'
    }
];

const packageListFake: IPackage[] = [
    {
        id: 1,
        name: "Sleep when driving",
        author: "Dat Doan",
        like: 52,
        warning: 30,
        download: 100,
        img: "https://th.bing.com/th/id/R.05b0f67bc783659ebf8d9c9d32f14100?rik=54ppBeT8IxipbQ&riu=http%3a%2f%2fi.huffpost.com%2fgen%2f1241183%2fimages%2fo-SLEEP-DRIVING-facebook.jpg&ehk=tkAzRgqRmfWOLvTNFumkveKG1hpVgKJcJMHtQKfGY4w%3d&risl=&pid=ImgRaw&r=0",
        version: "1.1.0",
        mode: "public"
    },
    {
        id: 2,
        name: "Wallet detection",
        author: "Nhan Luong",
        like: 52,
        warning: 28,
        download: 120,
        img: "https://th.bing.com/th/id/R.c15db627f355cfcd1aa70991ef1c0eda?rik=%2fG4YSBslyrcvpw&riu=http%3a%2f%2fwww.dayinsure.com%2fwp-content%2fuploads%2f2019%2f09%2fWallet-on-car-seat.jpg&ehk=uWlXFHJXqP2IfK0aMFRssPJbDnVH1EzW4bRpgrGiwAY%3d&risl=&pid=ImgRaw&r=0",
        version: "1.1.0",
        mode: "public"
    },
    {
        id: 3,
        name: "Auto Headlight",
        author: "Hien Phan",
        like: 52,
        warning: 28,
        download: 120,
        img: "https://th.bing.com/th/id/OIP.R1YU2A58eiXpHe5a8r-GfwAAAA?pid=ImgDet&rs=1",
        version: '1.0.0',
        mode: "public"
    },
]

export default {
    pageList,
    packageListFake
}