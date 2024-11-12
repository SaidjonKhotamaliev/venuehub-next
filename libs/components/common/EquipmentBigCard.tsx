import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Property } from '../../types/property/property';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Equipment } from '../../types/equipment/equipment';

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

					<div className={'price'}>${formatterStr(equipment?.equipmentRentPrice)}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{equipment?.equipmentTitle}</strong>
					<p className={'desc'}>{equipment?.equipmentCondition}</p>
					<div className={'options'}></div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div className="buttons-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{equipment?.equipmentViews}</Typography>
							<IconButton
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
