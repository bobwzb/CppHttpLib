import C2S from "../netWork/socket/C2S";
import { pb } from "../asset.pb";
import GameSocket from "../netWork/socket/GameSocket";
import { Message } from "../lib/mars/mars";
import UserData from "../data/userData";
import cardCtrl from "./cardCtrl";
import { RemoteAudio, SoundName } from "../lib/component/remoteAudio";

const { ccclass, property } = cc._decorator;

@ccclass
export default class boyExpense extends cc.Component {
	@property(cc.Label)
	moneyNum: cc.Label = null;

	@property(cc.Button)
	btKnow: cc.Button = null;

	onLoad() {}

	show() {
		this.node.active = true;
	}

	hide() {
		this.node.active = false;
	}

	setData(data: any) {
		RemoteAudio.playEffect(SoundName.CHILD);
		cardCtrl.cardNodes.push(this.node);
		this.moneyNum.string = "¥" + data.num;
		this.btKnow.node.on("click", this.onBtKnow, this);

		this.btKnow.node.active = data.isMy;
	}

	onBtKnow() {
		console.log("PassReq生小孩");
		var msg: pb.common.PassReq = new pb.common.PassReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.PassReq.encode(msg).finish();
		let cmd = pb.common.CmdID.PASS;

		let self: boyExpense = this;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.PassRsp.decode(msg.body);
				self.hide();
				C2S.SyncStateReq();
			})
			.catch();
	}

	onDestroy() {}
}
