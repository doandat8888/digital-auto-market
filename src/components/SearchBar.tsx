interface IProps {
    placeHolder: string,
    onSearchHandler: (e: any) => void,
    widthLg: string,
    widthSm: string,
    width: string
}

const SearchBar = ({ placeHolder, onSearchHandler, width, widthLg, widthSm }: IProps) => {
    return (
        <input className={`bg-white text-[14px] rounded border px-3 py-2 lg:w-[${widthLg}] sm:w-[${widthSm}] w-[${width}]`} type="text"
            placeholder={placeHolder} onChange={(e: any) => onSearchHandler(e)} />
    )
}

export default SearchBar