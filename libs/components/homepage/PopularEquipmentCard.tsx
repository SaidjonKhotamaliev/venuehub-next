import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Equipment } from '../../types/equipment/equipment';

interface PopularEquipmentCardProps {
	equipment: Equipment;
}

const PopularEquipmentCard = (props: PopularEquipmentCardProps) => {
	const { equipment } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const equipmentImage = equipment?.equipmentImages
		? `${process.env.REACT_APP_API_URL}/${equipment?.equipmentImages}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/
	const pushDetailHandler = async (equipmentId: string) => {
		await router.push({ pathname: '/equipment/detail', query: { id: equipmentId } });
	};
	const pushAgentHandler = async (memberId: string) => {
		await router.push({ pathname: '/agent/detail', query: { agentId: memberId } });
	};

	if (device === 'mobile') {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${equipmentImage}` }}
					onClick={() => {
						pushDetailHandler(equipment._id);
					}}
				></Box>
				<Box component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(equipment._id);
						}}
					>
						{equipment.memberData?.memberNick}
					</strong>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{equipment?.equipmentViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<>
				<Stack className="popular-card-box">
					<Box
						component={'div'}
						className={'card-img'}
						style={{ backgroundImage: `url(${REACT_APP_API_URL}/${equipment?.equipmentImages[0]})` }}
						onClick={() => {
							pushDetailHandler(equipment._id);
						}}
					></Box>
					<Box component={'div'} className={'info'}>
						<Stack className={'info-agent-box'}>
							<Box
								component={'div'}
								className={'member-small-img'}
								style={{
									backgroundImage: `url(${
										equipment?.memberData?.memberImage
											? `${REACT_APP_API_URL}/${equipment?.memberData?.memberImage}`
											: '/path/to/default-image.jpg'
									})`,
									width: '30px',
									height: '30px',
									borderRadius: '50%',
								}}
								onClick={() => {
									// Ensure _id is defined before attempting to use it
									if (equipment?.memberData?._id) {
										pushAgentHandler(equipment.memberData._id);
									}
								}}
							></Box>

							<strong
								className={'title'}
								onClick={() => {
									if (equipment?.memberData?._id) {
										pushAgentHandler(equipment.memberData._id);
									}
								}}
							>
								{equipment.memberData?.memberNick}
							</strong>
						</Stack>
						<p className="desc">{equipment?.equipmentDesc?.slice(0, 90)} ...</p>

						<Divider sx={{ mt: '15px', mb: '17px' }} />
						<div className={'bott'}>
							<div className="view-like-box">
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{equipment?.equipmentViews}</Typography>
							</div>
							<div className={'price'}>${equipment.equipmentRentPrice}</div>
						</div>
					</Box>
				</Stack>
			</>
		);
	}
};

export default PopularEquipmentCard;
