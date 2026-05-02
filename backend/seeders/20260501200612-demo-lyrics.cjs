"use strict";

/** @type {import("sequelize-cli").Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

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
          createdAt: yesterday,
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
          createdAt: yesterday,
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
          createdAt: yesterday,
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
          createdAt: yesterday,
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
          createdAt: yesterday,
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
          createdAt: yesterday,
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
          createdAt: yesterday,
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
          createdAt: yesterday,
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
          createdAt: yesterday,
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
          createdAt: yesterday,
          updatedAt: now,
        },
        {
          trackId: "550e8400-e29b-41d4-a716-446655440000",
          language: "Japanese",
          text: `
            貴方は風のように
            目を閉じては夕暮れ
            何を思っているんだろうか, hmm

            目蓋を開いていた
            貴方の目はビイドロ
            少しだけ晴るの匂いがした

            晴れに晴れ、花よ咲け
            咲いて晴るのせい
            降り止めば雨でさえ
            貴方を飾る晴る
            胸を打つ音よ凪げ
            僕ら晴る風
            あの雲も越えてゆけ
            遠くまだ遠くまで

            貴方は晴れ模様に
            目を閉じては青色
            何が悲しいのだろうか, hmm

            目蓋を開いている
            貴方の目にビイドロ
            今少し雨の匂いがした

            泣きに泣け、空よ泣け
            泣いて雨のせい
            降り頻る雨でさえ
            雲の上では晴る
            土を打つ音よ鳴れ
            僕ら春荒れ
            あの海も越えてゆく
            遠くまだ遠くまで
\
            通り雨 草を靡かせ
            羊雲 あれも春のせい
            風のよう 胸に春乗せ
            晴るを待つ

            晴れに晴れ、空よ裂け
            裂いて春のせい
            降り止めば雨でさえ
            貴方を飾る晴る
            胸を打つ音奏で
            僕ら春風
            音に聞く晴るの風
            さぁこの歌よ凪げ！

            晴れに晴れ、花よ咲け
            咲いて春のせい
            あの雲も越えてゆけ
            遠くまだ遠くまで
          `,
          createdAt: yesterday,
          updatedAt: now,
        },
        {
          trackId: "4f8c92b1-e7a3-4b6d-9c1f-2e8d5b0a3f4c",
          language: "Japanese",
          text: `
            夜に浮かんでいた
            海月のような月が爆ぜた
            バス停の背を覗けば
            あの夏の君が頭にいる

            だけ

            鳥居 乾いた雲 夏の匂いが頬を撫でる
            大人になるまでほら、背伸びしたままで
            遊び疲れたらバス停裏で空でも見よう
            じきに夏が暮れても きっときっと覚えてるから

            追いつけないまま大人になって
            君のポケットに夜が咲く
            口に出せないなら僕は一人だ
            それでいいからもう諦めてる

            だけ

            夏日 乾いた雲 山桜桃梅 錆びた標識
            記憶の中はいつも夏の匂いがする
            写真なんて紙切れだ 思い出なんてただの塵だ
            それがわからないから、口を噤んだまま
            絶えず君のいこふ 記憶に夏野の石一つ

            俯いたまま大人になって
            追いつけない ただ君に晴れ
            口に出せないまま坂を上った
            僕らの影に夜が咲いていく

            俯いたまま大人になった
            君が思うまま手を叩け
            陽の落ちる坂道を上って
            僕らの影は あ あ

            追いつけないまま大人になって
            君のポケットに夜が咲く
            口に出せなくても僕ら一つだ
            それでいいだろ、もう
            君の想い出を噛み締めてる

            だけ
          `,
          createdAt: yesterday,
          updatedAt: now,
        },
        {
          trackId: "b9d1e2f3-a4c5-40b9-8e7d-6c5b4a3f2e1d",
          language: "Japanese",
          text: `
            もう忘れてしまったかな
            夏の木陰に座ったまま
            氷菓(アイス)を口に放り込んで風を待っていた
            もう忘れてしまったかな
            世の中の全部嘘だらけ
            本当の価値を二人で探しに行こうと笑ったこと

            忘れないように
            色褪せないように
            形に残るものが全てじゃないように

            言葉をもっと教えて 夏が来るって教えて
            僕は描いてる 眼に映ったのは夏の亡霊だ
            風にスカートが揺れて 想い出なんて忘れて
            浅い呼吸をする, 汗を拭って夏めく

            もう忘れてしまったかな
            夏の木陰に座った頃
            遠くの丘から顔出した雲があったじゃないか
            君はそれを掴もうとして
            馬鹿みたいに空を切った手で
            僕は紙に雲一つを書いて
            笑って握って見せて

            忘れないように
            色褪せないように
            歴史に残るものが全てじゃないから

            今だけ顔も失くして
            言葉も全部忘れて
            君は笑ってる
            夏を待っている僕ら亡霊だ
            心をもっと教えて
            夏の匂いを教えて
            浅い呼吸をする

            忘れないように
            色褪せないように
            心に響くものが全てじゃないから

            言葉をもっと教えて
            さよならだって教えて
            今も見るんだよ
            夏に咲いてる花に亡霊を
            言葉じゃなくて時間を
            時間じゃなくて心を
            浅い呼吸をする, 汗を拭って夏めく

            夏の匂いがする
            夏の匂いがする

            もう忘れてしまったかな
            夏の木陰に座ったまま
            氷菓(アイス)を口に放り込んで風を待っていた
          `,
          createdAt: yesterday,
          updatedAt: now,
        },
        {
          trackId: "a7c1e92d-b84f-4d3a-91e2-f6c5b4a3d2e1",
          language: "Japanese",
          text: `
            変わらない風景 浅い正午
            高架下、藍二乗、寝転ぶまま
            白紙の人生に拍手の音が一つ鳴っている
            空っぽな自分を今日も歌っていた

            変わらないように
            君が主役のプロットを書くノートの中
            止まったガス水道 世間もニュースも所詮他人事
            この人生さえほら、インクみたいだ

            あの頃ずっと頭に描いた夢も 大人になるほど時効になっていく

            ただ、ただ雲を見上げても
            視界は今日も流れるまま
            遠く仰いだ夜に花泳ぐ
            春と見紛うほどに
            君をただ見失うように

            転ばないように下を向いた
            人生はどうにも妥協で出来てる
            心も運命もラブソングも人生も信じない
            所詮売れないなら全部が無駄だ

            わざと零した夢で描いた今に寝そべったままで時効を待っている

            ただ、ただ目蓋の裏側
            遠く描く君を見たまま
            ノート、薄い夜隅に花泳ぐ
            僕の目にまた一つ

            人生は妥協の連続なんだ
            そんなこと疾うにわかってたんだ
            エルマ、君なんだよ
            君だけが僕の音楽なんだ

            この詩はあと八十字
            人生の価値は、終わり方だろうから

            ただ、ただ君だけを描け
            視界の藍も滲んだまま
            遠く仰いだ空に花泳ぐ
            この目覆う藍二乗

            ただ、ただ
            遠く仰いだ空、君が涼む
            ただ夜を泳ぐように
          `,
          createdAt: yesterday,
          updatedAt: now,
        },
        {
          trackId: "2d3e4f5a-6b7c-4890-a1b2-c3d4e5f6a7b8",
          language: "Japanese",
          text: `
            言って

            あのね, 私実は気付いてるの
            ほら, 君がいったこと
            あまり考えたいと思えなくて
            忘れてたんだけど

            盲目的に盲動的に妄想的に生きて
            衝動的な焦燥的な消極的なままじゃ駄目だったんだ

            きっと, 人生最後の日を前に思うのだろう
            全部, 全部言い足りなくて惜しいけど
            あぁ, いつか人生最後の日, 君がいないことを
            もっと, もっと, もっと
            もっと, ちゃんと言って

            あのね, 空が青いのってどうやって伝えればいいんだろうね
            夜の雲が高いのってどうすれば君もわかるんだろう
            言って

            あのね, 私実はわかってるの
            もう君が逝ったこと
            あのね, わからず屋って言うんだろうね 忘れたいんだけど

            もっとちゃんと言ってよ
            忘れないようメモにしてよ
            明日十時にホームで待ち合わせとかしよう
            牡丹は散っても花だ
            夏が去っても追慕は切だ
            口に出して 声に出して
            君が言って

            そして人生最後の日, 君が見えるのなら

            きっと, 人生最後の日も愛をうたうのだろう
            全部, 全部無駄じゃなかったって言うから
            あぁ, いつか人生最後の日, 君がいないことがまだ信じられないけど

            もっと, もっと, もっと, もっと
            もっと, もっと, もっと, 君が
            もっと, もっと, もっと, もっと

            もっと, ちゃんと言って
          `,
          createdAt: yesterday,
          updatedAt: now,
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Lyrics", null, {});
  },
};