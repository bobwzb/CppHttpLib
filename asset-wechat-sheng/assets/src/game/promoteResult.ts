import { pb } from "../asset.pb";
import { RemoteAudio, SoundName } from "../lib/component/remoteAudio";

const { ccclass, property } = cc._decorator;

@ccclass
export default class promoteResult extends cc.Component {
	@property(cc.Label)
	moneyNum: cc.Label = null;

	@property(cc.Node)
	resultTrue: cc.Node = null;

	@property(cc.Node)
	resultFalse: cc.Node = null;

	onLoad() {}

	show() {
		this.node.active = true;
	}

	hide() {
		this.node.active = false;
		this.node.opacity = 255;
	}

	setData(data: pb.common.WageHikeMsg) {
		if (data.isPromotion) {
			RemoteAudio.playEffect(SoundName.PROMOTION);
		} else {
			RemoteAudio.playEffect(SoundName.PROMOTION_FAILED);
		}
		this.resultTrue.active = data.isPromotion;
		this.resultFalse.active = !data.isPromotion;
		if (data.isPromotion) {
			this.moneyNum.string = "+ ¥" + data.incr;
		}
		this.node.stopAllActions();
		this.node.runAction(cc.sequence(cc.delayTime(1.5), cc.fadeOut(0.3)));
	}

	onDestroy() {}
}
