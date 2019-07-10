import Config from "../../config";
import { INetHandler } from "./INetHandler";
import { GameEvent, EventType } from "../../lib/GameEvent";
import {
	Message,
	MarsConn,
	Header,
	MarsEventHandler,
	MarsEvent
} from "../../lib/mars/mars";
import { pb } from "../../asset.pb";
import C2S from "./C2S";
import ServerLoading from "../../hall/ServerLoadingPopup";
import UserData from "../../data/userData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameSocket {
	private static _instance: GameSocket;

	public static get instance(): GameSocket {
		if (!GameSocket._instance) {
			GameSocket._instance = new GameSocket();
		}
		return GameSocket._instance;
	}

	private ws: WebSocket;
	wsConn: MarsConn;

	private cacheBuffer: Uint8Array;

	private packcount: number = 0;

	private handlers: INetHandler[] = [];

	private littleEndian: boolean = true;

	private timerNode: cc.Node;

	private isClose: boolean = true;

	public addHandler(handler: INetHandler) {
		for (let i = 0; i < this.handlers.length; i++) {
			const tmpHandler = this.handlers[i];
			if (tmpHandler.name() == handler.name()) {
				return;
			}
		}
		const index = this.handlers.indexOf(handler);
		if (index == -1) {
			this.handlers.push(handler);
		}
	}

	public removeHandler(handler: INetHandler) {
		const index = this.handlers.indexOf(handler);
		if (index >= 0) {
			this.handlers.splice(index, 1);
		}
	}

	public connect(address: string, port: number) {
		console.log("connect------------------>");
		let self: GameSocket = this;
		var ws: WebSocket = new WebSocket(
			"wss://" + address + ":" + port + "/mars"
		);

		ws.onopen = () => {
			self.isClose = true;
			UserData.isHasSocket = true;
			this.wsConn = new MarsConn(ws);
			setInterval(() => {
				this.wsConn.sendHeartBeat();
			}, 10000);
			C2S.GameLoginReq();
			ServerLoading.hide();
			this.wsConn.onmessage(event => {
				// console.log("进入到回调",  event.message)
				let msg = event.message;
				switch (msg.header.cmdId) {
					case pb.common.CmdID.PUSH:
						let payload = pb.common.Payload.decode(msg.body);
						console.log(payload.type, "payload.type");
						for (let i = 0; i < self.handlers.length; i++) {
							const handler = self.handlers[i];
							if (handler.handle(payload.type, payload)) {
								continue;
							}
						}
						break;
				}
			});
		};

		ws.onerror = () => {
			console.log("ws.onerror--------------------->");
			if (self.isClose) {
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_ON_CLOSED)
				);
				self.isClose = false;
				UserData.isHasSocket = false;
			}
			ServerLoading.show();
			setTimeout(() => {
				self.connect(Config.SOCKET_ADDRESS, Config.SOCKET_PORT);
			}, 2000);
		};

		wx.onSocketClose(function() {
			console.log("------------------>ws.onclose");
			if (self.isClose) {
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_ON_CLOSED)
				);
				self.isClose = false;
				UserData.isHasSocket = false;
			}
			ServerLoading.show();
			setTimeout(() => {
				self.connect(Config.SOCKET_ADDRESS, Config.SOCKET_PORT);
			}, 2000);
		});

		wx.onSocketError(function() {
			console.log("------------------>wx.onSocketError");
			// if (self.isClose) {
			// 	GameEvent.event.dispatchEvent(
			// 		new GameEvent(EventType.SOCKET_ON_CLOSED)
			// 	);
			// 	self.isClose = false;
			// 	UserData.isHasSocket = false;
			// }
			// ServerLoading.show();
			// setTimeout(() => {
			// 	self.connect(Config.SOCKET_ADDRESS, Config.SOCKET_PORT);
			// }, 2000);
		});
	}

	public onClosed(event) {
		console.log("", event);
		// cc.director.getScheduler().
		// if (this.timerNode) {
		// 	this.timerNode.stopAllActions();
		// }
		// cc.director.loadScene("Loading");
	}

	public sendData(cmd, buffer) {}
}
