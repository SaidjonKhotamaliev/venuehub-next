import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import CancelIcon from '@mui/icons-material/Cancel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useRouter } from 'next/router';
// import { CartItem } from '../../../lib/types/search';
// import { Messages, serverApi } from '../../../lib/config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Notification } from '../../types/notification/notification';
import { REACT_APP_API_URL } from '../../config';

interface BasketProps {
	notifications: Notification[] | [];
}

export default function Basket(props: BasketProps) {
	const { notifications } = props;
	const user = useReactiveVar(userVar);
	const router = useRouter();

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/** HANDLERS **/
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(e.currentTarget);
		console.log('clicked');
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	// const proceedOrderHandler = async () => {
	// 	try {
	// 		handleClose();
	// 		if (!authMember) throw new Error(Messages.error2);
	// 		const order = new OrderService();
	// 		await order.createOrder(cartItems);
	// 		onDeleteAll();
	// 		// REFRESH VIA CONTEXT
	// 		sweetTopSmallSuccessAlert('Successfully added to Orders');
	// 		setOrderBuilder(new Date());
	// 		await router.push({ pathname: '/equipment/detail' }); // query: { id: equipmentId } });
	// 	} catch (err) {
	// 		console.log(err);
	// 		sweetErrorHandling(err).then();
	// 	}
	// };

	return (
		<Box className={'hover-line'}>
			<IconButton
				aria-label="cart"
				id="basic-button"
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
			>
				<Badge badgeContent={notifications.length} color="secondary">
					<img src={'/icons/cart2.png'} width={'24px'} />
				</Badge>
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				// onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1.5,
						'& .MuiAvatar-root': {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						'&:before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: 'background.paper',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<Stack className={'basket-frame'}>
					<Box className={'all-check-box'}>
						{notifications.length === 0 ? (
							<div>Cart is empty!</div>
						) : (
							<Stack flexDirection={'row'}>
								<div>Cart Products: </div>
							</Stack>
						)}
					</Box>

					<Box className={'orders-main-wrapper'}>
						<Box className={'orders-wrapper'}>
							{notifications.map((notification: Notification) => {
								// const imagePath = `${REACT_APP_API_URL}/${notification.notificationGroup}`;
								return (
									<Box className={'basket-info-box'} key={notification._id}>
										<img src={'/img/icons/arrowBig.svg'} className={'product-img'} />
										<span className={'product-name'}>{notification.notificationTitle}</span>
										<p className={'product-price'}>{notification.notificationGroup}</p>
									</Box>
								);
							})}
						</Box>
					</Box>
					{notifications.length !== 0 ? (
						<Box className={'basket-order'}>
							<Button variant={'contained'} color={'secondary'}>
								Mark all as read
							</Button>
							<Button
								// onClick={proceedOrderHandler}
								startIcon={<ShoppingCartIcon />}
								variant={'contained'}
								color={'primary'}
							>
								Order
							</Button>
						</Box>
					) : (
						''
					)}
				</Stack>
			</Menu>
		</Box>
	);
}
