import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";
import { RemoteAudio, SoundName } from "../lib/component/remoteAudio";

const { ccclass, property } = cc._decorator;

@ccclass
export default class loanTipPopup extends Popup {
	@property(cc.Label)
	moneyNum: cc.Label = null;

	data: any;
	onLoad() {
		super.onLoad();
		RemoteAudio.playEffect(SoundName.NEED_LOAN_PROMPT);
	}

	setData(data: any) {
		this.moneyNum.string = "-" + data;
		this.data = data;
	}

	onBtOk() {
		console.log("-------------->去贷款");
		this.hide();
		Popup.show(PopupType.BankPopup, null, this.data);
	}

	onBtQuit() {
		this.hide();
	}

	onDestroy() {}
}
