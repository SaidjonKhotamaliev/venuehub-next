import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography } from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface AgentCardProps {
	agent: any;
	likeMemberHandler: any;
	followMemberHandler: any;
}

const AgentCard = (props: AgentCardProps) => {
	const { agent, likeMemberHandler, followMemberHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = agent?.memberImage
		? `${REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	console.log(agent);

	if (device === 'mobile') {
		return <div>AGENT CARD</div>;
	} else {
		return (
			<Stack className="agent-general-card">
				<Link
					href={{
						pathname: '/agent/detail',
						query: { agentId: agent?._id },
					}}
				>
					<Box
						component={'div'}
						className={'agent-img'}
						style={{
							backgroundImage: `url(${imagePath})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							backgroundRepeat: 'no-repeat',
						}}
					></Box>
				</Link>

				<Stack className={'agent-desc'}>
					<Stack flexDirection={'row'} className={'first-row'}>
						<Stack flexDirection={'row'} className={'rating'}>
							<img src="/img/icons/Frame.png" alt="" />
							<strong>5.0</strong>
						</Stack>
						<Box component={'div'} className={'buttons'}>
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{agent?.memberViews}</Typography>
							<IconButton color={'default'} onClick={() => likeMemberHandler(user, agent?._id)}>
								{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon color={'primary'} />
								) : (
									<FavoriteBorderIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{agent?.memberLikes}</Typography>
						</Box>
					</Stack>

					<Box component={'div'} className={'agent-info'}>
						<Link
							href={{
								pathname: '/agent/detail',
								query: { agentId: 'id' },
							}}
						>
							<strong className="agent-name">{agent?.memberFullName ?? agent?.memberNick}</strong>
						</Link>
						<Link
							href={{
								pathname: '/property',
							}}
						>
							<strong>{agent?.memberProperties} properties</strong>
						</Link>
						<Link
							href={{
								pathname: '/equipment',
							}}
						>
							<strong>{agent?.memberEquipments ?? 0} equipments</strong>
						</Link>
					</Box>

					<Box className={'agent-follow-btn'}>
						<span onClick={() => followMemberHandler(user, agent?._id)}>
							{agent?.meFollowed && agent?.meFollowed[0]?.myFollowing ? 'Unfollow' : 'Follow'}
						</span>
						<img src="/img/icons/plus.png" alt="" style={{ filter: 'brightness(0) invert(1)' }} />
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default AgentCard;
