import { NoticeCategory, NoticeStatus, NoticeTopic } from '../../enums/notice.enum';

export interface Notice {
	_id: string;
	noticeCategory: NoticeCategory;
	noticeStatus: NoticeStatus;
	noticeTopic: NoticeTopic;
	noticeTitle: string;
	noticeContent: string;
	memberId: string;
	createdAt: Date;
}
