import ResManager from "../lib/ResManager";

const { ccclass, property } = cc._decorator;

export enum PopupLayer {
	MID, //中间层
	BOTTOM, //最下层
	TOP //最上层
}

/**
 * 对话框
 */
@ccclass
export default class Popup extends cc.Component {
	/**普通层 */
	private static popupLayer: cc.Node = null;

	/**最下层的ui Layer */
	private static bottomLayer: cc.Node = null;

	private static topLayer: cc.Node = null;

	private static blackPrefab: cc.Prefab = null;

	private static layers: Array<cc.Node> = [];

	private static layersLen: number = 0;

	/**
	 * 初始化popup层，只需初始化一次
	 */
	public static init() {
		if (!Popup.bottomLayer) {
			Popup.bottomLayer = new cc.Node();
			cc.game.addPersistRootNode(Popup.bottomLayer);
		}

		if (!Popup.popupLayer) {
			Popup.popupLayer = new cc.Node();
			cc.game.addPersistRootNode(Popup.popupLayer);
		}

		if (!Popup.topLayer) {
			Popup.topLayer = new cc.Node();
			cc.game.addPersistRootNode(Popup.topLayer);
		}

		Popup.layers = [Popup.popupLayer, Popup.bottomLayer, Popup.topLayer];
		Popup.layersLen = Popup.layers.length;
	}

	public static show(
		prefabPath: string,
		name?: string,
		data?: any,
		slide?: string,
		layer: PopupLayer = PopupLayer.MID
	): any {
		if (prefabPath == undefined || prefabPath == null) {
			console.log("Popup show prefabPath is undefined !");
			return;
		}
		//Popup.hide(prefabPath, name);
		let curLayer = Popup.layers[Number(layer)];

		var loadComplete = function(prefab: cc.Prefab): any {
			Popup.hide(prefabPath, name, false);

			var node: cc.Node = cc.instantiate(prefab);
			var nodeName: string = prefabPath.split("/").join("") + name;

			node.name = nodeName;
			var popup: Popup = node.getComponent(Popup);
			if (popup != null) {
				if (slide == "left") {
					node.setPosition(
						cc.v2(cc.winSize.width * 1.5, cc.winSize.height / 2)
					);
					let action: cc.Action = cc.moveTo(
						0.25,
						cc.v2(cc.winSize.width / 2, cc.winSize.height / 2)
					);
					node.runAction(action);
				} else if (slide == "right") {
				} else {
					node.x = cc.winSize.width / 2;
					node.y = cc.winSize.height / 2;
				}
				curLayer.addChild(node);
				popup.setData(data);
			} else {
				node.destroy();
			}
			return node;
		};

		var prefab: cc.Prefab = ResManager.instance.getRes(prefabPath);
		if (prefab) {
			return loadComplete(prefab);
		} else {
			cc.loader.loadRes(prefabPath, function(err: Error, prefab: cc.Prefab) {
				loadComplete(prefab);
			});
		}
	}

	public static hide(prefabPath: string, name?: string, ani: boolean = true) {
		if (prefabPath == undefined || prefabPath == null) {
			console.log("Popup hide prefabPath is undefined !");
			return;
		}
		if (Popup.popupLayer) {
			var nodeName: string = prefabPath.split("/").join("") + name;
			let node: cc.Node;
			for (let i = 0; i < Popup.layersLen; i++) {
				node = Popup.layers[i].getChildByName(nodeName);
				if (node) {
					break;
				}
			}

			if (node && node.getComponent("Popup")) {
				var popup: Popup = node.getComponent("Popup");
				popup.removePopup(ani);
			}
		}
	}

	/**
	 * 移除所有对话框
	 */
	public static removeAll() {
		if (Popup.popupLayer) {
			Popup.popupLayer.removeAllChildren();
		}
	}

	///////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	///////////////////////////////////////////////////////

	@property({
		type: cc.Node,
		tooltip: "黑色透明背景，添加之后空白处无法点击该对话框层级以下的对象"
	})
	blackLayer: cc.Node = null;

	@property({
		type: Boolean,
		tooltip: "空白处点击是否关闭"
	})
	blackClickHidden: boolean = true;

	@property({
		type: Boolean,
		tooltip: "隐藏时是否销毁"
	})
	autoDestory: boolean = true;

	@property({
		type: cc.Node,
		tooltip: "对话框内容Node"
	})
	content: cc.Node = null;

	@property({
		type: cc.Button,
		tooltip: "关闭按钮"
	})
	closeButton: cc.Button = null;

	// @property({
	//     type: cc.Integer,
	//     max: 3,
	//     min: 1,
	//     step: 1,
	//     tooltip: '动画类型:1-缩放(scale)，2-透明度(opacity), 3-无(none)'
	// })
	// animationType: number = 1;

	@property({
		type: Boolean,
		tooltip: "显示或隐藏的时候是否启动缩放动画效果"
	})
	scaleAnimate: boolean = true;

	@property({
		type: Boolean,
		tooltip: "显示或隐藏的时候是否启动淡入淡出动画效果"
	})
	fadeAnimate: boolean = true;

	@property({
		type: cc.Float,
		min: 0,
		tooltip: "动画时长"
	})
	animationTime: number = 0.25;

	@property({
		min: 0,
		tooltip: "动画效果类型\n(easeBackIn、easeBounceIn等，详见cc.easexxx)"
	})
	easing: string = "easeBackOut";

	private isRemoving: boolean = false;

	onLoad() {
		this.node.setContentSize(cc.winSize);
		let self: any = this;
		if (this.animationTime > 0) {
			this.content.stopAllActions();

			var actions: Array<cc.FiniteTimeAction> = [];

			if (this.scaleAnimate) {
				this.content.scale = 0.0;
				actions.push(
					cc.scaleTo(this.animationTime, 1, 1).easing(cc[this.easing]())
				);
			}
			if (this.fadeAnimate) {
				this.content.opacity = 0.0;
				actions.push(cc.fadeIn(this.animationTime));
			}

			if (actions.length > 0) {
				var action;
				if (actions.length == 1) {
					action = actions[0];
				} else {
					action = cc.spawn.apply(null, actions);
				}

				this.content.runAction(
					cc.sequence(action, cc.callFunc(this.showActionComplete, null, self))
				);
			} else {
				this.content.scale = 1;
				this.content.opacity = 255;
			}
		}

		this.isRemoving = false;
		this.addEvent();
	}

	protected addEvent() {
		if (this.closeButton) {
			this.closeButton.node.on("click", this.hide, this);
		}

		if (this.blackLayer) {
			this.blackLayer.setContentSize(cc.winSize);
			if (this.blackClickHidden) {
				this.blackLayer.on("click", this.hide, this);
			}
		}
	}

	private showActionComplete(thisTarget: any, self: any) {
		self.afterShow();
	}

	/**执行完缩放淡入动画后 */
	protected afterShow() {}

	public setData(data: any) {
		// 子类复写
	}

	/**
	 * 移除对话框
	 * @param ani 是否使用动画效果
	 */
	public removePopup(ani: boolean) {
		let self: Popup = this;
		if (ani && this.animationTime > 0) {
			if (this.isRemoving) return;

			this.content.stopAllActions();

			var actions: Array<cc.FiniteTimeAction> = [];
			if (this.scaleAnimate) {
				actions.push(cc.scaleTo(this.animationTime, 0, 0));
			}
			if (this.fadeAnimate) {
				actions.push(cc.fadeOut(this.animationTime));
			}

			if (actions.length > 0) {
				var action;
				if (actions.length == 1) {
					action = actions[0];
				} else {
					action = cc.spawn.apply(null, actions);
				}
				var hideAction = cc.callFunc(() => {
					this.removePopup(false);
				}, this);
				var seq = cc.sequence(action, hideAction);
				self.content.runAction(seq);
			} else {
				self.removePopup(false);
			}
			this.isRemoving = true;
		} else {
			this.node.removeFromParent(this.autoDestory);
			if (this.autoDestory) {
				this.node.destroy();
			}
		}
	}

	public hide(evt?: any) {
		this.removePopup(this.scaleAnimate || this.fadeAnimate);
	}
}
