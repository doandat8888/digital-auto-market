import PackageItem from "./PackageItem";

interface IProps {
    packages: IGetPackage[] | undefined;
    showMode: boolean;
    userRole?: string;
    isAdminPage?: boolean;
}

const PackageList = (props: IProps) => {

    const { packages, showMode, userRole, isAdminPage} = props;

    return (
        <div className="w-full h-[90%] mx-auto sm:h-auto sm:overflow-hidden overflow-scroll package-list grid lg:grid-cols-4 xl:grid-cols-4 justify-between sm:grid-cols-2 grid-cols-1">
            {packages && packages.length > 0 && packages.map((packageItem: IGetPackage) => (
                <PackageItem isAdminPage={isAdminPage} userRole={userRole} showMode={showMode} packageItem={packageItem}/>
            ))}
        </div>
    )
}

export default PackageList;