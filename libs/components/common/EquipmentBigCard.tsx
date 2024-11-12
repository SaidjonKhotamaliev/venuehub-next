import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Equipment } from '../../types/equipment/equipment';
import CommentIcon from '@mui/icons-material/Comment';

interface EquipmentBigCardProps {
	equipment: Equipment;
	likeEquipmentHandler?: any;
}

const EquipmentBigCard = (props: EquipmentBigCardProps) => {
	const { equipment, likeEquipmentHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
	const goPropertyDetatilPage = (equipmentId: string) => {
		router.push(`/equipment/detail?id=${equipmentId}`);
	};

	if (device === 'mobile') {
		return <div>EQUIPMENT BIG CARD</div>;
	} else {
		return (
			<Stack className="property-big-card-box" onClick={() => goPropertyDetatilPage(equipment?._id)}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${equipment?.equipmentImages?.[0]})` }}
				>
					{equipment && equipment?.equipmentRank >= topPropertyRank && (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					)}
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{equipment?.equipmentTitle}</strong>

					<Typography className="desc">
						{equipment?.equipmentType
							.replace(/_/g, ' ')
							.toLowerCase()
							.replace(/\b\w/g, (char) => char.toUpperCase())}
					</Typography>
					<p className={'desc'}>
						In{' '}
						{equipment?.equipmentCondition
							.replace(/_/g, ' ')
							.toLowerCase()
							.replace(/\b\w/g, (char) => char.toUpperCase())}{' '}
						condition
					</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/soqqa.png" alt="" />
							<span>{equipment?.equipmentRentPrice}/day</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div className="buttons-box">
							<CommentIcon
								style={{ cursor: 'pointer' }}
								color={'action'}
								onClick={(e) => {
									e.stopPropagation();
									goPropertyDetatilPage(equipment?._id);
								}}
							></CommentIcon>
							<Typography className="view-cnt">{equipment?.equipmentComments}</Typography>
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{equipment?.equipmentViews}</Typography>
							<IconButton
								style={{ zIndex: '99' }}
								color={'default'}
								onClick={(e) => {
									e.stopPropagation();
									likeEquipmentHandler(user, equipment?._id);
								}}
							>
								{equipment?.meLiked && equipment?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>

							<Typography className="view-cnt">{equipment?.equipmentLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default EquipmentBigCard;
