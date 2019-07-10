cc.Class({
    extends: cc.Component,

    properties: {
        is_test: false, // 是否跑测试， 测试跑的话这个为true, 发布要把勾去掉
        load_time: 3,
        shine: {
            type: cc.Node,
            default: null,
            tooltip: '进度条上粒子'
        },
        load_progress: {
            type: cc.ProgressBar,
            default: null,
            tooltip: '进度条'
        },
        avatarContainer_node: {
            type: cc.Node,
            default: null,
            tooltip: '头像节点'
        },
        nick_name: {
            type: cc.Label,
            default: null,
            tooltip: '用户昵称'
        },
        step1_node: {
            type: cc.Node,
            default: null,
            tooltip: '第一步节点'
        },
        step2_node: {
            type: cc.Node,
            default: null,
            tooltip: '第二步节点'
        },
        step3_node: {
            type: cc.Node,
            default: null,
            tooltip: '第三步节点'
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 预加载
        cc.director.preloadScene("guide_game", function() {
                
        })

        // once_init
        this.once_init()

        // 出现第一步
        this.step1_node.active = true
        
        // this.init()
        // this.on_move()
        // this.go_guide_game_scene()
    },

    // 初始化
    once_init: function () {
        this.step1_node.active = false
        this.step2_node.active = false
        this.step3_node.active = false

        this.shine.active = false
        this.load_progress.node.active = false
    },

    // 第一步
    on_btn_step1: function () {
        this.once_init()
        
        this.step2_node.active = true
    },

    // 第二步
    on_btn_step2: function () {
        this.once_init()
        
        this.step3_node.active = true
    },

    // 第三步
    on_btn_step3: function () {
        this.once_init()
        
        this.init()
        this.on_move()
        this.go_guide_game_scene()
    },
    
    

    init () {
        this.shine.active = true
        this.load_progress.node.active = true

        this.shine.setPosition(-276, -448) // -448
        this.load_progress.progress = 0

        if (!this.is_test) {
            var playerInfo = cc.sys.localStorage.getItem('playerInfo')
            // avatar 引用原始操作
            var AvatarContainer_com = this.avatarContainer_node.getComponent('AvatarContainer')
            AvatarContainer_com.setAvatarImageFromUrl(playerInfo.avatar)
            
            // nickname
            this.nick_name.string = playerInfo.nickname + ''
        }

    },

    start () {

    },

    on_move: function () {
        var action = cc.moveTo(this.load_time, cc.v2(276, -448))
        this.shine.runAction(action)
    },

    // (load_time属性时间后)前往game新手指导场景 william
    go_guide_game_scene: function () {
        this.scheduleOnce(function () {
            cc.director.loadScene("guide_game")
        }.bind(this), this.load_time)
        
    },

    update (dt) {
        if (this.load_progress.progress < 1) {
            this.load_progress.progress += dt * 0.34
        }
    },

});
