import { PropertyLocation, PropertyStatus, PropertyType } from '../../enums/property.enum';

export interface PropertyUpdate {
	_id: string;
	propertyType?: PropertyType;
	propertyStatus?: PropertyStatus;
	propertyLocation?: PropertyLocation;
	propertyAddress?: string;
	propertyTitle?: string;
	propertyRentPrice?: number;
	propertySquare?: number;
	propertyImages?: string[];
	propertyDesc?: string;
	rentedAt?: Date;
	deletedAt?: Date;
	constructedAt?: Date;
}
