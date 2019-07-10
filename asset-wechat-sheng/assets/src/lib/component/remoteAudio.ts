import Config from "../../config";

const { ccclass, property } = cc._decorator;

export enum SoundName {
	CHILD = "child",
	SIGH = "叹气",
	SELL = "售出",
	HEARTBEAT = "心跳",
	JUMP = "跳动",
	DICE = "骰子",
	CASH_REGISTER = "收银台",
	AVATAR_COUNTDOWN = "人物头像倒计时",
	TASK_AWARD = "任务领取奖励",
	PROMOTION = "升职加薪",
	PROMOTION_FAILED = "升职失败",
	CARD_COLLAPSE_TO_AVATAR = "卡片收起到头像",
	CAN_SELL_ASSET_SELECTED = "可售资产勾选",
	MARKET_INFO = "市场讯息",
	GETTING_ORDER = "年龄翻页",
	BID_RAISE = "拍卖出价",
	BID_START = "拍卖开始",
	BID_SUCCESS = "拍卖成功",
	BID_FAILED = "拍卖流拍",
	MESSAGE_RECEIVED = "收到消息",
	BID_GIVE_UP = "放弃拍卖",
	ACCIDENT = "日常消费",
	GAME_TIMEOUT = "游戏超时",
	GAME_FREEDOM = "财富自由",
	LOAN_SUCCESS = "贷款成功",
	FIVE_MIN_LEFT = "时间剩余5分钟",
	PAYDAY = "月度结账日",
	BUTTON_CLICKED = "按钮点击声音",
	GAME_BGM = "游戏背景音乐",
	CHANCE = "获得投资机会",
	CHOOSE_CHANCE = "选择大小机会",
	NEED_LOAN_PROMPT = "需要贷款弹框",
	OTHER_ROLL = "轮到别人掷骰子",
	EXPERIENCE_GOLD_GAIN = "金币经验页增长"
}

@ccclass
export class RemoteAudio extends cc.Component {
	// LIFE-CYCLE CALLBACKS:

	// onLoad () {}

	private static getAudioFromCDN(name: string): Promise<cc.AudioClip> {
		let url = Config.getCDNUrl("public/sound/" + name + ".m4a");
		console.log("audio url", url);
		return new Promise((resolve, rejects) => {
			cc.loader.load(url, (err, clip) => {
				if (err !== null) {
					rejects(err);
					return;
				}
				resolve(clip);
			});
		});
	}

	public static getAudioByName(name: string): Promise<cc.AudioClip> {
		return this.getAudioFromCDN(name);
	}

	// 预载所有音频资源
	public static preloadAllAudios(): Promise<Iterable<cc.AudioClip>> {
		const sounds = [
			SoundName.CHILD,
			SoundName.SIGH,
			SoundName.SELL,
			SoundName.HEARTBEAT,
			SoundName.JUMP,
			SoundName.DICE,
			SoundName.CASH_REGISTER,
			SoundName.AVATAR_COUNTDOWN,
			SoundName.TASK_AWARD,
			SoundName.PROMOTION,
			SoundName.PROMOTION_FAILED,
			SoundName.CARD_COLLAPSE_TO_AVATAR,
			SoundName.CAN_SELL_ASSET_SELECTED,
			SoundName.MARKET_INFO,
			SoundName.GETTING_ORDER,
			SoundName.BID_RAISE,
			SoundName.BID_START,
			SoundName.BID_SUCCESS,
			SoundName.BID_FAILED,
			SoundName.MESSAGE_RECEIVED,
			SoundName.BID_GIVE_UP,
			SoundName.ACCIDENT,
			SoundName.GAME_TIMEOUT,
			SoundName.GAME_FREEDOM,
			SoundName.LOAN_SUCCESS,
			SoundName.FIVE_MIN_LEFT,
			SoundName.PAYDAY,
			SoundName.BUTTON_CLICKED,
			SoundName.GAME_BGM,
			SoundName.CHANCE,
			SoundName.CHOOSE_CHANCE,
			SoundName.NEED_LOAN_PROMPT,
			SoundName.OTHER_ROLL,
			SoundName.EXPERIENCE_GOLD_GAIN
		];
		let promises = [];
		for (let i = 0; i < sounds.length; i++) {
			promises.push(this.getAudioByName(sounds[i]));
		}
		return Promise.all(promises);
	}

	public static playEffect(name: string) {
		this.getAudioByName(name).then(clip => {
			cc.audioEngine.playEffect(clip, false);
		});
	}
	// update (dt) {}
}
