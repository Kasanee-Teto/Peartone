"use strict";

/** @type {import("sequelize-cli").Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      "Lyrics",
      [
        {
          trackId: "e2cf4d12-0b65-4f1c-9df9-84d6c1f1c932",
          language: "Japanese",
          text: `
          Itsuka
          Awai kimochi wa kakushitekita
          Boku no honto no kokoro kagi kakete
          Dare mo shiranai basho e kakedashite
          Utauyo saisho de saigo no jikken
          Kokoro ni shikkari shimitsuita, kono sabishi sa no kakera hitotsu dake
          Ashita no choushi wa doudesu ka?
          Tte kikarete mo
          Nani ni mo kotae ran maisa

          Bokura wa kyou dake
          Chotto muri shite waratte misete
          Mada matteru ikiru imi o tada

          Tankyuu shite!

          Kyou mo sagasuyo saiensu mitai ni
          Sappari sarasara sanzanna
          Mainichidarou to furasuko no hannou
          Sonzai shoumei mitsuketai

          Ah
          Kai ga nai nante iwanaidekureyo
          Hisshi ni ikiteru kono sekai
          Ima dare mo shiranai teiri o mitsukete
          Kono sabishi sa ni o wakare o
          
          Sukoshi no nemurenu yoru ni
          Kono mahou ga honoka ni tomorunara
          Ima ga sonnani warukunai tte
          Waraeru toki made kyou mo
          Science!

          Tsurai kimochi ga komiagete mo
          Kyou mo honto no kokoro kagi kaketa
          Kotoba ja wakaran koto bakari
          Soshite sekai wa rifujindarakedashita

          Ashita no tenki o
          Yosou dekiru you ni
          Kono kokoro moyou sae mo
          Wakareba dore dake
          Raku ni nareru ka natte

          Kyou mo tankyuu

          Zutto sagasuyo saiensu mitai ni
          Kikkari kirikiri itamukedo
          Itsuka kono tsura sa ga kate ni narukara
          Shoumei shitaina shourai o

          Ah
          Kai wa hitotsu ja nai kamo shirenga
          Hisshi ni aruitetara seikai?
          Ima dare mo shiranai kotae o mitsukete
          Kono sabishi sa o dakishimetai

          Sukoshi no ondo ga yoru ni matte
          Sora no hate made todoite hoshikute
          Kinou no shousoukan mo sa ima wa
          Nami no mukou ni arun da

          Kyou mo sagasuyo saiensu mitai ni
          Sappari sarasara sanzanna
          Mainichidarou to furasuko no hannou
          Sonzai shoumei mitsuketai

          Ah
          Kai ga nai nante iwanaidekureyo
          Hisshi ni ikiteru kono sekai
          Ima dare mo shiranai teiri o mitsukete
          Kono sabishi sa ni o wakare o

          Sukoshi no nemurenu yoru ni
          Kono mahou ga honoka ni tomorunara
          Ima ga sonnani warukunai tte
          Waraeru toki made kyou mo
          Science!
                `,
          createdAt: now,
          updatedAt: now,
        },
        {
          trackId: "0f4f6a6b-0bd3-4c9f-9b55-1d5ed4e2a111",
          language: "Japanese",
          text: `つまづいた夜に
                眠ってる街で
                おやすみさえも
                言えないままで

                夢のまま今日が
                溶けだして君と
                駆け出してどこか
                遠い所へと

                明日に落ちてくその景色

                バイバイバイ寂しい夜が
                溶けてアンコール 空に歌うだけ
                ライライライ 世界は今日だって
                何も考えちゃいないの この通り

                輝く月に
                歌うよ孤独を
                その涙だけ
                海に隠したよ

                これが夢なら
                何処へも行けるよ
                揺られてどこか
                遠い所へと

                繊細なままに回ってる

                愛愛愛して欲しいだけだ
                魔法みたいな今日に舞う言葉ひとつ
                ライライライ世界はなんだって
                ラララ毎日に僕が居なくても

                バイバイバイ寂しい夜が
                溶けてアンコール 空に歌うだけ
                ライライ来世 無いわ 今日だって
                何も考えちゃいないの この通り

                そのままで くたばるよ
                でも言葉だけ綺麗で居たくて

                嗚呼バイバイバイ寂しい夜が
                溶けてアンコール 空に歌うだけ
                歌うだけ
          `,
          createdAt: now,
          updatedAt: now,
        },
        {
          trackId: "1c2b0e6e-7e1a-4ad9-9d43-77d54fb1b222",
          language: "Japanese",
          text: `
          何も無いけど寂しくなった
          僕の心はアンティークの色
          だから旅に出る遠く旅に出る
          オマジナイの衣装ひとつ抱いて

          ぽっかり空いた空白だけが
          どうも平凡な僕に重くて
          だから許して もうさいいでしょ
          どうか特別な魔法かけてよ

          息をする意味はここには無い
          ならありのまま居るだけ！

          今日は魔法にかかったメイド
          夜に煌めいた星の帳
          特別な言葉とお茶菓子を
          ささやかな晴れ舞台

          過去にバイバイバイ
          今を愛愛愛してる
          言えたら痛みにバイバイバイ

          今日は魔法にかかったメイド
          ささやかな晴れ舞台

          独りの夜の暗さが
          いつか孤独に沁みた涙ひとつ
          この気持ちだけ解ってくれる
          魔法みたいな衣装抱きしめて

          息をする意味も見つからない
          なら今は歌うだけだ

          夜の随に踊るメイド
          ほんのりまた痛みもあるけれど
          今は笑っていい気がするの
          あなたも紅茶をどうぞ

          過去にバイバイバイ
          今を愛愛愛してる
          言えたら痛みにバイバイバイ

          夜の随に踊るメイド
          ささやかな晴れ舞台

          今日は魔法にかかったメイド
          夜に煌めいた星の帳
          特別な言葉とお茶菓子を
          ささやかな晴れ舞台

          過去にバイバイバイ
          今を愛愛愛してる
          言えたら痛みにバイバイバイ

          今日は魔法にかかったメイド
          ささやかな晴れ舞台

          そっと咲いて征く言葉だけ
          どうか綺麗で居て欲しいだけ
          明日笑えるから今だけ
          歌い続けるメイド

          過去にバイバイバイ
          今を愛愛愛してる
          言えたら痛みにバイバイバイ

          今日は魔法にかかったメイド
          ささやかな晴れ舞台
          `,
          createdAt: now,
          updatedAt: now,
        },
        {
          trackId: "2d9fb1b3-3c15-4f6b-90a2-1a1c9d7a3333",
          language: "Japanese",
          text: `
          Pyon pyon pyon pyon!
          Pyon pyon pyon pyon!

          Mado no soto wa hare moyou
          Kimochi wa chotto dake tsumetai na
          Kyou mo mata onnaji hibi no kurikaeshi ne
          Tsumannai na tsumannai na

          Chotto dake yume mite mo ii desho?
          Kimi to issho ni kakedashite
          Dokomade demo ikeru kigashichau no
          Tomerarenai yo!

          Pyon pyon tobihanete miyou yo
          Sanzan na mainichi mo wasurechau kurai ni
          Kimi no tonari de warattetai no
          Sore dake de mou saikou janai?
          Pyon pyon hanechao!

          Koronde mo daijoubu
          Mata tachiagareba ii dake sa
          Saa te o totte!

          Pyon pyon tobihanete miyou yo
          Kono sekai ga mabushiku miete kuru made
          Kimi no tonari de utattetai no
          Dokomade demo hibike!
          Pyon pyon hanechao!

          Pyon pyon pyon pyon!
          Pyon pyon pyon pyon!
          `,
          createdAt: now,
          updatedAt: now,
        },
        {
          trackId: "3a3d5df7-3aef-43b1-9a28-3bda4c444444",
          language: "Japanese",
          text: `
          この何でもない手のひらのカードでさ
          1度だけの秘密のイリュージョン
          揺らめくハートそっと消える
          今夜も星のような開幕で
          種も仕掛けも無い世界を
          今日は愛せるのかな
          抱きしめる嘘みたいなホントの時間
          言葉だけじゃつらいは言えないから
          このカードだけ 何も無い夜だけど
          オマジナイみたいな手品ひとつ
          ちょっぴり寂しくて 涙
          零れる終末感 君は
          カードの魔法で微笑んだ
          種も仕掛けもないはずの心の欠片を
          探す旅に出るハートのA
          ちっぽけな感情のキャパシティ
          失敗ばかりしてきたそれでも
          明日の最後笑えるまでは
          この種を明かしちゃいけない
          少しの痛みが 灯っても
          君と抱きしめてる
          解けてくようにすり抜けてくように
          つまらない未来はこの手品で
          変えちゃうからどうか君が笑えるように
          鮮やかな記憶で幕を閉じたい
          しっかりしんどくて
          俯いてきた過去も
          嘘じゃないままギュッて赦せるように
          種も仕掛けもないはずの心の欠片を
          探す旅に出るハートのJ
          ゆっくり過ぎてく日常にほどける
          最後は笑えるような種を明かして
          君がまた微笑むその時まで
          抱きしめる嘘みたいなホントの時間
          言葉だけじゃつらいは言えないから
          このカードだけ 何も無い夜だけど
          オマジナイみたいな手品ひとつ
          ちょっぴり寂しくて 涙
          零れる終末感 君は
          カードの魔法で微笑んだ
          種も仕掛けもないはずの心の欠片を
          探す旅に出るハートのA
          `,
          createdAt: now,
          updatedAt: now,
        },

        {
          trackId: "4b02dca2-5b2d-4d3f-8b73-0f5b1a2f1c01",
          language: "Japanese",
          text: `
          Chikagoro uwasa no ano manga
          Minna wa zutto hanashi teru
          "Sore sore metcha yokatta yo ne"
          Mitakotonaikedo

          Yuzuru no ga mendoude michi kaeta
          Saisho kara ikisaki chigau furi o shite
          Soredemo gouru wa kawaranai no nara
          Kitto sou yatte ikite mo ii no

          Uso ga saki ka ma koto ga saki ka nande sa
          Itsuka kuru sonohi o mae ni wa dochira mo
          Kawaranai

          Odore, odore uso ni odore
          Ima made o sutete ude o fureyo
          Nakami ga nan mo nakute mo
          Mirai wa aru no sa

          Raiaa!, (Raiaa!) Raiaa! (Raiaa!) Dansaa
          Sunaode kizutsuita ano hi o
          Raiaa!, (Raiaa!) Raiaa! (Raiaa!) Dansaa
          Uso de odoru no sa

          Tatoeba do shaburi no ame datte
          Zubu nure de dou shiyou mo nakute mo
          Aozora ni mieru megane areba
          Hare no youna kimochidesho

          Kako ga kae rarenai mononaraba
          Yosa-gena toko dake tsugihagi de tsunagete
          Henkou houdou-magai no ayumi demo
          Kitto sou yatte ikite mo ii yo

          Odore uso to odore
          Ashidori de yurase kono sekai o
          Mikake dake no zouka mo
          Kokoro ugokasu no sa

          Raiaa!, (Raiaa!) Raiaa! (Raiaa!) Dansaa
          Fuande se o muketa ashita to
          Raiaa!, (Raiaa!) Raiaa! (Raiaa!) Dansaa
          Uso de odoru no sa

          Ima shiawase ka shiawase janai ka nante sa
          Itsu no hi ni ka jibun ga katte ni kimerukara
          Odotta mon kachi

          Odore, odore
          Risou to chigakute
          Subete kara kiete hitorikiri no
          Yoru ni mo feiku o terase
          Aa usode yokatta!

          Odore, odore uso ni odore
          Ima made o sutete ude o fureyo
          Soko kara hajimaru no sa
          Itsuwari no paatiinaito

          Raiaa!, (Raiaa!) Raiaa! (Raiaa!) Dansaa
          Sunaode kizutsuita ano hi o
          Raiaa!, (Raiaa!) Raiaa! (Raiaa!) Dansaa
          Uso de odoru no sa!
          `,
          createdAt: now,
          updatedAt: now,
        },
        {
          trackId: "5c13edb3-6c3e-4c4f-9c84-1a6c2b3f2d02",
          language: "Japanese",
          text: `
          Ore wa, shiranai, nani mo, shiranai
          Nani mo, mitenai, dare mo, mitenai
          Sora wo, mite mo, mienai, yoru no
          Kaketa, tsuki ni, usagi
          Kore wa, nanda, sore ga, nanika?
          Koko wa, tanoshi, sore de, yoroshi
          Hashiru, nigeru, nigasu, sorasu
          Tsuki no, kaketa, basho e

          Arara, arara, arara, arara, arara
          Arara, arara, arara, arara, arara

          Mousou tomedonaku
          Souzou togamenaku
          Shoudou, osamarazu
          Nazeka, nazeka, nazeka, nazekashira?

          Saiaku da
          Koujoryouzoku wo haide nuide odore
          Iya saitei ka
          Nande nande tsutte, nanka nanka takanatte
          Saiaku da
          Sou mo kou mo shinee yo katte ni shiyagare
          Iya saitei ka
          Iyaa mou honto, saiaku da, da, da, da, da, o, ou

          Nete mo samete mo tsukimatou
          Mienu ishiki no uragawa ni
          Ookiku aita kuroi ana
          Wakaru, wakaru, wakaru

          Yurusu, yurusen, yurusu, yuruse
          Kawaii, ehehe, mufufu, kowai
          Ringo, gorira, rakugo, gojira
          Rakuda, dabora, ramadan

          Watashitachi, zettai ni mitemasen
          Ittemasen, kiitemasen, shitta koccha arimasen
          Hikari wo isshi, kage ni hitotsuki
          Yurusarezaru shikou wo, atehamaranai ijou wo
          Tsutsunde ikite ikou ja arimasenka

          Koudou, na mo motazu
          Kyousou, imi mo naku
          Eigou, jiko mazoku
          Dakara, dakara, dakara, dakara kana?

          Saikou da
          Nou ga kouka shite nda, bukkowashite sakebe
          Iya saikou ka?
          Nande nande tsutte, bakko bakko hanechatte
          Saikou da
          Gukou kikou de kekkou, katte ni ikitare
          Iya saikou ka
          Iyaa mou honto, saikou da, da, da, da, da, iessaa

          Mukashimukashi no omoitsuki
          Muigi muimi no hitodakari
          Mujaki muteki no umaretsuki
          Sore ga, sore ga, sore ga

          Musekinin shuugoutai
          Anta mo watashi mo kankeinai
          Musekinin shuugoutai
          Tanoshiku yatterya moumantai
          Katte ni yatterya mondai nashi

          Ore wa, shiranai, nani mo, shiranai
          Nani mo, mitenai, dare mo, mitenai
          Kioku, chigai, yume no, hanashi
          Sou iu, koto de, sore ja
          `,
          createdAt: now,
          updatedAt: now,
        },
        {
          trackId: "6d24fea4-7d4f-4d5f-8d95-2b7d3c4f3e03",
          language: "Japanese",
          text: `
          ずっと前の気持ち
          捨て切れなくて
          心が足りない
          いくつになってもね
          ほら見てごらん
          でかい空
          もう落ちてきちゃいそうで
          もう もう 落ちてきちゃいそうで！

          ちっちゃな私がさ
          あーあ あーあ あー繰り返す
          ちっちゃな私はさ
          また また あー繰り返す

          見ないフリしても
          忘れようとしても
          とんがった痛みが
          いつまでもついてまわる
          そんな こんな 小ささでは
          風で飛んでってしまうよなー
          飛んで 飛んで 飛んでったらよかったのにな

          ちっちゃな私がさ
          あーあ あーあ あー気にしてる
          ちっちゃな私はさ
          今日も 今日も あー気にしてる

          悲しくなった？ 悲しくなった
          恥ずかしかった？ 恥ずかしかった
          やめたい？ やめたい
          消えたい？ 消えたい
          泣きたい？ 泣きたい
          そっか そうなのよ

          ちっちゃな私がさ
          ずっと ずっと あーここにいる
          ちっちゃな私がさ
          ずっと ずっと 胸の中にいる
          あー
          ちっちゃな私には
          全部 全部 大きすぎて
          ちっちゃな私はさ
          今日も 今日を あー繰り返す
          `,
          createdAt: now,
          updatedAt: now,
        },
        {
          trackId: "7e350fb5-8e50-4e6f-9ea6-3c8e4d5f4f04",
          language: "Japanese",
          text: `
          うーわ 最悪 もうだめだ
          お前はいつもそうだ
          ずっとなにやってんだ
          はぁ…はぁ…はぁ…はぁ…
          最低の感情は
          常識の反対が
          全部ぶっ壊していった。
          それは
          ”お化け”のような
          ”影”のような
          ”鏡”のような姿をしていて
          ハードラックの因果
          センチメンタルの正体
          暴いていったんだ
          BANG! BANG! BANG!
          崩壊！
          やっちまった ハハ
          手遅れだよ おかしいんだ！
          何仕出かすかわかんねぇぞ！

          親には見せられない、
          恥に塗れた生き方──。

          広大な空は逆さになって
          無限の底になった
          馬鹿をやって
          ツケが回って
          今になって やってきた！
          ここから先の展開は想像できない
          感動も業も熱狂も絶望も希望も
          待っている。
          君を待っている。

          うわああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ

          例えば適当に描いた落書きから
          全てが始まっていたとしたら？
          どこかでまた会えたら 話してあげよっかな
          本当のことを──
          後悔してるんだ
          もう会えないんだ
          記憶に閉じこもって
          胸の鼓動だけに
          支配されていれば
          どれだけ楽なのか

          過去には戻れない
          前にしか進めない
          わ〜〜〜〜〜〜〜〜〜

          しゃあっ！続行だ！
          馬鹿ばっかだ そうか
          確かめたいんだ 見たいんだ
          そんなんじゃくたばんねぇぞ！
          いまだかつてない速度で
          混沌の時代がやってくる─！

          巨大な理想 世界を埋めて
          不幸な思考を奪った
          二人で笑って
          一人で泣いて
          ゼロになって 始まった！
          昨日に止まった空想なんてもういらない
          最高を奇妙を僥倖を嘲笑を熱情を
          今迎えに行くんだ

          ダッダッダッダッダーッダッダッ
          ダッダッダッダーッダッダッ
          ”ウルトラトレーラー” さぁ、幕が上がるぜ──。
          山の向こうに 空の向こうに
          ある心教えて
          ダーッダッダラララ
          ダッダッダッダッダーッダッダッ
          ダッダッダッダーッダッダッ
          ”ウルトラトレーラー” 想像を超えて──。
          言葉にできない 強大な感情が
          僕を動かしている
          `,
          createdAt: now,
          updatedAt: now,
        },
        {
          trackId: "aa1b2c3d-4e5f-6789-a012-3456789abcde",
          language: "Japanese",
          text: `
          実際の感情は no think
          気付かないフリ
          絶対的な虚実と心中
          そうやって減っていく安置
          傷の切り売り
          脆く叫ぶ、醜態
          そんなあなたにオススメ
          最高級の逃避行
          やがて、甘美な罠に
          釣られたものから救われる
          もはや正気の沙汰では
          やっていけないこの娑婆じゃ
          敢えて素知らぬ顔で
          身を任せるのが最適解

          言葉で飾った花束も
          心を奪えば、本物か
          全てが染まっていくような
          事象にご招待

          さらば
          こんな時代に誂えた
          見て呉れの脆弱性
          本当の芝居で騙される
          矢鱈と煩い心臓の鼓動
          残機は疾うにないなっている
          擦り減る耐久性
          目の前の事象を躱しつつ
          生きるので手一杯
          誰か、助けてね
          
          「あなた段々眠くなる」
          浅はかな催眠術
          頭、身体、煙に巻く
          まさか、数多誑かす
          目の前で揺らぐ硬貨
          動かなくなる彼方
          「これでいいんだ」
          自分さえも騙し騙し shut down
          「あなた段々眠くなる」
          浅はかな催眠術
          頭、身体、煙に巻く
          まさか、数多誑かす
          目の前で揺らぐ硬貨
          動かなくなる彼方

          どんなに今日を生き抜いても
          報われぬ every day
          もう bot みたいなサイクルで
          惰性の瞬間を続けているのだ
          運も希望も無いならば
          尚更しょうがねえ
          無いもんは無いで、諦めて
          余物で勝負するのが運命

          こんな時代に誂えた
          見て呉れの脆弱性
          本当の芝居で騙される
          矢鱈と煩い心臓の鼓動
          賛美はもう意味ないなっている
          偽のカリスマ性
          現実を直視しすぎると
          失明しちゃうんだ
          だから、適度にね
          `,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Lyrics", null, {});
  },
};