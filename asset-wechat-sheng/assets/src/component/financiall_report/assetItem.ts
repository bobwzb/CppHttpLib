const { ccclass, property } = cc._decorator;

@ccclass
export default class AssetItem extends cc.Component {
	@property(cc.Label)
	categoryLabel?: cc.Label = null;

	@property(cc.Label)
	nameLabel?: cc.Label = null;

	@property(cc.Label)
	priceLabel?: cc.Label = null;

	category: string = "";

	assetName: string = "";

	price: number | Long = 0;

	setCategory(category: string) {
		this.category = category;
		this.categoryLabel.string = category;
	}

	setAssetName(name: string) {
		this.assetName = name;
		this.nameLabel.string = name;
	}

	setPrice(value: number | Long) {
		this.price = value;
		this.priceLabel.string = "¥" + value.toString();
	}

	// LIFE-CYCLE CALLBACKS:

	// onLoad () {}

	start() {}

	// update (dt) {}
}
