import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
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

/**************************
 *        PROPERTY        *
 *************************/

export const UPDATE_PROPERTY_BY_ADMIN = gql`
	mutation UpdatePropertyByAdmin($input: PropertyUpdate!) {
		updatePropertyByAdmin(input: $input) {
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
			propertyImages
			propertyDesc
			memberId
			deletedAt
			rentedAt
			constructedAt
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_PROPERTY_BY_ADMIN = gql`
	mutation RemovePropertyByAdmin($input: String!) {
		removePropertyByAdmin(propertyId: $input) {
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
			propertyImages
			propertyDesc
			memberId
			deletedAt
			rentedAt
			constructedAt
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *      EQUIPMENTS     *
 *************************/

export const UPDATE_EQUIPMENT_BY_ADMIN = gql`
	mutation UpdateEquipmentByAdmin($input: EquipmentUpdate!) {
		updateEquipmentByAdmin(input: $input) {
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
		}
	}
`;

export const REMOVE_EQUIPMENT_BY_ADMIN = gql`
	mutation RemoveEquipmentByAdmin($input: String!) {
		removeEquipmentByAdmin(equipmentId: $input) {
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
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
		updateBoardArticleByAdmin(input: $input) {
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

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation RemoveBoardArticleByAdmin($input: String!) {
		removeBoardArticleByAdmin(articleId: $input) {
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

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
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
