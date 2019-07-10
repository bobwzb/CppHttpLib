import { GameEvent, EventType } from "../lib/GameEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DiceAnim2 extends cc.Component {
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
		console.log("onShowEnd", this.data);
		console.log("onShowEnd--------------------------->");
		let self: DiceAnim2 = this;
		this.node.active = false;
		this.node.parent.getChildByName("showSprite").active = true;
		this.node.parent
			.getChildByName("showSprite")
			.getComponent(cc.Sprite).spriteFrame = this.diceFrame[this.data.num - 1];
		this.animEndCallback = function() {
			GameEvent.event.dispatchEvent(new GameEvent(EventType.GAME_PROMOTE_END));
		};
		this.unscheduleAllCallbacks();
		this.scheduleOnce(this.animEndCallback, 1);
	}

	onDestroy() {
		this.clearData();
		this.unscheduleAllCallbacks();
	}
}
