import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import IconButton from '@mui/material/IconButton';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatterStr } from '../../utils';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { Equipment } from '../../types/equipment/equipment';
import { EquipmentStatus } from '../../enums/equipment.enum';

interface EquipmentCardProps {
	equipment: Equipment;
	deleteEquipmentHandler?: any;
	memberPage?: boolean;
	updateEquipmentHandler?: any;
}

export const EquipmentCard = (props: EquipmentCardProps) => {
	const { equipment, deleteEquipmentHandler, memberPage, updateEquipmentHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/** HANDLERS **/
	const pushEditProperty = async (id: string) => {
		await router.push({
			pathname: '/mypage',
			query: { category: 'addEquipment', equipmentId: id },
		});
	};

	const pushEquipmentDetail = async (id: string) => {
		if (memberPage)
			await router.push({
				pathname: '/equipment/detail',
				query: { id: id },
			});
		else return;
	};

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <div>MOBILE EQUIPMENT CARD</div>;
	} else
		return (
			<Stack className="property-card-box">
				<Stack className="image-box" onClick={() => pushEquipmentDetail(equipment?._id)}>
					<img src={`${process.env.REACT_APP_API_URL}/${equipment?.equipmentImages[0]}`} alt="no image" />
				</Stack>
				<Stack className="information-box" onClick={() => pushEquipmentDetail(equipment?._id)}>
					<Typography className="name">{equipment?.equipmentTitle}</Typography>
					<Typography className="address">
						{equipment.equipmentType
							.replace(/_/g, ' ')
							.toLowerCase()
							.replace(/\b\w/g, (char) => char.toUpperCase())}{' '}
					</Typography>

					<Typography className="price">
						<strong>${formatterStr(equipment?.equipmentRentPrice)}</strong>
					</Typography>
				</Stack>
				<Stack className="date-box">
					<Typography className="date">{equipment?.equipmentCondition}</Typography>
				</Stack>
				<Stack className="date-box">
					<Typography className="date">
						<Moment format="DD.MM.YYYY">{equipment?.createdAt}</Moment>
					</Typography>
				</Stack>
				<Stack className="status-box">
					<Stack className="coloured-box" sx={{ background: '#E5F0FD' }} onClick={handleClick}>
						<Typography className="status" sx={{ color: '#3554d1' }}>
							{equipment?.equipmentStatus}
						</Typography>
					</Stack>
				</Stack>

				{!memberPage && (
					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						PaperProps={{
							elevation: 0,
							sx: {
								width: '140px',
								mt: 1,
								ml: '10px',
								overflow: 'visible',
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							},
							style: {
								padding: 0,
								display: 'flex',
								justifyContent: 'center',
							},
						}}
					>
						{/* Check for the current equipment status */}
						{equipment?.equipmentStatus === 'ACTIVE' && (
							<>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateEquipmentHandler('RENT', equipment?._id);
										// Update status to 'RENT' after the mutation
									}}
								>
									RENT
								</MenuItem>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateEquipmentHandler('MAINTENANCE', equipment?._id);
										// Update status to 'MAINTENANCE' after the mutation
									}}
								>
									MAINTENANCE
								</MenuItem>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateEquipmentHandler('RETIRED', equipment?._id);
										// Update status to 'RETIRED' after the mutation
									}}
								>
									RETIRED
								</MenuItem>
							</>
						)}

						{/* If the equipment status is RENT, show other options */}
						{equipment?.equipmentStatus === 'RENT' && (
							<>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateEquipmentHandler('ACTIVE', equipment?._id);
										// Update status to 'ACTIVE' after the mutation
									}}
								>
									ACTIVE
								</MenuItem>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateEquipmentHandler('MAINTENANCE', equipment?._id);
										// Update status to 'MAINTENANCE' after the mutation
									}}
								>
									MAINTENANCE
								</MenuItem>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateEquipmentHandler('RETIRED', equipment?._id);
										// Update status to 'RETIRED' after the mutation
									}}
								>
									RETIRED
								</MenuItem>
							</>
						)}

						{/* If the equipment status is MAINTENANCE, show other options */}
						{equipment?.equipmentStatus === 'MAINTENANCE' && (
							<>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateEquipmentHandler('ACTIVE', equipment?._id);
										// Update status to 'ACTIVE' after the mutation
									}}
								>
									ACTIVE
								</MenuItem>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateEquipmentHandler('RENT', equipment?._id);
										// Update status to 'RENT' after the mutation
									}}
								>
									RENT
								</MenuItem>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateEquipmentHandler('RETIRED', equipment?._id);
										// Update status to 'RETIRED' after the mutation
									}}
								>
									RETIRED
								</MenuItem>
							</>
						)}

						{/* If the equipment status is RETIRED, show other options */}
						{equipment?.equipmentStatus === 'RETIRED' && (
							<>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateEquipmentHandler('ACTIVE', equipment?._id);
										// Update status to 'ACTIVE' after the mutation
									}}
								>
									ACTIVE
								</MenuItem>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateEquipmentHandler('RENT', equipment?._id);
										// Update status to 'RENT' after the mutation
									}}
								>
									RENT
								</MenuItem>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateEquipmentHandler('MAINTENANCE', equipment?._id);
										// Update status to 'MAINTENANCE' after the mutation
									}}
								>
									MAINTENANCE
								</MenuItem>
							</>
						)}
					</Menu>
				)}

				<Stack className="views-box">
					<Typography className="views">{equipment?.equipmentViews.toLocaleString()}</Typography>
				</Stack>

				<Stack className="views-box">
					<Typography className="views">{equipment?.equipmentLikes.toLocaleString()}</Typography>
				</Stack>
				{!memberPage && equipment?.equipmentStatus === EquipmentStatus.ACTIVE && (
					<Stack className="action-box">
						<IconButton
							style={{ marginLeft: '50px' }}
							className="icon-button"
							onClick={() => pushEditProperty(equipment?._id)}
						>
							<ModeIcon className="buttons" />
						</IconButton>
					</Stack>
				)}
			</Stack>
		);
};
