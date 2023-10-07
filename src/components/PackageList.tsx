import PackageItem from "./PackageItem";

interface IProps {
    packages: IGetPackage[];
}

const PackageList = (props: IProps) => {

    const { packages } = props;

    return (
        <div className="w-full h-[90%] sm:h-auto sm:overflow-hidden overflow-scroll package-list grid lg:grid-cols-3 justify-between sm:grid-cols-2 grid-cols-1">
            {packages && packages.length > 0 && packages.map((packageItem: IGetPackage) => (
                <PackageItem packageItem={packageItem}/>
            ))}
        </div>
    )
}

export default PackageList;