interface IProps {
    title: string,
    value: string,
    handleFileTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    placeholderStr: string,
    disabled?: boolean | undefined
}

const TextInput = ({title, value, handleFileTextChange, placeholderStr, disabled}: IProps) => {
    return (
        <div className="sm:col-span-4 my-4">
            <div className="flex">
                <label htmlFor="versioname" className="block text-sm font-bold leading-6 text-gray-900">
                    {title}
                </label>
                <p className="required text-red-500 ml-1">*</p>
            </div>
            <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                        maxLength={380}
                        required
                        type="text"
                        className="text-[12px] block flex-1 border-0 bg-transparent py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder={placeholderStr}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFileTextChange(event)}
                        value={value}
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    )
}

export default TextInput;