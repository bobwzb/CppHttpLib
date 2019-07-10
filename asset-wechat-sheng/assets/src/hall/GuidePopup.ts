import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GuidePopup extends Popup {
	onLoad() {
		super.onLoad();
	}

	onBtOk() {
		// console.log("----------引导链接");
		this.hide();
	}

	onDestroy() {}
}
