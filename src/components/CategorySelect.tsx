interface IProps {
    listCategory: ICategory[];
    handleChangeCategory: (value: string) => void,
}

const CategorySelect = (props: IProps) => {

    const { listCategory, handleChangeCategory } = props;

    return (
        <div className="category-select sm:col-span-full">
            <div className="flex">
                <label htmlFor="versioname" className="block text-sm font-bold leading-6 text-gray-900">
                    Category
                </label>
                <span className="required text-red-500 ml-1">*</span>
            </div>
            <select
                defaultValue={"widget"}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleChangeCategory(event.target.value)}
                className="bg-white w-[50%] text-black block px-1 mt-1 sm:text-sm sm:text-[10px] text-[14px] border py-1 border-gray-500 rounded"
            >
                {listCategory && listCategory.length > 0 && listCategory.map((category) => (
                    <option value={category.name}>{category.textShow}</option>
                ))}
            </select>
        </div>

    )
}

export default CategorySelect;