import ReviewItem from "./ReviewItem";

interface IProps {
    reviewsFilter: IUpdateReview[] | undefined,
    // user: IUser | null,
    onUpdateReview: (review: IUpdateReview) => void
    onDeleteReview: (reviewId: string) => void
}

const ReviewList = (props: IProps) => {

    const {reviewsFilter, onUpdateReview, onDeleteReview} = props;

    return (
        <div>
            {reviewsFilter && reviewsFilter.length > 0 && reviewsFilter.map((review) => (
                <ReviewItem onDeleteReview={() => onDeleteReview(review._id)} onUpdateReview={() => onUpdateReview(review)} rating={review.rating} comment={review.content} createdAt={review.createdAt} createdBy={review.createdBy._id}/>
            ))}
        </div>
        
    )
}

export default ReviewList;