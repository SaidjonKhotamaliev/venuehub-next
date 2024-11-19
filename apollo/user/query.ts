import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_AGENTS = gql`
	query GetAgents($input: AgentsInquiry!) {
		getAgents(input: $input) {
			list {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberProperties
				memberArticles
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				accessToken
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				memberEquipments
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER = gql(`
query GetMember($input: String!) {
    getMember(memberId: $input) {
        _id
        memberType
        memberStatus
        memberAuthType
        memberPhone
        memberNick
        memberFullName
        memberImage
        memberAddress
        memberDesc
        memberProperties
		memberEquipments
        memberArticles
        memberPoints
        memberLikes
        memberViews
        memberFollowings
				memberFollowers
        memberRank
        memberWarnings
        memberBlocks
        deletedAt
        createdAt
        updatedAt
        accessToken
        meFollowed {
					followingId
					followerId
					myFollowing
				}
    }
}
`);

/**************************
 *        PROPERTY        *
 *************************/

export const GET_PROPERTY = gql`
	query GetProperty($input: String!) {
		getProperty(propertyId: $input) {
			_id
			propertyType
			propertyStatus
			propertyLocation
			propertyAddress
			propertyTitle
			propertyRentPrice
			propertySquare
			propertyViews
			propertyLikes
			propertyComments
			propertyRank
			propertyImages
			propertyDesc
			memberId
			deletedAt
			constructedAt
			createdAt
			updatedAt
			memberData {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberProperties
				memberArticles
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
			rentedAt
		}
	}
`;

export const GET_PROPERTIES = gql`
	query GetProperties($input: PropertiesInquiry!) {
		getProperties(input: $input) {
			list {
				_id
				propertyType
				propertyStatus
				propertyLocation
				propertyAddress
				propertyTitle
				propertyRentPrice
				propertySquare
				propertyViews
				propertyLikes
				propertyComments
				propertyRank
				propertyImages
				propertyDesc
				memberId
				deletedAt
				constructedAt
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProperties
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				rentedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_AGENT_PROPERTIES = gql`
	query GetAgentProperties($input: AgentPropertiesInquiry!) {
		getAgentProperties(input: $input) {
			list {
				_id
				propertyType
				propertyStatus
				propertyLocation
				propertyAddress
				propertyTitle
				propertyRentPrice
				propertySquare
				propertyViews
				propertyLikes
				propertyComments
				propertyRank
				propertyImages
				propertyDesc
				memberId
				deletedAt
				constructedAt
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				rentedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProperties
					memberEquipments
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_FAVORITES = gql`
	query GetFavorites($input: OrdinaryInquiryProperty!) {
		getFavorites(input: $input) {
			properties {
				list {
					_id
					propertyType
					propertyStatus
					propertyLocation
					propertyAddress
					propertyTitle
					propertyRentPrice
					propertySquare
					propertyViews
					propertyLikes
					propertyComments
					propertyRank
					propertyImages
					propertyDesc
					memberId
					rentedAt
					deletedAt
					constructedAt
					createdAt
					updatedAt
					meLiked {
						memberId
						likeRefId
						myFavorite
					}
					memberData {
						_id
						memberType
						memberStatus
						memberAuthType
						memberPhone
						memberNick
						memberFullName
						memberImage
						memberAddress
						memberDesc
						memberProperties
						memberEquipments
						memberArticles
						memberFollowers
						memberFollowings
						memberPoints
						memberLikes
						memberViews
						memberComments
						memberRank
						memberWarnings
						memberBlocks
						deletedAt
						createdAt
						updatedAt
						accessToken
					}
				}
				metaCounter {
					total
				}
			}
			equipments {
				list {
					_id
					equipmentType
					equipmentStatus
					equipmentCondition
					equipmentTitle
					equipmentRentPrice
					equipmentViews
					equipmentLikes
					equipmentComments
					equipmentRank
					equipmentImages
					equipmentDesc
					memberId
					rentedAt
					deletedAt
					maintanencedAt
					retiredAt
					createdAt
					updatedAt
				}
				metaCounter {
					total
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_VISITED = gql`
	query GetVisited($input: OrdinaryInquiryProperty!) {
		getVisited(input: $input) {
			properties {
				list {
					_id
					propertyType
					propertyStatus
					propertyLocation
					propertyAddress
					propertyTitle
					propertyRentPrice
					propertySquare
					propertyViews
					propertyLikes
					propertyComments
					propertyRank
					propertyImages
					propertyDesc
					memberId
					rentedAt
					deletedAt
					constructedAt
					createdAt
					updatedAt
					meLiked {
						memberId
						likeRefId
						myFavorite
					}
					memberData {
						_id
						memberType
						memberStatus
						memberAuthType
						memberPhone
						memberNick
						memberFullName
						memberImage
						memberAddress
						memberDesc
						memberProperties
						memberEquipments
						memberArticles
						memberFollowers
						memberFollowings
						memberPoints
						memberLikes
						memberViews
						memberComments
						memberRank
						memberWarnings
						memberBlocks
						deletedAt
						createdAt
						updatedAt
						accessToken
					}
				}
				metaCounter {
					total
				}
			}
			equipments {
				list {
					_id
					equipmentType
					equipmentStatus
					equipmentCondition
					equipmentTitle
					equipmentRentPrice
					equipmentViews
					equipmentLikes
					equipmentComments
					equipmentRank
					equipmentImages
					equipmentDesc
					memberId
					rentedAt
					deletedAt
					maintanencedAt
					retiredAt
					createdAt
					updatedAt
				}
				metaCounter {
					total
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *        EQUIPMENT        *
 *************************/

export const GET_EQUIPMENTS = gql`
	query GetEquipments($input: EquipmentsInquiry!) {
		getEquipments(input: $input) {
			list {
				_id
				equipmentType
				equipmentStatus
				equipmentCondition
				equipmentTitle
				equipmentRentPrice
				equipmentViews
				equipmentLikes
				equipmentComments
				equipmentRank
				equipmentImages
				equipmentDesc
				memberId
				rentedAt
				deletedAt
				maintanencedAt
				retiredAt
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProperties
					memberEquipments
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_EQUIPMENT = gql`
	query GetEquipment($input: String!) {
		getEquipment(equipmentId: $input) {
			_id
			equipmentType
			equipmentStatus
			equipmentCondition
			equipmentTitle
			equipmentRentPrice
			equipmentViews
			equipmentLikes
			equipmentComments
			equipmentRank
			equipmentImages
			equipmentDesc
			memberId
			rentedAt
			deletedAt
			maintanencedAt
			retiredAt
			createdAt
			updatedAt
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
			memberData {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberProperties
				memberEquipments
				memberArticles
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				accessToken
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
		}
	}
`;

export const GET_AGENT_EQUIPMENTS = gql`
	query GetAgentEquipments($input: AgentEquipmentsInquiry!) {
		getAgentEquipments(input: $input) {
			list {
				_id
				equipmentType
				equipmentStatus
				equipmentCondition
				equipmentTitle
				equipmentRentPrice
				equipmentViews
				equipmentLikes
				equipmentComments
				equipmentRank
				equipmentImages
				equipmentDesc
				memberId
				rentedAt
				deletedAt
				maintanencedAt
				retiredAt
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProperties
					memberEquipments
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
					meLiked {
						memberId
						likeRefId
						myFavorite
					}
					meFollowed {
						followingId
						followerId
						myFollowing
					}
				}
			}
			metaCounter {
				total
			}
		}
	}
`;
/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_BOARD_ARTICLE = gql`
	query GetBoardArticle($input: String!) {
		getBoardArticle(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			articleComments
			memberId
			createdAt
			updatedAt
			memberData {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberWarnings
				memberBlocks
				memberProperties
				memberRank
				memberPoints
				memberLikes
				memberViews
				deletedAt
				createdAt
				updatedAt
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_BOARD_ARTICLES = gql`
	query GetBoardArticles($input: BoardArticlesInquiry!) {
		getBoardArticles(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				articleComments
				memberId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberWarnings
					memberBlocks
					memberProperties
					memberRank
					memberPoints
					memberLikes
					memberViews
					deletedAt
					createdAt
					updatedAt
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberWarnings
					memberBlocks
					memberProperties
					memberRank
					memberPoints
					memberLikes
					memberViews
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/
export const GET_MEMBER_FOLLOWERS = gql`
	query GetMemberFollowers($input: FollowInquiry!) {
		getMemberFollowers(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followerData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProperties
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				followingData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProperties
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         NOTIFICATION        *
 *************************/

export const GET_USER_NOTIFICATIONS = gql`
	query GetUserNotifications($input: NotificationsInquiry!) {
		getUserNotifications(input: $input) {
			notificationType
			notificationStatus
			notificationGroup
			notificationTitle
			notificationDesc
			authorId
			receiverId
			createdAt
			updatedAt
			articleId
			propertyId
			_id
			equipmentId
		}
	}
`;

/**************************
 *         NOTICE         *
 *************************/

export const GET_NOTICES = gql`
	query GetNotices($input: NoticeInquiry!) {
		getNotices(input: $input) {
			_id
			noticeCategory
			noticeStatus
			noticeTopic
			noticeTitle
			noticeContent
			memberId
			createdAt
		}
	}
`;

export const GET_NOTICES_FOR_AGENTS_AND_ADMINS = gql`
	query GetNoticesForAgentAndAdmins($input: NoticeInquiryAgent!) {
		getNoticesForAgentAndAdmins(input: $input) {
			_id
			noticeCategory
			noticeStatus
			noticeTopic
			noticeTitle
			noticeContent
			memberId
			createdAt
		}
	}
`;
