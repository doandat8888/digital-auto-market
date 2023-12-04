import ReviewItem from "./ReviewItem";

interface IProps {
    reviewsFilter: IUpdateReview[] | undefined,
    // user: IUser | null,
    onUpdateReview: (review: IUpdateReview) => void
    onDeleteReview: (reviewId: string) => void,
    currentUser: IUser
}

const ReviewList = (props: IProps) => {

    const {reviewsFilter, onUpdateReview, onDeleteReview, currentUser} = props;

    return (
        <div>
            {reviewsFilter && reviewsFilter.length > 0 && reviewsFilter.map((review) => (
                <ReviewItem currentUser={currentUser} onDeleteReview={() => onDeleteReview(review._id)} onUpdateReview={() => onUpdateReview(review)} rating={review.rating} comment={review.content} createdAt={review.createdAt} createdBy={review.createdBy}/>
            ))}
        </div>
        
    )
}

export default ReviewList;