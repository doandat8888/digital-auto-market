import { useState } from "react"
import { AiFillStar } from "react-icons/ai";

interface IProps {
    starArr: number[],
    stars: number,
    onClickStar: (value: number) => void
}

const Rating = (props: IProps) => {

    const {starArr, stars, onClickStar} = props;

    return (
        <div className="flex text-center">
            <div className="mx-auto">
                <div className="flex items-center">
                    {starArr.map((value) => (
                        <div onClick={() => onClickStar(value)} className={`${stars >= value ? 'text-yellow-400' : 'text-gray-300'} text-4xl cursor-pointer`}><AiFillStar/></div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Rating