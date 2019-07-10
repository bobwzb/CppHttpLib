import Config from "../config";
import { GameEvent, EventType } from "../lib/GameEvent";
import WxHttpControl from "../netWork/http/WxHttpControl";
import UserData from "../data/userData";
import GameSocket from "../netWork/socket/GameSocket";

export const WX = {
	/** 优先设置shareTicket */
	initShareMenu() {
		wx.showShareMenu({
			withShareTicket: true
		});
	},

	/**menu转发 */
	onShareMenu() {
		console.log("onShareMenu");
		wx.onShareAppMessage(function() {
			console.log("onShareAppMessage");
			// let id = Math.floor(Math.random() * (8 - 0 + 1) + 0);
			let id = 0;
			let shareImg = Config.SHARE_CONFIG[id].img;
			let shareTxt = Config.SHARE_CONFIG[id].txt;
			setTimeout(() => {
				WxHttpControl.getShareResult(1);
			}, 1000);
			return {
				title: shareTxt,
				imageUrl: "images/" + shareImg,
				// imageUrl: "res/images/" + shareImg,
				query: "",
				success: res => {
					console.log("转发成功", res);
					// WxHttpControl.getShareResult(1);
				},
				fail: res => {
					console.log("转发失败", res);
				}
			};
		});
	},

	/** 获取分享*/
	getShareFriend() {
		console.log("getShareFriend");
		let _self = this;
		// let id = Math.floor(Math.random() * (8 - 0 + 1) + 0);
		let id = 0;
		let shareImg = Config.SHARE_CONFIG[id].img;
		let shareTxt = Config.SHARE_CONFIG[id].txt;
		wx.shareAppMessage({
			title: shareTxt,
			imageUrl: "images/" + shareImg,
			// imageUrl: "res/images/" + shareImg,
			query: "",
			success: res => {
				console.log("转发成功", res);
				// WxHttpControl.getShareResult(1);
				// GameEvent.event.dispatchEvent(
				// 	new GameEvent(EventType.SHARE_SUCESS, res)
				// );
			}
		});
		setTimeout(() => {
			WxHttpControl.getShareResult(1);
		}, 1000);
	},

	/**切到后台 */
	onHide() {
		wx.onHide(function() {
			GameEvent.event.dispatchEvent(new GameEvent(EventType.ON_HIDE));
		});
	},

	/**返回前台 */
	onShow() {
		wx.onShow(function() {
			if (!UserData.isHasSocket) {
				GameSocket.instance.connect(Config.SOCKET_ADDRESS, Config.SOCKET_PORT);
			}
			GameEvent.event.dispatchEvent(new GameEvent(EventType.ON_SHOW));
		});
	}
};
