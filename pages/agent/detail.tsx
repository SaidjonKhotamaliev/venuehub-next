import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import PropertyBigCard from '../../libs/components/common/PropertyBigCard';
import ReviewCard from '../../libs/components/agent/ReviewCard';
import { Box, Button, Divider, Pagination, Stack, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Property } from '../../libs/types/property/property';
import { Member } from '../../libs/types/member/member';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { userVar } from '../../apollo/store';
import { PropertiesInquiry } from '../../libs/types/property/property.input';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { REACT_APP_API_URL } from '../../libs/config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
	CREATE_COMMENT,
	LIKE_TARGET_EQUIPMENT,
	LIKE_TARGET_MEMBER,
	LIKE_TARGET_PROPERTY,
	SUBSCRIBE,
	UNSUBSCRIBE,
} from '../../apollo/user/mutation';
import { GET_EQUIPMENTS, GET_MEMBER, GET_PROPERTIES } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { GET_COMMENTS } from '../../apollo/admin/query';
import { Message } from '../../libs/enums/common.enum';
import { Equipment } from '../../libs/types/equipment/equipment';
import EquipmentBigCard from '../../libs/components/common/EquipmentBigCard';
import { EquipmentsInquiry } from '../../libs/types/equipment/equipment.input';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const AgentDetail: NextPage = ({ initialInput, initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [agentId, setMbId] = useState<string | null>(null);
	const [agent, setAgent] = useState<Member | null>(null);
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(initialInput);
	const [searchFilterEquipment, setSearchFilterEquipment] = useState<EquipmentsInquiry>(initialInput);
	const [agentProperties, setAgentProperties] = useState<Property[]>([]);
	const [agentEquipments, setAgentEquipments] = useState<Equipment[]>([]);
	const [propertyTotal, setPropertyTotal] = useState<number>(0);
	const [equipmentTotal, setEquipmentTotal] = useState<number>(0);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [agentComments, setAgentComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.MEMBER,
		commentContent: '',
		commentRefId: '',
	});

	/** APOLLO REQUESTS **/
	const [createComment] = useMutation(CREATE_COMMENT);
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);
	const [likeTargetEquipment] = useMutation(LIKE_TARGET_EQUIPMENT);
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);

	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: agentId },
		skip: !agentId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgent(data?.getMember);
			setSearchFilter({
				...searchFilter,
				search: {
					memberId: data?.getMember?._id,
				},
			});
			setSearchFilterEquipment({
				...searchFilterEquipment,
				search: {
					memberId: data?.getMember?._id,
				},
			});
			setCommentInquiry({
				...commentInquiry,
				search: {
					commentRefId: data?.getMember?._id,
				},
			});
			setInsertCommentData({
				...insertCommentData,
				commentRefId: data?.getMember?._id,
			});
		},
	});

	const {
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter.search.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentProperties(data?.getProperties?.list);
			setPropertyTotal(data?.getProperties?.metaCounter[0]?.total ?? 0);
		},
	});

	const {
		loading: getEquipmentsLoading,
		data: getEquipmentsData,
		error: getEquipmentsError,
		refetch: getEquipmentsRefetch,
	} = useQuery(GET_EQUIPMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilterEquipment },
		skip: !searchFilterEquipment.search.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentEquipments(data?.getEquipments?.list);
			setEquipmentTotal(data?.getEquipments?.metaCounter[0]?.total ?? 0);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: commentInquiry },
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.agentId) setMbId(router.query.agentId as string);
	}, [router]);

	useEffect(() => {
		getPropertiesRefetch();
	}, [searchFilter, searchFilterEquipment]);
	useEffect(() => {}, [commentInquiry]);

	/** HANDLERS **/
	const likeMemberHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetMember({
				variables: { input: id },
			});

			getMemberRefetch();

			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			console.log('ERROR, likeMemberHandler: ', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const followMemberHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await subscribe({
				variables: { input: id },
			});

			getMemberRefetch();

			await sweetTopSmallSuccessAlert('Followed', 800);
		} catch (err: any) {
			console.log('ERROR, followMemberHandler: ', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const unfollowMemberHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await unsubscribe({
				variables: { input: id },
			});

			getMemberRefetch();

			await sweetTopSmallSuccessAlert('Unfollowed', 800);
		} catch (err: any) {
			console.log('ERROR, unfollowMemberHandler: ', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	const propertyPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		setSearchFilter({ ...searchFilter });
	};
	const equipmentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilterEquipment.page = value;
		setSearchFilterEquipment({ ...searchFilterEquipment });
	};

	const likePropertyHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetProperty({
				variables: { input: id },
			});

			await getPropertiesRefetch({ input: searchFilter });

			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			console.log('ERROR, likfePropertyHandler: ', err);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const likeEquipmentHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetEquipment({
				variables: { input: id },
			});

			await getEquipmentsRefetch({ input: searchFilterEquipment });

			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			console.log('ERROR, likfePropertyHandler: ', err);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommentHandler = async () => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (user._id === agentId) throw new Error('Cannot write a review for yourself'!);

			await createComment({ variables: { input: insertCommentData } });
			setInsertCommentData({ ...insertCommentData, commentContent: '' });

			await getCommentsRefetch({ input: commentInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	if (device === 'mobile') {
		return <div>AGENT DETAIL PAGE MOBILE</div>;
	} else {
		return (
			<Stack className={'agent-detail-page'}>
				<Stack className={'container'}>
					<Stack className={'agent-info'}>
						<img
							src={agent?.memberImage ? `${REACT_APP_API_URL}/${agent?.memberImage}` : '/img/profile/defaultUser.svg'}
							alt=""
						/>
						<Box component={'div'} className={'info'} onClick={() => redirectToMemberPageHandler(agent?._id as string)}>
							<strong>
								{agent?.memberNick}
								{agent?.memberFullName ? agent?.memberFullName : ''}
							</strong>
							<Stack flexDirection={'row'} className={'rating'}>
								<img src="/img/icons/Frame.png" alt="" />
								<strong>5.0</strong>
								<Divider
									orientation="vertical"
									flexItem
									sx={{
										width: '2px',
										height: '35px',
										backgroundColor: '#6d6d6d',
										marginRight: '10px',
									}}
								/>
								<strong style={{ fontSize: '18px', color: '#6d6d6d', backgroundColor: '#FFE0B2' }}>Top Rated***</strong>
							</Stack>

							<div>
								<img src="/img/icons/call.svg" alt="" />
								<span>{agent?.memberPhone}</span>
							</div>
							<Box
								className="agent-follow-btn"
								onClick={(e) => {
									e.stopPropagation();
									if (agent?._id) {
										if (agent?.meFollowed && agent?.meFollowed[0]?.myFollowing) {
											unfollowMemberHandler(user, agent?._id);
										} else {
											followMemberHandler(user, agent?._id);
										}
									}
								}}
								style={{
									backgroundColor: agent?.meFollowed && agent?.meFollowed[0]?.myFollowing ? 'gray' : '#1a8377',
								}}
							>
								<span>{agent?.meFollowed && agent?.meFollowed[0]?.myFollowing ? 'Unfollow' : 'Follow'}</span>
								{!agent?.meFollowed || !agent?.meFollowed[0]?.myFollowing ? (
									<img src="/img/icons/plus.png" alt="" style={{ filter: 'brightness(0) invert(1)' }} />
								) : null}
							</Box>
						</Box>
					</Stack>

					<Stack className="agent-desc">
						<h3>About me</h3>
						<p>{agent?.memberDesc ? agent?.memberDesc : 'no description about the agent...'}</p>
					</Stack>
					<Stack className={'agent-home-list'}>
						<Stack className={'card-wrap'}>
							{agentProperties.map((property: Property) => {
								return (
									<div className={'wrap-main'} key={property?._id}>
										<PropertyBigCard
											property={property}
											key={property?._id}
											likePropertyHandler={likePropertyHandler}
										/>
									</div>
								);
							})}
						</Stack>
						<Stack className={'pagination'}>
							{propertyTotal ? (
								<>
									<Stack className="pagination-box">
										<Pagination
											page={searchFilter.page}
											count={Math.ceil(propertyTotal / searchFilter.limit) || 1}
											onChange={propertyPaginationChangeHandler}
											shape="circular"
											color="secondary"
										/>
									</Stack>
									<span>
										Total {propertyTotal} propert{propertyTotal > 1 ? 'ies' : 'y'} available
									</span>
								</>
							) : (
								<div className={'no-data'}>
									<img src="/img/icons/icoAlert.svg" alt="" />
									<p>No properties found!</p>
								</div>
							)}
						</Stack>
					</Stack>
					<Stack className={'agent-home-list'}>
						<Stack className={'card-wrap'}>
							{agentEquipments.map((equipment: Equipment) => {
								return (
									<div className={'wrap-main'} key={equipment?._id}>
										<EquipmentBigCard
											equipment={equipment}
											key={equipment?._id}
											likeEquipmentHandler={likeEquipmentHandler}
										/>
									</div>
								);
							})}
						</Stack>
						<Stack className={'pagination'}>
							{equipmentTotal ? (
								<>
									<Stack className="pagination-box">
										<Pagination
											page={searchFilterEquipment.page}
											count={Math.ceil(equipmentTotal / searchFilterEquipment.limit) || 1}
											onChange={equipmentPaginationChangeHandler}
											shape="circular"
											color="secondary"
										/>
									</Stack>
									<span>
										Total {equipmentTotal} equipment{equipmentTotal > 1 ? 's' : ''} available
									</span>
								</>
							) : (
								<div className={'no-data'}>
									<img src="/img/icons/icoAlert.svg" alt="" />
									<p>No equipments found!</p>
								</div>
							)}
						</Stack>
					</Stack>
					<Stack className={'review-box'}>
						<Stack className={'main-intro'}>
							<span>Reviews</span>
							<p>we are glad to see you again</p>
						</Stack>
						{commentTotal !== 0 && (
							<Stack className={'review-wrap'}>
								<Box component={'div'} className={'title-box'}>
									<StarIcon />
									<span>
										{commentTotal} review{commentTotal > 1 ? 's' : ''}
									</span>
								</Box>
								{agentComments?.map((comment: Comment) => {
									return <ReviewCard comment={comment} key={comment?._id} />;
								})}
								<Box component={'div'} className={'pagination-box'}>
									<Pagination
										page={commentInquiry.page}
										count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
										onChange={commentPaginationChangeHandler}
										shape="circular"
										color="secondary"
									/>
								</Box>
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
			</Stack>
		);
	}
};

AgentDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 3,
		search: {
			memberId: '',
		},
	},
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutBasic(AgentDetail);
