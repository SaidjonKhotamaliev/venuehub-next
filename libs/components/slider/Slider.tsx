import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import styles from './Slider.module.css';
function Slider() {
	return (
		<section className={styles.sliderSection}>
			<img
				className={styles.hero}
				src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/c62efd51-f844-4335-ba29-70ea35521dd8"
				alt="Hero"
			/>
			<Swiper
				className={styles.swiper}
				grabCursor={true}
				speed={500}
				effect="slide"
				loop={true}
				mousewheel={{ invert: false, sensitivity: 1 }}
			>
				<SwiperSlide className={styles.swiperSlide}>
					<h1 className={`${styles.title} ${styles.one}`}></h1>
					<img
						src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/1bdebd02-d675-4469-be36-dc248448980d"
						alt="Edinburgh"
					/>
				</SwiperSlide>

				<SwiperSlide className={styles.swiperSlide}>
					<h1 className={`${styles.title} ${styles.two}`}></h1>
					<img
						src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/62411bbf-dde9-4654-9298-1fe3e7da2d64"
						alt="Stockholm"
					/>
				</SwiperSlide>
			</Swiper>
		</section>
	);
}

export default Slider;
