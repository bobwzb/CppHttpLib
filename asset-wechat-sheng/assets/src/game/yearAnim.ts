const { ccclass, property } = cc._decorator;

@ccclass
export default class yearAnim extends cc.Component {
	@property(cc.Label)
	yearNum: cc.Label = null;

	@property(cc.Node)
	yearAnim: cc.Node = null;

	private oldNum: number = 25;
	onLoad() {}

	setoldNum(oldNum: number) {
		this.oldNum = oldNum;
		this.yearNum.string = "" + this.oldNum;
	}

	onShowStart() {
		let anim = this.yearAnim.getComponent(cc.Animation);
		anim.play("yearPage");
		this.unscheduleAllCallbacks();
		this.scheduleOnce(function() {
			this.onShowEnd();
		}, 1);
	}

	onShowEnd() {
		console.log("----------->yearend");
		this.oldNum++;
		this.yearNum.string = "" + this.oldNum;
	}

	onDestroy() {
		this.unscheduleAllCallbacks();
	}
}
