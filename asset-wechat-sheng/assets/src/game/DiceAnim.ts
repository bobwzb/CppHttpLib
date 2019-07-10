import { GameEvent, EventType } from "../lib/GameEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DiceAnim extends cc.Component {
	@property([cc.SpriteFrame])
	diceFrame: cc.SpriteFrame[] = [];

	animEndCallback: any;
	data: any;
	onLoad() {}

	setData(data: any) {
		this.clearData();

		this.data = data;
		console.log(data, "-------------------->dicedata");
	}

	clearData() {
		this.node.active = true;
		this.data = null;
		this.animEndCallback = null;
	}

	onShowEnd() {
		this.unscheduleAllCallbacks();
		console.log("onShowEnd", this.data);
		console.log("onShowEnd--------------------------->");
		let self: DiceAnim = this;
		this.node.active = false;
		this.node.parent.getChildByName("showSprite").active = true;
		this.node.parent
			.getChildByName("showSprite")
			.getComponent(cc.Sprite).spriteFrame = this.diceFrame[this.data.num - 1];
		this.animEndCallback = function() {
			GameEvent.event.dispatchEvent(new GameEvent(EventType.GAME_DICE_END));
		};
		this.scheduleOnce(this.animEndCallback, 1);
	}

	stopAnim() {
		let animCtrl = this.node.getComponent(cc.Animation);
		animCtrl.stop("dic");
	}

	onDestroy() {
		this.clearData();
		this.unscheduleAllCallbacks();
	}
}
