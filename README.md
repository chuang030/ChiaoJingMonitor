## 功能

這個機器人是一個兼具娛樂及實用性的機器人，以下為它的主要功能：

* 訊息命令
  * `運氣`：每日運勢占卜
  * `要不要`：協助決定要不要做一些事情
  * `有意思`：當你覺得「有意思」它也會覺得有意思
  * `沒意思`：當你覺得「沒意思」它會傳送貼圖回應你
  * `一起聊天`：當你想一起聊天，它會傾聽你的或你指定的人聲音
  * `不要聊天`：代表你不想跟它聊天，他會退出語音
* 斜線指令
  * `運勢`：每日運勢占卜
* 語音頻道狀態偵測
  * 偵測語言頻道動態發送訊息：
    * 成員進入語音頻道
    * 成員離開語音頻道
    * 成員靜音時
    * 成員開麥時
    * 成員開啟直播時
    * 成員關閉直播時
    * 成員更換語音頻道時
  * 可設置一位成員發送特殊訊息
  * 可在訊息中插入預設表情符號及自訂表情符號
---

## 下載

* 下載安裝[Node.js](https://nodejs.org/en)，需要**16.9.0**或更新版本
* 執行`git clone https://github.com/chuang030/ChiaoJingMonitor.git`
* 執行`npm install`
* 根目錄新增`.env`檔案，加入`BOT_TOKEN=YOUR_BOT_TOKEN`
* 執行`start.bat`

---

## 佈署斜線指令
* 若不進行開發/編譯則直接在`./dist/config.json`中設置`clientId`及`guildId`
* 執行`deploy-commands.bat`

---

## 訊息命令
### 運氣
語法：`運氣`
使用後即可得知今日運勢。

### 要不要
語法：`要不要 做什麼都可以`
使用後機器人會告訴你要不要做你說的事情。

### 有意思
語法：
  * `有意思`
  * `有意思隨意文字`
  * `隨意文字有意思`

使用後機器人會回應你包含有意思的訊息。

### 沒意思
語法：`沒意思`
使用後機器人會回應隨機貼圖。

### 一起聊天
語法：
  * `一起聊天`
  * `一起聊天 @任一使用者`
  * `一起聊天 #語音頻道`
  * `一起聊天 @任一使用者 #語音頻道`

這個命令適用於呼喚機器人進入語音頻道並且將自己或指定的人的聲音錄下。<br>
如果單純使用`一起聊天`則直接錄發送命令的人的聲音。<br>
如果使用`一起聊天 @任一使用者`則會錄你所標註的人的聲音。如果標註的使用者在別的頻道中，機器人會進到該使用者的頻道中<br>
如果已經在錄音，再使用一次該指令，將會直接切換錄音對象(沒標註人就是自己)<br>
現在不需要親自加入語音頻道即可將機器人加入頻道錄音，只需要使用 `一起聊天 #語音頻道` 標註語音頻道。如果標註的語音頻道不是語音頻道或不存在，機器人會加入發送命令使用者的語音頻道，若發送者不在語音頻道中，則給予訊息提示<br>

**備註：**
* 目前所錄的聲音檔案會存放在`./dist/recordings/`中，暫不支援直接發送給其他用戶
* 發送錄音功能在未來更新中會加入
* 目前同一時間只能在一個伺服器中錄音，未來會支援多伺服器
* 未來更新會加入多人同時錄音功能

### 不要聊天
語法：`不要聊天`
如果機器人在語音頻道中，使用後機器人會中斷連線。<br>
如果機器人不在語音頻道中，使用後機器人會給你回應。

---

## 斜線指令

### 運勢
使用後即可得知今日運勢。與「運氣」相同，這是另一種觸發方式。

### 抉擇之
輸入事情、物品或任何事物，讓機器人來選擇

**子命令**
* 殘酷二選一：輸入兩件事情、物品或任何事物，讓機器人來選擇
* 偏心二選一：輸入兩件事情、物品或任何事物，讓機器人來選擇，但你可以偏心，機率預設計算至小數點後3位<br>

設置：<br>
以下是 `config/commands/chooseOne.json` 的內容
```js
{
  // 指令名稱
  "commandName": "抉擇之",
  // 指令說明
  "commandDescription": "輸入事情、物品或任何事物，讓機器人來選擇",
  // 子指令
  "subCommand": [
      {
        // 子指令名稱
        "commandName": "殘酷二選一",
        // 子指令說明
        "commandDescription": "輸入兩件事情、物品或任何事物，讓機器人來選擇",
        // 輸入選項
        "option": [
            {
                "optionName": "選項一",
                "optionDescription": "輸入第一個選項"
            },
            {
                "optionName": "選項二",
                "optionDescription": "輸入第二個選項"
            }
        ],
        // [思考效果]是否啟用思考時傳送圖片
        "enableThinkImage": false,
        // [思考效果]思考時間，單位：ms
        "thinkTime": 1500,
        // [思考效果]思考時傳送文字
        "thinkMessage": "機器人思考中...",
        // [思考效果]圖片路徑或連結
        "thinkImage": "",
        // 指令回覆文字
        "reply": "`選項一` ：<otherMsg>    `選項二：` <otherMsg>\n`選擇：` <otherMsg>"
      }
      // ...
  ]
}
```

---

## 語音頻道狀態偵測

### 觸發條件：
* 成員進入語音頻道
* 成員離開語音頻道
* 成員靜音時
* 成員開麥時
* 成員開啟直播時
* 成員關閉直播時
* 成員更換語音頻道時

該功能中每一個伺服器中都可以設置該伺服器特定訊息。<br>
如果想要所有伺服器都使用相同訊息，則在全域訊息中設置即可。<br>
訊息格式可以套用格式化標籤，在訊息中標註使用者、頻道或使用預設、自訂表情符號。<br>
每個伺服器中都可以設置一位主要監聽使用者及一位主要標註使用者，如果主要監聽使用者觸發該功能，主要標註使用者將會被標註通知。<br>

**備註：**
* 目前暫不支援白名單/非白名單模式，更新中會加入
* 非白名單模式中只要機器人加入該伺服器將即可觸發該功能
* 白名單模式中需要加入監視名單才可觸發該功能

---

## 設置
以下是 `config.json` 中的內容

```js
{
  // 機器人 client ID，設置指令用
  "clientId": "",
  // 伺服器 guild ID，設置指令用，若為全局設置則不需設置
  "guildId": "",
  // 要監聽的使用者，設置後列表中的使用者能夠觸發語言偵測功能
  "userListener": [
    {
      // 使用者者ID
      "id": "000000000000000000",
      // 發送訊息時會使用這個名稱，為空時使用該伺服器暱稱，無暱稱則使用自身的使用者名稱
      "name": "自訂該使用者名稱"
    }
	],
  // 要監聽的頻道，設置後列表中的使用者能夠觸發語言偵測功能
  "channelListener": [
    {
      // 伺服器ID
      "guildId": "000000000000000000",
      // 機器人主要發送訊息的頻道，若為空則傳送訊息到系統頻道
      "channelId": "000000000000000000",
      // 是否關閉主要標註使用者功能
      "disableMainMentionsUser": true,
      // 主要標註使用者 ID
      "mainMentionsUserId": "",
      // 是否關閉主要監視使用者功能
      "disableMainListenerUser": true,
      // 主要監視使用者 ID
      "mainListenerUserId": "",
      // 若未設置使用者名稱，伺服器中也未找到則使用該名稱
      "defaultUserName": "user",
      // 各事件發送訊息內容，會以對應事件發送對應的隨機訊息，這裡只針對該伺服器設定
    "randomMessage": {
      "join": [
      	"出現了~",
        "出現了<emoji>"
      ],
      "leave": [
      	"消失了~",
        "消失了<emoji>"
      ],
      "streamingOn": [
      	"開直播了~"
      ],
      "streamingOff": [
      	"關直播了~"
      ],
      "muteOn": [
      	"關麥了~"
      ],
      "muteOff": [
      	"開麥了~"
      ],
      "changeChannel": [
      	"跑到<channelId>裡了~"
      ]
    },
      // 該伺服器中自訂表情符號，用於發送訊息時使用的表情符號，只針對該伺服器設定
      "specialEmoji": {
        // 成員進入語音頻道時使用的表情符號池
      	"join": [],
        // 成員離開語音頻道時使用的表情符號池
      	"leave": [],
        // 成員開啟直播時使用的表情符號池
      	"streamingOn": [],
        // 成員關閉直播時使用的表情符號池
      	"streamingOff": [],
        // 成員靜音時使用的表情符號池
      	"muteOn": [],
        // 成員開麥時使用的表情符號池
      	"muteOff": [],
        // 成員更換語音頻道時使用的表情符號池
      	"changeChannel": []
      }
    }
	],
  // 設置格式化標，符合該標籤的文字會被替換
  "formatObject": {
    // 使用者 ID
    "userId": "<userId>",
    // 使用者名稱
    "userName": "<userName>",
    // 頻道 ID
    "channelId": "<channelId>",
    // 該標籤用來替換任一訊息
    "otherMessageString": "<otherMsg>",
    // 表情符號
    "emoji": "<emoji>"
  },
  // 語言偵測功能發送訊息格式
  "sendMessage": {
    // 成員進入語音頻道時發送訊息格式
    // <userId> 必須要將 disableMainMentionsUser 及 disableMainListenerUser 關閉時才會使用
    "join": "<userId><userName><otherMsg>",
    // 成員離開語音頻道時發送訊息格式
    "leave": "<userId><userName><otherMsg>",
    // 成員開啟直播時發送訊息格式
    "streamingOn": "<userId><userName><otherMsg>",
    // 成員關閉直播時發送訊息格式
    "streamingOff": "<userId><userName><otherMsg>",
    // 成員靜音時發送訊息格式
    "muteOn": "<userId><userName><otherMsg>",
    // 成員開麥時發送訊息格式
    "muteOff": "<userId><userName><otherMsg>",
    // 成員更換語音頻道時發送訊息格式
    "changeChannel": "<userId><userName><otherMsg>",
    // 各事件發送訊息內容，會以對應事件發送對應的隨機訊息，這裡是全局設定
    "randomMessage": {
      "join": [
      	"出現了~",
        "出現了<emoji>"
      ],
      "leave": [
      	"消失了~",
        "消失了<emoji>"
      ],
      "streamingOn": [
      	"開直播了~"
      ],
      "streamingOff": [
      	"關直播了~"
      ],
      "muteOn": [
      	"關麥了~"
      ],
      "muteOff": [
      	"開麥了~"
      ],
      "changeChannel": [
      	"跑到<channelId>裡了~"
      ]
    },
    // 各事件發送表情符號，會以對應事件發送對應的表情符號，這裡是全局設定
    "randomEmoji": {
      "join": [],
      "leave": [],
      "streamingOn": [],
      "streamingOff": [],
      "muteOn": [],
      "muteOff": [],
      "changeChannel": []
    }
  },
  // 訊息分析條件
  "messageAnalyze": {
    // 分析使用者ID條件，格式為<@00000000000000000>
    "analyzeUserIdTag": "<@[0-9]*>",
    // 分析頻道ID條件，格式為<#00000000000000000>
    "analyzeChannelIdTag": "<#[0-9]*>",
    // 分析自訂貼圖條件，格式為<:emoji:00000000000000000>
    "analyzeCustomEmojiTag": "<:[A-Za-z0-9_]*:[0-9]*>",
    // 分析自訂貼圖ID條件，格式為:emoji:00000000000000000
    "analyzeCustomEmojiIdTag": ":[A-Za-z0-9_]*:[0-9]*",
    // 分析使用者ID條件，00000000000000000
    "analyzeIdTag": "[0-9]+"
  },
  // 運勢設置
  "divination": {
    // 運勢種類
    "level": {
      "superGreatLuck": "超級上吉",
      "greatLuck": "大吉",
      "mediumLuck": "中吉",
      "minorLuck": "小吉",
      "goodLuck": "吉",
      "lastLuck": "末吉",
      "nopeBadLuck": "沒凶",
      "badLuck": "凶",
      "greatBadLuck": "大凶",
      "superGreatBadLuck": "超級大凶"
    },
    // 發送訊息格式
    "message": "<userId>\n<otherMsg> ： <otherMsg>",
    // 關鍵字
    "keywords": [
      "運氣"
    ]
  },
  // 「有意思」功能設置
  "interesting": {
    // 發送訊息格式
    "message": "<otherMsg>",
    // 關鍵字
    "keywords": [
      "有意思",
      "沒意思"
    ],
    // 「沒意思」的隨機貼圖池
    "emojiPool": [
      ":rolling_eyes:",
      ":smirk:",
      ":pleading_face:",
      ":upside_down:",
      ":melting_face:",
      ":unamused:"
    ]
  },
  // 「要不要」功能設置
  "doYouWant": {
    // 發送訊息格式
    "message": "<otherMsg>",
    // 關鍵字
    "keywords": [
      "要不要"
    ],
    // 發送隨機訊息池
    "sendMessagePool": [
      "要",
      "不要",
      "好問題:melting_face:"
    ]
  },
  // 「一起聊天」功能設置
  "chatTogether": {
    // 關鍵字
    "keywords": {
      "chatTogether": "一起聊天",
      "dontChat": "不要聊天"
    },
    // 發送訊息格式
    "message": {
      // 當使用命令時的錯誤提示
      "errorMessage": {
        // 當使用命令使用者未加入且未標註語音頻道或標註非語音/不存在頻道
      	"notInVoiceChannel":"你必須加入語音頻道或指定頻道",
      	"mentionedUser": "<userId> 不在語音頻道中喔~",
      	"mentionedChannel": "<channelId> 並非語音頻道或不存在~",
      	"mentionedChannel_2": "<channelId> 並非語音頻道或不存在，所以來找 <userId> 啦~"
      },
      // 成功觸發/指定成功時
      "welcome": "歡迎 <userId> 一起聊天",
      // 中斷機器人連線時
      "leave": "<userId> 要想我喔~",
      // 使用「不要聊天」功能，但機器人不再任何語音頻道時
      "absent": "<userId> 想我了? 我不在裡面哦~"
    }
  },
  "activityOption": {
    // 機器人活動狀態
    // https://discord-api-types.dev/api/discord-api-types-v10/enum/ActivityType
    "activityType": 0,
    // 機器人狀態文字
    "activityMessage": "",
    // 機器人活動狀態
    // https://discord-api-types.dev/api/discord-api-types-v10/enum/PresenceUpdateStatus
    "status": "online"
  }
}
```