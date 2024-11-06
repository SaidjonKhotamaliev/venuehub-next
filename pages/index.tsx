import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import PopularProperties from '../libs/components/homepage/PopularEquipments';
import TopProperties from '../libs/components/homepage/TopProperties';
import { Stack } from '@mui/material';
import Advertisement from '../libs/components/homepage/Advertisement';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DownloadSection from '../libs/components/homepage/DownloadSection';
import OurTeam from '../libs/components/homepage/OurTeam';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<TopProperties />
				<PopularProperties />
				<Advertisement />
				<OurTeam />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<TopProperties />
				<PopularProperties />
				<Advertisement />
				<OurTeam />
				<DownloadSection />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
