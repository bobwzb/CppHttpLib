const { ccclass, property } = cc._decorator;

@ccclass
export default class roadItem extends cc.Component {
	@property(cc.Node)
	year: cc.Node = null;

	onLoad() {}

	setData(data) {
		if (data % 4) {
			this.year.active = false;
		} else {
			this.year.active = true;
			this.year.getChildByName("txt").getComponent(cc.Label).string =
				2019 + data / 4 + "年";
		}
	}
}
