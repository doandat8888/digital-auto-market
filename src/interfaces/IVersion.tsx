type IVersion = {
    _id: string,
    packageId: string,
    name: string,
    state: string,
    downloadUrl: string,
    desc: string,
}

type IAddVersion = {
    name?: string | undefined,
    // downloadUrl: string,
    // deploymentUrl: string,
    desc?: string | undefined,
    description?: string | undefined,
    packageId: string,
    file?: File | undefined,
    endpointUrl?: string | undefined,
    apiKey?: string | undefined
    samples?: string | undefined
}

type IUpdateVersion = {
    _id: string,
    name: string,
    desc: string | undefined,
    endpointUrl?: string | undefined,
    apiKey?: string | undefined
    samples?: string | undefined
}

type IGetVersion = IVersion &{
    createdAt: string,
    updatedAt: string,
    deploymentUrl: string,
    entryUrl: string
    __v: number,
    package: IPackage,
    endpointUrl?: string | undefined,
    apiKey?: string | undefined
    samples?: string | undefined
}