import { PropertyLocation, PropertyStatus, PropertyType } from '../../enums/property.enum';
import { Direction } from '../../enums/common.enum';
import { EquipmentCondition, EquipmentStatus, EquipmentType } from '../../enums/equipment.enum';

export interface EquipmentInput {
	equipmentType: EquipmentType;
	equipmentCondition: EquipmentCondition;
	equipmentTitle: string;
	equipmentRentPrice: number;
	equipmentImages: string[];
	equipmentDesc?: string;
	memberId?: string;
	constructedAt?: Date;
}

interface EISearch {
	memberId?: string;
	typeList?: EquipmentType[];
	pricesRangeEquipment?: PricesRangeEquipment;
	periodsRangeEquipment?: PeriodsRangeEquipment;
	text?: string;
}

export interface EquipmentsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: EISearch;
}

interface AEISearch {
	equipmentStatus?: EquipmentStatus;
}

export interface AgentEquipmentsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: AEISearch;
}

interface ALEISearch {
	equipmentStatus?: EquipmentStatus;
}

export interface AllEquipmentsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALEISearch;
}

interface PricesRangeEquipment {
	start: number;
	end: number;
}

interface PeriodsRangeEquipment {
	start: Date | number;
	end: Date | number;
}
