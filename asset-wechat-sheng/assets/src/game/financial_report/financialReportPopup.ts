import Popup from "../../until/Popup";
import { GameEvent, EventType } from "../../lib/GameEvent";
import { pb } from "../../asset.pb";
import AssetItem from "../../component/financiall_report/assetItem";
import AvatarContainer from "../../lib/component/avatarContainer";
import UserData from "../../data/userData";
import C2S from "../../netWork/socket/C2S";
import GameSocket from "../../netWork/socket/GameSocket";
import { Message } from "../../lib/mars/mars";
import ServerLoading from "../../hall/ServerLoadingPopup";

const { ccclass, property } = cc._decorator;

const RMB_SYMBOL = "¥";

enum PanelId {
	ASSET = 1,
	INCOME = 2,
	CASH_FLOW = 3,
	SUMMARY = 4
}

enum TextType {
	INCOME = 1,
	EXPENSE = 2
}

enum AssetTabId {
	ASSET = 1,
	LIABILITY = 2
}

enum IncomeTabId {
	INCOME = 1,
	EXPENSE = 2,
	CASH_FLOW = 3
}

const sortKeyArr: Array<string> = [
	"工资",
	"理财",
	"货币",
	"股票",
	"房地产",
	"股权投资",
	"企业投资"
];

@ccclass
export default class financialReportPopup extends cc.Component {
	@property(cc.Node)
	titleBar: cc.Node = null;

	@property({
		type: cc.Button,
		tooltip: "返回按钮"
	})
	backButton: cc.Button = null;

	//
	// 弹层顶部 title 图片字体
	@property(cc.Node)
	popUpTitleImg: cc.Node = null;

	@property([cc.SpriteFrame])
	titleBg: cc.SpriteFrame[] = [];

	@property([cc.Node])
	panelTabNode: cc.Node[] = [];

	// asset 面板 tab
	@property([cc.SpriteFrame])
	assetPanelTabImg: cc.SpriteFrame[] = [];

	@property([cc.Button])
	assetPanelBtn: cc.Button[] = [];

	// income 面板 tab
	@property([cc.SpriteFrame])
	incomePanelTabImg: cc.SpriteFrame[] = [];

	@property([cc.Button])
	incomePanelTabBtn: cc.Button[] = [];

	// cashFlow 面板 tab
	@property([cc.SpriteFrame])
	cashFlowPanelTabBg: cc.SpriteFrame[] = [];

	// summary 面板 tab

	@property([cc.Button])
	summaryBtn: cc.Button[] = [];

	@property([cc.Node])
	panelNode: cc.Node[] = [];

	@property(cc.Prefab)
	assetItemPrefab: cc.Prefab = null;

	@property(cc.Node)
	avatarContainer: cc.Node = null;

	@property(cc.Node)
	nextPanelContent: cc.Node = null;

	@property(cc.Node)
	bannerNode: cc.Node = null;

	@property([cc.Label])
	titleLabel: cc.Label[] = [];

	currentPanel: PanelId = 0;
	assetPanelCurrentTab: AssetTabId = 1;
	incomePanelCurrentTab: IncomeTabId = 1;

	data?: pb.common.IAssetStatement;

	isOnLoad: boolean = false;
	summyTab: number = 0;
	onLoad() {
		// this.addEvent();
	}

	show() {
		this.node.active = true;
		console.log("GetStatementReq--------->", new Date().toLocaleString());
		var msg = new pb.common.GetStatementReq();
		msg.req = { userId: UserData.uid };

		let buffer = pb.common.GetStatementReq.encode(msg).finish();
		console.log("before send GetStatementReq");
		GameSocket.instance.wsConn
			.sendRequest(pb.common.CmdID.GET_STATEMENT, buffer)
			.then((msg: Message) => {
				let rsp = pb.common.GetStatementRsp.decode(msg.body);
				let res = { userData: null };
				res.userData = rsp;
				this.showFinancialReport(res);
				if (!this.isOnLoad) {
					this.bindEvent();
					this.isOnLoad = true;
				}
				console.log("GetStatementRsp--------->", new Date().toLocaleString());
				ServerLoading.hide();
			});
	}

	hide() {
		this.node.active = false;
		this.clearData();
		this.updateVisibility();
	}

	clearData() {
		this.currentPanel = 0;
		this.assetPanelCurrentTab = 1;
		this.incomePanelCurrentTab = 1;
		this.summyTab = 0;

		this.data = null;
	}

	updateSummaryLabel() {
		let data = this.data;

		this.summaryBtn[0].node
			.getChildByName("assetAmountLabel")
			.getComponent(cc.Label).string =
			RMB_SYMBOL + data.assetLiability.assetTotal.toString();
		this.summaryBtn[0].node
			.getChildByName("liabilityAmountLabel")
			.getComponent(cc.Label).string =
			RMB_SYMBOL + data.assetLiability.debtsTotal.toString();
		this.summaryBtn[1].node
			.getChildByName("incomeAmountLabel")
			.getComponent(cc.Label).string =
			RMB_SYMBOL + data.monthProfitLoss.income.toString();
		this.summaryBtn[1].node
			.getChildByName("expenseAmountLabel")
			.getComponent(cc.Label).string =
			RMB_SYMBOL + data.monthProfitLoss.expense.toString();
		this.summaryBtn[1].node
			.getChildByName("cashFlowAmountLabel")
			.getComponent(cc.Label).string =
			RMB_SYMBOL + data.monthProfitLoss.cashflow.toString();
		this.summaryBtn[2].node
			.getChildByName("cashAmountLabel")
			.getComponent(cc.Label).string =
			RMB_SYMBOL + data.cashFlow.total.toString();
	}

	addEvent() {
		GameEvent.event.on(
			EventType.SOCKET_GET_FINANCIAL_REPORTS,
			this.showFinancialReport,
			this
		);
		this.bindEvent();
	}

	bindEvent() {
		let self = this;
		for (let i = 0; i < this.summaryBtn.length; i++) {
			this.summaryBtn[i].node.on("click", () => {
				this.setCurrentPanel(1, i);
			});
		}
		this.backButton.node.on("click", () => {
			console.log(this.currentPanel, "this.currentPanel--------------------->");
			if (this.currentPanel !== 0) {
				this.setCurrentPanel(0);
			} else {
				this.hide();
			}
		});

		this.initTab();
	}

	setAssetPanelTab(id: AssetTabId) {
		// if (id === this.assetPanelCurrentTab) {
		// 	return;
		// }
		this.assetPanelCurrentTab = id;
		let frame: cc.SpriteFrame;
		let nodes: Array<cc.Node> = new Array();
		let topCategories: pb.common.ITopCategory[];
		let labelTitle: string;
		let labelTitle2: string[] = [];
		let labelValue: number | Long;
		let labelType: TextType;
		if (id === AssetTabId.ASSET) {
			labelTitle = "资产";
			labelTitle2 = ["类型", "资产名称", "总价"];
			labelValue = this.data.assetLiability.assetTotal;
			labelType = TextType.INCOME;
			topCategories = this.data.assetLiability.assets;
			frame = this.assetPanelTabImg[0];
		} else if (id === AssetTabId.LIABILITY) {
			labelTitle = "负债";
			labelTitle2 = ["类型", "负债名称", "金额"];
			labelValue = this.data.assetLiability.debtsTotal;
			labelType = TextType.EXPENSE;
			topCategories = this.data.assetLiability.debts;
			frame = this.assetPanelTabImg[1];
		}
		for (let i = 0; i < topCategories.length; i++) {
			for (let j = 0; j < topCategories[i].details.length; j++) {
				let node = this.newAssetItem(
					topCategories[i].details[j].category,
					topCategories[i].details[j].name,
					topCategories[i].details[j].value
				);
				nodes.push(node);
			}
		}
		this.nextPanelContent.removeAllChildren();
		this.populateContentNode(this.nextPanelContent, nodes);
		this.panelTabNode[this.summyTab].getComponent(
			cc.Sprite
		).spriteFrame = frame;
		this.updatePanelLabel(labelTitle2, labelTitle, labelValue, labelType);
	}

	setIncomePanelTab(id: IncomeTabId) {
		// if (id === this.incomePanelCurrentTab) {
		// 	return;
		// }
		this.incomePanelCurrentTab = id;
		let nodes: Array<cc.Node> = new Array();
		let topCategories: pb.common.ITopCategory[];
		let frame: cc.SpriteFrame;
		let labelTitle: string;
		let labelTitle2: string[] = ["类型", "", "金额/月"];
		let labelValue: number | Long;
		let labelType: TextType;
		if (id === IncomeTabId.INCOME) {
			labelTitle = "收入";
			labelValue = this.data.monthProfitLoss.income;
			labelType = TextType.INCOME;
			topCategories = this.data.monthProfitLoss.incomeTops;
			frame = this.incomePanelTabImg[0];
			labelTitle2[1] = "收入名称";
		} else if (id === IncomeTabId.EXPENSE) {
			labelTitle = "支出";
			labelValue = this.data.monthProfitLoss.expense;
			labelType = TextType.EXPENSE;
			topCategories = this.data.monthProfitLoss.expenseTops;
			frame = this.incomePanelTabImg[1];
			labelTitle2[1] = "支出名称";
		} else if (id === IncomeTabId.CASH_FLOW) {
			labelTitle = "现金流";
			labelValue = this.data.monthProfitLoss.cashflow;
			labelType = TextType.INCOME;
			topCategories = this.data.monthProfitLoss.cashflowTops;
			frame = this.incomePanelTabImg[2];
			labelTitle2[1] = "现金流名称";
		}
		for (let i = 0; i < topCategories.length; i++) {
			for (let j = 0; j < topCategories[i].details.length; j++) {
				let node = this.newAssetItem(
					topCategories[i].details[j].category,
					topCategories[i].details[j].name,
					topCategories[i].details[j].value
				);
				nodes.push(node);
			}
		}

		this.nextPanelContent.removeAllChildren();
		this.populateContentNode(this.nextPanelContent, nodes);
		this.panelTabNode[this.summyTab].getComponent(
			cc.Sprite
		).spriteFrame = frame;
		this.updatePanelLabel(labelTitle2, labelTitle, labelValue, labelType);
	}

	populateContentNode(contentNode: cc.Node, nodes: cc.Node[]) {
		for (let i = 0; i < nodes.length; i++) {
			contentNode.addChild(nodes[i]);
		}
	}

	setCashFlowPanelTab(id: number) {
		let cashFlow = this.data.cashFlow;
		let nodes: Array<cc.Node> = new Array();
		let frame: cc.SpriteFrame;
		let labelTitle: string;
		let labelTitle2: string[] = ["名称", "", "金额"];
		let labelValue: number | Long;
		let labelType: TextType;
		labelTitle = "现金";
		labelValue = cashFlow.total;
		labelType = TextType.INCOME;
		frame = this.cashFlowPanelTabBg[0];
		for (let i = 0; i < cashFlow.details.length; i++) {
			let node = this.newAssetItem(
				cashFlow.details[i].name,
				"",
				cashFlow.details[i].value
			);
			nodes.push(node);
		}

		this.nextPanelContent.removeAllChildren();
		this.populateContentNode(this.nextPanelContent, nodes);
		this.panelTabNode[this.summyTab].getComponent(
			cc.Sprite
		).spriteFrame = frame;
		this.updatePanelLabel(labelTitle2, labelTitle, labelValue, labelType);
	}

	setCurrentPanel(panel: PanelId, tabId?: number) {
		var imgTexture: cc.SpriteFrame;
		if (panel) {
			imgTexture = this.titleBg[tabId];
		} else {
			imgTexture = this.titleBg[3];
		}
		let sprite = this.popUpTitleImg.getComponent(cc.Sprite);
		sprite.spriteFrame = imgTexture;
		this.currentPanel = panel;
		this.summyTab = tabId;
		console.log(this.summyTab, "this.summyTab-------------->");
		this.updateVisibility();
		this.updatePanel();
	}

	showFinancialReport(event: any) {
		console.log("received showFinancialReport");
		this.data = event.userData.assetStatement;
		// this.data = TEST_FINANCIAL_DATA;;
		let data = this.data;
		let topsArr = [
			data.assetLiability.assets,
			data.assetLiability.debts,
			data.monthProfitLoss.incomeTops,
			data.monthProfitLoss.expenseTops,
			data.monthProfitLoss.cashflowTops
		];
		for (let i = 0; i < topsArr.length; i++) {
			this.sortAssetItemByIndex(topsArr[i], sortKeyArr);
		}
		this.updateSummaryLabel();
		ServerLoading.hide();
	}

	setHead() {
		let avatarContainer = this.avatarContainer.getComponent(AvatarContainer);
		if (UserData.avatarFrame) {
			avatarContainer.avatarSprite.spriteFrame = UserData.avatarFrame;
		} else {
			if (
				typeof UserData.avatarUrl !== "undefined" &&
				UserData.avatarUrl !== null &&
				UserData.avatarUrl.length > 5
			) {
				avatarContainer.setAvatarImageFromUrl(UserData.avatarUrl);
			}
		}
	}

	updateVisibility() {
		for (let i = 0; i < this.panelNode.length; i++) {
			this.panelNode[i].active = false;
		}
		this.panelNode[this.currentPanel].active = true;
	}

	updatePanel() {
		if (this.currentPanel) {
			for (let i = 0; i < this.panelTabNode.length; i++) {
				this.panelTabNode[i].active = false;
			}
			this.panelTabNode[this.summyTab].active = true;
			this.updatePanelTab();
		} else {
			return;
		}
	}

	initTab() {
		let assetpanelIdArr = [AssetTabId.ASSET, AssetTabId.LIABILITY];
		for (let j = 0; j < this.assetPanelBtn.length; j++) {
			this.assetPanelBtn[j].node.on("click", () => {
				console.log(
					"button clicked",
					assetpanelIdArr[j],
					", panelId:",
					assetpanelIdArr[j]
				);
				this.setAssetPanelTab(assetpanelIdArr[j]);
			});
		}

		let incomepanelIdArr = [
			IncomeTabId.INCOME,
			IncomeTabId.EXPENSE,
			IncomeTabId.CASH_FLOW
		];
		for (let k = 0; k < this.incomePanelTabBtn.length; k++) {
			this.incomePanelTabBtn[k].node.on("click", () => {
				console.log(
					"button clicked",
					incomepanelIdArr[k],
					", panelId:",
					incomepanelIdArr[k]
				);
				this.setIncomePanelTab(incomepanelIdArr[k]);
			});
		}
	}

	updatePanelTab() {
		if (this.summyTab == 0) {
			this.setAssetPanelTab(AssetTabId.ASSET);
		} else if (this.summyTab == 1) {
			this.setIncomePanelTab(IncomeTabId.INCOME);
		} else if (this.summyTab == 2) {
			this.setCashFlowPanelTab(1);
		}
	}

	updatePanelLabel(
		text2: string[],
		text: string,
		value: number | Long,
		type: TextType
	) {
		let kindLabel = this.bannerNode.getChildByName("kindLabel");
		let valueLabel = this.bannerNode.getChildByName("amountLabel");
		kindLabel.getComponent(cc.Label).string = text + "：";
		valueLabel.getComponent(cc.Label).string = RMB_SYMBOL + value.toString();
		let color: cc.Color;
		if (type === TextType.INCOME) {
			valueLabel.color = new cc.Color(238, 176, 38, 255);
		} else if (type === TextType.EXPENSE) {
			valueLabel.color = new cc.Color(238, 72, 52, 255);
		}
		for (let i = 0; i < this.titleLabel.length; i++) {
			this.titleLabel[i].getComponent(cc.Label).string = text2[i];
		}
	}

	newAssetItem(category: string, name: string, price: number | Long): cc.Node {
		let node = cc.instantiate(this.assetItemPrefab);
		let comp = node.getComponent(AssetItem);
		comp.setCategory(category);
		comp.setAssetName(name);
		comp.setPrice(price);
		return node;
	}
	// update (dt) {}

	private sortAssetItemByIndex(
		tops: pb.common.ITopCategory[],
		indexArr: Array<String>
	) {
		tops.sort(
			(
				first: pb.common.ITopCategory,
				second: pb.common.ITopCategory
			): number => {
				const MAX_IDX = sortKeyArr.length + 10;
				var firstIdx = indexArr.indexOf(first.category);
				var secondIdx = indexArr.indexOf(second.category);
				firstIdx = firstIdx === -1 ? MAX_IDX : firstIdx;
				secondIdx = secondIdx === -1 ? MAX_IDX : secondIdx;

				if (firstIdx < secondIdx) {
					return -1;
				} else if (secondIdx > firstIdx) {
					return 1;
				} else {
					return 0;
				}
			}
		);
	}

	onBtHide() {
		this.hide();
		this.nextPanelContent.removeAllChildren();
	}

	onDestroy() {
		this.node.destroy();
		GameEvent.event.off(
			EventType.SOCKET_GET_FINANCIAL_REPORTS,
			this.showFinancialReport,
			this
		);
	}
}
