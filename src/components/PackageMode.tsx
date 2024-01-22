interface IProps {
    mode: string,
    onChangeMode: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const PackageMode = ({ mode, onChangeMode }: IProps) => {
    return (
        <fieldset className='w-[50%] flex justify-end'>
            <div className="w-[95%]">
                <div className="flex w-[95%]">
                    <legend className="text-sm font-semibold leading-6 text-gray-900">Mode</legend>
                    <span className="required text-red-500 ml-1">*</span>
                </div>
                <div className="space-y-3 w-[95%] flex items-center">
                    <div className="flex items-center mr-4">
                        <input
                            checked={mode === "public"}
                            id="public"
                            name="public"
                            type="radio"
                            className="h-4 w-4 mr-1 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            onChange={onChangeMode}
                            value={"public"}
                        />
                        <label htmlFor="push-everything" className="block text-sm font-medium leading-6 text-gray-900">
                            Public
                        </label>
                    </div>
                    <div className="flex items-center mode-private">
                        <input
                            checked={mode === "private"}
                            id="private"
                            name="private"
                            type="radio"
                            className="mr-1 h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            onChange={onChangeMode}
                            value={"private"}
                        />
                        <label htmlFor="push-nothing" className="block text-sm font-medium leading-6 text-gray-900">
                            Only me
                        </label>
                    </div>
                </div>
            </div>
        </fieldset>
    )
}

export default PackageMode