import { useState, useEffect } from "react";
import ManageVersionTable from "../components/ManageVersionTable";
import { useParams } from "react-router";
import versionService from "../services/versionService";
import packageService from "../services/packageService";
import LoadingModal from "../components/LoadingDialog";
import userService from "../services/userService";
import { AiOutlineCloudUpload, AiOutlineEdit } from "react-icons/ai";
import ModalPublishVersion from "../components/ModalPublishVersion";

const ManageVersion = () => {

    const [versionList, setVersionList] = useState<IGetVersion[]>([]);
    const [canEdit, setCanEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { packageId } = useParams();
    const [packageDetail, setPackageDetail] = useState<IGetPackage>();
    //User info
    const [tokenUser, setTokenUser] = useState<string>("");
    const [user, setUser] = useState<IUser | null>();

    //Open modal publish version
    const [openModalPublish, setOpenModalPublish] = useState<boolean>(false);

    //Get user info
    useEffect(() => {
        const localToken = localStorage.getItem('token') || "";
        console.log("Token details: " + localToken);
        setTokenUser(localToken);
    }, [])

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
                if(user) {
                    setIsLoading(false);
                }
            }
        }
    }

    const onCloseModal = () => {
        setIsLoading(false);
    }

    useEffect(() => {
        getPackageInfo();
    }, [tokenUser, packageDetail])

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
            <div className="title my-10 text-center font-bold text-2xl">RELEASE VERSION</div>
            <div className="body mx-6">
                <button onClick={() => setOpenModalPublish(true)} className=" my-4 border-none outline-none flex justify-center mr-2 px-4 py-2 text-white items-center cursor-pointer rounded bg-green-400"><AiOutlineCloudUpload /><p className="lg:block lg:ml-2 hidden">Publish new version</p></button>
                <ManageVersionTable canEdit={canEdit} versionList={versionList}/>
                <ModalPublishVersion open={openModalPublish} handleClose={() => setOpenModalPublish(false)}/>
            </div>
        </div>
    )
}

export default ManageVersion;