import C2S from "../netWork/socket/C2S";
import cardCtrl from "./cardCtrl";
import { RemoteAudio, SoundName } from "../lib/component/remoteAudio";

const { ccclass, property } = cc._decorator;

@ccclass
export default class unemployment extends cc.Component {
	@property(cc.Label)
	moneyNum: cc.Label = null;

	@property(cc.Button)
	btKnow: cc.Button = null;

	onLoad() {}

	show() {
		this.node.active = true;
	}

	hide() {
		this.node.active = false;
	}

	setData(data: any) {
		RemoteAudio.playEffect(SoundName.SIGH);
		cardCtrl.cardNodes.push(this.node);
		this.moneyNum.string = "¥" + data.num;

		this.btKnow.node.on("click", this.onBtKnow, this);
		this.btKnow.node.active = data.isMy;
	}

	onBtKnow() {
		C2S.UnemploymentAckReq();
	}
}
