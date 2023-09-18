import PackageItem from "./PackageItem";

interface IProps {
    packages: IPackage[];
}

const PackageList = (props: IProps) => {

    let { packages } = props;

    return (
        <div className="w-full package-list grid lg:grid-cols-3 justify-between sm:grid-cols-2 grid-cols-1">
            {packages && packages.length > 0 && packages.map((packageItem: IPackage) => (
                <PackageItem packageItem={packageItem}/>
            ))}
        </div>
    )
}

export default PackageList;