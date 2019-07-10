import { preInit } from "./_preload";
import * as Long from "long";
import ResManager from "./lib/ResManager";
import Popup from "./until/Popup";
import { PopupType } from "./until/PopupType";
import Tips from "./until/Tips";
import HttpRequest from "./netWork/http/HttpRequest";
import HttpControl from "./netWork/http/HttpControl";
import { GameEvent, EventType } from "./lib/GameEvent";
import BasicScene from "./lib/BasicScene";
import UserData from "./data/userData";
import { pb } from "./asset.pb";
import GameSocket from "./netWork/socket/GameSocket";
import C2S from "./netWork/socket/C2S";
import WxHttpControl from "./netWork/http/WxHttpControl";
import S2C from "./netWork/socket/S2C";
import StringUtils from "./until/StringUtils";
import { TextDecoder, TextEncoder } from "util";
import { BinaryDecoder, BinaryEncoder } from "./until/BinaryUtils";
import Config from "./config";
import { RemoteAudio } from "./lib/component/remoteAudio";
import ServerLoading from "./hall/ServerLoadingPopup";
import { WX } from "./until/WX";
let JSONbig = require("json-bigint");
import * as Sentry from "@sentry/browser";
Sentry.init({
	dsn:
		"http://a616c340fe5b4478a08151f545c394a9:91278f8d39c64229811c1ecb0704f670@118.24.146.84:9000/5"
});

const { ccclass, property } = cc._decorator;

@ccclass
export default class loginScene extends BasicScene {
	@property(cc.Node)
	btLogin: cc.Node = null;

	@property(cc.ProgressBar)
	progress: cc.ProgressBar = null;

	sceneLoading: boolean = false;

	requiredRes: string[] = [Tips.PREFAB_PATH, PopupType.ServerLoadingPopup];

	encryptData: any;
	iv: any;
	isLogin: boolean = false;
	onLoad() {
		let self = this;
		self.loadSubPack();
		RemoteAudio.preloadAllAudios().then(() => {
			console.log("all audio loaded");
		});
		WX.initShareMenu();
		WX.onShareMenu();
	}

	private loadSubPack() {
		let self = this;
		self.progress.progress = 0;
		let timeCallBack = function() {
			self.progress.progress = self.progress.progress + 1 / 100;
			if (self.progress.progress >= 1) {
				self.progress.progress = 1;
				// self.progress.node.active = false;
				// self.btLogin.active = true;
				self.unschedule(timeCallBack);
			}
		};
		this.schedule(timeCallBack, 0.1);
		cc.loader.downloader.loadSubpackage("asset_anime", function(err) {
			if (err) {
				self.loadSubPack();
				Sentry.captureException(new Error("asset_anime分包加载失败"));
				wx.showModal({
					title: "友情提示",
					content: "网络连接不稳定,请等候或重试",
					showCancel: false,
					confirmText: "知道了"
				});
				return console.error(err);
			}
			cc.loader.downloader.loadSubpackage("asset_resource", function(err) {
				if (err) {
					self.loadSubPack();
					Sentry.captureException(new Error("asset_resource分包加载失败"));
					wx.showModal({
						title: "友情提示",
						content: "网络连接不稳定,请等候或重试",
						showCancel: false,
						confirmText: "知道了"
					});
					return console.error(err);
				}
				console.log("load subpackage successfully.");
				self.progress.progress = 1;
				self.progress.node.active = false;
				self.btLogin.active = true;
				self.unschedule(timeCallBack);
				if (cc.sys.localStorage.getItem("uid")) {
					let uid = Long.fromString(cc.sys.localStorage.getItem("uid"));
					UserData.uid = uid;
				}
				if (cc.sys.localStorage.getItem("X-Auth-Token")) {
					let token = cc.sys.localStorage.getItem("X-Auth-Token");
					UserData.token = token;
				}
				self.loadRes();
				GameSocket.instance.addHandler(new S2C());
				self.addEvent();
			});
		});
	}

	private loadRes() {
		let self = this;

		ResManager.instance.loadRes(
			this.requiredRes,
			ResManager.DEFAULT_MODULE_NAME,
			null,
			function(percent: number): void {
				// self.setProcress(percent * 0.7);
			},
			function(err: Error): void {
				if (err) {
				} else {
					self.loadResComplete();
				}
			}
		);

		// cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
	}

	private createAuthorizeBtn(): void {
		let btnSize = cc.size(358 + 10, 104 + 10);
		let frameSize = cc.view.getFrameSize();
		let winSize = cc.director.getWinSize();
		// console.log("winSize: ",winSize);
		// console.log("frameSize: ",frameSize);
		//适配不同机型来创建微信授权按钮
		let left =
			((winSize.width * 0.5 + 0 - btnSize.width * 0.5) / winSize.width) *
			frameSize.width;
		let top =
			((winSize.height * 0.5 - -509 - btnSize.height * 0.5) / winSize.height) *
			frameSize.height;
		let width = (btnSize.width / winSize.width) * frameSize.width;
		let height = (btnSize.height / winSize.height) * frameSize.height;
		// console.log("button pos: ",cc.v2(left,top));
		// console.log("button size: ",cc.size(width,height));

		let self = this;
		let btnAuthorize = wx.createUserInfoButton({
			type: "text",
			text: "",
			style: {
				left: left,
				top: top,
				width: width,
				height: height,
				lineHeight: 0,
				backgroundColor: "",
				color: "#ffffff",
				textAlign: "center",
				fontSize: 16,
				borderRadius: 4
			}
		});

		btnAuthorize.onTap(uinfo => {
			console.log("onTap uinfo: ", uinfo);
			if (uinfo.userInfo) {
				console.log("wxLogin auth success");
				wx.showToast({ title: "授权成功" });
				UserData.userInfo = uinfo.userInfo;
				self.encryptData = uinfo.encryptedData;
				self.iv = uinfo.iv;
				self.checkLogin();
				btnAuthorize.destroy();
			} else {
				console.log("wxLogin auth fail");
				wx.showToast({ title: "授权失败, 请重新授权" });
			}
		});
	}

	private wxLoginSet() {
		let self: any = this;
		wx.login({
			success(res) {
				if (res.code) {
					console.log(res);
					// 发起网络请求
					wx.request({
						url: Config.HTTP_ADDRESS + "auth/sign_in_with_wx_code?mini=1",
						data: {
							wx_code: res.code,
							encrypt_user_info: self.encryptData,
							iv: self.iv
						},
						header: {
							"content-type": "application/json"
						},
						method: "POST",
						dataType: "string",
						success(res) {
							console.log(res, typeof res);
							console.log(res.header["X-Auth-Token"]);
							if (res.header["X-Auth-Token"]) {
								cc.sys.localStorage.setItem(
									"X-Auth-Token",
									res.header["X-Auth-Token"]
								);
							} else if (res.header["x-auth-token"]) {
								cc.sys.localStorage.setItem(
									"X-Auth-Token",
									res.header["x-auth-token"]
								);
							}
							var json = res.data;
							var r1 = JSONbig.parse(json);
							let uidString = r1.uid.toString();
							console.log(uidString, typeof uidString, "typeof(uidString)");
							let uid = Long.fromString(uidString);
							cc.sys.localStorage.setItem("uid", uidString);
							UserData.uid = uid;
							UserData.token = cc.sys.localStorage.getItem("X-Auth-Token");
							GameSocket.instance.connect(
								Config.SOCKET_ADDRESS,
								Config.SOCKET_PORT
							);
						},
						fail(res) {
							console.log(res);
						}
					});
				} else {
					console.log("登录失败！" + res);
				}
			},
			fail(res) {
				console.log(res, "wx.loginfail");
			}
		});
	}

	private checkLogin() {
		let self = this;
		if (self.isLogin) {
			self.wxLoginSet();
		}
		wx.checkSession({
			success() {
				// session_key 未过期，并且在本生命周期一直有效
				console.log("checkSessionsuccess");
				if (self.encryptData && self.iv) {
					Sentry.captureException(new Error("checkSessionsuccess"));
				}
			},
			fail() {
				// session_key 已经失效，需要重新执行登录流程
				// 重新登录
				console.log("checkSessionfail");
				self.wxLoginSet();
			}
		});
	}

	private checkSQ() {
		let self = this;
		wx.getSetting({
			success(res) {
				if (!res.authSetting["scope.userInfo"]) {
					self.createAuthorizeBtn();
					console.log("用户未授权");
				} else {
					console.log("用户已经授权");
					// C2S.GameLoginReq()
					// GameSocket.instance.connect("192.168.199.103", 10080);
					GameSocket.instance.connect(
						Config.SOCKET_ADDRESS,
						Config.SOCKET_PORT
					);
				}
			},
			fail(res) {
				Sentry.captureException(new Error("wx.getSettingfail接口调用失败"));
			}
		});
	}

	private loadResComplete() {
		Popup.init();
		Tips.init();
		this.checkSQ();
		// this.enterGame();
		// let action = cc.moveTo(0.5, cc.v2(-cc.winSize.width, 0));
		// this.node.runAction(action)
		// cc.director.loadScene("storeScene");
	}

	onTest() {
		// let msg = [
		// 	{delivered: true, progress:1, target:10},
		// 	{delivered: false, progress:1, target:10},
		// 	{delivered: false, progress:10, target:10},
		// 	{delivered: false, progress:1, target:10},
		// 	{delivered: true, progress:10, target:10},
		// ]
		// msg.sort(function(a, b) {
		// 	if (a.delivered && !b.delivered) {
		// 		return 1
		// 	}
		// 	else if (!a.delivered && b.delivered) {
		// 		return -1
		// 	}
		// 	else {
		// 		if (a.progress >= a.target) {
		// 			return -1
		// 		}
		// 		else {
		// 			return 1
		// 		}
		// 	}
		// })
		// console.log(msg)
	}

	protected addEvent() {
		let self: loginScene = this;
		GameEvent.event.on(EventType.HTTP_LOGIN_SUCCESS, function(
			event: GameEvent
		) {
			console.log(event.userData);
			// self.enterGame()
		});

		GameEvent.event.on(EventType.SOCKET_LOGIN_SUCESS, function(
			event: GameEvent
		) {
			self.enterGame("hallScene");
		});
		GameEvent.event.on(EventType.SOCKET_LOGIN_FAIL, function(event: GameEvent) {
			Tips.show("登录失败，请重新登录")
			self.isLogin = true
			self.createAuthorizeBtn();
		});
		// GameEvent.event.on(
		// 	EventType.SOCKET_CHECK_PLAYING,
		// 	this.getCheckLogin,
		// 	this
		// );
	}

	/**
	 * 进入游戏场景
	 */
	private enterGame(scene?: string) {
		console.log("-------------->enterGame0");
		if (!this.sceneLoading) {
			this.sceneLoading = true;
			cc.director.preloadScene(scene, function() {
				console.log("-------------->enterGame1");
				cc.director.loadScene(scene);
			});
		}
	}

	// getCheckLogin(event: any) {
	// 	let self: loginScene = this;
	// 	let msg: pb.common.CheckPlayingRsp = event.userData;
	// 	UserData.checkData = msg;
	// 	if (msg.state == pb.common.PlayerState.PLAYER_STATE_BEGIN) {
	// 		ServerLoading.show()
	// 		UserData.isConnect = true
	// 		self.enterGame("hallScene")
	// 		// self.enterGame("testScene")
	// 	} else if (
	// 		msg.state == pb.common.PlayerState.PLAYER_STATE_IN_ROOM ||
	// 		msg.state == pb.common.PlayerState.PLAYER_STATE_MATCHED ||
	// 		msg.state == pb.common.PlayerState.PLAYER_STATE_MATCHING ||
	// 		msg.state == pb.common.PlayerState.PLAYER_STATE_READY
	// 	) {
	// 		ServerLoading.show()
	// 		UserData.isConnect = true
	// 		self.enterGame("readyScene")
	// 	} else if (msg.state == pb.common.PlayerState.PLAYER_STATE_PLAYING) {
	// 		console.log("进入到gamescene---------------------->");
	// 		ServerLoading.show()
	// 		UserData.isConnect = true
	// 		self.enterGame("gameScene")
	// 	}
	// }

	onDestroy() {
		let self: loginScene = this;
		GameEvent.event.off(EventType.HTTP_LOGIN_SUCCESS, function(
			event: GameEvent
		) {
			console.log(event.userData);
			// self.enterGame()
		});

		GameEvent.event.off(EventType.SOCKET_LOGIN_SUCESS, function(
			event: GameEvent
		) {
			self.enterGame();
		});
		GameEvent.event.off(EventType.SOCKET_LOGIN_FAIL, function(
			event: GameEvent
		) {
			Tips.show("登录失败，请重新登录");
			self.isLogin = true;
			self.createAuthorizeBtn();
		});
		// GameEvent.event.off(
		// 	EventType.SOCKET_CHECK_PLAYING,
		// 	this.getCheckLogin,
		// 	this
		// );
	}
}
