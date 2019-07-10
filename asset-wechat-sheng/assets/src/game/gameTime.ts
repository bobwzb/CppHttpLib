import StringUtils from "../until/StringUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class gameTime extends cc.Component {
	@property(cc.Label)
	timeTxt: cc.Label = null;
	onLoad() {}

	/**
	 * 游戏全局倒计时
	 */
	setShowTime(time: number) {
		let self: gameTime = this;
		this.unscheduleAllCallbacks();
		let timeRemainCallBack = function() {
			time--;
			self.timeTxt.string = StringUtils.doInverseTime(time);
			if (time == 0) {
				self.unschedule(timeRemainCallBack);
			}
		};
		this.schedule(timeRemainCallBack, 1);
	}

	onDestroy() {
		this.unscheduleAllCallbacks();
	}
}
