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
	pricesRange?: Range;
	periodsRange?: PeriodsRange;
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

export interface AgentPropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: AEISearch;
}

interface ALEISearch {
	equipmentStatus?: EquipmentStatus;
	propertyLocationList?: PropertyLocation[];
}

export interface AllPropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALEISearch;
}

interface Range {
	start: number;
	end: number;
}

interface PeriodsRange {
	start: Date | number;
	end: Date | number;
}
