import { NoticeCategory, NoticeStatus, NoticeTopic } from '../../enums/notice.enum';

export interface NoticeInput {
	noticeCategory: NoticeCategory;
	noticeStatus?: NoticeStatus;
	noticeTopic: NoticeTopic;
	noticeTitle: string;
	noticeContent: string;
	memberId?: string;
}
