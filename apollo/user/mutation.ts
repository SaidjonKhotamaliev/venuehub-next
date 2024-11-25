import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
	mutation Signup($input: MemberInput!) {
		signup(input: $input) {
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
			memberEquipments
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
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
`;

export const UPDATE_MEMBER = gql`
	mutation UpdateMember($input: MemberUpdate!) {
		updateMember(input: $input) {
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
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const LIKE_TARGET_MEMBER = gql`
	mutation LikeTargetMember($input: String!) {
		likeTargetMember(memberId: $input) {
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
`;

/**************************
 *        PROPERTY        *
 *************************/

export const CREATE_PROPERTY = gql`
	mutation CreateProperty($input: PropertyInput!) {
		createProperty(input: $input) {
			_id
			propertyType
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
			propertyStatus
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
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const UPDATE_PROPERTY = gql`
	mutation UpdateProperty($input: PropertyUpdate!) {
		updateProperty(input: $input) {
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
		}
	}
`;

export const LIKE_TARGET_PROPERTY = gql`
	mutation LikeTargetProperty($input: String!) {
		likeTargetProperty(propertyId: $input) {
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
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

/**************************
 *      EQUIPMENT    *
 *************************/

export const CREATE_EQUIPMENT = gql`
	mutation CreateEquipment($input: EquipmentInput!) {
		createEquipment(input: $input) {
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
	}
`;

export const UPDATE_EQUIPMENT = gql`
	mutation UpdateEquipment($input: EquipmentUpdate!) {
		updateEquipment(input: $input) {
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
	}
`;

export const LIKE_TARGET_EQUIPMENT = gql`
	mutation LikeTargetEquipment($input: String!) {
		likeTargetEquipment(equipmentId: $input) {
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
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const CREATE_BOARD_ARTICLE = gql`
	mutation CreateBoardArticle($input: BoardArticleInput!) {
		createBoardArticle(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_BOARD_ARTICLE = gql`
	mutation UpdateBoardArticle($input: BoardArticleUpdate!) {
		updateBoardArticle(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const LIKE_TARGET_BOARD_ARTICLE = gql`
	mutation LikeTargetBoardArticle($input: String!) {
		likeTargetBoardArticle(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const CREATE_COMMENT = gql`
	mutation CreateComment($input: CommentInput!) {
		createComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_COMMENT = gql`
	mutation UpdateComment($input: CommentUpdate!) {
		updateComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/

export const SUBSCRIBE = gql`
	mutation Subscribe($input: String!) {
		subscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

export const UNSUBSCRIBE = gql`
	mutation Unsubscribe($input: String!) {
		unsubscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/

export const UPDATE_NOTIFICATION = gql`
	mutation UpdateMemberNotification($input: NotificationUpdate!) {
		updateMemberNotification(input: $input) {
			notificationType
			notificationStatus
			notificationGroup
			notificationTitle
			notificationDesc
			authorId
			receiverId
			propertyId
			equipmentId
			articleId
			createdAt
			updatedAt
			_id
		}
	}
`;

export const UPDATE_ALL_NOTIFICATIONS = gql`
	mutation UpdateMemberAllNotifications {
		updateMemberAllNotifications {
			notificationType
			notificationStatus
			notificationGroup
			notificationTitle
			notificationDesc
			authorId
			receiverId
			propertyId
			equipmentId
			articleId
			createdAt
			updatedAt
			_id
		}
	}
`;

export const REMOVE_NOTIFICATION = gql`
	mutation DeleteMemberNotification($input: String!) {
		deleteMemberNotification(input: $input)
	}
`;

/**************************
 *         NOTICE        *
 *************************/

export const CREATE_NOTICE = gql`
	mutation CreateNotice($input: NoticeInput!) {
		createNotice(input: $input) {
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

export const UPDATE_NOTICE = gql`
	mutation UpdateNotice($input: NoticeUpdate!) {
		updateNotice(input: $input) {
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
