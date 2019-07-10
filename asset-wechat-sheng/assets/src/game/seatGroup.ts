import seat from "./seat";
import Config from "../config";

const { ccclass, property } = cc._decorator;

@ccclass
export default class seatGroup extends cc.Component {
	@property({
		type: [seat],
		tooltip: "所有玩家的座位"
	})
	playerSeats: seat[] = [];

	playerSeatNum = [0, 1, 2, 3];
	selfPosid: number = 0;
	private selfSeatId: number = 0;
	countTime = 0;
	timeCallBack = {
		"0": null,
		"1": null
	};
	onLoad() {}

	initAllSeat() {
		for (let i = 0; i < Config.GAME_PLAYER_NUM; i++) {
			this.playerSeats[i].hideAllToast();
		}
	}

	setSelfPosid(posid: number) {
		console.log("---------------------->setSelfPosid");
		this.selfPosid = posid;
	}

	setSeatSyncData(posid: number, data: any, isMe?: boolean) {
		// let seatId: number = isMe ? 0 : 1
		let seatId = this.PosidToseatid(posid);
		console.log(seatId, "seatId");
		this.playerSeats[seatId].setPlayerSyncData(data, isMe);
	}

	setSeatChckData(posid: number, data: any, isMe?: boolean) {
		let seatId = this.PosidToseatid(posid);
		this.playerSeats[seatId].setPlayerInfo(data);
	}

	setSeatToast(posid: number, data: any, isMe: boolean, isAuct?: boolean) {
		let seatId = this.PosidToseatid(posid);
		data.isSelf = posid == this.selfPosid;
		// if (isAuct) {
		// } else {
		this.playerSeats[seatId].hideAllToast();
		// }
		this.playerSeats[seatId].setToast(data, isMe);
	}

	hideAllToast() {
		for (let i = 0; i < Config.GAME_PLAYER_NUM; i++) {
			this.playerSeats[i].hideAllToast();
		}
	}

	hidefloorToast(posid: number) {
		let seatId = this.PosidToseatid(posid);
		this.playerSeats[seatId].hidefloorToast();
	}

	hideAuctionToast(posid: number) {
		let seatId = this.PosidToseatid(posid);
		this.playerSeats[seatId].hideAuctionToast();
	}

	hideOffLineToast(posid: number) {
		let seatId = this.PosidToseatid(posid);
		this.playerSeats[seatId].hideOffLineToast();
	}

	setRate(posid: number, rate: number, type: number) {
		let seatId = this.PosidToseatid(posid);
		this.playerSeats[seatId].setTimeRate(rate, type);
	}

	stopClock(posid: number) {
		let seatId = this.PosidToseatid(posid);
		this.playerSeats[seatId].stopClock();
		if (this.timeCallBack[posid.toString()]) {
			this.unschedule(this.timeCallBack[posid.toString()]);
		}
	}

	startClock(posid: number, countTime: number, type: number) {
		// this.unscheduleAllCallbacks();
		this.stopClock(posid);
		let curTime = countTime;
		let self: seatGroup = this;
		this.timeCallBack[posid.toString()] = function() {
			countTime = countTime - 0.05;
			this.setRate(posid, countTime / curTime, type);
			// console.log(countTime, "----------------->")
			if (countTime <= 0) {
				this.unschedule(self.timeCallBack[posid.toString()]);
				this.stopClock(posid);
				console.log("定时结束");
			}
		};
		this.schedule(self.timeCallBack[posid.toString()], 0.05);
	}

	stopAllClock() {
		for (let i = 0; i < Config.GAME_PLAYER_NUM; i++) {
			this.stopClock(i);
		}
	}

	hideAuctAll() {
		for (let i = 0; i < Config.GAME_PLAYER_NUM; i++) {
			this.playerSeats[i].hideAuctAll();
		}
	}

	/**
	 * PosidToseatid
	 */
	PosidToseatid(posid: number): number {
		let seatId: number;
		// console.log("this.selfPosid", this.selfPosid);
		if (posid > this.selfPosid) {
			// seatId = posid - this.selfPosid
			seatId = 1;
		} else if (posid < this.selfPosid) {
			// seatId = posid + (Config.GAME_PLAYER_NUM - this.selfPosid)
			seatId = 1;
		} else {
			seatId = this.selfSeatId;
		}
		return seatId;
	}

	clearData() {
		this.playerSeats = [];
		this.playerSeatNum = [0, 1, 2, 3];
		this.selfPosid = 0;
		this.selfSeatId = 0;
	}

	onDestroy() {
		this.clearData();
		this.unscheduleAllCallbacks();
	}
}
