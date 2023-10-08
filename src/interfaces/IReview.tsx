interface IReview {
    packageId: string,
    versionId: string,
    rating: number,
    content: string,
    createdBy: {
        _id: string,
        fullName: string,
        avatar: string
    }
}

type IGetReview = IReview & {
    _id: string,
    createdBy: {
        _id: string,
        fullName: string,
        avatar: string
    },
}

type IUpdateReview = IReview & {
   _id: string,
   createdAt: string,
}

