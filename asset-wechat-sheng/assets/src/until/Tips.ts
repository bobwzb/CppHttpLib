import ResManager from "../lib/ResManager";

const { ccclass, property } = cc._decorator;
/**
 * 游戏顶层Tips信息
 */
@ccclass
export default class Tips {
	public static PREFAB_PATH: string = "prefab/tips";

	private static instance: Tips;
	/**
	 * init
	 */
	public static init() {
		if (!Tips.instance) {
			Tips.instance = new Tips();
		}

		const prefab: cc.Prefab = ResManager.instance.getRes(Tips.PREFAB_PATH);
		Tips.instance.prefab = prefab;
	}
	/**
	 * 在屏幕中间显示系统提示消息
	 * @param content 消息内容
	 */
	public static show(content: string) {
		if (Tips.instance) {
			Tips.instance.show(content);
		}
	}

	prefab: cc.Prefab = null;

	tipsLayer: cc.Node = null;

	/**
	 * 构造函数
	 */
	constructor() {
		this.tipsLayer = new cc.Node();
		cc.game.addPersistRootNode(this.tipsLayer);
	}

	private show(content: string) {
		var node: cc.Node = cc.instantiate(this.prefab);
		if (content.length > 4) {
			node.width =
				128 +
				content.length *
					node.getChildByName("txt").getComponent(cc.Label).fontSize;
		} else {
			node.width = 248;
		}
		var label: cc.Label = node.getChildByName("txt").getComponent(cc.Label);
		label.string = content;
		node.opacity = 0;
		node.x = cc.winSize.width / 2;
		node.y = cc.winSize.height / 2;
		this.tipsLayer.addChild(node);

		var seq = cc.sequence(
			cc.fadeIn(0.3),
			cc.delayTime(1),
			cc.fadeOut(0.3),
			cc.callFunc(function() {
				node.removeFromParent(true);
			})
		);
		node.runAction(seq);
	}
}
