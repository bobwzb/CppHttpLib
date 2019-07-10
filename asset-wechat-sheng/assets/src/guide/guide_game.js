var {RemoteAudio, SoundName} = require('remoteAudio');

var guide_game = cc.Class({
    extends: cc.Component,

    properties: {
        is_video: true, // 是否需要播放新手指导
        guide_node: {
            type: cc.Node,
            default: null,
            tooltip: '指导总节点'
        },
        mouse: {
            type: cc.Node,
            default: null,
            tooltip: '指导手指'
        },
        bank: {
            type: cc.Node,
            default: null,
            tooltip: '指导牌'
        },
        bank_common: {
            type: cc.SpriteFrame,
            default: null,
            tooltip: '指导牌正常框'
        },
        bank_big: {
            type: cc.SpriteFrame,
            default: null,
            tooltip: '指导牌加大框'
        },
        time_node: {
            type: cc.Node,
            default: null,
            tooltip: '时钟节点'
        },

        // 个人资料 ===============================================
        cash: {
            type: cc.Label,
            default: null,
            tooltip: '现金'
        },
        free_progress: {
            type: cc.ProgressBar,
            default: null,
            tooltip: '财富bar' 
        },
        free_txt: {
            type: cc.Label,
            default: null,
            tooltip: '财富txt'  
        },
        invest_get: {
            type: cc.Label,
            default: null,
            tooltip: '投资收益'  
        },
        pay_out: {
            type: cc.Label,
            default: null,
            tooltip: '支出'  
        },
        cash_flow: {
            type: cc.Label,
            default: null,
            tooltip: '月现金流' 
        },
        // 个人资料end ===============================================

        profit_node: {
            type:　cc.Node,
            default: null,
            tooltip: '收益_利益板'
        },
        profit_action_node: {
            type:　cc.Node,
            default: null,
            tooltip: '收益_金币节点'
        },
        year_account_node: {
            type: cc.Node,
            default: null,
            tooltip: '年度结账节点'  
        },
        Asset_facebook: {
            type: cc.Node,
            default: null,
            tooltip: '拥有的理财产品--facebook'
        },
        Asset_APP: {
            type: cc.Node,
            default: null,
            tooltip: '拥有的理财产品--APP'
        },
        Asset_teaClub: {
            type: cc.Node,
            default: null,
            tooltip: '拥有的理财产品--teaClub'
        },
        Asset_xicheng: {
            type: cc.Node,
            default: null,
            tooltip: '拥有的理财产品--xicheng'
        },
        Asset_mall: {
            type: cc.Node,
            default: null,
            tooltip: '拥有的理财产品--mall'
        },
        wu_node: {
            type: cc.Node,
            default: [],
            tooltip: '无字'
        },
        saizi_splash: {
            type: cc.Node,
            default: null,
            tooltip: '色子遮罩'  
        },
        saizi_frames: {
            type: cc.SpriteFrame,
            default: [],
            tooltip: '色子图集'
        },
        saizi: {
            type: cc.Node,
            default: null,
            tooltip: '色子'
        },
        upwork_saizi_node: {
            type: cc.Node,
            default: null,
            tooltip: '加薪色子'
        },
        myNode: {
            type: cc.Node,
            default: null,
            tooltip: '我的棋子'
        },
        load_node: {
            type: cc.Node,
            default: null,
            tooltip: '路总节点'
        },
        popup_total: {
            type: cc.Node,
            default: null,
            tooltip: '弹框总节点'
        },
        /**
         * popup_nodes
         * 0 投资大小框 => facebook
         * 1 FACEBOOK 10元股框
         * 2 购买成功页面
         * 3 可售资产
         * 
         * 4 升值加薪卡片
         * 5 恭喜升值加薪
         * 
         * 6 购买页面 => facebook
         * 7 投资大小框 => 社交APP
         * 
         * 8 购买页面 => app
         * 9 APP购买成功页面
         * 
         * 10 投资大小框 => 奶茶店
         * 11 奶茶店
         * 12 购买页面 => 奶茶店
         * 
         * 13 市场讯息 => 卖出奶茶店
         * 14 可售资产 => 奶茶店
         * 
         * 15 投资大小框 => 西城上筑
         * 16 西城上住
         * 17 购买页面 => 西城上筑
         * 
         * 18 市场讯息 => 卖出社交APP
         * 19 可售资产 => 社交APP
         * 
         * 20 日常消费 => 度假
         * 21 购买页面 => 支付度假
         * 
         * 22 市场讯息 => 卖出西城上筑
         * 23 可售资产 => 西城上筑
         * 
         * 24 投资大小 => 商场
         * 25 商场框
         * 26 金币不足提示
         * 27 贷款
         * 28 财富自由
         */
        popup_nodes: {
            type: cc.Node,
            default: [],
            tooltip: '弹框节点'
        },
        facebook_sellout_prefab: {
            type: cc.Prefab,
            default: null,
            tooltip: 'facebook售出预制体'
        },
        splash_all: {
            type: cc.Node,
            default: null,
            tooltip: '全局遮罩'
        }  
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init()

        cc.director.preloadScene("guide_result_coin", function() {
            
        })
    },

    start () {
        // for (var i in this.popup_total.children) {
        //     this.popup_nodes.push(this.popup_total.children[i])
        // }
    },

    init () {
        // 时钟标志key
        this.time_show = true

        // 初始第一步标志为1
        this.step = 1

        // 第一步操作
        this.opt = true

        // 加薪骰的机会 true可点击，false点击了
        this.upwork_saizi = true

        // 色子遮罩
        if (this.is_video == true) {
            this.saizi_splash.active = true // 骰子背景
            this.guide_node.active = true // 指导总节点
            this.mouse.setPosition(182, 75)
            this.bank.setPosition(103, -200)
        } else {
            this.guide_node.active = false
            this.saizi_splash.active = false
        }
    },

    // 时钟移动
    on_time_node_action: function (key) {
        var t_action
        if (this.time_show == true) {
            t_action = cc.moveTo(0.6, cc.v2(-176, 619))
            this.time_show = false
        } else {
            t_action = cc.moveTo(0.6, cc.v2(-244, 619))
            this.time_show = true
        }
        this.time_node.runAction(t_action)
    },

    on_click_saizi: function () {
        if (this.opt == true) {
            this.guide_node.active = false
            this.saizi_splash.active = false
            this.opt = false
        }

        this.on_saizi_tip(false)
        this.splash_all.active = true // 全局遮罩打开
        // this.on_new_player_close() // 新手去掉

        // 年度结账
        this.scheduleOnce(function () {
            switch (this.step) {
                case 3:
                    this.year_account_node.getComponent('year_account').on_node_ctrl('¥59040')
                    break
                case 4:
                    this.year_account_node.getComponent('year_account').on_node_ctrl('¥82656')
                    break
                case 5:
                    this.year_account_node.getComponent('year_account').on_node_ctrl('¥82656')
                    break
                case 7:
                    this.year_account_node.getComponent('year_account').on_node_ctrl('¥82656')
                    break
                case 8:
                    this.year_account_node.getComponent('year_account').on_node_ctrl('¥34656')
                    break
                case 11:
                    this.year_account_node.getComponent('year_account').on_node_ctrl('¥82656')
                    break
                default:
                    break
            }
        }.bind(this), 4)     

        var index // 色子该摇点数
        switch (this.step) { // 第几步
            case 1:
                index = 2
                break
            case 2:
                index = 1
                break
            case 3:
                index = 3
                break
            case 4:
                index = 2
                break
            case 5:
                index = 4
                break
            case 6:
                index = 3
                break
            case 7:
                index = 2
                break
            case 8:
                index = 5
                break
            case 9:
                index = 2
                break
            case 10:
                index = 1
                break   
            case 11:
                index = 3
                break
            default:
                console.log('==== game_guide 超过有效步骤 return')
                return
        }
        // 色子, 棋子, 路移动
        this.on_move_ctrl(index)
        // 弹框
        this.scheduleOnce(function () {
            this.on_popup_ctrl()
        }.bind(this), 2.1 + 0.3 * index) // 2 给骰子播放动画 0.3是棋子和路的
    },

    // 色子, 棋子, 路移动
    on_move_ctrl: function (index) {
        if (this.step == 1) { // 第一步 第二步 路没动
            this.on_saizi_run(index)
            this.scheduleOnce(function () {
                this.on_mynode_move_jump(index) // 棋子移动
                // 年度结账
                this.year_account_node.getComponent('year_account').on_node_ctrl('¥0')
            }.bind(this), 2)
        } else { // 不是第一第二步色子, 棋子, 路都移动
            this.on_saizi_run(index)
            this.scheduleOnce(function () {
                this.on_mynode_jump(index) // 棋子跳
                this.on_load_move(index)
            }.bind(this), 2)
        }

    },

    // 棋子, 路移动后下一轮
    on_next_round_flash: function () {
        // 计算玩家个人数据
        this.on_person_info_ctrl(this.step)

        this.step ++
        this.saizi.active = true

        this.on_saizi_tip(true)

        // this.scheduleOnce(function () {
        //     // 每一步骰子指导
        //     if (this.is_video == true) {
        //         this.saizi_splash.active = true // 骰子背景
        //         this.guide_node.active = true // 指导总节点
        //         this.mouse.setPosition(182, 75)
        //         this.bank.setPosition(103, -200)
        //         this.bank.getChildByName('label').getComponent('cc.Label').string = '投掷这枚骰子前进'
        //     }
        // }.bind(this), 1)
        
    },

    // 骰子动画
    on_saizi_run: function (index) { // index最后点数
        // index--
        // index = 2 + ''

        // sound
        RemoteAudio.playEffect(SoundName.DICE);

        this.saizi.getComponent(cc.Animation).play('dic')
        this.scheduleOnce(function () {
            this.saizi.getComponent(cc.Animation).stop('dic')
            console.log(index)
            this.saizi.getComponent(cc.Sprite).spriteFrame = this.saizi_frames[index - 1]
        }.bind(this), 1)

        this.scheduleOnce(function () {
            this.saizi.getComponent(cc.Sprite).spriteFrame = this.saizi_frames[0]
            this.saizi.active = false
            this.splash_all.active = false // 全局遮罩关闭
        }.bind(this), 2)
    },

    // 加薪骰子
    on_saizi_upwork: function (index) { // index最后点数
        this.guide_node.active = false
        this.splash_all.active = true // 全局遮罩打开

        // sound
        RemoteAudio.playEffect(SoundName.DICE);

        if (this.upwork_saizi == true) {
            index = 6
            this.upwork_saizi_node.getComponent(cc.Animation).play('dic')
            this.scheduleOnce(function () {
                this.upwork_saizi_node.getComponent(cc.Animation).stop('dic')
                this.upwork_saizi_node.getComponent(cc.Sprite).spriteFrame = this.saizi_frames[index - 1]

                this.on_step3_2() // 弹出恭喜升职加薪 1秒后
                this.upwork_saizi = false // 加薪骰的机会 true可点击，false点击了
            }.bind(this), 1)
        } else {
            console.log('你已经点过加薪骰子了, 不能再点了哦! O(∩_∩)O')
            return
        }
        
    },
    
    // // 停止骰子
    // stop: function () {
    //     this.saizi.getComponent(cc.Animation).stop('dic')
    // },

    // myNode 我的棋子移动
    on_mynode_move_jump: function (index) { // index 跳的格子数(1~6)
        // index = 2
        // sound
        var audio = cc.callFunc(function () {
            RemoteAudio.playEffect(SoundName.JUMP);
        }, this)

        var m_action = cc.sequence([ audio, cc.moveBy(0.15, cc.v2(0, 285)), cc.moveBy(0.15, cc.v2(0, -40)) ])
        var move_action = cc.repeat(m_action, index)
        this.myNode.runAction(move_action)
    },

    // myNode 我的棋子跳动
    on_mynode_jump: function (index) { // 跳几次
        // sound
        var audio = cc.callFunc(function () {
            RemoteAudio.playEffect(SoundName.JUMP);
        }, this)

        // var d_time = cc.delayTime(0.1)
        var j_action = cc.sequence([ audio, cc.moveBy(0.15, cc.v2(0, 40)), cc.moveBy(0.15, cc.v2(0, -40))])
        var jump_action = cc.repeat(j_action, index)
        this.myNode.runAction(jump_action)
    },

    // 路移动
    on_load_move: function (index) { // index路向下移动几个
        // index = 2

        // 分几步
        // var l_action = cc.moveBy(0.4, cc.v2(0, -210))
        // var d_time = cc.delayTime(0.1)
        // var move_action = cc.sequence([ l_action, d_time ])
        // var load_action = cc.repeat(move_action, index)
        // this.load_node.runAction(load_action)

        // 一大步
        var num = index * -210
        var time = 0.3 * index
        console.log('OOOOOOOOOOOOOO', time)
        var l_action = cc.moveBy(time, cc.v2(0, num))
        this.load_node.runAction(l_action)

        // this.load_node.stopAllActions()
    },

    // 点骰子指导 true出现提示 false 关掉提示
    on_saizi_tip: function (key) {
        if (key == true) {
            this.guide_node.active = true // 指导总节点
            this.mouse.setPosition(182, 75)
            this.bank.setPosition(103, -200)
            this.bank.getChildByName('label').getComponent('cc.Label').string = '投掷这枚骰子继续前进'
        } else {
            this.guide_node.active = false // 指导总结点
            this.saizi_splash.active = false // 骰子遮罩
        }
    },

    // 弹框管理
    on_popup_ctrl: function () {
        console.log('gg', this.step) // william this.step 会跳过了3
        switch (this.step) { // this.step第几步 1~11
            case 1: this.on_step1()
                break
            case 2: this.on_step2_0()
                break
            case 3: this.on_step3()
                break
            case 4: this.on_step4()
                break
            case 5: this.on_step5()
                break
            case 6: this.on_step6()
                break
            case 7: this.on_step7()
                break
            case 8: this.on_step8()
                break
            case 9: this.on_step9()
                break
            case 10: this.on_step10()
                break
            case 11: this.on_step11()
                break
            default: console.log(' ==== guide_game 弹框管理步骤超出有效范围')
                return
        }
    },

    // 买10000万判断
    buy_goon: function (index) { // index 是 int
        switch (index) {
            case 1: // 买facebook
                this.on_step1_2()
                break
            default:
                console.log('买10000资产时候的步骤key不对呢O(∩_∩)O')
                break
        }
    },

    // 出售100% 判断
    sell_goon: function (index) {
        switch (index) {
            case 2: // 卖10000股facebook
                this.on_step2_1()
                break
            case 6: // 卖100%奶茶店
                this.on_step6_2()
                break
            case 8: // 卖100%APP
                this.on_step8_2()
                break
            case 10: // 卖100%卖西城
                this.on_step10_2()
                break
            default:
                console.log('卖出100%资产时候的步骤key不对呢O(∩_∩)O')
                break
        }
    }, // index 是 int

    // 新手指导(可选)
    on_new_player_video: function (inf, str) { // 次号
        if (this.is_video == true) {
            this.guide_node.active = true
            
            // if (inf == '1_1_1' || inf == '2' || inf == '6_1' || inf == '8_1' || inf == '10_1') {
            if (inf == '1_1_1' || inf == '2') {
                this.mouse.active = false
            } else {
                this.mouse.active = true
            }

            switch (inf) {
                // case 0: // 点骰子
                //     this.mouse.setPosition(68, 218)
                //     this.bank.setPosition(103, -63)

                // ======================= 《第一步》 买facebook
                case '1': // 选大小 选小
                    this.mouse.setPosition(68, 218)
                    this.bank.setPosition(103, -63)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '起步资金比较少,\n适合小额投资'
                    break
                case '1_1': // facebook框
                    this.mouse.setPosition(80, -240)
                    this.bank.setPosition(107, -422)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '股票最低价，适合抄底'
                    break
                case '1_1_0': // facebook资产
                    this.mouse.setPosition(3, -255)
                    this.bank.setPosition(107, -422)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '购买资产'
                    break

                case '1_1_1': // 购买页面
                    this.mouse.setPosition(280, -30)
                    this.bank.setPosition(115, -298)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '选择10000股票购买'
                    break
                case '1_2': // 购买页面准备点付款
                    this.mouse.setPosition(230, -250)
                    this.bank.setPosition(107, -430)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '这里点击付款'
                    break
                case '1_3': // 点付款后 准备确定支付
                    this.mouse.setPosition(230, -250)
                    // this.bank.setPosition(107, -430)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '这里点确定支付'
                    break
                case '1_4': // 确定支付后不指导
                    this.guide_node.active = false
                    break

                // ======================= 《第二步》 出售facebook
                case '2_0': // 大小提示框显示
                    this.mouse.setPosition(68, 218)
                    this.bank.setPosition(103, -63)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '小额投资可以帮你度过\n前期的财富积累阶段'
                    break

                case '2_0_1': // 大小提示框显示
                    // this.mouse.setPosition(3, -255)
                    this.mouse.setPosition(160, -250)
                    this.bank.setPosition(107, -422)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '美滋滋\n股票最高点，立刻卖出'
                    break

                case '2': // 可售资产框指导 选出售的股数
                    this.mouse.setPosition(280, -150)
                    this.bank.setPosition(115, -310)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '选择10000出售股票'
                    break
                case '2_1': // 可售资产框指导 点确定出售
                    this.mouse.setPosition(230, -250)
                    this.bank.setPosition(115, -430)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '这里点确定出售'
                    break
                case '2_2': // 可售资产框指导 点确定出售
                    this.profit_action_node.active = true
                    this.profit_node.getChildByName('txt').getComponent('cc.Label').string = '售出升维科技,收益:'
                    this.profit_node.getChildByName('num').getComponent('cc.Label').string = '¥100万'
                    this.guide_node.active = false
                    break

                // ======================= 《第三步》 升职加薪
                case '3': // 升职加薪卡片
                    this.mouse.setPosition(160, -20)
                    this.bank.setPosition(115, -265)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '再次点击骰子\n点数大于3可以加薪喔'
                    break
                case '3_2': // 升职加薪卡片
                    this.guide_node.active = false
                    break

                // ======================= 《第四步》 买APP
                case '4': // 选大小 选小
                    this.mouse.setPosition(68, 218)
                    this.bank.setPosition(103, -63)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '小额投资可以帮你度过\n前期的财富积累阶段'
                    break
                case '4_1': // 购买页
                    this.mouse.setPosition(75, -250)
                    this.bank.setPosition(107, -422)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '虽然无现金流收益，\n但总价不高，可以买入'
                    break
                case '4_2': // 确定支付
                    this.mouse.setPosition(230, -250)
                    // this.bank.setPosition(110, -410)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '这里点确定支付'
                    break
                case '4_3': // 点完确定支付之后不操作
                    this.guide_node.active = false
                    break

                // ======================= 《第五步》 买奶茶店
                case '5': // 选大小 选大
                    this.mouse.setPosition(280, 218)
                    this.bank.setPosition(103, -63)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '恭喜你已经赚到一百万\n是时候尝试大额投资了'
                    break
                case '5_1': // 购买页
                    this.mouse.setPosition(80, -240)
                    this.bank.setPosition(107, -422)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '属于股权投资，也有\n稳定现金流，适合买入'
                    break
                case '5_2': // 确定支付
                    this.mouse.setPosition(230, -250)
                    // this.bank.setPosition(110, -410)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '这里点确定支付'
                    break
                case '5_3': // 点完确定支付之后不操作
                    this.guide_node.active = false
                    break

                // ======================= 《第六步》 卖奶茶店
                case '6': // 卖出奶茶店
                    // this.mouse.setPosition(160, -250)
                    this.mouse.setPosition(80, -240)
                    this.bank.setPosition(120, -410)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '10倍！赚翻了'
                    break
                case '6_1': // 选择出售的数量
                    this.mouse.setPosition(325, 285)
                    this.bank.setPosition(115, -330)
                    // this.bank.getChildByName('label').getComponent('cc.Label').string = '选择100%的数量出售'
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '勾选要售出的资产'
                    break
                case '6_2': // 确定出售
                    this.mouse.setPosition(210, -280)
                    this.bank.setPosition(115, -430)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '这里点确定出售'
                    break
                case '6_3': // 点完确定支付之后不操作
                    this.profit_action_node.active = true
                    this.profit_node.getChildByName('txt').getComponent('cc.Label').string = '售出奶茶店,收益:'
                    this.profit_node.getChildByName('num').getComponent('cc.Label').string = '¥300万'
                    this.guide_node.active = false
                    break

                // ======================= 《第七步》 买西城上筑
                case '7': // 选大小 选大
                    this.mouse.setPosition(280, 218)
                    this.bank.setPosition(103, -63)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '大额投资可以帮助你买入\n更多现金流或获利空间的资产'
                    break
                case '7_1': // 购买页
                    this.mouse.setPosition(80, -240)
                    this.bank.setPosition(107, -422)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '不错的房产，值得买入'
                    break
                case '7_2': // 确定支付
                    this.mouse.setPosition(230, -250)
                    // this.bank.setPosition(110, -410)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '这里点确定支付'
                    break
                case '7_3': // 点完确定支付之后不操作
                    this.guide_node.active = false
                    break

                // ======================= 《第八步》 卖出社交APP
                case '8': // 卖出社交APP
                    // this.mouse.setPosition(160, -250)
                    this.mouse.setPosition(80, -240)
                    this.bank.setPosition(120, -410)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '厉害，这么快就获得超额回报'
                    break
                case '8_1': // 出售的数量 
                    this.mouse.setPosition(325, 285)
                    this.bank.setPosition(115, -330)
                    // this.bank.getChildByName('label').getComponent('cc.Label').string = '选择100%的数量出售'
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '勾选要售出的资产'
                    break
                case '8_2': // 确定出售
                    this.mouse.setPosition(210, -280)
                    this.bank.setPosition(115, -430)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '这里点确定出售'
                    break
                case '8_3': // 点完确定出售之后不操作
                    this.profit_action_node.active = true
                    this.profit_node.getChildByName('txt').getComponent('cc.Label').string = '售出社交APP,收益:'
                    this.profit_node.getChildByName('num').getComponent('cc.Label').string = '¥400万'
                    this.guide_node.active = false
                    break

                // ======================= 《第九步》 日常消费度假
                case '9': // 度假日常消费
                    this.mouse.setPosition(230, -250)
                    this.bank.setPosition(115, -430)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '日常消费要支付费用喔'
                    break
                case '9_0': // 付款
                    this.mouse.setPosition(230, -250)
                    // this.bank.setPosition(110, -410)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '这里点确定支付'
                    break

                case '9_1': // 确定付款
                    this.mouse.setPosition(230, -250)
                    this.bank.setPosition(115, -430)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '这里点确定出售'
                    break
                
                case '9_2': // 确定出售
                    this.guide_node.active = false
                    break

                // ======================= 《第十步》 卖出西城上筑
                case '10': // 卖出奶茶店
                    // this.mouse.setPosition(160, -250)
                    this.mouse.setPosition(80, -240)
                    this.bank.setPosition(120, -410)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '恭喜，优质资产变现成功'
                    break
                case '10_1': // 出售的数量
                    this.mouse.setPosition(325, 285)
                    this.bank.setPosition(115, -330)
                    // this.bank.getChildByName('label').getComponent('cc.Label').string = '选择100%的数量出售'
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '勾选要售出的资产'
                    break
                case '10_2': // 确定出售
                    this.mouse.setPosition(230, -270)
                    this.bank.setPosition(115, -430)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '这里点确定出售'
                    break
                case '10_3': // 点完确定出售之后不操作
                    this.profit_action_node.active = true
                    this.profit_node.getChildByName('txt').getComponent('cc.Label').string = '售出西城上筑,收益:'
                    this.profit_node.getChildByName('num').getComponent('cc.Label').string = '¥360万'
                    this.guide_node.active = false
                    break

                // ======================= 《第十一步》 买商场 ，金币不足， 贷款， 购买， 财富自由
                case '11': // 选大小 选大
                    this.mouse.setPosition(280, 218)
                    this.bank.setPosition(103, -63)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '大额投资可以帮助你买入\n更多现金流或获利空间的资产'
                    break
                case '11_1': // 购买页
                    this.mouse.setPosition(80, -240)
                    this.bank.setPosition(10, -475)
                    // this.bank.setContentSize(700, 400)
                    this.bank.getComponent(cc.Sprite).spriteFrame = this.bank_big
                    this.bank.getChildByName('label').setPosition(20, 0)
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '太棒了！\n通过正确的投资，你已经是千万富翁\n现在可以通过买入商场，\n使得月现金流大于月支出，\n从而实现财富自由的终极目标'
                    
                    break
                case '11_2': // 确定支付
                    this.mouse.setPosition(230, -250)
                    this.bank.setPosition(110, -410)
                    // this.bank.setContentSize(489, 171)
                    this.bank.getComponent(cc.Sprite).spriteFrame = this.bank_common
                    this.bank.getChildByName('label').getComponent('cc.Label').string = '这里点确定支付'
                    this.bank.getChildByName('label').setPosition(2, 0)
                    break
                case '11_3': // 点完确定支付之后不操作
                    this.guide_node.active = false
                    break
                // case '11_2': // 金币不足
                //     this.mouse.setPosition(205, -95)
                //     this.bank.setPosition(115, -340)
                //     this.bank.getChildByName('label').getComponent('cc.Label').string = '当金币不足的时候\n可以贷款购买喔'
                //     break
                // case '11_3': // 确认贷款金额后\n点击确定贷款即可
                //     this.mouse.setPosition(30, -580)
                //     this.bank.setPosition(60, -400)
                //     this.bank.getChildByName('label').getComponent('cc.Label').string = '确认贷款金额后\n点击确定贷款即可'
                //     break
                // case '11_4': // 点完确认贷款后不操作
                //     this.guide_node.active = false
                //     break
                default: 
                    console.log('第' + this.step + '步之间的指导位置不明确')
                    break
            }
        } else {
            this.guide_node.active = false            
        }

    },

    // 每一步的新手指导关闭
    on_new_player_close: function () {
        this.guide_node.active = false
    },

    // 【第1步】 ====================================================
    on_step1: function () {
        // sound
        RemoteAudio.playEffect(SoundName.CHOOSE_CHANCE);
        this.popup_nodes[0].active = true // 选择大小
        this.on_new_player_video('1')
    },
    
    // 第1步的点小额投资
    on_step1_1: function () {
        this.on_new_player_close()
        this.on_new_player_video('1_1')
        this.on_popup_total_flash()

        this.popup_nodes[31].active = true // 资产页面
    },

    // 第一步
    on_step1_1_0: function () {
        this.on_new_player_close()
        this.on_new_player_video('1_1_0')
        this.on_popup_total_flash()
        
        this.popup_nodes[6].active = true // 购买页面
    },

    // 第一步的点购买
    on_step1_1_1: function () {
        this.on_new_player_close()
        this.on_new_player_video('1_1_1')
        this.on_popup_total_flash()
        
        this.popup_nodes[1].active = true // FACEBOOK 一万股
    },

    // 第1步的点一万股    // william 玩家点到10000
    on_step1_2: function () {
        this.on_new_player_close()
        this.on_new_player_video('1_2')
        this.popup_nodes[1].getChildByName('auctioncionBg').getChildByName('TEXT_LABEL').getComponent('cc.Label').string = '10000'
    },

    // 第1步的点付款
    on_step1_3: function () {
        this.on_new_player_close()
        this.on_new_player_video('1_3')
        this.on_popup_total_flash()

        this.popup_nodes[2].active = true // 购买成功页面
        this.popup_nodes[2].getChildByName('paying').active = true
        this.popup_nodes[2].getChildByName('paying').getChildByName('moneyLabel').getComponent('cc.Label').string = '¥100000'
    },

    // 第1步的点确定支付
    on_step1_4: function () {
        this.on_new_player_close()
        this.on_new_player_video('1_4')

        this.popup_nodes[2].getChildByName('paying').active = false
        this.popup_nodes[2].getChildByName('btOk').active = false
        this.popup_nodes[2].getChildByName('sucess').active = true

        // this.scheduleOnce(function () {
        //     // sound
        //     RemoteAudio.playEffect(SoundName.CASH_REGISTER);
        // }.bind(this), 1)

        // sound
        RemoteAudio.playEffect(SoundName.CASH_REGISTER);

        this.scheduleOnce(function () {
            this.popup_nodes[2].getChildByName('paying').active = true
            this.popup_nodes[2].getChildByName('btOk').active = true
            this.popup_nodes[2].getChildByName('sucess').active = false
            this.on_popup_total_flash()

            // 理财产品 + facebook
            this.Asset_facebook.active = true
            this.wu_node[0].active = false

            this.on_next_round_flash() // 下一轮骰子生成 和 this.step++
        }.bind(this), 2)

        
    },
    
    // 【第2步】====================================================
    on_step2_0: function () { // 大小
        this.on_new_player_close()
        this.on_new_player_video('2_0')
        // sound
        RemoteAudio.playEffect(SoundName.CHOOSE_CHANCE);
        this.popup_nodes[29].active = true // 大小投资 选小
        
    },

    on_step2_0_1: function () { // 资产
        this.on_new_player_close()
        this.on_new_player_video('2_0_1')
        this.on_popup_total_flash()
        this.popup_nodes[30].active = true // 显示可售资产，社交APP
        
    },

    on_step2: function () {
        this.on_new_player_close()
        this.on_new_player_video('2')
        this.on_popup_total_flash()

        this.popup_nodes[3].active = true // 可售资产框, 卖出10000股
        this.facebook_node = this.popup_nodes[3].getChildByName('scrollview').getChildByName('view').getChildByName('content').getChildByName('fictitiousItem')

        this.facebook_node.getChildByName('detailsBg').getChildByName('num0').getComponent('cc.Label').string = '¥10'
        this.facebook_node.getChildByName('detailsBg').getChildByName('num2').getComponent('cc.Label').string = '¥100'
        
    },

    // 第2步点100%
    on_step2_1: function () {
        this.on_new_player_close()
        this.on_new_player_video('2_1')
        this.facebook_node.getChildByName('auctioncionBg').getChildByName('TEXT_LABEL').getComponent('cc.Label').string = '10000'
    },

    // 第2步点确定出售
    on_step2_2: function () {
        // sound
        RemoteAudio.playEffect(SoundName.SELL);

        this.on_new_player_close()
        this.on_new_player_video('2_2')
        // ****** 加效果

        // 理财产品 - facebook
        this.Asset_facebook.active = false
        this.wu_node[0].active = true

        this.on_popup_total_flash()
        this.on_next_round_flash() // 下一轮骰子生成 和 this.step++
    },

    // 【第3步】 ======================================================
    on_step3: function () {
        this.on_new_player_close()
        this.on_new_player_video('3')
        this.popup_nodes[4].active = true // 升值加薪卡片

    },

    // 第3步点完色子
    on_step3_2: function () {
        this.on_new_player_close()
        this.on_new_player_video('3_2')
        this.scheduleOnce(function () {
            this.on_popup_total_flash() // william
            this.splash_all.active = false // 全局遮罩关闭
            // sound
            RemoteAudio.playEffect(SoundName.PROMOTION);
            // 弹出恭喜升职加薪
            this.popup_nodes[5].active = true
        }.bind(this), 1)

        // 2.5秒后升职加薪去掉
        this.scheduleOnce(function () {
            this.on_popup_total_flash()
            this.on_next_round_flash() // 下一轮骰子生成 和 this.step++
        }.bind(this), 2.5)

    },

    // 第4步点 ======================================================
    on_step4: function () {
        this.on_new_player_close()
        this.on_new_player_video('4')
        // sound
        RemoteAudio.playEffect(SoundName.CHOOSE_CHANCE);
        this.popup_nodes[7].active = true // 选择大小
    },

    // 第4步点小额投资 
    on_step4_1: function () {
        this.on_new_player_close()
        this.on_new_player_video('4_1')
        this.on_popup_total_flash()

        this.popup_nodes[8].active = true // 社交APP
    },

    // 第4步点【购买】
    on_step4_2: function () {
        this.on_new_player_close()
        this.on_new_player_video('4_2')
        this.on_popup_total_flash()

        this.popup_nodes[9].active = true // app购买页面
        this.popup_nodes[9].getChildByName('paying').getChildByName('moneyLabel').getComponent('cc.Label').string = '¥200000'
    },

    // 第4步点确定支付
    on_step4_3: function () {
        // this.on_popup_total_flash()
        this.on_new_player_close()
        this.on_new_player_video('4_3')

        // this.popup_nodes[9].active = true // 购买成功页面
        this.popup_nodes[9].getChildByName('paying').active = false
        this.popup_nodes[9].getChildByName('btOk').active = false
        this.popup_nodes[9].getChildByName('sucess').active = true

        // this.scheduleOnce(function () {
            
        // }.bind(this), 1)
        // sound
        RemoteAudio.playEffect(SoundName.CASH_REGISTER);

        // 播放完成动画
        this.popup_nodes[9].getChildByName('sucess').getChildByName('blueLoading').getComponent(cc.Animation).play('blueLoading')

        // 1秒后到下一步
        this.scheduleOnce(function () {
            // 理财产品 + APP
            this.Asset_APP.active = true
            this.wu_node[1].active = false

            this.on_popup_total_flash()
            this.on_next_round_flash() // 下一轮骰子生成 和 this.step++

            this.on_saizi_tip(true)
        }.bind(this), 3)
        
    },

    // 第5步 显示奶茶店 ====================================================== 奶茶店60万买入
    on_step5: function () {
        this.on_new_player_close()
        this.on_new_player_video('5')
        // sound
        RemoteAudio.playEffect(SoundName.CHOOSE_CHANCE);
        this.popup_nodes[10].active = true // 大小投资 选大
    },

    // 第5步 点大投资 => 显示奶茶店
    on_step5_1: function () {
        this.on_new_player_close()
        this.on_new_player_video('5_1')
        this.on_popup_total_flash()
        this.popup_nodes[11].active = true
    },

    // 第5步 点购买 => 显示付款页面
    on_step5_2: function () {
        this.on_new_player_close()
        this.on_new_player_video('5_2')
        this.on_popup_total_flash()
        this.popup_nodes[12].active = true
    },

    // 第5步 确定支付 => 支付成功
    on_step5_3: function () {
        this.on_new_player_close()
        this.on_new_player_video('5_3')
        // this.on_popup_total_flash()
        this.popup_nodes[12].getChildByName('paying').active = false
        this.popup_nodes[12].getChildByName('btOk').active = false
        this.popup_nodes[12].getChildByName('sucess').active = true

        // this.scheduleOnce(function () {
           
        // }.bind(this), 1)
        // sound
        RemoteAudio.playEffect(SoundName.CASH_REGISTER);

        // 播放完成动画
        this.popup_nodes[12].getChildByName('sucess').getChildByName('blueLoading').getComponent(cc.Animation).play('blueLoading')

        // 1秒后到下一步
        this.scheduleOnce(function () {
            // 理财产品 + 奶茶店
            this.Asset_teaClub.active = true
            this.wu_node[2].active = false

            this.on_popup_total_flash()
            this.on_next_round_flash() // 下一轮骰子生成 和 this.step++
        }.bind(this), 3)
    },

    // 第6步 ====================================================== 显示市场讯息， 卖出奶茶店
    on_step6: function () {
        this.on_new_player_close()
        this.on_new_player_video('6')

        // sound
        RemoteAudio.playEffect(SoundName.MARKET_INFO);
        this.popup_nodes[13].active = true // 显示市场讯息，奶茶店
    },

    // 第6步 点资产
    on_step6_1: function () {
        // sound
        // RemoteAudio.playEffect(SoundName.SELL);

        this.on_new_player_close()
        this.on_new_player_video('6_1')
        this.on_popup_total_flash()

        this.popup_nodes[14].active = true // 奶茶店可售资产框
        // // console.log(' ==== ', this.facebook_sellout_prefab)
        // // this.facebook_node = cc.instantiate(this.facebook_sellout_prefab)
        // this.facebook_node = this.popup_nodes[3].getChildByName('scrollview').getChildByName('view').getChildByName('content').getChildByName('fictitiousItem')

        // this.facebook_node.getChildByName('detailsBg').getChildByName('num0').getComponent('cc.Label').string = '￥10万'
        // this.facebook_node.getChildByName('detailsBg').getChildByName('num2').getComponent('cc.Label').string = '￥100万'
    },

    // 第6步 点100%
    on_step6_2: function () {
        this.on_new_player_close()
        this.on_new_player_video('6_2')
        // console.log(' ==== ', this.facebook_sellout_prefab)
        this.popup_nodes[14].getChildByName('scrollview').getChildByName('view').getChildByName('content').getChildByName('fictitiousItem').getChildByName('auctioncionBg').getChildByName('TEXT_LABEL').getComponent('cc.Label').string = '100'

        // this.facebook_node.getChildByName('detailsBg').getChildByName('num0').getComponent('cc.Label').string = '￥10万'
        // this.facebook_node.getChildByName('detailsBg').getChildByName('num2').getComponent('cc.Label').string = '￥100万'
    },

    // 第6步 点确定出售
    on_step6_3: function () {
        // sound
        RemoteAudio.playEffect(SoundName.SELL);

        this.on_new_player_close()
        this.on_new_player_video('6_3')

        // 理财产品 - 奶茶店
        this.Asset_teaClub.active = false
        this.wu_node[2].active = true

        this.on_popup_total_flash()
        this.on_next_round_flash() // 下一轮骰子生成 和 this.step++
    },

    // 第7步点 ====================================================== 买西城上住
    on_step7: function () {
        this.on_new_player_close()
        this.on_new_player_video('7')
        // sound
        RemoteAudio.playEffect(SoundName.CHOOSE_CHANCE);
        this.popup_nodes[15].active = true // 显示大小
    },

    // 第7步 点大投资 => 出现西城上住
    on_step7_1: function () {
        this.on_new_player_close()
        this.on_new_player_video('7_1')
        this.on_popup_total_flash()
        this.popup_nodes[16].active = true // 西城上住框
    },

    // 第7步 点购买
    on_step7_2: function () {
        this.on_new_player_close()
        this.on_new_player_video('7_2')
        this.on_popup_total_flash()

        this.popup_nodes[17].active = true // 支付框
    },

    // 第7步 点确定支付
    on_step7_3: function () {
        this.on_new_player_close()
        this.on_new_player_video('7_3')
        // this.on_popup_total_flash()
        this.popup_nodes[17].getChildByName('paying').active = false
        this.popup_nodes[17].getChildByName('btOk').active = false
        this.popup_nodes[17].getChildByName('sucess').active = true

        // this.scheduleOnce(function () {
            
        // }.bind(this), 1)

        // sound
        RemoteAudio.playEffect(SoundName.CASH_REGISTER);

        // 播放完成动画
        this.popup_nodes[17].getChildByName('sucess').getChildByName('blueLoading').getComponent(cc.Animation).play('blueLoading')

        // 1秒后到下一步
        this.scheduleOnce(function () {
            // 理财产品 + xicheng
            this.Asset_xicheng.active = true
            this.wu_node[3].active = false

            this.on_popup_total_flash()
            this.on_next_round_flash() // 下一轮骰子生成 和 this.step++
        }.bind(this), 3)
    },

    // 第8步 ====================================================== 求购社交app 400万
    on_step8: function () {
        this.on_new_player_close()
        this.on_new_player_video('8')
        // sound
        RemoteAudio.playEffect(SoundName.MARKET_INFO);
        this.popup_nodes[18].active = true // 显示市场讯息，可卖社交APP
    },

    // 第8步 点资产
    on_step8_1: function () {
        this.on_new_player_close()
        this.on_new_player_video('8_1')
        this.on_popup_total_flash()
        this.popup_nodes[19].active = true // 可售资产，社交APP
    },

    // 第8步 点100%
    on_step8_2: function () {
        this.on_new_player_close()
        this.on_new_player_video('8_2')
        this.popup_nodes[19].getChildByName('scrollview').getChildByName('view').getChildByName('content').getChildByName('fictitiousItem').getChildByName('auctioncionBg').getChildByName('TEXT_LABEL').getComponent('cc.Label').string = '100'

    },

    // 第8步 点确定出售
    on_step8_3: function () {
        // sound
        RemoteAudio.playEffect(SoundName.SELL);

        // 理财产品 - APP
        this.Asset_APP.active = false
        this.wu_node[1].active = true

        this.on_new_player_close()
        this.on_new_player_video('8_3')
        this.on_popup_total_flash()

        this.on_next_round_flash() // 下一轮骰子生成 和 this.step++
    },

    // 第9步 ====================================================== 弹出日常消费 度假 消费10000元
    on_step9: function () {
        this.on_new_player_close()
        this.on_new_player_video('9')
        // sound
        RemoteAudio.playEffect(SoundName.ACCIDENT);
        this.popup_nodes[20].active = true // 日常消费度假
    },

    // 第九步点日常消费的付款
    on_step9_0: function () {
        this.on_new_player_close()
        this.on_new_player_video('9_0')
        this.on_popup_total_flash()

        this.popup_nodes[21].active = true // 支付框
    },

    // 第九步点日常消费的确定付款
    on_step9_1: function () {
        this.on_new_player_close()
        // this.on_new_player_video('9_1')
        // this.on_popup_total_flash()
        // this.popup_nodes[21].active = true
        this.popup_nodes[21].getChildByName('paying').active = false
        this.popup_nodes[21].getChildByName('btOk').active = false
        this.popup_nodes[21].getChildByName('sucess').active = true

        // this.scheduleOnce(function () {
            
        // }.bind(this), 1)

        // sound
        RemoteAudio.playEffect(SoundName.CASH_REGISTER);

        // 播放完成动画
        this.popup_nodes[21].getChildByName('sucess').getChildByName('blueLoading').getComponent(cc.Animation).play('blueLoading')

        // 1秒后到下一步
        this.scheduleOnce(function () {
            this.on_new_player_close()
            this.on_popup_total_flash()
            this.on_next_round_flash() // 下一轮骰子生成 和 this.step++
        }.bind(this), 2)
    },

    // 第10步 ====================================================== 市场讯息求购西城上筑 720万
    on_step10: function () {
        this.on_new_player_close()
        this.on_new_player_video('10')
        // sound
        RemoteAudio.playEffect(SoundName.MARKET_INFO);
        this.popup_nodes[22].active = true // 市场讯息求购西城上筑 720万
    },

    // 第10步 点资产
    on_step10_1: function () {
        this.on_new_player_close()
        this.on_new_player_video('10_1')
        this.on_popup_total_flash()
        this.popup_nodes[23].active = true // 可售资产，社交APP
        // this.popup_nodes[23].getChildByName('scrollview').getChildByName('view').getChildByName('content').getChildByName('fictitiousItem').getChildByName('auctioncionBg').getChildByName('TEXT_LABEL').getComponent('cc.Label').string = '0'
    },

    // 第10步 点100%
    on_step10_2: function () {
        this.on_new_player_close()
        this.on_new_player_video('10_2')
        this.popup_nodes[23].getChildByName('scrollview').getChildByName('view').getChildByName('content').getChildByName('fictitiousItem').getChildByName('auctioncionBg').getChildByName('TEXT_LABEL').getComponent('cc.Label').string = '100'

    },

    // 第10步 点确定出售
    on_step10_3: function () {
        // sound
        RemoteAudio.playEffect(SoundName.SELL);

        // 理财产品 + xicheng
        this.Asset_xicheng.active = false
        this.wu_node[3].active = true

        this.on_new_player_close()
        this.on_new_player_video('10_3')
        this.on_popup_total_flash()
        this.on_next_round_flash() // 下一轮骰子生成 和 this.step++
    },

    // 第11步点 ====================================================== 投资大小 大
    on_step11: function () {
        this.on_new_player_close()
        this.on_new_player_video('11')
        // sound
        RemoteAudio.playEffect(SoundName.CHOOSE_CHANCE);
        this.popup_nodes[24].active = true // 投资选择大小 大
    },

    // 第11步 点大投资 => 商场1000万
    on_step11_1: function () {
        this.on_new_player_close()
        this.on_new_player_video('11_1')
        this.on_popup_total_flash()
        this.popup_nodes[25].active = true // 商场框
    },

    // 第11步 点购买
    on_step11_2: function () {
        this.on_new_player_close()
        this.on_new_player_video('11_2')
        this.on_popup_total_flash()

        this.popup_nodes[32].active = true // 支付框
        // this.popup_nodes[26].active = true // 金币不足提示框
    },

    // 第11步 点确定支付
    on_step11_3: function () {
        this.on_new_player_close()
        this.on_new_player_video('11_3')
        // this.on_popup_total_flash()
        this.popup_nodes[32].getChildByName('paying').active = false
        this.popup_nodes[32].getChildByName('btOk').active = false
        this.popup_nodes[32].getChildByName('sucess').active = true

        // this.scheduleOnce(function () {
        //     // sound
        //     RemoteAudio.playEffect(SoundName.CASH_REGISTER);
        // }.bind(this), 1)

        // sound
        RemoteAudio.playEffect(SoundName.CASH_REGISTER);

        // 播放完成动画
        this.popup_nodes[32].getChildByName('sucess').getChildByName('blueLoading').getComponent(cc.Animation).play('blueLoading')

        // 1秒后到下一步
        this.scheduleOnce(function () {
            // 显示财富自由
            this.on_step11_4()
        }.bind(this), 3)
    },

    // // 第11步 点贷款
    // on_step11_3: function () {
    //     this.on_new_player_close()
    //     this.on_new_player_video('11_3')
    //     this.on_popup_total_flash()

    //     // sound
    //     RemoteAudio.playEffect(SoundName.NEED_LOAN_PROMPT);
    //     this.popup_nodes[27].active = true // 贷款框
    // },

    // 第11步 显示财富自由
    on_step11_4: function () {
        // 理财产品 + mall
        this.Asset_mall.active = true
        this.wu_node[4].active = false

        this.on_new_player_close()
        // this.on_new_player_video('11_4')

        this.on_popup_total_flash()

        // sound
        RemoteAudio.playEffect(SoundName.GAME_FREEDOM);
        this.popup_nodes[28].active = true // 财富自由

        // 
        this.on_seccess()

        // 2秒后进入结算场景
        this.scheduleOnce(function () {
            // 跳到下一个场景
            cc.director.loadScene("guide_result_coin")
        }.bind(this), 2)
    },

    // 弹框都关闭
    on_popup_total_flash: function () {
        for (var i in this.popup_total.children) {
            this.popup_total.children[i].active = false
        }
    },
     
    
    // 个人信息变化
    // cash: {
    //     type: cc.Label,
    //     default: null,
    //     tooltip: '现金'
    // },
    // free_progress: {
    //     type: cc.ProgressBar,
    //     default: null,
    //     tooltip: '财富bar' 
    // },
    // free_txt: {
    //     type: cc.Label,
    //     default: null,
    //     tooltip: '财富txt'  
    // },
    // invest_get: {
    //     type: cc.Label,
    //     default: null,
    //     tooltip: '投资收益'  
    // },
    // pay_out: {
    //     type: cc.Label,
    //     default: null,
    //     tooltip: '支出'  
    // },
    // cash_flow: {
    //     type: cc.Label,
    //     default: null,
    //     tooltip: '月现金流' 
    // },
    on_person_info_ctrl: function (index) {
        switch (index) {
            case 1: // 资产增加1万股facebook股票
                // var num = parseInt(this.cash.string) - 10000
                this.cash.string = '18080'
                this.free_progress.progress = 0 / 100
                this.free_txt.string = 0 + '%'
                this.invest_get.string = 0 + ''
                this.pay_out.string = 11480 + ''
                this.cash_flow.string = 4920 + ''
                break
            case 2: // 现金增加100万
                this.cash.string = '1018080'
                this.free_progress.progress = 0 / 100
                this.free_txt.string = 0 + '%'
                this.invest_get.string = 0 + ''
                this.pay_out.string = 11480 + ''
                this.cash_flow.string = 4920 + ''
                break
            case 3: // 升职加薪成功，加薪6560元
                this.cash.string = '1077120'
                this.free_progress.progress = 0 / 100
                this.free_txt.string = 0 + '%'
                this.invest_get.string = 0 + ''
                this.pay_out.string = 16072 + ''
                this.cash_flow.string = 6888 + ''
                break
            case 4: // 资产增加软件APP 现金减少20万
                this.cash.string = '959776'
                this.free_progress.progress = 0 / 100
                this.free_txt.string = 0 + '%'
                this.invest_get.string = 0 + ''
                this.pay_out.string = 16072 + ''
                this.cash_flow.string = 6888 + ''
                break
            case 5: // 资产增加奶茶店，现金减少60万，现金流1500
                this.cash.string = '442432'
                this.free_progress.progress = 9.33 / 100
                this.free_txt.string = 9.33 + '%'
                this.invest_get.string = 1500 + ''
                this.pay_out.string = 16072 + ''
                this.cash_flow.string = 8388 + ''
                break
            case 6: // 现金增加300万，现金流减少1500
                this.cash.string = '3442432'
                this.free_progress.progress = 0
                this.free_txt.string = 0 + '%'
                this.invest_get.string = 0 + ''
                this.pay_out.string = 16072 + ''
                this.cash_flow.string = 6888 + ''
                break
            case 7: // 资产增加西城上筑，现金减少108万，现金流减少4000
                this.cash.string = '2445088'
                this.free_progress.progress = 29.99 / 100
                this.free_txt.string = 29.99 + '%'
                this.invest_get.string = 8600 + ''
                this.pay_out.string = 28672 + ''
                this.cash_flow.string = 2888 + ''
                break
            case 8: // 现金增加400万
                this.cash.string = '6479744'
                this.free_progress.progress = 7.91 / 100
                this.free_txt.string = 7.91 + '%'
                this.invest_get.string = 8600 + ''
                this.pay_out.string = 108672 + ''
                this.cash_flow.string = 77888 + ''
                break
            case 9: // 现金减少10000元
                this.cash.string = '6469744'
                this.free_progress.progress = 7.91 / 100
                this.free_txt.string = 7.91 + '%'
                this.invest_get.string = 8600 + ''
                this.pay_out.string = 108672 + ''
                this.cash_flow.string = 77888 + ''
                break
            case 10: // 现金增加360万
                this.cash.string = '10069744'
                this.free_progress.progress = 0 / 100
                this.free_txt.string = 0 + '%'
                this.invest_get.string = 0 + ''
                this.pay_out.string = 16072 + ''
                this.cash_flow.string = 6888 + ''
                break
            case 11: // 买入商场，财富自由
                this.cash.string = '152400'
                this.free_progress.progress = 161.34 / 100
                this.free_txt.string = 161.34 + '%'
                this.invest_get.string = 155000 + ''
                this.pay_out.string = 96072 + ''
                this.cash_flow.string = 81888 + ''
                break
            default:
                console.log('guide_game脚本的on_person_info_ctrl函数的index超出有效范围')
                break
        }
        // 自由度计算
        this.getComponent()
    },
    
    // 自由度计算
    on_calculate_freedom: function () {
        console.log('计算了一次自由度')
        var per = parseInt(this.invest_get) / parseInt(this.pay_out)
        per = per.toFixed(2)
        
        this.free_progress.progress = per
        this.free_txt.string = per + '%'
    },

    // 最终 success
    on_seccess: function () {
        this.free_progress.progress = 1
        this.free_txt.string = 100 + '%'
    }
    

    // 10000股判断
    
    // update (dt) {},
});

module.exports = guide_game
