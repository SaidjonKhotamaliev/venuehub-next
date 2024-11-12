import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Property } from '../../types/property/property';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Equipment } from '../../types/equipment/equipment';

interface PropertyCardType {
	equipment: Equipment;
	likeEquipmentHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const EquipmentCard = (props: PropertyCardType) => {
	const { equipment, likeEquipmentHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = equipment?.equipmentImages[0]
		? `${REACT_APP_API_URL}/${equipment?.equipmentImages[0]}`
		: '/img/banner/header1.svg';

	if (device === 'mobile') {
		return <div>PROPERTY CARD</div>;
	} else {
		return (
			<Stack className="card-config">
				<Stack className="property-left">
					<Link
						href={{
							pathname: '/equipment/detail',
							query: { id: equipment?._id },
						}}
					>
						<img src={imagePath} alt="" />
					</Link>
					{equipment && equipment?.equipmentRank > topPropertyRank && (
						<Box component={'div'} className={'top-badge'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<Typography>TOP</Typography>
						</Box>
					)}
				</Stack>
				<Stack className="property-mid">
					<Stack className="name-address">
						<Stack className="name">
							<Link
								href={{
									pathname: '/equipment/detail',
									query: { id: equipment?._id },
								}}
							>
								<Typography>{equipment.equipmentTitle}</Typography>
							</Link>
						</Stack>
						<Stack className="type">
							<Typography>
								{equipment.equipmentType
									.replace(/_/g, ' ')
									.toLowerCase()
									.replace(/\b\w/g, (char) => char.toUpperCase())}
							</Typography>
						</Stack>
						<Stack className="address">
							{/* <Typography>In {equipment.equipmentCondition} condition</Typography> */}
						</Stack>

						<Stack className="desc">
							<Typography>{equipment.equipmentDesc}</Typography>
						</Stack>
					</Stack>
				</Stack>
				<Stack className="property-right">
					<Stack className="type-buttons">
						{!recentlyVisited && (
							<Stack className="buttons">
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{equipment?.equipmentViews}</Typography>
								<IconButton color={'default'} onClick={() => likeEquipmentHandler(user, equipment?._id)}>
									{myFavorites ? (
										<FavoriteIcon color="primary" />
									) : equipment?.meLiked && equipment?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color="primary" />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography className="view-cnt">{equipment?.equipmentLikes}</Typography>
							</Stack>
						)}
					</Stack>
					<Box component={'div'} className={'price-box'}>
						<Typography>${formatterStr(equipment?.equipmentRentPrice)}/day</Typography>
					</Box>
					<Box className="square-meter">
						<Typography>{/* {equipment?.propertySquare} m<span className="superScript">2</span> */}</Typography>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default EquipmentCard;
