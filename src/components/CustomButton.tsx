import React from 'react'

interface IProps {
    disabled?: boolean,
    onClickBtn: (event: any) => void,
    type?: string,
    title: string,
    bgColor?: string
    px?: string,
    py?: string
}

const CustomButton = ({disabled, onClickBtn, type, title, bgColor}: IProps) => {
    return (
        <button
            disabled={disabled ? disabled : false}
            onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onClickBtn(event)}
            type={type ? type : 'button'}
            className={`w-full text-white ${bgColor ? bgColor : 'bg-blue-500'} hover:opacity-80 focus:ring-4 
                        focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center 
                        dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50`}>
            {title}
        </button>
    )
}

export default CustomButton