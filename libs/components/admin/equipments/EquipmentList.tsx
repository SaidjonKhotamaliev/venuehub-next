import React from 'react';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Stack } from '@mui/material';
import { Property } from '../../../types/property/property';
import { REACT_APP_API_URL } from '../../../config';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { PropertyStatus } from '../../../enums/property.enum';
import { Equipment } from '../../../types/equipment/equipment';
import { EquipmentStatus } from '../../../enums/equipment.enum';

interface Data {
	id: string;
	title: string;
	price: string;
	agent: string;
	location: string;
	type: string;
	status: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'MB ID',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'price',
		numeric: false,
		disablePadding: false,
		label: 'PRICE',
	},
	{
		id: 'agent',
		numeric: false,
		disablePadding: false,
		label: 'AGENT',
	},
	{
		id: 'location',
		numeric: false,
		disablePadding: false,
		label: 'LOCATION',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'TYPE',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { onSelectAllClick } = props;

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface EquipmentPanelListType {
	equipments: Equipment[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateEquipmentHandler: any;
	removeEquipmentHandler: any;
}

export const EquipmentPanelList = (props: EquipmentPanelListType) => {
	const {
		equipments,
		anchorEl,
		menuIconClickHandler,
		menuIconCloseHandler,
		updateEquipmentHandler,
		removeEquipmentHandler,
	} = props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{equipments.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{equipments.length !== 0 &&
							equipments.map((equipment: Equipment, index: number) => {
								const propertyImage = `${REACT_APP_API_URL}/${equipment?.equipmentImages[0]}`;

								return (
									<TableRow hover key={equipment?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">{equipment._id}</TableCell>
										<TableCell align="left" className={'name'}>
											{equipment.equipmentStatus === EquipmentStatus.ACTIVE ? (
												<Stack direction={'row'}>
													<Link href={`/equipment/detail?id=${equipment?._id}`}>
														<div>
															<Avatar alt="Remy Sharp" src={propertyImage} sx={{ ml: '2px', mr: '10px' }} />
														</div>
													</Link>
													<Link href={`/equipment/detail?id=${equipment?._id}`}>
														<div>{equipment.equipmentTitle}</div>
													</Link>
												</Stack>
											) : (
												<Stack direction={'row'}>
													<div>
														<Avatar alt="Remy Sharp" src={propertyImage} sx={{ ml: '2px', mr: '10px' }} />
													</div>
													<div style={{ marginTop: '10px' }}>{equipment.equipmentTitle}</div>
												</Stack>
											)}
										</TableCell>
										<TableCell align="center">{equipment.equipmentRentPrice}</TableCell>
										<TableCell align="center">{equipment.memberData?.memberNick}</TableCell>
										<TableCell align="center">{equipment.equipmentCondition}</TableCell>
										<TableCell align="center">
											{equipment.equipmentType
												.replace(/_/g, ' ')
												.toLowerCase()
												.replace(/\b\w/g, (char) => char.toUpperCase())}
										</TableCell>
										<TableCell align="center">
											{equipment.equipmentStatus === EquipmentStatus.RETIRED && (
												<Button
													variant="outlined"
													sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
													onClick={() => removeEquipmentHandler(equipment._id)}
												>
													<DeleteIcon fontSize="small" />
												</Button>
											)}

											{equipment.equipmentStatus === EquipmentStatus.ACTIVE && (
												<>
													<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
														{equipment.equipmentStatus}
													</Button>

													<Menu
														className={'menu-modal'}
														MenuListProps={{
															'aria-labelledby': 'fade-button',
														}}
														anchorEl={anchorEl[index]}
														open={Boolean(anchorEl[index])}
														onClose={menuIconCloseHandler}
														TransitionComponent={Fade}
														sx={{ p: 1 }}
													>
														{Object.values(EquipmentStatus)
															.filter((ele) => ele !== equipment.equipmentStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() =>
																		updateEquipmentHandler({ _id: equipment._id, equipmentStatus: status })
																	}
																	key={status}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{status}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</>
											)}
											{equipment.equipmentStatus === EquipmentStatus.RENT && (
												<>
													<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
														{equipment.equipmentStatus}
													</Button>

													<Menu
														className={'menu-modal'}
														MenuListProps={{
															'aria-labelledby': 'fade-button',
														}}
														anchorEl={anchorEl[index]}
														open={Boolean(anchorEl[index])}
														onClose={menuIconCloseHandler}
														TransitionComponent={Fade}
														sx={{ p: 1 }}
													>
														{Object.values(EquipmentStatus)
															.filter((ele) => ele !== equipment.equipmentStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() =>
																		updateEquipmentHandler({ _id: equipment._id, equipmentStatus: status })
																	}
																	key={status}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{status}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</>
											)}

											{equipment.equipmentStatus === EquipmentStatus.MAINTENANCE && (
												<>
													<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
														{equipment.equipmentStatus}
													</Button>

													<Menu
														className={'menu-modal'}
														MenuListProps={{
															'aria-labelledby': 'fade-button',
														}}
														anchorEl={anchorEl[index]}
														open={Boolean(anchorEl[index])}
														onClose={menuIconCloseHandler}
														TransitionComponent={Fade}
														sx={{ p: 1 }}
													>
														{Object.values(EquipmentStatus)
															.filter((ele) => ele !== equipment.equipmentStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() =>
																		updateEquipmentHandler({ _id: equipment._id, equipmentStatus: status })
																	}
																	key={status}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{status}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</>
											)}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
