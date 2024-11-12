import React, { useState } from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Property } from '../../types/property/property';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { relative } from 'path';

interface TopPropertyCardProps {
	property: Property;
	likePropertyHandler: any;
}

const TopPropertyCard = (props: TopPropertyCardProps) => {
	const { property, likePropertyHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const propertyImage = property?.propertyImages
		? `${process.env.REACT_APP_API_URL}/${property?.propertyImages}`
		: '/img/profile/defaultUser.svg';
	const [isHovered, setIsHovered] = useState(false);

	/** HANDLERS **/

	const pushDetailHandler = async (propertyId: string) => {
		await router.push({ pathname: '/property/detail', query: { id: propertyId } });
	};

	if (device === 'mobile') {
		return (
			<Stack className="top-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
					onClick={() => {
						pushDetailHandler(property._id);
					}}
				>
					<div>${property?.propertyRentPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(property._id);
						}}
					>
						{property?.propertyTitle}
					</strong>
					<p className={'desc'}>{property?.propertyAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{property?.propertySquare} m2</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.propertyViews}</Typography>
							<IconButton color={'default'} onClick={() => likePropertyHandler(user, property._id)}>
								{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{property?.propertyLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack
				className="top-card-box"
				style={{
					backgroundImage: `url(${propertyImage})`,
					position: 'relative',
					backgroundSize: 'cover',
					borderRadius: '12px',
					justifyContent: 'space-between',
					paddingBottom: '20px',
				}}
				onClick={() => {
					pushDetailHandler(property._id);
				}}
			>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							borderRadius: '12px',
							background: isHovered
								? 'linear-gradient(45deg, #1a8377 0%, rgba(26, 131, 119, 0.8) 10%, rgba(26, 131, 119, 0.2) 60%, #1a8377 100%)'
								: 'linear-gradient(154deg, #141415 0%, rgba(0, 0, 0, 0.70) 0%, rgba(20, 20, 21, 0.20) 94.29%)',
							zIndex: 0,
							transition: 'background 0.3s ease',
						}}
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
					/>
					<div
						style={{
							margin: '12px 0px 10px 12px',
							color: '#ffffff',
							fontFamily: 'Inter',
							fontStyle: 'normal',
							fontSize: '28px',
							fontWeight: '800',
							zIndex: 1,
							cursor: 'pointer',
						}}
					>
						{property?.propertyTitle}
					</div>
					<div
						style={{
							margin: '0px 12px',
							color: 'rgba(255, 255, 255, 0.60)',
							fontFamily: 'Inter',
							fontStyle: 'normal',
							fontSize: '14px',
							fontWeight: '800',
							zIndex: 1,
							cursor: 'pointer',
						}}
					>
						{property?.propertyType
							.replace(/_/g, ' ')
							.toLowerCase()
							.replace(/\b\w/g, (char) => char.toUpperCase())}
					</div>
				</div>

				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: '10px',
						justifyContent: 'flex-end',
						paddingRight: '20px',
					}}
				>
					<div
						onClick={(e) => {
							e.stopPropagation(); // Prevents the click event from bubbling up to parent elements
							likePropertyHandler(user, property._id); // Your custom handler for liking a property
						}}
						style={{
							width: '50px',
							height: '50px',
							borderRadius: '50%',
							backgroundColor: '#f5f4f4',
							display: isHovered ? 'flex' : 'none',
							justifyContent: 'center',
							alignItems: 'center',
							opacity: isHovered ? 0.7 : 0,
							transform: isHovered ? 'translate(0, 0)' : 'translate(-50px, 20px)',
							cursor: 'pointer',
							transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
						}}
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
					>
						<IconButton color={'default'}>
							{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon style={{ color: 'red', width: '30px', height: '30px' }} />
							) : (
								<FavoriteIcon />
							)}
						</IconButton>
					</div>
				</div>

				{/* </Box> */}
			</Stack>
		);
	}
};

export default TopPropertyCard;
