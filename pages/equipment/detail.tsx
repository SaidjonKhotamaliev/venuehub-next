import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Divider, IconButton, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import { NextPage } from 'next';
import Review from '../../libs/components/property/PropertyReview';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Property } from '../../libs/types/property/property';
import moment from 'moment';
import { formatterStr } from '../../libs/utils';
import { REACT_APP_API_URL } from '../../libs/config';
import { userVar } from '../../apollo/store';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Pagination as MuiPagination } from '@mui/material';
import Link from 'next/link';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import 'swiper/css';
import 'swiper/css/pagination';
import { GET_COMMENTS, GET_EQUIPMENT, GET_EQUIPMENTS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CREATE_COMMENT, LIKE_TARGET_EQUIPMENT, LIKE_TARGET_PROPERTY } from '../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Equipment } from '../../libs/types/equipment/equipment';
import EquipmentBigCard from '../../libs/components/common/EquipmentBigCard';

SwiperCore.use([Autoplay, Navigation, Pagination]);

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const EquipmentDetail: NextPage = ({ initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const myFavorites: boolean = false;
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [equipmentId, setEquipmentId] = useState<string | null>(null);
	const [equipment, setEquipment] = useState<Equipment | null>(null);
	const [slideImage, setSlideImage] = useState<string>('');
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [equipmentComments, setEquipmentComments] = useState<Comment[]>([]);
	const [equipmentTypes, setEquipmentTypes] = useState<Equipment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.EQUIPMENT,
		commentContent: '',
		commentRefId: '',
	});

	/** APOLLO REQUESTS **/
	const [likeTargetEquipment] = useMutation(LIKE_TARGET_EQUIPMENT);
	const [createComment] = useMutation(CREATE_COMMENT);

	const {
		loading: getEquipmentLoading,
		data: getEquipmentData,
		error: getEquipmentError,
		refetch: getEquipmentRefetch,
	} = useQuery(GET_EQUIPMENT, {
		fetchPolicy: 'network-only',
		variables: { input: equipmentId },
		skip: !equipmentId, // apollo req amalga oshmaydi
		notifyOnNetworkStatusChange: true, // refetching bolganda state ni update qilib loading ni korsatadi
		onCompleted: (data: T) => {
			if (data?.getEquipment) setEquipment(data?.getEquipment);
			if (data?.getEquipment) setSlideImage(data?.getEquipment?.equipmentImages[0]);
		},
	});

	const {
		loading: getEquipmentsLoading,
		data: getEquipmentsData,
		error: getEquipmentsError,
		refetch: getEquipmentsRefetch,
	} = useQuery(GET_EQUIPMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 4,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: { typeList: equipment?.equipmentType ? [equipment?.equipmentType] : [] },
			},
		},
		skip: !equipmentId && !equipment,
		notifyOnNetworkStatusChange: true, // refetching bolganda state ni update qilib loading ni korsatadi
		onCompleted: (data: T) => {
			if (data?.getEquipments?.list) setEquipmentTypes(data?.getEquipments?.list);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialComment },
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true, // refetching bolganda state ni update qilib loading ni korsatadi
		onCompleted: (data: T) => {
			if (data?.getComments?.list) setEquipmentComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.id) {
			setEquipmentId(router.query.id as string);
			setCommentInquiry({
				...commentInquiry,
				search: {
					commentRefId: router.query.id as string,
				},
			});
			setInsertCommentData({
				...insertCommentData,
				commentRefId: router.query.id as string,
			});
		}
	}, [router]);

	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch({ input: commentInquiry });
		}
	}, [commentInquiry]);

	/** HANDLERS **/

	const likeEquipmentHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetEquipment({
				variables: { input: id },
			});

			await getEquipmentRefetch({ input: id });

			await getEquipmentsRefetch({
				input: {
					page: 1,
					limit: 4,
					sort: 'createdAt',
					direction: Direction.DESC,
					search: { typeList: [equipment?.equipmentType] },
				},
			});

			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			console.log('ERROR, likeEquipmentHandler: ', err);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const changeImageHandler = (image: string) => {
		setSlideImage(image);
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommentHandler = async () => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await createComment({ variables: { input: insertCommentData } });
			setInsertCommentData({ ...insertCommentData, commentContent: '' });

			await getCommentsRefetch({ input: commentInquiry });
		} catch (err) {
			await sweetErrorHandling(err).then();
		}
	};

	if (getEquipmentLoading) {
		return (
			<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '1080px' }}>
				<CircularProgress size={'4rem'} />
			</Stack>
		);
	}

	if (device === 'mobile') {
		return <div>EQUIPMENT DETAIL PAGE</div>;
	} else {
		return (
			<div id={'property-detail-page'}>
				<div className={'container'}>
					<Stack className={'property-detail-config'}>
						<Stack className={'main-title'}>
							<span>{equipment?.equipmentTitle}</span>
							<Stack flexDirection={'row'} gap={'20px'}>
								<img src="/img/icons/time.png" alt="" width={'30px'} height={'30px'} />
								<p>
									{equipment?.createdAt
										? new Date(equipment.createdAt).toLocaleDateString('en-CA')
										: 'No date available'}
								</p>
							</Stack>
						</Stack>
						<Stack className={'property-info-config'}>
							<Stack className={'images'}>
								<Stack className={'main-image'}>
									<Stack className="type-buttons">
										<Stack className="buttons">
											<IconButton color={'default'}>
												<RemoveRedEyeIcon />
											</IconButton>
											<Typography className="view-cnt">{equipment?.equipmentViews}</Typography>
											<IconButton
												color={'default'}
												onClick={() => {
													if (equipment?._id) {
														likeEquipmentHandler(user, equipment._id);
													}
												}}
											>
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
									</Stack>
									<img
										src={slideImage ? `${REACT_APP_API_URL}/${slideImage}` : '/img/property/equipment.jpg'}
										alt={'main-image'}
									/>
								</Stack>
								<Stack className={'sub-images'}>
									{equipment?.equipmentImages.map((subImg: string) => {
										const imagePath: string = `${REACT_APP_API_URL}/${subImg}`;
										return (
											<Stack className={'sub-img-box'} onClick={() => changeImageHandler(subImg)} key={subImg}>
												<img src={imagePath} alt={'sub-image'} />
											</Stack>
										);
									})}
								</Stack>
							</Stack>

							<Stack className={'info'}>
								<Stack flexDirection={'row'} gap={'10px'}>
									<img src="/img/icons/telegram.png" alt="" />
									<Stack flexDirection={'column'}>
										<p>Title:</p>
										<span>{equipment?.equipmentTitle}</span>
									</Stack>
								</Stack>
								<Stack flexDirection={'row'} gap={'10px'}>
									<img src="/img/icons/clock.png" alt="" />
									<Stack flexDirection="column">
										<p>Created At:</p>
										<span>
											{equipment?.createdAt ? moment(equipment.createdAt).format('YYYY-MM-DD') : 'no data provided'}
										</span>
									</Stack>
								</Stack>
								<Stack flexDirection={'row'} gap={'10px'}>
									<img src="/img/icons/soqqa.png" alt="" />
									<Stack flexDirection={'column'}>
										<p>Price: </p>
										<span>{equipment?.equipmentRentPrice}/day</span>
									</Stack>
								</Stack>
								<Stack flexDirection={'row'} gap={'10px'}>
									<img src="/img/icons/strelka.png" alt="" />
									<Stack flexDirection={'column'}>
										<p>Condition</p>
										<span>
											{equipment?.equipmentCondition
												.replace(/_/g, ' ')
												.toLowerCase()
												.replace(/\b\w/g, (char) => char.toUpperCase())}
										</span>
									</Stack>
								</Stack>
							</Stack>
						</Stack>
						<Stack className={'property-desc-config'}>
							<Stack className={'right-config'}>
								<Stack className={'info-box'}>
									<Typography className={'main-title'}>Contact us!</Typography>
									<Stack className={'image-info'}>
										<img
											className={'member-image'}
											src={
												equipment?.memberData?.memberImage
													? `${REACT_APP_API_URL}/${equipment?.memberData?.memberImage}`
													: '/img/profile/defaultUser.svg'
											}
										/>
										<Stack className={'name-phone-listings'}>
											<Link href={`/member?memberId=${equipment?.memberData?._id}`}>
												<Typography className={'name'}>{equipment?.memberData?.memberNick}</Typography>
											</Link>
											<Stack className={'phone-number'}>
												<svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
													<g clipPath="url(#clip0_6507_6774)">
														<path
															d="M16.2858 10.11L14.8658 8.69C14.5607 8.39872 14.1551 8.23619 13.7333 8.23619C13.3115 8.23619 12.9059 8.39872 12.6008 8.69L12.1008 9.19C11.7616 9.528 11.3022 9.71778 10.8233 9.71778C10.3444 9.71778 9.88506 9.528 9.54582 9.19C9.16082 8.805 8.91582 8.545 8.67082 8.29C8.42582 8.035 8.17082 7.76 7.77082 7.365C7.43312 7.02661 7.24347 6.56807 7.24347 6.09C7.24347 5.61193 7.43312 5.15339 7.77082 4.815L8.27082 4.315C8.41992 4.16703 8.53822 3.99099 8.61889 3.79703C8.69956 3.60308 8.741 3.39506 8.74082 3.185C8.739 2.76115 8.57012 2.35512 8.27082 2.055L6.85082 0.625C6.44967 0.225577 5.9069 0.000919443 5.34082 0C5.06197 0.000410905 4.78595 0.0558271 4.52855 0.163075C4.27116 0.270322 4.03745 0.427294 3.84082 0.625L2.48582 1.97C1.50938 2.94779 0.960937 4.27315 0.960938 5.655C0.960937 7.03685 1.50938 8.36221 2.48582 9.34C3.26582 10.12 4.15582 11 5.04082 11.92C5.92582 12.84 6.79582 13.7 7.57082 14.5C8.5484 15.4749 9.87269 16.0224 11.2533 16.0224C12.6339 16.0224 13.9582 15.4749 14.9358 14.5L16.2858 13.15C16.6828 12.7513 16.9073 12.2126 16.9108 11.65C16.9157 11.3644 16.8629 11.0808 16.7555 10.8162C16.6481 10.5516 16.4884 10.3114 16.2858 10.11ZM15.5308 12.375L15.3858 12.5L13.9358 11.045C13.8875 10.99 13.8285 10.9455 13.7623 10.9142C13.6961 10.8829 13.6243 10.8655 13.5511 10.8632C13.478 10.8608 13.4051 10.8734 13.337 10.9003C13.269 10.9272 13.2071 10.9678 13.1554 11.0196C13.1036 11.0713 13.0631 11.1332 13.0361 11.2012C13.0092 11.2693 12.9966 11.3421 12.999 11.4153C13.0014 11.4884 13.0187 11.5603 13.05 11.6265C13.0813 11.6927 13.1258 11.7517 13.1808 11.8L14.6558 13.275L14.2058 13.725C13.4279 14.5005 12.3743 14.936 11.2758 14.936C10.1774 14.936 9.12372 14.5005 8.34582 13.725C7.57582 12.955 6.70082 12.065 5.84582 11.175C4.99082 10.285 4.06582 9.37 3.28582 8.59C2.51028 7.81209 2.0748 6.75845 2.0748 5.66C2.0748 4.56155 2.51028 3.50791 3.28582 2.73L3.73582 2.28L5.16082 3.75C5.26027 3.85277 5.39648 3.91182 5.53948 3.91417C5.68247 3.91651 5.82054 3.86196 5.92332 3.7625C6.02609 3.66304 6.08514 3.52684 6.08748 3.38384C6.08983 3.24084 6.03527 3.10277 5.93582 3L4.43582 1.5L4.58082 1.355C4.67935 1.25487 4.79689 1.17543 4.92654 1.12134C5.05619 1.06725 5.19534 1.03959 5.33582 1.04C5.61927 1.04085 5.89081 1.15414 6.09082 1.355L7.51582 2.8C7.61472 2.8998 7.6704 3.0345 7.67082 3.175C7.67088 3.24462 7.65722 3.31358 7.63062 3.37792C7.60403 3.44226 7.56502 3.50074 7.51582 3.55L7.01582 4.05C6.47844 4.58893 6.17668 5.31894 6.17668 6.08C6.17668 6.84106 6.47844 7.57107 7.01582 8.11C7.43582 8.5 7.66582 8.745 7.93582 9C8.20582 9.255 8.43582 9.53 8.83082 9.92C9.36974 10.4574 10.0998 10.7591 10.8608 10.7591C11.6219 10.7591 12.3519 10.4574 12.8908 9.92L13.3908 9.42C13.4929 9.32366 13.628 9.26999 13.7683 9.26999C13.9087 9.26999 14.0437 9.32366 14.1458 9.42L15.5658 10.84C15.6657 10.9387 15.745 11.0563 15.7991 11.1859C15.8532 11.3155 15.8809 11.4546 15.8808 11.595C15.8782 11.7412 15.8459 11.8853 15.7857 12.0186C15.7255 12.1518 15.6388 12.2714 15.5308 12.37V12.375Z"
															fill="#181A20"
														/>
													</g>
													<defs>
														<clipPath id="clip0_6507_6774">
															<rect width="16" height="16" fill="white" transform="translate(0.9375)" />
														</clipPath>
													</defs>
												</svg>
												<Typography className={'number'}>{equipment?.memberData?.memberPhone}</Typography>
											</Stack>
											<Link
												href={{
													pathname: '/equipment',
												}}
											>
												<Typography className={'listings'}>More Equipments</Typography>
											</Link>
										</Stack>
									</Stack>
								</Stack>
								<Stack className={'info-box'}>
									<Typography className={'sub-title'}>Name</Typography>
									<input type={'text'} placeholder={'Enter your name'} />
								</Stack>
								<Stack className={'info-box'}>
									<Typography className={'sub-title'}>Phone</Typography>
									<input type={'text'} placeholder={'Enter your phone'} />
								</Stack>
								<Stack className={'info-box'}>
									<Typography className={'sub-title'}>Email</Typography>
									<input type={'text'} placeholder={'creativelayers088'} />
								</Stack>
								<Stack className={'info-box'}>
									<Typography className={'sub-title'}>Message</Typography>
									<textarea
										placeholder={'Hello, \n I am interested in \n' + '[Equipment].  Can you share more details?'}
									></textarea>
								</Stack>
								<Stack className={'info-box'}>
									<Button className={'send-message'}>
										<Typography className={'title'}>Send</Typography>
										<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
											<g clipPath="url(#clip0_6975_593)">
												<path
													d="M16.0556 0.5H6.2778C6.03214 0.5 5.83334 0.698792 5.83334 0.944458C5.83334 1.19012 6.03214 1.38892 6.2778 1.38892H14.9827L0.630219 15.7413C0.456594 15.915 0.456594 16.1962 0.630219 16.3698C0.71701 16.4566 0.83076 16.5 0.944469 16.5C1.05818 16.5 1.17189 16.4566 1.25872 16.3698L15.6111 2.01737V10.7222C15.6111 10.9679 15.8099 11.1667 16.0556 11.1667C16.3013 11.1667 16.5001 10.9679 16.5001 10.7222V0.944458C16.5 0.698792 16.3012 0.5 16.0556 0.5Z"
													fill="white"
												/>
											</g>
											<defs>
												<clipPath id="clip0_6975_593">
													<rect width="16" height="16" fill="white" transform="translate(0.5 0.5)" />
												</clipPath>
											</defs>
										</svg>
									</Button>
								</Stack>
							</Stack>
							<Stack className={'left-config'}>
								<Stack className={'prop-desc-config'}>
									<Stack className={'top'}>
										<Typography className={'title'}>Equipment Description</Typography>
										<Typography className={'desc'}>{equipment?.equipmentDesc ?? 'No Description!'}</Typography>
									</Stack>

									<Stack className={'bottom'}>
										<Typography className={'title'}>Equipment Details</Typography>
										<Stack className={'info-box'}>
											<Stack className={'left'}>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Price</Typography>
													<Typography className={'data'}>${formatterStr(equipment?.equipmentRentPrice)}</Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Condition</Typography>
													<Typography className={'data'}>
														{equipment?.equipmentCondition
															.replace(/_/g, ' ')
															.toLowerCase()
															.replace(/\b\w/g, (char) => char.toUpperCase())}
													</Typography>
												</Box>
											</Stack>
											<Stack className={'mid'}>
												<Box component="div" className="info">
													<Typography className="title">Created At</Typography>
													<Typography className="data">
														{equipment?.createdAt ? moment(equipment.createdAt).fromNow() : 'no date'}
													</Typography>
												</Box>

												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Equipment Type</Typography>
													<Typography className={'data'}>
														{equipment?.equipmentType
															.replace(/_/g, ' ')
															.toLowerCase()
															.replace(/\b\w/g, (char) => char.toUpperCase())}
													</Typography>
												</Box>
											</Stack>
											<Stack className={'right'}>
												<Box component={'div'} className={'info'}>
													<Typography className="title">Maintanenced</Typography>
													<Typography className="data">
														{equipment?.maintanencedAt ? moment(equipment.maintanencedAt).fromNow() : 'not fixed'}
													</Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Last rented At</Typography>
													<Typography style={{ fontSize: '10px' }} className="data">
														{equipment?.rentedAt ? moment(equipment.rentedAt).fromNow() : 'no date'}
													</Typography>
												</Box>
											</Stack>
										</Stack>
									</Stack>
								</Stack>
								<Stack className={'amenities'}>
									<Typography className={'title'}>Equipment Coverage Benefits: </Typography>
									<Stack flexDirection={'row'} gap={'20px'}>
										<img src="/img/icons/activities.png" alt="" />
										<span>Comprehensive coverage for all rented equipment, ensuring peace of mind.</span>
									</Stack>
									<Stack flexDirection={'row'} gap={'20px'}>
										<img src="/img/icons/business.png" alt="" />
										<span>Insurance against accidental damage, theft, or loss during the rental period.</span>
									</Stack>
									<Stack flexDirection={'row'} gap={'20px'}>
										<img src="/img/icons/wifi.png" alt="" />
										<span>24/7 customer support in case of equipment-related issues or emergencies.</span>
									</Stack>
									<Stack flexDirection={'row'} gap={'20px'}>
										<img src="/img/icons/parking.png" alt="" />
										<span>Full replacement or repair services for malfunctioning equipment.</span>
									</Stack>
									<Stack flexDirection={'row'} gap={'20px'}>
										<img src="/img/icons/media.png" alt="" />
										<span>
											Coverage extends to high-value equipment, including audiovisual gear, computers, and tools.
										</span>
									</Stack>
									<Stack flexDirection={'row'} gap={'20px'}>
										<img src="/img/icons/air.png" alt="" />
										<span>Quick and easy claims process to minimize downtime during events or projects.</span>
									</Stack>
									<Stack flexDirection={'row'} gap={'20px'}>
										<img src="/img/icons/security.png" alt="" />
										<span>
											Flexible insurance options tailored to the specific needs of the equipment being rented.
										</span>
									</Stack>
								</Stack>

								<Stack className="rules">
									<Typography className="title">Terms & Conditions!</Typography>
									<Stack flexDirection={'row'} gap={'200px'}>
										<Stack flexDirection={'row'} gap={'20px'}>
											<img src="/img/icons/checkout.png" alt="" width={'35px'} height={'35px'} />
											<div className="strong-title">Check in:</div>
										</Stack>
										<span>
											The renter must provide a valid photo ID and credit card at check-in. Please notify the rental
											service in advance about the expected pickup or delivery time.
										</span>
									</Stack>
									<Divider
										sx={{
											width: '100%',
											height: '2px',
											backgroundColor: '#c4c4c4',
										}}
									/>

									<Stack flexDirection={'row'} gap={'163px'}>
										<Stack flexDirection={'row'} gap={'20px'}>
											<img src="/img/icons/checkin.png" alt="" width={'35px'} height={'35px'} />
											<div className="strong-title">Check out:</div>
										</Stack>

										<span>Equipment must be returned within 2 hours after the event or agreed upon time.</span>
									</Stack>
									<Divider
										sx={{
											width: '100%',
											height: '2px',
											backgroundColor: '#c4c4c4',
										}}
									/>

									<Stack flexDirection={'row'} gap={'122px'}>
										<Stack flexDirection={'row'} gap={'20px'}>
											<img src="/img/icons/age.png" alt="" width={'35px'} height={'35px'} />
											<div className="strong-title">Age restriction:</div>
										</Stack>

										<span>The minimum age for renting equipment is 18 years old.</span>
									</Stack>
									<Divider
										sx={{
											width: '100%',
											height: '2px',
											backgroundColor: '#c4c4c4',
										}}
									/>
								</Stack>

								{commentTotal !== 0 && (
									<Stack className={'reviews-config'}>
										<Stack className={'filter-box'}>
											<Stack className={'review-cnt'}>
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
													<g clipPath="url(#clip0_6507_7309)">
														<path
															d="M15.7183 4.60288C15.6171 4.3599 15.3413 4.18787 15.0162 4.16489L10.5822 3.8504L8.82988 0.64527C8.7005 0.409792 8.40612 0.257812 8.07846 0.257812C7.7508 0.257812 7.4563 0.409792 7.32774 0.64527L5.57541 3.8504L1.14072 4.16489C0.815641 4.18832 0.540363 4.36035 0.438643 4.60288C0.337508 4.84586 0.430908 5.11238 0.676772 5.28084L4.02851 7.57692L3.04025 10.9774C2.96794 11.2275 3.09216 11.486 3.35771 11.636C3.50045 11.717 3.66815 11.7575 3.83643 11.7575C3.98105 11.7575 4.12577 11.7274 4.25503 11.667L8.07846 9.88098L11.9012 11.667C12.1816 11.7979 12.5342 11.7859 12.7992 11.636C13.0648 11.486 13.189 11.2275 13.1167 10.9774L12.1284 7.57692L15.4801 5.28084C15.7259 5.11238 15.8194 4.84641 15.7183 4.60288Z"
															fill="#181A20"
														/>
													</g>
													<defs>
														<clipPath id="clip0_6507_7309">
															<rect width="15.36" height="12" fill="white" transform="translate(0.398438)" />
														</clipPath>
													</defs>
												</svg>
												<Typography className={'reviews'}>{commentTotal} reviews</Typography>
											</Stack>
										</Stack>
										<Stack className={'review-list'}>
											{equipmentComments?.map((comment: Comment) => {
												return <Review comment={comment} key={comment?._id} />;
											})}
											<Box component={'div'} className={'pagination-box'}>
												<MuiPagination
													page={commentInquiry.page}
													count={Math.ceil(commentTotal / commentInquiry.limit)}
													onChange={commentPaginationChangeHandler}
													shape="circular"
													color="secondary"
												/>
											</Box>
										</Stack>
									</Stack>
								)}
								<Stack className={'leave-review-config'}>
									<Typography className={'main-title'}>Leave A Review</Typography>
									<Typography className={'review-title'}>Review</Typography>
									<textarea
										onChange={({ target: { value } }: any) => {
											setInsertCommentData({ ...insertCommentData, commentContent: value });
										}}
										value={insertCommentData.commentContent}
									></textarea>
									<Box className={'submit-btn'} component={'div'}>
										<Button
											className={'submit-review'}
											disabled={insertCommentData.commentContent === '' || user?._id === ''}
											onClick={createCommentHandler}
										>
											<Typography className={'title'}>Submit Review</Typography>
											<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
												<g clipPath="url(#clip0_6975_3642)">
													<path
														d="M16.1571 0.5H6.37936C6.1337 0.5 5.93491 0.698792 5.93491 0.944458C5.93491 1.19012 6.1337 1.38892 6.37936 1.38892H15.0842L0.731781 15.7413C0.558156 15.915 0.558156 16.1962 0.731781 16.3698C0.818573 16.4566 0.932323 16.5 1.04603 16.5C1.15974 16.5 1.27345 16.4566 1.36028 16.3698L15.7127 2.01737V10.7222C15.7127 10.9679 15.9115 11.1667 16.1572 11.1667C16.4028 11.1667 16.6016 10.9679 16.6016 10.7222V0.944458C16.6016 0.698792 16.4028 0.5 16.1571 0.5Z"
														fill="#181A20"
													/>
												</g>
												<defs>
													<clipPath id="clip0_6975_3642">
														<rect width="16" height="16" fill="white" transform="translate(0.601562 0.5)" />
													</clipPath>
												</defs>
											</svg>
										</Button>
									</Box>
								</Stack>
							</Stack>
						</Stack>
						{equipmentTypes.length !== 0 && (
							<Stack className={'similar-properties-config'}>
								<Stack className={'title-pagination-box'}>
									<Stack className={'title-box'}>
										<Typography className={'main-title'}>Related Equipments</Typography>
										<Typography className={'sub-title'}>
											Other products available in{' '}
											{equipmentTypes[0].equipmentType
												.replace(/_/g, ' ')
												.toLowerCase()
												.replace(/\b\w/g, (char) => char.toUpperCase())}{' '}
											type
										</Typography>
									</Stack>
									<Stack className={'pagination-box'}>
										<WestIcon className={'swiper-similar-prev'} />
										<div className={'swiper-similar-pagination'}></div>
										<EastIcon className={'swiper-similar-next'} />
									</Stack>
								</Stack>
								<Stack className={'cards-box'}>
									<Swiper
										className={'similar-homes-swiper'}
										slidesPerView={'auto'}
										spaceBetween={35}
										modules={[Autoplay, Navigation, Pagination]}
										navigation={{
											nextEl: '.swiper-similar-next',
											prevEl: '.swiper-similar-prev',
										}}
										pagination={{
											el: '.swiper-similar-pagination',
										}}
									>
										{equipmentTypes.map((equipment: Equipment) => {
											if (!equipment) return null;

											return (
												<SwiperSlide className="similar-homes-slide" key={equipment?.equipmentTitle}>
													<EquipmentBigCard
														likeEquipmentHandler={likeEquipmentHandler}
														equipment={equipment}
														key={equipment._id}
													/>
												</SwiperSlide>
											);
										})}
									</Swiper>
								</Stack>
							</Stack>
						)}
					</Stack>
				</div>
			</div>
		);
	}
};

EquipmentDetail.defaultProps = {
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutFull(EquipmentDetail);
