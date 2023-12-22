interface IProps {
    title: string,
    placeHolderStr: string,
    value: string,
    handleTextAreaChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const TextArea = (props: IProps) => {

    const { title, placeHolderStr, value, handleTextAreaChange } = props;

    return (
        <div className="col-span-full my-4 select-none">
            <div className="flex">
                <label htmlFor="about" className="block text-sm font-bold leading-6 text-gray-900">
                    {title}
                </label>
                <span className="required text-red-500 ml-1">*</span>
            </div>
            <div className="mt-2">
                <textarea
                    maxLength={1024}
                    required
                    id="about"
                    name="about"
                    rows={3}
                    className="bg-white text-[12px] block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm 
                    ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder={placeHolderStr}
                    defaultValue={''}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => handleTextAreaChange(event)}
                    value={value}
                />
            </div>
        </div>
    )
}

export default TextArea;