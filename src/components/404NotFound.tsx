interface IProps {}

const NotFound = (props: IProps) => {
    return (
        <div className={`notfound flex items-center`}>
            <img className="w-[20%] mx-auto my-auto" src="https://juststickers.in/wp-content/uploads/2016/12/404-error-not-found.png" alt="notfound" />
        </div>
    )
}

export default NotFound;