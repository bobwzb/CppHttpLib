
var guide_game = require('guide_game')

cc.Class({
    extends: cc.Component,

    properties: {
        popup_num: 0, // 弹框的序号
        show_lab: {
            type: cc.Label,
            default: null,
            tooltip: '中间文字值'
        },
        price: 0,
        buy_total_price: {
            type: cc.Label,
            default: null,
            tooltip: '购买总价'
        },
        btns_splash: {
            type: cc.Node,
            default: null,
            tooltip: '按钮遮罩'
        },
        guide_game_com: {
            type: guide_game,
            default: null,
            tooltip: 'guide_game组件'
        }

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.show_lab.string = 0
        this.buy_total_price.string = '¥0万'
    },

    // 减100
    on_sub100: function () {
        this.show_lab.string = 0 + ''
        this.buy_total_price.string = '¥0万'
    },

    // 加100
    on_add100: function () {
        this.show_lab.string = '10000'
        this.buy_total_price.string = '¥' + this.price + '万'
        this.btns_splash.active = true
        this.guide_game_com.sell_goon(this.popup_num)
    },

    // 加10%
    on_add10p: function () {
        this.show_lab.string = '1000'
        this.buy_total_price.string = '¥' + this.price / 10 + '万'
    },

    // 加50%
    on_add50p: function () {
        this.show_lab.string = '5000'
        this.buy_total_price.string = '¥' + this.price / 2 + '万'
    },

    // 加100%
    on_add100p: function () {
        this.show_lab.string = '10000'
        this.buy_total_price.string = '¥' + this.price + '万'
        this.btns_splash.active = true
        this.guide_game_com.sell_goon(this.popup_num)
    },

    // 勾选
    on_toggle: function () {
        // this.show_lab.string = '10000'
        this.buy_total_price.string = '¥' + this.price
        this.btns_splash.active = true
        this.guide_game_com.sell_goon(this.popup_num)
    }

    // update (dt) {},
});
