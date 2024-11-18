import React, { useState } from 'react';
import { Box, Button, Divider, Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import { useRouter } from 'next/router';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Notification } from '../../types/notification/notification';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { GET_USER_NOTIFICATIONS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { NotificationGroup } from '../../enums/notification.enum';

export default function Basket() {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/** HANDLERS **/
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(e.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	/** APOLLO REQUESTS **/
	const initialInput = {};
	const {
		loading: getNotificationsLoading,
		data: getNotificationsData,
		error: getNotificationsError,
		refetch: getNotificationsRefetch,
	} = useQuery(GET_USER_NOTIFICATIONS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNotifications(data?.getUserNotifications);
		},
	});

	const timeAgo = (timestamp: string) => {
		const now = new Date();
		const createdAt = new Date(timestamp);
		const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
		const diffInMinutes = Math.floor(diffInSeconds / 60);
		const diffInHours = Math.floor(diffInMinutes / 60);
		const diffInDays = Math.floor(diffInHours / 24);

		if (diffInSeconds < 60) {
			return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
		} else if (diffInMinutes < 60) {
			return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
		} else if (diffInHours < 24) {
			return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
		} else if (diffInDays < 30) {
			return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
		} else {
			return createdAt.toLocaleDateString();
		}
	};

	const pushDetailHandler = async (notification: Notification) => {
		const { notificationGroup, propertyId, articleId, equipmentId, receiverId, authorId } = notification;
		console.log(propertyId, '+');

		switch (notificationGroup) {
			case 'EQUIPMENT':
				await router.push({ pathname: '/equipment/detail', query: { id: equipmentId } });
				break;
			case 'PROPERTY':
				await router.push({ pathname: '/property/detail', query: { id: propertyId } });
				break;
			case 'ARTICLE':
				await router.push({ pathname: '/community/detail', query: { id: articleId } });
				break;
			case 'MEMBER':
				if (notification.notificationType === 'FOLLOW' || notification.notificationType === 'LIKE') {
					await router.push({ pathname: '/member', query: { memberId: authorId } });
				} else {
					await router.push({ pathname: '/agent/detail', query: { agentId: receiverId } });
					break;
				}
				break;

			default:
				console.log('Unknown notification type');
		}
	};

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
				<Badge
					badgeContent={notifications.filter((notification) => notification.notificationStatus === 'WAIT').length || 0}
					color="secondary"
				>
					<NotificationsActiveIcon color="warning" />
				</Badge>
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
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
							Index: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<Stack className={'basket-frame'} sx={{ backgroundColor: '#fff' }}>
					<Box className={'all-check-box'}>
						{notifications.length === 0 ? (
							<div>No notification!</div>
						) : (
							<Stack flexDirection={'row'}>
								<div>Notifications </div>
							</Stack>
						)}
					</Box>

					<Box className={'main-wrapper'}>
						<Stack flexDirection={'row'} gap={'10px'} padding={'10px'}>
							<Button variant={'contained'} color={'info'} onClick={() => getNotificationsRefetch({ input: {} })}>
								All
							</Button>
							<Divider style={{ width: '2px', height: '30px', backgroundColor: '#000' }} />

							<Button
								variant={'contained'}
								color={'info'}
								onClick={() => getNotificationsRefetch({ input: { notificationStatus: 'WAIT' } })}
							>
								Unread
							</Button>
						</Stack>

						<Box
							className={'orders-wrapper'}
							gap={'5px'}
							sx={{
								maxHeight: '500px',
								overflowY: 'auto',
							}}
						>
							{notifications.map((notification: Notification) => {
								return (
									<Stack
										onClick={() => {
											console.log('+++', notification);
											pushDetailHandler(notification);
										}}
										flexDirection={'column'}
										key={notification._id}
										width={'100%'}
										height={'80px'}
										sx={{
											marginBottom: '5px',
											'&:hover': {
												backgroundColor: '#f6f6f6',
												cursor: 'pointer',
											},
										}}
										gap={'5px'}
										padding={'10px'}
										paddingLeft={'10px'}
									>
										<Stack flexDirection={'row'} alignItems={'center'} gap={'10px'}>
											<img src={'/img/icons/arrowBig.svg'} className={'product-img'} width={'12px'} />
											{notification.notificationStatus === 'WAIT' ? (
												<Box
													width={'8px'}
													height={'8px'}
													sx={{ borderRadius: '50%', backgroundColor: '#085ED4' }}
													flexDirection={'row'}
												></Box>
											) : (
												''
											)}
											<span>
												New{' '}
												{notification.notificationGroup === 'EQUIPMENT' ||
												notification.notificationGroup === 'PROPERTY' ||
												notification.notificationGroup === 'ARTICLE'
													? notification.notificationType === 'CREATE'
														? notification.notificationGroup
														: notification.notificationType === 'LIKE'
														? 'like'
														: notification.notificationType === 'COMMENT'
														? 'comment'
														: ''
													: notification.notificationGroup === 'MEMBER'
													? notification.notificationType === 'LIKE'
														? 'like'
														: notification.notificationType === 'COMMENT'
														? 'comment'
														: notification.notificationType === 'FOLLOW'
														? 'subscriber'
														: ''
													: ''}
											</span>
										</Stack>

										<span style={{ width: '100%' }}>{notification.notificationTitle}</span>
										<div>{timeAgo(notification.createdAt)}</div>
									</Stack>
								);
							})}
						</Box>
					</Box>
				</Stack>
			</Menu>
		</Box>
	);
}
