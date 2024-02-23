interface IProps {
    listStatus: IStatus[];
    handleChangeStatus: (value: string) => void,
}

const StatusSelect = ({ listStatus, handleChangeStatus }: IProps) => {
    return (
        <div className="custom-select w-[100%] sm:w-[20%] lg:w-[15%]">
            <select defaultValue={"widget"} onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                handleChangeStatus(event.target.value)}
                className="bg-white w-full mb-4 sm:mb-0 text-black block rounded"
            >
                {listStatus && listStatus.length > 0 && listStatus.map((status) => (
                    <option value={status.name}>{status.textShow}</option>
                ))}
            </select>
        </div>
    )
}

export default StatusSelect;