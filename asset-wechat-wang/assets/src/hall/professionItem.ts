const { ccclass, property } = cc._decorator;

@ccclass
export default class professionItem extends cc.Component {
	@property(cc.Sprite)
	headIcon: cc.Sprite = null;

	@property(cc.Label)
	namelabel: cc.Label = null;

	@property(cc.Label)
	incomelabel: cc.Label = null;

	@property(cc.Label)
	buylabel: cc.Label = null;

	@property(cc.Label)
	asslabel: cc.Label = null;

	@property(cc.Sprite)
	itemBg: cc.Sprite = null;

	@property([cc.SpriteFrame])
	assFrame: cc.SpriteFrame[] = [];

	data: any;
	onLoad() {}

	getData(data: any) {
		this.data = data;
		let self: professionItem = this;
		cc.loader.load(data.Avatar, function(err, texture) {
			let spriteFrame = new cc.SpriteFrame(texture);
			self.headIcon.spriteFrame = spriteFrame;
		});

		this.namelabel.string = data.Name;
		this.incomelabel.string = data.MonthSalary;
		this.buylabel.string = data.MonthExpense;
		this.asslabel.string = data.MonthFlow;

		if (this.data.purchased || this.data.Free) {
			this.node.opacity = 255;
		} else {
			this.node.opacity = 150;
			this.itemBg.node.active = false;
			this.node.getComponent(cc.Button).interactable = false;
		}
	}

	setItemFrame(isSelcet: boolean) {
		if (isSelcet) {
			this.itemBg.spriteFrame = this.assFrame[0];
		} else {
			this.itemBg.spriteFrame = this.assFrame[1];
		}
	}
}
