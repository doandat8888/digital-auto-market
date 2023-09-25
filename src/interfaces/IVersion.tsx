type IVersion = {
    _id: string,
    packageId: string,
    name: string,
    state: string,
    downloadUrl: string,
    desc: string,
}

type IGetVersion = IVersion &{
    createdAt: string,
    updatedAt: string,
    __v: number
}