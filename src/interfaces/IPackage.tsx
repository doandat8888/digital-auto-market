interface IPackage {
    no: number
    id: string,
    name: string,
    author: string | undefined,
    description: string,
    likeNumber: number,
    download: number,
    imgCover: string,
    version: string,
    mode: string,
    imgDetails: string[],
    source: string,
    uid: string | undefined
}
