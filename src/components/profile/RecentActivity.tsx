import { useRecentReviewsByUserId } from '@/config/supabaseClient';
import RecentActivityCard from '@/components/profile/RecentActivityCard';

export default function RecentActivity({ userId }: { userId: string }) {
	const {
		isLoading: isLoadingReviews,
		isError: isErrorReviews,
		error: errorReviews,
		data: recentReviews,
	} = useRecentReviewsByUserId(userId, 4);

	if (isLoadingReviews)
		return <p className='text-slate-400'>Loading recent activity...</p>;
	if (isErrorReviews)
		return (
			<p className='text-red-400'>
				Error loading recent activity: {errorReviews?.message}
			</p>
		);
	if (!recentReviews || recentReviews.length === 0)
		return <p className='text-slate-400'>No recent activity found.</p>;

	return (
		<div className='flex gap-2'>
			{recentReviews.map((review) => (
				<RecentActivityCard
					key={`${review.id}-${review.user_id}`}
					review={review}
				/>
			))}
		</div>
	);
}
