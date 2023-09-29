import { useState, useEffect } from "react";
import ManageVersionTable from "../components/ManageVersionTable";
import { useNavigate, useParams } from "react-router";
import versionService from "../services/versionService";
import packageService from "../services/packageService";
import LoadingModal from "../components/LoadingDialog";
import userService from "../services/userService";
import { AiOutlineCloudUpload } from "react-icons/ai";
import ModalPublishVersion from "../components/ModalPublishVersion";
import ModalConfirmDelete from "../components/ModalConfirmDelete";

const ManageVersion = () => {

    const [versionList, setVersionList] = useState<IGetVersion[]>([]);
    const [versionDeleteId, setVersionDeleteId] = useState<string>("");
    const [canEdit, setCanEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { packageId } = useParams();
    const [packageDetail, setPackageDetail] = useState<IGetPackage>();
    //User info
    const [tokenUser, setTokenUser] = useState<string>("");
    const [user, setUser] = useState<IUser | null>();

    //Open modal publish version
    const [openModalPublish, setOpenModalPublish] = useState<boolean>(false);
    const [openModalConfirmDelete, setopenModalConfirmDelete] = useState(false);

    //Navigate
    const navigate = useNavigate();

    //Get user info
    useEffect(() => {
        const localToken = localStorage.getItem('token') || "";
        if(localToken !== "") {
            setIsLoading(true);
            setTokenUser(localToken);
        }
    }, []);

    //Update version
    const [versionUpdate, setVersionUpdate] = useState<IUpdateVersion | undefined>();

    const getUserInfo = async () => {
        try {
            const response = await userService.getUser();
            if (response && response.status === 200) {
                setUser(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const checkPackage = () => {
        if(user) {
            const canEdit = packageDetail && packageDetail.createdBy === user._id ? true : false;
            setCanEdit(canEdit);
            setIsLoading(false);
        }
    }

    const getVersionList = async() => {
        if(packageId) {
            const response = await versionService.getVersionByPackageId(packageId);
            if(response && response.status === 200) {
                setVersionList(response.data.data);
            }
        }
    }

    const getPackageInfo = async() => {
        if(packageId) {
            const response = await packageService.getPackageById(packageId);
            if(response) {
                setPackageDetail(response.data);
            }
        }
    }

    const onUpdateVersion = (version: IGetVersion) => {
        setVersionUpdate(version);
        setOpenModalPublish(true);
    }

    const onDeleteVersion = async(versionId: string) => {
        setopenModalConfirmDelete(true);
        setVersionDeleteId(versionId);
        
    }

    const removeVersion = async() => {
        if(versionDeleteId) {
            try {
                const response = await versionService.deleteVersion(versionDeleteId);
                if(response && response.status === 200) {
                    alert("Delete version successfully!");
                    getVersionList();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const onCloseModal = () => {
        setIsLoading(false);
    }

    const handleCloseModal = () => {
        setOpenModalPublish(false);
        setVersionUpdate(undefined);
    }

    useEffect(() => {
        getPackageInfo();
    }, [])

    useEffect(() => {
        getVersionList();
    }, []);

    useEffect(() => {
        if(tokenUser !== "") {
            getUserInfo();
        }
    }, [tokenUser]);

    useEffect(() => {
        if(user) {
            checkPackage();
        }
    }, [user]);

    return (
        <div className={`${isLoading === true ? 'hidden' : ''}`}>
            <LoadingModal open={isLoading} closeModal={onCloseModal}/>
            <div className="title my-10 text-center font-bold text-2xl">RELEASE VERSIONS</div>
            <div className="body mx-6">
                {canEdit && <button onClick={() => setOpenModalPublish(true)} className=" my-4 border-none outline-none flex justify-center mr-2 px-4 py-2 text-white items-center cursor-pointer rounded bg-green-400"><AiOutlineCloudUpload /><p className="lg:block lg:ml-2">Publish new version</p></button>}
                <ManageVersionTable onDeleteVersion={onDeleteVersion} canEdit={canEdit} versionList={versionList} onUpdateVersion={onUpdateVersion}/>
                <ModalPublishVersion versionUpdate={versionUpdate} refreshData={getVersionList} open={openModalPublish} handleClose={handleCloseModal} packageId={packageId ? packageId : ''}/>
                <ModalConfirmDelete remove={removeVersion} open={openModalConfirmDelete} handleClose={() => setopenModalConfirmDelete(false)}/>
            </div>
        </div>
    )
}

export default ManageVersion;