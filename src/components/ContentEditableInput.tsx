import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

interface IProps {
    title: string,
    value: string,
    handleFileTextChange: (event: ContentEditableEvent) => void
    placeholderStr: string
}

const ContentEditableInput = (props: IProps) => {

    const { title, value, handleFileTextChange, placeholderStr } = props;

    return (
        <div className="sm:col-span-4 my-4">
            <div className="flex">
                <label htmlFor="versioname" className="block text-sm font-bold leading-6 text-gray-900">
                    {title}
                </label>
                <span className="required text-red-500 ml-1">*</span>
            </div>
            <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset 
                focus-within:ring-indigo-600 sm:max-w-md">
                    <ContentEditable
                        placeholder={placeholderStr}
                        html={value}
                        aria-required
                        onChange={(event: ContentEditableEvent) => handleFileTextChange(event)}
                        className='bg-white text-[12px] block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 
                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    />
                </div>
            </div>
        </div>
    )
}

export default ContentEditableInput;