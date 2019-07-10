const { ccclass, property } = cc._decorator;
@ccclass
export default class TimeUtils {
	public static DelayTime(node, time, fun) {
		node.runAction(cc.sequence(cc.delayTime(time), cc.callFunc(fun)));
	}
}
