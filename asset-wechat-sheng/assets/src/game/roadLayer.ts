import { pb } from "../asset.pb";
import { SCENARIO_TYPE } from "./mapType";
import seatGroup from "./seatGroup";
import { GameEvent, EventType } from "../lib/GameEvent";
import roadItem from "./roadItem";
import UserData from "../data/userData";
import AvatarContainer from "../lib/component/avatarContainer";
import { RemoteAudio, SoundName } from "../lib/component/remoteAudio";
import Config from "../config";
var Long = require("long");

const { ccclass, property } = cc._decorator;

@ccclass
export default class roadLayer extends cc.Component {
	@property(cc.Node)
	roadContent: cc.Node = null;

	@property(cc.Node)
	roadLayer: cc.Node = null;

	@property(cc.Prefab)
	roadIten: cc.Prefab = null;

	@property([cc.Node])
	headNode: cc.Node[] = [];

	@property(cc.Sprite)
	startItem: cc.Sprite = null;

	@property([cc.SpriteFrame])
	startFrame: cc.SpriteFrame[] = [];

	@property([cc.SpriteFrame])
	itemLightFrame: cc.SpriteFrame[] = [];

	@property([cc.SpriteFrame])
	itemFrame: cc.SpriteFrame[] = [];

	roadNodeArr: cc.Sprite[] = [];
	counts: number = 0;
	isMy: boolean = false;
	frameIdx: number[] = [];
	seatid: number;
	onLoad() {}

	clearData() {
		this.roadNodeArr = [];
		this.counts = 0;
		this.isMy = false;
		this.frameIdx = [];
	}

	/**
	 * 创建路径
	 */
	createRoad(mapData: pb.common.IGameMap) {
		// let map = 12
		// if (Config.SOCKET_ADDRESS === "test.leapthinking.com") {
		// 	map = 20
		// }
		let map = 20;
		for (let j = 0; j < map; j++) {
			for (let i = 0; i < mapData.scenarios.length; i++) {
				let node = cc.instantiate(this.roadIten);
				if (mapData.scenarios[i].type == SCENARIO_TYPE.S_CHANCE) {
					node.getComponent(cc.Sprite).spriteFrame = this.itemFrame[0];
					this.frameIdx.push(0);
				} else if (
					mapData.scenarios[i].type == SCENARIO_TYPE.S_MARKET_INFO ||
					mapData.scenarios[i].type == SCENARIO_TYPE.S_MARKET_CHANGE
				) {
					node.getComponent(cc.Sprite).spriteFrame = this.itemFrame[1];
					this.frameIdx.push(1);
				} else if (mapData.scenarios[i].type == SCENARIO_TYPE.S_ACCIDENT) {
					node.getComponent(cc.Sprite).spriteFrame = this.itemFrame[2];
					this.frameIdx.push(2);
				} else if (mapData.scenarios[i].type == SCENARIO_TYPE.S_UNEMPLOYMENT) {
					node.getComponent(cc.Sprite).spriteFrame = this.itemFrame[3];
					this.frameIdx.push(3);
				} else if (mapData.scenarios[i].type == SCENARIO_TYPE.S_BABY) {
					node.getComponent(cc.Sprite).spriteFrame = this.itemFrame[4];
					this.frameIdx.push(4);
				} else if (mapData.scenarios[i].type == SCENARIO_TYPE.S_WAGE_HIKE) {
					node.getComponent(cc.Sprite).spriteFrame = this.itemFrame[5];
					this.frameIdx.push(5);
				}
				node.x = 0;
				node.getComponent(roadItem).setData(i + 1 + j * 24);
				let pos1 = 280 - 72;
				let pos2 = 250 - 70;
				node.y = i * pos1 + pos2 + j * (24 * pos1);
				this.roadContent.addChild(node);
				this.roadNodeArr.push(node.getComponent(cc.Sprite));
			}
		}
		// console.log(this.roadNodeArr, this.frameIdx, "this.frameIdx---------------------->")
	}

	/**
	 * 加载头像
	 */
	initHead() {
		let avatarContainer, avatarContainerMini;
		for (let i = 0; i < UserData.checkData.players.length; i++) {
			if (UserData.checkData.players[i].userId.equals(UserData.uid)) {
				avatarContainer = this.headNode[0]
					.getChildByName("headIcon")
					.getChildByName("avatarContainer")
					.getComponent(AvatarContainer);
				avatarContainerMini = this.headNode[0]
					.getChildByName("headIconO")
					.getChildByName("avatarContainer")
					.getComponent(AvatarContainer);
				if (UserData.avatarFrame) {
					avatarContainer.avatarSprite.spriteFrame = UserData.avatarFrame;
					avatarContainerMini.avatarSprite.spriteFrame = UserData.avatarFrame;
				} else {
					if (
						typeof UserData.checkData.players[i].avatar !== "undefined" &&
						UserData.checkData.players[i].avatar !== null &&
						UserData.checkData.players[i].avatar.length > 5
					) {
						UserData.avatarUrl = UserData.checkData.players[i].avatar;
						avatarContainer.setAvatarImageFromUrl(
							UserData.checkData.players[i].avatar
						);
						avatarContainerMini.setAvatarImageFromUrl(
							UserData.checkData.players[i].avatar
						);
					}
				}
			} else {
				avatarContainer = this.headNode[1]
					.getChildByName("headIcon")
					.getChildByName("avatarContainer")
					.getComponent(AvatarContainer);
				avatarContainer.setAvatarImageFromUrl(
					UserData.checkData.players[i].avatar
				);
				avatarContainerMini = this.headNode[1]
					.getChildByName("headIconO")
					.getChildByName("avatarContainer")
					.getComponent(AvatarContainer);
				avatarContainerMini.setAvatarImageFromUrl(
					UserData.checkData.players[i].avatar
				);
			}
		}
	}

	/**
	 * show路劲头像
	 */
	roadHead(isMy: boolean) {
		this.isMy = isMy;
		console.log(this.isMy, "roadLayerthis.isMy----------------------->");
		this.headNode[0].getChildByName("headIcon").active = this.isMy;
		this.headNode[0].getChildByName("headIconO").active = !this.isMy;
		this.headNode[1].getChildByName("headIcon").active = !this.isMy;
		this.headNode[1].getChildByName("headIconO").active = this.isMy;
	}

	/**
	 * 摇完播放路劲动画
	 */
	onShowItemMove(DiceNum: number, seatid: number) {
		console.log(DiceNum, seatid, "onShowItemMove----------------------->");
		let self = this;
		this.unscheduleAllCallbacks();
		this.node.stopAllActions();
		self.seatid = seatid;

		let numX = seatid ? 60 : -60;
		for (let i = 0; i < DiceNum; i++) {
			let aa = self.counts + i > 1 ? -200 : 0;
			let roadLightcallback = function() {
				if (self.counts + i == 0) {
					self.startItem.spriteFrame = self.startFrame[1];
					self.roadNodeArr[0].spriteFrame =
						self.itemLightFrame[self.frameIdx[0]];
				} else if (self.counts + i > 0) {
					self.roadNodeArr[self.counts + i].spriteFrame =
						self.itemLightFrame[self.frameIdx[self.counts + i]];
					self.roadNodeArr[self.counts + i - 1].spriteFrame =
						self.itemFrame[self.frameIdx[self.counts + i - 1]];
				}
				RemoteAudio.playEffect(SoundName.JUMP);
			};
			let roadLightTime;
			if (i > 0) {
				roadLightTime = i * 0.25 + 0.15;
			} else {
				roadLightTime = 0;
			}
			self.node.runAction(
				cc.sequence(
					cc.delayTime(roadLightTime),
					cc.callFunc(roadLightcallback)
					// cc.callFunc(() => {
					// 	RemoteAudio.playEffect(SoundName.JUMP);
					// })
				)
			);
			self.roadLayer.runAction(
				cc.sequence(cc.delayTime(i * 0.25), cc.moveBy(0.2, 0, aa))
			);
			self.headNode[seatid].runAction(
				cc.sequence(
					cc.delayTime(i * 0.25),
					cc.moveTo(0.25, numX, self.roadNodeArr[self.counts + i].node.y - 15)
				)
			);
			self.headNode[seatid].runAction(
				cc.sequence(
					cc.delayTime(i * 0.25),
					cc.scaleTo(0.25 / 3, 1.3, 1.3),
					cc.scaleTo(0.25 / 3, 0.9, 0.9),
					cc.scaleTo(0.25 / 3, 1, 1)
				)
			);
		}

		let moveEnd = function() {
			self.roadNodeArr[self.counts + DiceNum - 1].node.getComponent(
				cc.Sprite
			).spriteFrame = self.itemFrame[self.frameIdx[self.counts + DiceNum - 1]];
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.GAME_ROAD_MOVE_END)
			);
		};

		this.scheduleOnce(moveEnd, 0.25 * DiceNum);
		// this.node.runAction(cc.sequence(cc.delayTime(0.25 * DiceNum), cc.callFunc(moveEnd)))
	}

	/**
	 * 摇完播放路劲动画
	 */
	onShowItemStop() {
		this.node.stopAllActions();
		this.roadLayer.stopAllActions();
		this.headNode[this.seatid].stopAllActions();
		this.unscheduleAllCallbacks();
	}

	/**
	 * 设置当前路径以及当前人物位置
	 */
	setCurRoad(curRoadIdx: number) {
		this.counts = curRoadIdx;
		console.log(this.counts, "this.counts------------>");
		if (this.counts > 1) {
			this.roadLayer.setPosition(
				117,
				-this.roadNodeArr[this.counts].node.y + 150
			);
		} else {
			this.roadLayer.setPosition(117, -400);
		}
	}

	/**
	 * 设置不是当前位置
	 */
	setPlayerPosition(count: number, seatid: number) {
		if (count > 0) {
			let numX = seatid ? 60 : -60;
			this.headNode[seatid].setPosition(
				numX,
				this.roadNodeArr[count - 1].node.y - 15
			);
		}
	}

	onDestroy() {
		this.clearData();
		this.unscheduleAllCallbacks();
	}
}
