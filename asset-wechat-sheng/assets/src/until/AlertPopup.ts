import Popup from "./Popup";
import { PopupType } from "./PopupType";
import { KdHandler } from "../lib/FunctionEventManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AlertPopup extends Popup {
	public static TYPE_OK: number = 1;
	public static TYPE_NORMAL: number = 0;

	@property({
		type: cc.Node
	})
	btnLeft: cc.Node = null;

	@property({
		type: cc.Node
	})
	btnRight: cc.Node = null;

	@property({
		type: cc.Label
	})
	contentLable: cc.Label = null;

	private type: number = 0;
	private data: any;
	private onBtnClick(evt: any) {
		let index: number = evt.currentTarget == this.btnLeft ? 1 : 2;
		if (this.data[index]) {
			(this.data[index] as KdHandler).execute();
		}
		this.hide();
	}

	public setData(data: any) {
		this.data = data;
		this.contentLable.string = data[0];
		this.btnLeft.on("click", this.onBtnClick, this);

		if (this.btnRight) {
			this.btnRight.on("click", this.onBtnClick, this);
		}

		if (data[3] != undefined && data[3] == AlertPopup.TYPE_OK) {
			if (this.btnRight) {
				this.btnRight.active = false;
			}
			this.btnLeft.setPosition(0);
		}
	}

	/**
	 * @param content 内容
	 * @param okCallback 确定按钮回调
	 * @param cancelCallback 取消按钮回调
	 */
	public static showAlert(
		content: string,
		okCallback?: KdHandler,
		cancelCallback?: KdHandler,
		showType?: number
	) {
		let data = [content, okCallback, cancelCallback, showType];
		Popup.show(PopupType.AlertPopup, null, data);
	}
}
