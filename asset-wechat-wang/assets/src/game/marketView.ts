import C2S from "../netWork/socket/C2S";
import { pb } from "../asset.pb";
import StringUtils from "../until/StringUtils";
import { GameEvent, EventType } from "../lib/GameEvent";
import { SCENARIO_TYPE } from "./mapType";
import cardCtrl from "./cardCtrl";
import AvatarContainer from "../lib/component/avatarContainer";
import { RemoteImage } from "../lib/component/remoteImage";
import { RemoteAudio, SoundName } from "../lib/component/remoteAudio";

const { ccclass, property } = cc._decorator;

@ccclass
export default class marketView extends cc.Component {
	@property(cc.Label)
	titleTxt: cc.Label = null;

	@property(cc.Label)
	moneyNum: cc.Label = null;

	@property(cc.Sprite)
	contnetImg: cc.Sprite = null;

	@property(cc.Label)
	detailTxt: cc.Label = null;

	@property(cc.Button)
	btKnow: cc.Button = null;

	@property(cc.Button)
	btQuit: cc.Button = null;

	@property(cc.Button)
	btAsset: cc.Button = null;

	@property(cc.Button)
	btQuit2: cc.Button = null;

	@property(cc.Label)
	remindLabel: cc.Label = null;

	@property(cc.Sprite)
	iconBuy: cc.Sprite = null;

	@property(cc.Sprite)
	iconAll: cc.Sprite = null;

	@property(cc.Node)
	headIcon: cc.Node = null;

	@property(cc.Node)
	headNode: cc.Node = null;

	@property(cc.SpriteFrame)
	defaultHead: cc.SpriteFrame = null;

	data: pb.common.RollMsg;
	isMy: boolean;
	playerInfo: pb.common.IPlayerInfo;

	onLoad() {}

	show() {
		this.node.active = true;
	}

	hide() {
		this.node.active = false;
	}

	clearData() {
		this.data = null;
		this.isMy = false;
		this.playerInfo = null;
	}

	setData(
		data: pb.common.RollMsg,
		playerInfo: pb.common.IPlayerInfo,
		isMy: boolean
	) {
		RemoteAudio.playEffect(SoundName.MARKET_INFO);
		this.clearData();
		let remoteImage = this.getComponent(RemoteImage);
		remoteImage
			.getImageForScenario(data.scenario.imgFile)
			.then((tex: cc.Texture2D) => {
				remoteImage.setImage(tex);
			});
		cardCtrl.cardNodes.push(this.node);
		let self: marketView = this;
		this.data = data;
		this.isMy = isMy;

		if (this.data.scenarioType == SCENARIO_TYPE.S_MARKET_CHANGE) {
			this.moneyNum.string = data.scenario.MC_Ratio + "%";
			if (data.scenario.MC_Type == 0) {
				// this.remindLabel.string = "总价"
			} else if (data.scenario.MC_Type == 1) {
				this.remindLabel.string = "租金上涨";
				this.moneyNum.node.color = cc.color(238, 176, 38, 1);
			} else if (data.scenario.MC_Type == 2) {
				this.remindLabel.string = "租金降低";
				this.moneyNum.node.color = cc.color(238, 72, 52, 1);
			} else if (data.scenario.MC_Type == 3) {
				this.remindLabel.string = "总价";
				this.moneyNum.node.color = cc.color(238, 72, 52, 1);
				this.moneyNum.string = "¥0";
			} else if (data.scenario.MC_Type == 4) {
				this.remindLabel.string = "月收入增长";
				this.moneyNum.node.color = cc.color(238, 176, 38, 1);
			} else if (data.scenario.MC_Type == 5) {
				this.remindLabel.string = "月收入下降";
				this.moneyNum.node.color = cc.color(238, 72, 52, 1);
			}

			this.btQuit.node.active = false;
			this.btQuit2.node.active = false;
			this.btAsset.node.active = false;
			if (this.isMy) {
				this.btKnow.node.active = true;
			} else {
				this.btKnow.node.active = false;
			}
			this.iconBuy.node.active = false;
			this.iconAll.node.active = data.scenario.MC_AffectAll;
			this.headNode.active = !data.scenario.MC_AffectAll;

			this.titleTxt.string = data.scenario.Name;
		} else if (this.data.scenarioType == SCENARIO_TYPE.S_MARKET_INFO) {
			this.titleTxt.string = data.scenario.Name;
			if (
				data.scenario.Code == "HOUSE" ||
				data.scenario.Code == "HOUSE:*" ||
				data.scenario.Code == "LAND" ||
				data.scenario.Code == "GOLD" ||
				StringUtils.searchString(data.scenario.Code, "CO:")
			) {
				if (data.scenario.Code == "HOUSE:12+") {
					this.remindLabel.string = "每套";
					this.moneyNum.string =
						"¥" + StringUtils.ConvertInt2(data.scenario.MI_UnitPrice);
				} else if (data.scenario.Code == "CO:PERF") {
					this.remindLabel.node.active = false;
					this.moneyNum.node.active = false;
				} else {
					this.remindLabel.string = "总价";
					this.moneyNum.string =
						"¥" + StringUtils.ConvertInt2(data.scenario.MI_TotalPrice);
				}
			} else if (data.scenario.Code == "EQUITY") {
				this.remindLabel.string = "收购价";
				this.moneyNum.string = data.scenario.MI_Multiple + "倍";
			} else if (data.scenario.Code == "GOLD:COIN") {
				this.remindLabel.string = "今日价格";
				this.moneyNum.string =
					"¥" + StringUtils.ConvertInt2(data.scenario.MI_TotalPrice);
			}

			this.moneyNum.node.color = cc.color(238, 176, 38, 1);
			if (this.isMy) {
				this.btKnow.node.active = false;
				if (data.roundData.canSellCnt == 0) {
					this.btQuit.node.active = true;
					this.btQuit2.node.active = false;
					this.btAsset.node.active = false;
				} else {
					this.btQuit.node.active = false;
					this.btQuit2.node.active = true;
					this.btAsset.node.active = true;
				}
			} else {
				this.btKnow.node.active = false;
				this.btQuit.node.active = false;
				if (data.roundData.canSellCnt == 0) {
					this.btQuit2.node.active = false;
					this.btAsset.node.active = false;
				} else {
					this.btQuit2.node.active = true;
					this.btAsset.node.active = true;
				}
			}
			this.headNode.active = false;
			this.iconBuy.node.active = true;
			this.iconAll.node.active = false;
			this.btAsset.node.getChildByName("txt").getComponent(cc.Label).string =
				"(" + data.roundData.canSellCnt + ")";
		}
		this.detailTxt.string = "" + data.scenario.Desc;

		this.remindLabel.node.parent.width =
			this.remindLabel.string.length * 22 + 12;

		// cc.loader.load(data.scenario.imgFile, function(err, texture) {
		// 	let spriteFrame = new cc.SpriteFrame(texture);
		// 	self.contnetImg.spriteFrame = spriteFrame;
		// });
		this.headIcon
			.getChildByName("headDefault")
			.getComponent(cc.Sprite).spriteFrame = this.defaultHead;
		let avatarContainer = this.headIcon.getComponent(AvatarContainer);
		avatarContainer.setAvatarImageFromUrl(playerInfo.avatar);

		this.addEvent();
	}

	addEvent() {
		this.btAsset.node.on("click", this.onBtAsset, this);
		this.btQuit.node.on("click", this.onBtQuit, this);
		this.btQuit2.node.on("click", this.onBtQuit, this);
		this.btKnow.node.on("click", this.onBtKnow, this);
	}

	onBtQuit() {
		this.hide();
		C2S.GiveUpChanceReq();
	}

	onBtAsset() {
		C2S.GetCanSellPlayerAssetReq();
	}

	onBtKnow() {
		C2S.ConfirmMarketChangeReq();
	}

	onDestroy() {
		this.clearData();
	}
}
