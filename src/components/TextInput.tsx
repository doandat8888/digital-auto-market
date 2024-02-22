interface IProps {
    title: string,
    value: string,
    handleFileTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    placeholderStr: string,
    disabled?: boolean | undefined,
    type?: string,
    required?: boolean,
}

const TextInput = ({title, value, handleFileTextChange, placeholderStr, disabled, type, required}: IProps) => {
    return (
        <div className="my-4">
            <div className="flex">
                <label htmlFor="versioname" className="block text-sm font-bold leading-6 text-gray-900">
                    {title}
                </label>
                {required === false ? '' : <span className="required text-red-500 ml-1">*</span>}
            </div>
            <div className="mt-2">
                <div className="flex w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                        required={required ? required : true}
                        type={type ? type : 'text'}
                        className="w-[100%] max-w-[100%] text-[12px] border-0 bg-transparent py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder={placeholderStr}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFileTextChange(event)}
                        value={value}
                        disabled={disabled ? disabled : false}
                    />
                </div>
            </div>
        </div>
    )
}

export default TextInput;