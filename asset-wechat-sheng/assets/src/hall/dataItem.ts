import StringUtils from "../until/StringUtils";
import WxHttpControl from "../netWork/http/WxHttpControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class dataItem extends cc.Component {
	@property(cc.Label)
	wealthTxt: cc.Label = null;

	@property(cc.Label)
	assetsTxt: cc.Label = null;

	@property(cc.Label)
	liabilitiesTxt: cc.Label = null;

	@property(cc.Label)
	moneyTxt: cc.Label = null;

	@property(cc.Label)
	txtData: cc.Label = null;

	@property(cc.Sprite)
	iconData: cc.Sprite = null;

	@property(cc.Sprite)
	iconOccupation: cc.Sprite = null;

	@property([cc.SpriteFrame])
	dataFrame: cc.SpriteFrame[] = [];

	@property(cc.Label)
	txtOccupation: cc.Label = null;

	@property(cc.Label)
	timeLabel: cc.Label = null;

	data: any;
	onLoad() {}

	getData(data: any) {
		this.data = data;

		if (this.data.win) {
			this.wealthTxt.node.color = cc.color(255, 161, 30, 1);
		} else {
			this.wealthTxt.node.color = cc.color(51, 51, 51, 1);
		}

		this.wealthTxt.string = this.data.freedom_degree + "%";
		this.assetsTxt.string = "¥" + StringUtils.ConvertInt2(this.data.assets);
		this.liabilitiesTxt.string =
			"¥" + StringUtils.ConvertInt2(this.data.liability);
		this.moneyTxt.string = "¥" + StringUtils.ConvertInt2(this.data.cash);
		this.txtOccupation.string = this.data.role_name;

		let date = new Date(this.data.ended_at);
		var year = date.getFullYear(); //年
		var month = date.getMonth(); //月
		var day = date.getDate(); //日
		var hours = date.getHours(); //时
		var min = date.getMinutes(); //分
		var second = date.getSeconds(); //秒
		this.timeLabel.string = month + "-" + day + " " + hours + ":" + min;

		let self: any = this;
		cc.loader.load(this.data.role_avatar, function(err, texture) {
			let spriteFrame = new cc.SpriteFrame(texture);
			self.iconOccupation.spriteFrame = spriteFrame;
		});

		if (this.data.win) {
			this.txtData.string = "财富自由";
			this.iconData.spriteFrame = this.dataFrame[0];
		} else if (this.data.broke) {
			this.txtData.string = "破产";
			this.iconData.spriteFrame = this.dataFrame[2];
		} else if (this.data.game_timeout) {
			this.txtData.string = "时间结束";
			this.iconData.spriteFrame = this.dataFrame[3];
		} else {
			this.txtData.string = "游戏结束";
			this.iconData.spriteFrame = this.dataFrame[1];
		}

		this.node.on("click", this.setResultData, this);
	}

	setResultData() {
		WxHttpControl.getGameResultPage(this.data.id);
	}
}
