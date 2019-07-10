import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ServerLoading extends cc.Component {
	/////////////////////////////////////////////////////
	///////////////////  static  ////////////////////////
	private static instance: cc.Node = null;

	public static show() {
		ServerLoading.hide();
		ServerLoading.instance = Popup.show(PopupType.ServerLoadingPopup);
	}

	public static hide() {
		if (ServerLoading.instance) {
			let loading: Popup = ServerLoading.instance.getComponent(Popup);
			if (loading) {
				loading.hide();
			}
			ServerLoading.instance = null;
		}
	}

	/////////////////////////////////////////////////////
	/////////////////////////////////////////////////////

	@property(cc.Node)
	circle: cc.Node;

	@property(cc.Node)
	heart: cc.Node;

	@property(cc.Node)
	loading_bg: cc.Node;

	@property({
		type: cc.Label,
		tooltip: "描述"
	})
	loading_text: cc.Label = null;

	onLoad() {
		let serverLoadingCom = this.circle.getComponent(cc.Animation);
		serverLoadingCom.play("loading");
	}
}
