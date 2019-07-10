import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";
import C2S from "../netWork/socket/C2S";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BrokeExitPopup extends Popup {
	onLoad() {
		super.onLoad();
	}

	onBtNext() {
		this.hide();
	}

	onBtQuit() {
		this.hide();
		C2S.GameQuitReq();
	}

	onDestroy() {}
}
