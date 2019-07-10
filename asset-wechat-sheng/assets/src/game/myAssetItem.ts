import { pb } from "../asset.pb";
import StringUtils from "../until/StringUtils";
import Tips from "../until/Tips";
import { GameEvent, EventType } from "../lib/GameEvent";
import UserData from "../data/userData";
import AvatarContainer from "../lib/component/avatarContainer";
var Long = require("long");

const { ccclass, property } = cc._decorator;

@ccclass
export default class myAssetItem extends cc.Component {
	@property(cc.Node)
	headIcon: cc.Node = null;

	@property(cc.Sprite)
	itemBg: cc.Sprite = null;

	@property(cc.Label)
	nameTxt: cc.Label = null;

	@property(cc.Label)
	professionTxt: cc.Label = null;

	@property(cc.Label)
	stockNum: cc.Label = null;

	@property(cc.Label)
	homeNum: cc.Label = null;

	@property(cc.Label)
	stockRightNum: cc.Label = null;

	@property(cc.Label)
	companyNum: cc.Label = null;

	@property(cc.Label)
	assetNum: cc.Label = null;

	data: pb.common.IGameReportItem;
	msg: pb.common.IPlayerInfo;
	role: pb.common.IPlayerRole;
	onLoad() {}

	clearData() {
		this.data = null;
	}

	setData(
		data: pb.common.IGameReportItem,
		msg: pb.common.IPlayerInfo,
		role: pb.common.IPlayerRole
	) {
		this.clearData();
		this.data = data;
		this.msg = msg;
		let self: myAssetItem = this;

		let avatarContainer = this.headIcon.getComponent(AvatarContainer);
		if (msg.userId.equals(UserData.uid)) {
			if (UserData.avatarFrame) {
				avatarContainer.avatarSprite.spriteFrame = UserData.avatarFrame;
			} else {
				if (
					typeof msg.avatar !== "undefined" &&
					msg.avatar !== null &&
					msg.avatar.length > 5
				) {
					UserData.avatarUrl = msg.avatar;
					avatarContainer.setAvatarImageFromUrl(msg.avatar);
				}
			}
		} else {
			avatarContainer.setAvatarImageFromUrl(msg.avatar);
		}
		this.nameTxt.string = msg.nickname;
		this.professionTxt.string = role.Name;
		this.stockNum.string = data.stockCnt.toString();
		this.homeNum.string = data.houseCnt.toString();
		this.stockRightNum.string = data.equityCnt.toString();
		this.companyNum.string = data.companyCnt.toString();
		this.assetNum.string = data.degree.toFixed(2) + "%";

		if (msg.userId.equals(UserData.uid)) {
			this.itemBg.node.active = true;
		} else {
			this.itemBg.node.active = false;
		}
	}

	onDestroy() {
		this.clearData();
	}
}
