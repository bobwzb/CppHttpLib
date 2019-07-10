
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
        buy_in_price: 0,
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
        this.buy_total_price.string = '¥0'
    },

    // 减100
    on_sub100: function () {
        var num = parseInt(this.show_lab.string)
        if (num <= 100) {
            this.show_lab.string = 0 + ''
            this.buy_total_price.string = '¥0'
            return
        }
        num -= 100
        this.show_lab.string = num + ''
        this.buy_total_price.string = '¥' + this.buy_in_price * num
    },

    // 加100
    on_add100: function () {
        var num = parseInt(this.show_lab.string)
        if (num >= (10000 - 100)) {
            this.show_lab.string = '10000'
            this.buy_total_price.string = '¥' + this.buy_in_price * 10000
            this.btns_splash.active = true
            // 可以走下一步
            this.guide_game_com.buy_goon(this.popup_num)
            return
        }
        num += 100
        this.show_lab.string = num + ''
        this.buy_total_price.string = '¥' + this.buy_in_price * num
    },

    // 加1000
    on_add1000: function () {
        var num = parseInt(this.show_lab.string)
        if (num >= (10000 - 1000)) {
            this.show_lab.string = '10000'
            this.buy_total_price.string = '¥' + this.buy_in_price * 10000
            this.btns_splash.active = true
            // 可以走下一步
            this.guide_game_com.buy_goon(this.popup_num)
            return
        }
        num += 1000
        this.show_lab.string = num + ''
        this.buy_total_price.string = '¥' + this.buy_in_price * num
    },

    // 加5000
    on_add5000: function () {
        var num = parseInt(this.show_lab.string)
        if (num >= (10000 - 5000)) {
            this.show_lab.string = '10000'
            this.buy_total_price.string = '¥' + this.buy_in_price * 10000
            this.btns_splash.active = true
            // 可以走下一步
            this.guide_game_com.buy_goon(this.popup_num)
            return
        }
        num += 5000
        this.show_lab.string = num + ''
        this.buy_total_price.string = '¥' + this.buy_in_price * num
    },

    // 加10000
    on_add10000: function () {
        this.show_lab.string = '10000'
        this.buy_total_price.string = '¥' + this.buy_in_price * 10000
        this.btns_splash.active = true
        // 可以走下一步
        this.guide_game_com.buy_goon(this.popup_num)
    },

    // update (dt) {},
});
