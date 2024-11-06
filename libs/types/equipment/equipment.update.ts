import { EquipmentCondition, EquipmentStatus, EquipmentType } from '../../enums/equipment.enum';
import { PropertyLocation, PropertyStatus, PropertyType } from '../../enums/property.enum';

export interface EquipmentUpdate {
	_id: string;
	equipmentType?: EquipmentType;
	equipmentStatus?: EquipmentStatus;
	equipmentCondition?: EquipmentCondition;
	equipmentTitle?: string;
	equipmentRentPrice?: number;
	equipmentImages?: string[];
	equipmentDesc?: string;
	rentedAt?: Date;
	retiredAt?: Date;
	deletedAt?: Date;
	maintanencedAt?: Date;
}
