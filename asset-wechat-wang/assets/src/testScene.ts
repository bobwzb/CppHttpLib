import Tips from "./until/Tips";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
	onLoad() {
		wx.showKeyboard({
			defaultValu: "0",
			maxLength: 20,
			multiple: false,
			confirmHold: true,
			confirmType: "done",

			success(res) {
				Tips.show("微信小游戏键盘调用成功");
			}
		});
	}
}
