import { EquipmentCondition, EquipmentStatus, EquipmentType } from '../../enums/equipment.enum';
import { PropertyLocation, PropertyStatus, PropertyType } from '../../enums/property.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Equipment {
	_id: string;
	equipmentType: EquipmentType;
	equipmentStatus: EquipmentStatus;
	equipmentCondition: EquipmentCondition;
	equipmentTitle: string;
	equipmentRentPrice: number;
	equipmentViews: number;
	equipmentLikes: number;
	equipmentComments: number;
	equipmentRank: number;
	equipmentImages: string[];
	equipmentDesc?: string;
	memberId: string;
	rentedAt?: Date;
	deletedAt?: Date;
	maintanencedAt?: Date;
	retiredAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Equipments {
	list: Equipment[];
	metaCounter: TotalCounter[];
}
