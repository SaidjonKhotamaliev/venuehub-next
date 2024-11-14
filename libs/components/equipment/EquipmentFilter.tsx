import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	OutlinedInput,
	Tooltip,
	IconButton,
	Box,
	MenuItem,
	Menu,
	Button,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import { EquipmentsInquiry } from '../../types/equipment/equipment.input';
import { EquipmentType } from '../../enums/equipment.enum';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: EquipmentsInquiry;
	setSearchFilter: any;
	initialInput: EquipmentsInquiry;
	sortingClickHandler: any;
	sortingCloseHandler: any;
	sortingHandler: any;
	filterSortName: any;
	anchorEl: any;
	sortingOpen: any;
}

const EquipmentFilter = (props: FilterType) => {
	const {
		searchFilter,
		setSearchFilter,
		initialInput,
		sortingCloseHandler,
		sortingClickHandler,
		sortingHandler,
		sortingOpen,
		anchorEl,
		filterSortName,
	} = props;
	const device = useDeviceDetect();
	const router = useRouter();

	const [equipmentType, setEquipmentType] = useState<EquipmentType[]>(Object.values(EquipmentType));
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);

	/** LIFECYCLES **/
	useEffect(() => {
		if (searchFilter?.search?.typeList?.length == 0) {
			delete searchFilter.search.typeList;
			setShowMore(false);
			router
				.push(
					`/equipment?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/equipment?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.typeList) setShowMore(true);
	}, [searchFilter]);

	/** HANDLERS **/

	const equipmentTypeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/equipment?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						`/equipment?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.typeList?.includes(value)) {
					await router.push(
						`/equipment?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						`/equipment?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('propertyTypeSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, propertyTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const equipmentPriceHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				await router.push(
					`/equipment?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRangeEquipment: { ...searchFilter.search.pricesRangeEquipment, start: value * 1 },
						},
					})}`,
					`/equipment?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRangeEquipment: { ...searchFilter.search.pricesRangeEquipment, start: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/equipment?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRangeEquipment: { ...searchFilter.search.pricesRangeEquipment, end: value * 1 },
						},
					})}`,
					`/equipment?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRangeEquipment: { ...searchFilter.search.pricesRangeEquipment, end: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/equipment?input=${JSON.stringify(initialInput)}`,
				`/equipment?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>EQUIPMENTS FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-home'} mb={'40px'}>
					<Typography className={'title-main'}>Find the equipment you need</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'What are you looking for?'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={() => {
											setSearchText('');
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: '' },
											});
										}}
									/>
								</>
							}
						/>
						<img src={'/img/icons/search_icon.png'} alt={''} />
						<Tooltip title="Reset">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>

					<Box component={'div'} className={'right'}>
						<span>Sort by</span>
						<div>
							<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
								{filterSortName}
							</Button>
							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
								<MenuItem
									onClick={sortingHandler}
									id={'new'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									New
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'lowest'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									Lowest Price
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'highest'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									Highest Price
								</MenuItem>
							</Menu>
						</div>
					</Box>
				</Stack>

				<Stack flexDirection={'row'}>
					<Stack className={'find-your-home'} mb={'30px'}>
						<Typography className={'title'}>Equipment Type</Typography>
						<Stack
							className={`property-location`}
							style={{
								height: showMore ? '600px' : '122px',
								width: showMore ? '400px' : '250px', // Added width change based on `showMore`
								transition: 'all 0.4s ease', // Smooth transition for both height and width
							}}
							onMouseEnter={() => setShowMore(true)}
							onMouseLeave={() => {
								if (!searchFilter?.search?.typeList) {
									setShowMore(false);
								}
							}}
						>
							{equipmentType.map((type: string) => (
								<Stack className={'input-box'} key={type}>
									<Checkbox
										id={type}
										className="property-checkbox"
										color="default"
										size="small"
										value={type}
										onChange={equipmentTypeSelectHandler}
										checked={(searchFilter?.search?.typeList || []).includes(type as EquipmentType)}
									/>
									<label style={{ cursor: 'pointer' }}>
										<Typography className="property_type">
											{type
												.replace(/_/g, ' ')
												.toLowerCase()
												.replace(/\b\w/g, (char) => char.toUpperCase())}
										</Typography>
									</label>
								</Stack>
							))}
						</Stack>
					</Stack>

					<Stack width={'100px'}></Stack>
					<Stack className={'find-your-home'}>
						<Typography className={'title'}>Price Range</Typography>
						<Stack className="square-year-input">
							<input
								type="number"
								placeholder="$ min"
								min={0}
								value={searchFilter?.search?.pricesRangeEquipment?.start ?? 0}
								onChange={(e: any) => {
									if (e.target.value >= 0) {
										equipmentPriceHandler(e.target.value, 'start');
									}
								}}
							/>
							<div className="central-divider"></div>
							<input
								type="number"
								placeholder="$ max"
								value={searchFilter?.search?.pricesRangeEquipment?.end ?? 0}
								onChange={(e: any) => {
									if (e.target.value >= 0) {
										equipmentPriceHandler(e.target.value, 'end');
									}
								}}
							/>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default EquipmentFilter;
