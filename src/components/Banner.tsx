interface IProps {
    title: string | undefined,
    contentBtn: string | undefined
}

const Banner = ({ title, contentBtn }: IProps) => {
    return (
        <div className='pt-[46px] mb-10 xl:mx-40 lg:mx-20 sm:mx-10 mx-5 relative text-white'>
            <img src="https://digitalauto.netlify.app/assets/HomeCover-9aabc219.png" className='rounded-2xl w-full object-cover h-[40vh]' alt="" />
            <div className='absolute lg:top-[40%] sm:top-[40%] top-[40%] mx-6'>
                <p className='font-bold lg:text-4xl sm:text-2xl text-xl'>{title}</p>
                <button className='p-2 my-4 border-2 border-white outline-none'>{contentBtn}</button>
            </div>
        </div>
    )
}

export default Banner