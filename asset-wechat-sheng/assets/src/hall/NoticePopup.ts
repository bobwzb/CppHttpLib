import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";
import { GameEvent, EventType } from "../lib/GameEvent";
import WxHttpControl from "../netWork/http/WxHttpControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NoticePopup extends Popup {
	@property(cc.Label)
	contentLabel: cc.Label = null;

	data: any;
	onLoad() {
		WxHttpControl.getNoctice();
		this.addEvent();

		super.onLoad();
	}

	onBtOk() {
		Popup.hide(PopupType.NoticePopup);
	}

	addEvent() {
		super.addEvent();
		GameEvent.event.on(EventType.HTTP_GET_NOTICE, this.getNotice, this);
	}

	getNotice(res: any) {
		this.data = res.userData.data;
		let curId = cc.sys.localStorage.getItem("NOTICE_ID");
		if (curId) {
			if (this.data.id && this.data.id > curId) {
				this.contentLabel.string = this.data.content;
				cc.sys.localStorage.setItem("NOTICE_ID", this.data.id);
			} else {
				this.contentLabel.string = "暂无公告";
			}
		} else {
			this.contentLabel.string = this.data.content;
			cc.sys.localStorage.setItem("NOTICE_ID", this.data.id);
		}
	}

	onDestroy() {
		GameEvent.event.off(EventType.HTTP_GET_NOTICE, this.getNotice, this);
		WxHttpControl.getNoctice();
	}
}
