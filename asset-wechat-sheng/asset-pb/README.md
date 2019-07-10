# Asset Protobuf 定义

<!-- TOC depthFrom:2 -->

- [如何编译](#如何编译)
- [协议编写规范](#协议编写规范)
  - [protobuf 选项](#protobuf-选项)
  - [协议字段命名规范](#协议字段命名规范)
  - [前端通信协议命名规范](#前端通信协议命名规范)
  - [后端通信协议规范](#后端通信协议规范)

<!-- /TOC -->

目录结构：

~~~
.
├── README.md
└── protos
    # 每个文件夹是一个项目
    ├── game
    │   └── main.proto
    └── lobby
        └── main.proto
~~~

protobuf 文件包名：

 - 建议使用与项目名相同的名字，如果有需要再做拆分。
 - 公共的部分放入到 common 中。


## 如何编译

进入你的项目目录（比如 `$GOPATH/cenarius`），然后执行  `$ASSET_PB_REPO/compile.sh`，脚本会在你的
`$PWD/vendor` 下面输出一个 `asset_pb`  文件夹，里面包含所有编译得到的 golang 文件。

## 协议编写规范

### protobuf 选项

- 所有 proto 文件都应该使用 proto3 语法（也就是说 `syntax = "proto3";`）
- *重要*：设置 `option go_package = "asset_pb/$PROJECT_NAME";`，例如，对于 `cenarius` 项目的 proto 文件，
  设置 `option go_package = "asset_pb/cenarius";`，这样才能保证输出的 golang 文件有正确的路径


### 协议字段命名规范

- 所有 protobuf Message 使用  Upper Camelcase 命名，例如：`GetCanSellPlayerAsset`
- 所有 message 字段，使用 lower Camelcase，例如 `userId`
- 所有 Enum 类型，使用 Upper Camelcase，例如如 `GameType`
- 所有 Enum 值，使用 大写 + 下划线命名
- 顶层 Enum 推荐使用内嵌 Message 避免命名冲突；如果 Enum 定义在顶层而且不使用内嵌的方式，该枚举的值**必须**用 Enum 类型名做前
  缀避免冲突，例如 `GameType_RANK`（推荐使用内嵌的方式）
- 对于 Enum，如果有合理的默认值，应该将其定义为 Enum 的零值，如果没有合理的默认值， 0 值应命名为
  `$ENUM_TYPE` + `_UNKNOWN`，例如：`GameType_UNKNOWN`
- 如果某个 Enum 只在某个 Message 内用到，可以考虑把 Enum 嵌入到 Message 内部，对于这种 Enum，可以不
  加 Enum 类型前缀

示例：

```proto
message UserInfo {
    int64 id = 1;
}

message AuthenticateReq {
    // 将 AuthenticateType 嵌入，嵌入的枚举不需要加前缀
    enum AuthenticateType {
        WEIBO = 1;
        WEIXIN = 2;
        QQ = 3;
    }
    string token = 1;
    AuthenticateType authType = 2;
}

message AuthenticateRsp {
    UserInfo userInfo = 1;
}

// 顶层 Enum，所有枚举值加入类型前缀
enum GameType {
    GameType_UNKNOWN = 0;
    GameType_NORMAL = 1;
    GameType_RANK = 2;
}

// 顶层 Enum，使用内嵌的方式来避免 name collision 
message GameType {
    enum Enum {
        UNKNOWN = 0;
        NORMAL = 1;
        RANK = 2;
    }
}
```

### 前端通信协议命名规范

* 所有同步请求都是:  XXXReq -> XXXRsp 配对； 
* 所有异步push的消息都是  XXXMsg;
* 所有 XXXReq有一个req字段，表示BaseReq; 
* 所有 XXXRsp有一个rsp字段，表示BaseRsp;

示例：

```proto
message StartGameReq {
    BaseReq req = 1;
    int64 userId = 2;
}

message StartGameRsp {
    BaseRsp rsp = 1;
    int64 userId = 2;
    int64 gameId = 3;
}

message StartGameMsg {
    GameBaseMsg base = 1;
    int64 userId = 2;
    int64 gameId = 3;
}
```


### 后端通信协议规范

- 如果不需要返回值时，使用 `google.protobuf.Empty` 作为返回类型
- 时间戳使用 `google.protobuf.Timestamp` 作为类型
- 避免在响应体内 wrap 错误类型，例如：
  ```proto
  // Don't do this
  message Error {
      int32 code = 1;
      string msg = 2;
  }

  message AuthenticateRsp {
      Error err = 1;
      int64 userId = 2;
  }
  ```
  响应的，使用 gRPC 自带的错误返回机制来返回错误。对于 golang，使用类似于下面的代码来返回错误：
  ```go
  package rpc

  import (
      "gitlab.com/vectorup/asset-pb/go/common"
      "google.golang.org/grpc/codes"
      "google.golang.org/grpc/status"
      "context"
  )

  func rpchandler(ctx context.Context, msg proto.Message) error {
	  //
	  err := doSomething()
      return status.New(codes.Internal, err.Error()).Err()
  }
  ```
  这样做的好处是可以用 `WithDetails` 带上更多的错误信息，包括调用栈等，更多示例请参考
  [Google API Design Guide](https://cloud.google.com/apis/design/errors#error_details)
  [gRPC Error Handling Example](https://github.com/grpc/grpc-go/blob/master/examples/rpc_errors/server/main.go)。
