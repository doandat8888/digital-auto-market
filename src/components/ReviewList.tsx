import ReviewItem from "./ReviewItem";

interface IProps {
    reviewsFilter: IUpdateReview[],
    user: IUser,
    onUpdateReview: (review: IUpdateReview) => void
    onDeleteReview: (reviewId: string) => void
}

const ReviewList = (props: IProps) => {

    const {reviewsFilter, user, onUpdateReview, onDeleteReview} = props;

    return (
        <div>
            {reviewsFilter && reviewsFilter.length > 0 && reviewsFilter.map((review) => (
                <ReviewItem onDeleteReview={() => onDeleteReview(review._id)} onUpdateReview={() => onUpdateReview(review)} user={user} rating={review.rating} comment={review.content} createdBy={review.createdBy._id}/>
            ))}
        </div>
        
    )
}

export default ReviewList;