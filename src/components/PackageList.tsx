import PackageItem from "./PackageItem";

interface IProps {
    packages: IPackage[];
}

const PackageList = (props: IProps) => {

    return (
        <div className="w-full package-list grid lg:grid-cols-3 justify-between sm:grid-cols-2 grid-cols-1">
            <PackageItem />
            <PackageItem />
            <PackageItem />
            <PackageItem />
        </div>
    )
}

export default PackageList;