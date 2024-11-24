import React from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box, Stack, Typography } from '@mui/material';
import { BoardArticle } from '../../types/board-article/board-article';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import moment from 'moment';

interface CommunityCardProps {
	boardArticle: BoardArticle;
	size?: string;
	likeArticleHandler: any;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { boardArticle, size = 'normal', likeArticleHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const imagePath: string = boardArticle?.articleImage
		? `${REACT_APP_API_URL}/${boardArticle?.articleImage}`
		: '/img/community/communityImg.png';

	/** HANDLERS **/
	const chooseArticleHandler = (e: React.SyntheticEvent, boardArticle: BoardArticle) => {
		router.push(
			{
				pathname: '/community/detail',
				query: { articleCategory: boardArticle?.articleCategory, id: boardArticle?._id },
			},
			undefined,
			{ shallow: true },
		);
	};
	const pushAgentHandler = async (memberId: string) => {
		await router.push({ pathname: '/agent/detail', query: { agentId: memberId } });
	};

	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	if (device === 'mobile') {
		return <div>COMMUNITY CARD MOBILE</div>;
	} else {
		return (
			<Stack
				sx={{ width: '100%' }}
				className="community-general-card-config"
				onClick={(e) => chooseArticleHandler(e, boardArticle)}
				flexDirection={'row'}
			>
				<Stack className="image-box">
					<img src={imagePath} alt="" className="card-img" />
				</Stack>
				<Stack className="desc-box">
					<Stack width={'100%'}>
						<Stack
							flexDirection={'row'}
							justifyContent={'space-between'}
							style={{ width: '100%' }}
							alignItems={'center'}
							marginBottom={'40px'}
						>
							<Typography className="title">{boardArticle?.articleTitle} </Typography>
							<Stack className={'buttons'}>
								<CommentIcon
									style={{ cursor: 'pointer', marginRight: '5px' }}
									color={'action'}
									onClick={(e) => {
										e.stopPropagation();
										chooseArticleHandler(e, boardArticle);
									}}
								></CommentIcon>
								<Typography className="view-cnt">{boardArticle?.articleComments}</Typography>
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{boardArticle?.articleViews}</Typography>
								<IconButton
									color={'default'}
									onClick={(e: any) => {
										e.stopPropagation();
										likeArticleHandler(user, boardArticle._id);
									}}
								>
									{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color={'primary'} />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography className="view-cnt">{boardArticle?.articleLikes}</Typography>
							</Stack>
						</Stack>

						<Stack flexDirection={'row'} gap={'20px'} style={{ marginBottom: '5px' }}>
							<Box
								component={'div'}
								className={'member-small-img'}
								style={{
									backgroundImage: `url(${
										boardArticle?.memberData?.memberImage
											? `${REACT_APP_API_URL}/${boardArticle?.memberData?.memberImage}`
											: '/path/to/default-image.jpg'
									})`,
									width: '30px',
									height: '30px',
									borderRadius: '50%',
								}}
								onClick={() => {
									if (boardArticle?.memberData?._id) {
										pushAgentHandler(boardArticle.memberData._id);
									}
								}}
							></Box>
							<Typography
								className="desc"
								onClick={(e) => {
									e.stopPropagation();
									goMemberPage(boardArticle?.memberData?._id as string);
								}}
							>
								{boardArticle?.memberData?.memberNick}
							</Typography>
						</Stack>
						<Stack className="date-box">
							<Typography className="days-ago">
								Published:{' '}
								{boardArticle?.createdAt ? `${moment().diff(moment(boardArticle?.createdAt), 'days')} days ago` : ''}
							</Typography>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default CommunityCard;
