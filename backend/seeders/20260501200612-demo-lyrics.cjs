
"use strict";
/** @type {import("sequelize-cli").Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const entries = [
      {
        "trackId": "e2cf4d12-0b65-4f1c-9df9-84d6c1f1c932",
        "language": "Japanese",
        "text": `
[00:00.62]itsuka
[00:01.14]awai kimochi wa kakushite kita
[00:03.12]boku no honto no kokoro kagi kakete
[00:05.53]dare mo shiranai basho e kakedashite
[00:08.18]utau yo saisho de saigo no jikken
[00:10.57]kokoro ni shikkari shimitsuita kono sabishisa no kakera hitotsu dake
[00:15.75]ashita no choushi wa dou desu ka tte kikarete mo
[00:19.33]nani ni mo kotaerannai sa
[00:21.58]bokura wa kyou datte chotto muri shite waratte misete
[00:25.85]mada matteru ikiru imi o tada
[00:29.03]tankyuu shite!
[00:31.16]kyou mo sagasu yo saiensu mitai ni
[00:33.95]sappari sarasara sanzan na
[00:36.34]mainichi darou to furasuko no hannou
[00:39.13]sonzai shoumei mitsuketai
[00:41.39]aa
[00:41.78]kai ga nai nante iwanaide kure yo
[00:44.43]hisshi ni ikiteru kono sekai
[00:46.42]ima dare mo shiranai teiri o mitsukete
[00:49.49]kono sabishisa ni o wakare o
[00:51.75]sukoshi no nemurenu yoru ni kono mahou ga honoka ni tomoru nara
[00:56.53]ima ga sonna ni warukunai tte waraeru toki made kyou mo
[01:01.17]science!
[01:22.79]tsurai kimochi ga komiagete mo kyou mo honto no kokoro kagi kaketa
[01:27.43]kotoba ja wakaran koto bakari soshite sekai wa rifujin darake deshita
[01:33.15]ashita no tenki o
[01:34.87]yosou dekiru you ni kono kokoromoyou sae mo
[01:38.20]wakareba dore dake raku ni nareru ka natte
[01:41.39]kyou mo tankyuu!
[01:42.71]zutto sagasu yo saiensu mitai ni
[01:45.64]kikkari kirikiri itamu kedo
[01:47.90]itsuka kono tsurasa ga kate ni naru kara
[01:50.68]shoumei shitai na shourai o
[01:52.81]aa
[01:53.34]kai wa hitotsu janai kamo shirenga
[01:55.85]hisshi ni aruitetara seikai?
[01:57.98]ima dare mo shiranai kotae o mitsukete
[02:00.90]kono sabishisa o dakishimetai
[02:03.43]sukoshi no ondo ga yoru ni matte sora no hate made todoite hoshikute
[02:08.62]kinou no shousoukan mo sa ima wa nami no mukou ni arunda
[02:34.12]kyou mo sagasu yo saiensu mitai ni
[02:36.63]sappari sarasara sanzan na
[02:38.90]mainichi darou to furasuko no hannou
[02:41.71]sonzai shoumei mitsuketai
[02:43.96]aa
[02:44.22]kai ga nai nante iwanaide kure yo
[02:47.02]hisshi ni ikiteru kono sekai
[02:49.00]ima dare mo shiranai teiri o mitsukete
[02:52.06]kono sabishisa ni o wakare o
[02:54.46]sukoshi no nemurenu yoru ni kono mahou ga honoka ni tomoru nara
[02:59.24]ima ga sonna ni warukunai tte waraeru toki made kyou mo
[03:03.75]science!`
      },
      {
        "trackId": "0f4f6a6b-0bd3-4c9f-9b55-1d5ed4e2a111",
        "language": "Japanese",
        "text": `
[00:14.81]tsumazuita yoru ni nemutteru machi de
[00:18.80]oyasumi sae mo ienai mama de
[00:22.26]yume no mama kyou ga tokedashite kimi to
[00:25.96]kakedashite dokoka tooi tokoro e to
[00:29.42]ashita ni ochiteku sono keshiki
[00:33.14]bai bai bai sabishii yoru ga
[00:36.32]tokete ankooru sora ni utau dake
[00:40.04]rai rai rai sekai wa kyou datte
[00:43.50]nani mo kangaecha inai no kono toori
[00:55.46]kagayaku tsuki ni utau yo kodoku o
[00:58.67]sono namida dake umi ni kakushita yo
[01:02.10]kore ga yume nara doko e mo ikeru yo
[01:06.35]yurarete dokoka tooi tokoro e to
[01:09.54]sensai na mama ni mawatteru
[01:13.26]ai ai aishite hoshii dake da
[01:16.18]mahou mitai na kyou ni mau kotoba hitotsu
[01:20.43]rai rai rai sekai wa nan datte
[01:23.62]rarara mainichi ni boku ga inakute mo
[01:42.46]bai bai bai sabishii yoru ga
[01:45.37]tokete ankooru sora ni utau dake
[01:49.09]rai rai raise nai wa kyou datte
[01:52.81]nani mo kangaecha inai no kono toori
[01:56.81]sono mama de kutabaru yo
[02:00.26]demo kotoba dake kirei de itakute
[02:03.70]aa bai bai bai sabishii yoru ga
[02:07.43]tokete ankooru sora ni utau dake
[02:11.43]utau dake`
      },
      {
        "trackId": "1c2b0e6e-7e1a-4ad9-9d43-77d54fb1b222",
        "language": "Japanese",
        "text": `
[00:00.36]nani mo nai kedo samishiku natta
[00:02.87]boku no kokoro wa antiiku no iro
[00:05.80]dakara tabi ni deru tooku tabi ni deru
[00:08.47]omajinai no ishou hitotsu daite
[00:11.26]pokkari aita kuuhaku dake ga
[00:14.06]doumo heibon na boku ni omokute
[00:16.71]dakara yurushite mou saiidesho
[00:19.50]douka tokubetsu na mahou kakete yo
[00:23.10]iki o suru imi wa koko ni wa nai
[00:25.07]nara ari no mama iru dake!
[00:27.46]kyou wa mahou ni kakatta meido
[00:30.66]yoru ni kirameita hoshi no tobari
[00:33.18]tokubetsu na kotoba to ochagashi o
[00:35.99]sasayaka na harebutai
[00:38.78]kako ni baibai bai ima o ai ai aishiteru
[00:41.68]ietara itami ni baibai bai
[00:43.96]kyou wa mahou ni kakatta meido
[00:46.88]sasayaka na harebutai
[00:50.07]hitori no yoru no kurasa ga
[01:03.07]itsu ka kodoku ni shimita namida hitotsu
[01:06.12]kono kimochi dake wakatte kureru
[01:08.51]mahou mitai na ishou dakishimete
[01:11.31]iki o suru imi mo mitsukaranai
[01:14.09]nara ima wa utau dake da
[01:16.48]yoru no manimani odoru meido
[01:19.54]hon'nori mata itami mo aru keredo
[01:22.34]ima wa waratte ii ki ga suru no
[01:25.12]anata mo koucha o douzo
[01:27.65]kako ni baibai bai ima o ai ai aishiteru
[01:30.96]ietara itami ni baibai bai
[01:33.09]yoru no manimani odoru meido
[01:35.87]sasayaka na harebutai
[01:41.20]kyou wa mahou ni kakatta meido
[01:52.34]yoru ni kirameita hoshi no tobari
[01:55.01]tokubetsu na kotoba to ochagashi o
[01:57.67]sasayaka na harebutai
[02:00.31]kako ni baibai bai ima o ai ai aishiteru
[02:03.51]ietara itami ni baibai bai
[02:05.90]kyou wa mahou ni kakatta meido
[02:08.68]sasayaka na harebutai
[02:11.62]sotto saite yuku kotoba dake
[02:14.13]douka kirei de ite hoshii dake
[02:16.93]ashita waraeru kara ima dake
[02:19.59]utai tsuzukeru meido
[02:22.24]kako ni baibai bai ima o ai ai aishiteru
[02:25.56]ietara itami ni baibai bai
[02:27.68]kyou wa mahou ni kakatta meido
[02:30.61]sasayaka na harebutai`
      },
      {
        "trackId": "2d9fb1b3-3c15-4f6b-90a2-1a1c9d7a3333",
        "language": "Japanese",
        "text": `
[00:02.29]tsuki no uragawa omochi tsuiteru
[00:15.57]mada nemui mama no usagi wa matte iru
[00:19.28]yoru ni pyon pyon no toki ga yatte kuru no o
[00:22.73]yume no mukou de hoshi ga nobotte
[00:26.19]mada awai mama no kokoro ga hanetara
[00:30.19]kyou no pyon pyon no mai o oboete ite ne
[00:33.64]potsun ochiru kotoba mitai
[00:36.82]soshite ima odoru kara ne
[00:38.67]see no
[00:39.24]pyon pyon pyon pyo pyon
[00:40.82]watashi usagi
[00:41.89]fuwafuwa fuwafuwa haneru
[00:44.00]kimi no tareta mimi ni todoke
[00:46.67]tsuki no uragawa de naitete mo
[00:49.86]hora
[00:50.14]pyon pyon pyon pyo pyon
[00:51.72]kimi mo usagi
[00:52.81]toro toro torokeru yawaraka haato ni
[00:56.25]namida no toumei o nazeru haamonii
[00:59.43]fantajii mitai
[01:03.68]kurumaru kurumaru futon datte daisuki
[01:06.07]soto de wa ikiteku sore wa chotto kowakute
[01:09.00]kurumaru kurumaru fuwafuwa tte daisuki
[01:11.92]powapowa powapowa mada nemui mama de
[01:14.59]dekireba saigo made aa ninjin makura umoretai
[01:19.39]see no
[01:19.90]pyon pyon pyon pyo pyon
[01:21.76]watashi usagi
[01:22.84]fuwafuwa fuwafuwa haneru
[01:24.95]kimi no samishisou na koe ga
[01:27.59]te o nigittara mou daijoubu da yo
[01:30.81]pyon pyon pyon pyo pyon kimi mo usagi
[01:33.46]kimi mo usagi
[01:34.00]mada mada mada mada koko de odorou
[01:36.40]honto no kimochi wa yawarakai mama
[01:39.57]matteru kara
[01:42.76]yume no tsuzuki dake
[01:44.07]nukunuku na hanashi de susumasete
[01:46.48]dondon
[01:47.26]yoru no tsuzuki dake
[01:48.87]yasashii kotoba de mitashite
[01:52.31]nee
[01:52.85]pyon pyon pyon pyo pyon
[01:54.46]watashi usagi
[01:55.25]fuwafuwa fuwafuwa haneru
[01:57.10]kimi no tareta mimi ni todoke
[02:00.29]tsuki no uragawa de naitete mo
[02:03.48]hora
[02:04.01]pyon pyon pyon pyo pyon
[02:05.34]kimi mo usagi
[02:06.40]toro toro torokeru yawaraka haato ni
[02:09.59]namida no toumei o nazeru haamonii
[02:13.03]fantajii mitai`
      },
      {
        "trackId": "3a3d5df7-3aef-43b1-9a28-3bda4c444444",
        "language": "Japanese",
        "text": `
[00:00.55]kono nandemonai te no hira no kaado de sa
[00:03.46]ichido dake no himitsu no iryuujon
[00:06.65]yurameku haato sotto kieru
[00:09.31]konya mo hoshi no you na kaimaku de
[00:13.28]tane mo shikake mo nai sekai o
[00:15.94]kyou wa aiseru no kana
[00:19.66]dakishimeru uso mitai na honto no jikan
[00:22.85]kotoba dake ja tsurai wa ienai kara
[00:26.03]kono kaado dake nani mo nai yoru da kedo
[00:28.96]omajinai mitai na tejina hitotsu
[00:32.40]choppiri sabishikute namida
[00:34.27]koboreru shuumatsukan kimi wa
[00:35.86]kaado no mahou de hohoenda
[00:38.78]tane mo shikake mo nai hazu no kokoro no kakera o
[00:42.24]sagasu tabi ni deru haato no ACE
[00:51.81]chippoke na kanjou no kyapashiti
[01:01.35]shippai bakari shite kita soredemo
[01:04.56]ashita no saigo waraeru made wa
[01:07.48]kono tane o akashicha ikenai
[01:10.93]sukoshi no itami ga tomotte mo
[01:13.87]kimi to dakishimeteru
[01:17.04]hodoketeku you ni surinuketeku you ni
[01:20.23]tsumaranai mirai wa kono tejina de
[01:23.42]kaechau kara douka kimi ga waraeru you ni
[01:26.89]azayaka na kioku de maku o tojitai
[01:30.60]shikkari shindokute
[01:31.92]utsumuite kita kako mo
[01:33.51]uso ja nai mama gyutte yuruseru you ni
[01:36.18]tane mo shikake mo nai hazu no kokoro no kakera o
[01:39.65]sagasu tabi ni deru haato no JACK
[01:57.43]yukkuri sugite ku nichijou ni hodokeru
[01:58.76]saigo wa waraeru you na tane o akashite
[02:05.43]kimi ga mata hohoemu sono toki made
[02:08.34]dakishimeru uso mitai na honto no jikan
[02:11.27]kotoba dake ja tsurai wa ienai kara
[02:14.71]kono kaado dake nani mo nai yoru da kedo
[02:17.90]omajinai mitai na tejina hitotsu
[02:21.09]choppiri sabishikute namida
[02:23.21]koboreru shuumatsukan kimi wa
[02:24.81]kaado no mahou de hohoenda
[02:27.74]tane mo shikake mo nai hazu no kokoro no kakera o
[02:31.18]sagasu tabi ni deru haato no ACE`
      },
      {
        "trackId": "4b02dca2-5b2d-4d3f-8b73-0f5b1a2f1c01",
        "language": "Japanese",
        "text": `
[00:01.88]chikagoro uwasa no ano manga
[00:27.91]minna wa zutto hanashiteru
[00:30.57]sore sore meccha yokatta yo ne
[00:33.49]mita koto nai kedo
[00:36.14]kono ato bareta
[00:38.54]yuzuru no ga mendou de michi kaeta
[00:39.32]saisho kara ikisaki chigau furi o shite
[00:41.99]soredemo gooru wa kawaranai no nara
[00:44.65]kitto sou yatte ikite mo ii no
[00:48.36]uso ga saki ka makoto ga saki ka nante sa
[00:52.35]itsuka kuru sono hi o mae ni wa dochira mo
[00:56.34]kawaranai
[00:58.99]odore odore uso ni odore
[01:02.71]ima made o sutete ude o fure yo
[01:05.90]nakami ga nan mo nakute mo
[01:09.07]mirai wa aru no sa
[01:11.20]raiaa raiaa dansaa
[01:14.12]sunao de kizutsuita ano hi o
[01:17.31]raiaa raiaa dansaa
[01:19.98]uso de odoru no sa
[01:22.89]tatoeba doshaburi no ame datte
[01:38.32]zubunure de doushiyou mo nakute mo
[01:40.98]aozora ni mieru megane areba
[01:43.90]hare no you na kimochi desho
[01:46.56]kako ga kaerarenai mono naraba
[01:49.76]yosage na toko dake tsugihagi de tsunagete
[01:52.40]henkou houdou magai no ayumi demo
[01:55.60]kitto sou yatte ikite mo ii yo
[01:59.31]odore uso to odore
[02:00.90]ashidori de yurase kono sekai o
[02:04.09]mikake dake no zouka mo
[02:06.76]kokoro ugokasu no sa
[02:08.90]raiaa raiaa dansaa
[02:12.34]fuan de se o muketa ashita to
[02:15.00]raiaa raiaa dansaa
[02:17.91]uso de odoru no sa
[02:20.87]ima shiawase ka shiawase janai ka nante sa
[02:49.31]itsu no hi ni ka jibun ga katte ni kimeru kara
[02:52.50]odotta mongachi
[02:54.62]odore odore
[02:58.09]risou to chigakute
[02:59.68]subete kara kiete hitorikiri no
[03:02.86]yoru ni mo feiku o terase
[03:05.25]aa uso de yokatta!
[03:07.90]odore odore uso ni odore
[03:10.56]ima made o sutete ude o fure yo
[03:14.28]soko kara hajimaru no sa
[03:16.13]itsuwari no paatii naito
[03:19.33]raiaa raiaa dansaa
[03:21.97]sunao de kizutsuita ano hi o
[03:25.16]raiaa raiaa dansaa
[03:28.09]uso de odoru no sa`
      },
      {
        "trackId": "5c13edb3-6c3e-4c4f-9c84-1a6c2b3f2d02",
        "language": "Japanese",
        "text": `
[00:01.08]ore wa shiranai nani mo shiranai
[00:08.52]nani mo mitenai dare mo mitenai
[00:11.72]sora o mite mo mienai yoru no
[00:15.44]kaketa tsuki ni usagi
[00:19.16]kore wa nanda sore ga nanika?
[00:22.62]koko wa tanoshi sore de yoroshi
[00:25.80]hashiru nigeru nigasu sorasu
[00:29.53]tsuki no kaketa basho e
[00:33.50]arara arara arara arara arara
[00:40.40]arara arara arara arara arara
[00:47.86]mousou tomedonaku
[00:50.52]souzou togamenaku
[00:54.50]shoudou osamarazu
[00:57.96]nazeka nazeka nazeka nazekashira?
[01:01.67]saiaku da!
[01:02.74]koujoryouzoku o haide nuide odore!
[01:05.12]iya saitei ka!
[01:06.20]nande nande tsutte
[01:07.26]nanka nanka takanatte
[01:08.59]saiaku da!
[01:09.65]doumo kou mo shinee yo katte ni shiyagare!
[01:12.31]iya saitei ka!
[01:13.10]iyaa mou honto
[01:14.18]saiaku da! da! da! da! da!
[01:16.04]o, ou…
[01:16.56]nete mo samete mo tsukimatou
[01:19.50]mienu ishiki no uragawa ni
[01:22.95]ookiku aita kuroi ana
[01:26.65]wakaru
[01:27.18]wakaru
[01:28.26]wakaru
[01:29.84]yurusu yurusen yurusu yuruse
[01:33.82]kawaii ehehe mufufu kowai
[01:37.03]ringo gorira rakugo gojira
[01:40.73]rakuda dabora ramadan
[01:43.93]watashitachi, zettai ni mitemasen!!
[02:02.54]ittemasen!! kiitemasen!! shitta koccha arimasen!!
[02:05.20]hikari o isshi!! kage ni hitotsuki!!
[02:09.19]yurusarezaru shikou o!! atehamaranai ijou o!!
[02:12.37]tsutsunde ikite ikou ja arimasen ka!!
[02:14.75]koudou na mo motazu
[02:17.68]kyousou imi mo naku
[02:21.15]eigou jikomanzoku
[02:24.59]dakara dakara dakara
[02:26.99]dakara kana?
[02:28.31]saikou da!
[02:31.25]nou ga kouka shite nda
[02:33.09]bukkowashite sakebe!
[02:34.15]iya saikou ka!?
[02:34.96]nande nande tsutte
[02:36.00]bakko bakko hanechatte
[02:37.34]saikou da!
[02:38.13]gukou kikou de kekkou
[02:40.00]katte ni ikitare!
[02:41.08]iya saikou ka!
[02:41.84]iyaa mou honto
[02:42.93]saikou da! da! da! da! da!
[02:44.78]iessaa!!
[02:45.05]mukashi mukashi no omoitsuki
[02:48.25]muigi muimi no hitodakari
[02:51.69]mujaki muteki no umaretsuki
[02:55.41]sore ga
[02:56.21]sore ga
[02:57.28]sore ga
[02:58.34]musekinin shuugoutai
[03:02.86]anta mo watashi mo kankeinai
[03:06.05]musekinin shuugoutai
[03:09.77]tanoshiku yatterya moumantai
[03:13.47]katte ni yatterya mondai nashi
[03:16.13]ore wa shiranai nani mo shiranai
[03:18.53]nani mo mitenai dare mo mitenai
[03:21.97]kioku chigai yume no hanashi
[03:25.43]sou iu koto de sore ja
`
      },
      {
        "trackId": "6d24fea4-7d4f-4d5f-8d95-2b7d3c4f3e03",
        "language": "Japanese",
        "text": `
[00:00.55]zutto mae no kimochi (kimochi)
[00:19.64]sutekirenakute (nakute)
[00:22.85]kokoro ga tarinai (tarinai)
[00:26.57]ikutsu ni natte mo ne (te mo ne)
[00:29.76]hora mite goran (hora mite goran)
[00:32.67]dekai (dekai) sora (sora)
[00:36.13]mou ochite kichaisou de
[00:38.78]mou mou ochite kichaisou de!
[00:42.50]chiccha na watashi ga sa aaa aaa aa kurikaesu
[00:49.67]chiccha na watashi wa sa mata mata aa kurikaesu
[00:56.57]minai furi shite mo (shite mo)
[01:13.59]wasureyou to shite mo (shite mo)
[01:16.50]tongatta itami ga (itami ga)
[01:19.95]itsu made mo tsuite mawaru (mawaru)
[01:23.40]sonna konna chiisasa de wa
[01:26.59]kaze de tonde tte shimau yo naa
[01:30.04]tonde tonde tondettara yokatta no ni na
[01:36.15]chiccha na watashi ga sa aaa aaa aa ki ni shiteru
[01:43.34]chiccha na watashi wa sa kyou mo kyou mo aa ki ni shiteru
[01:49.98]kanashiku natta? kanashiku natta
[02:26.65]hazukashikatta? hazukashikatta
[02:34.32]yametai? yametai
[02:35.90]kietai? kietai
[02:39.09]nakitai? nakitai
[02:42.28]sokka sou nano yo
[02:47.59]chiccha na watashi ga sa zutto zutto aa koko ni iru
[02:57.43]chiccha na watashi ga sa zutto zutto mune no naka ni iru
[03:03.53]aa
[03:04.59]chiccha na watashi ni wa zenbu zenbu ookisugite
[03:10.96]chiccha na watashi wa sa kyou mo kyou o aa kurikaesu`
      },
      {
        "trackId": "7e350fb5-8e50-4e6f-9ea6-3c8e4d5f4f04",
        "language": "Japanese",
        "text": `
[00:25.41]uuwa saiaku mou dame da
[00:43.21]omae wa itsumo sou da
[00:44.81]zutto nani yatte nda
[00:46.67]haa... haa... haa... haa...
[00:47.75]saitei no kanjou wa
[00:49.60]joushiki no hantai ga
[00:50.96]zenbu bukkowashite itta.
[00:53.32]sore wa
[00:54.13]"obake" no you na
[00:55.20]"kage" no you na
[00:56.79]"kagami" no you na sugata o shite ite
[01:00.25]haado rakku no inga
[01:01.86]senchimentaru no shoutai
[01:03.46]abaite itta nda
[01:05.04]BANG!　BANG!　BANG!
[01:06.12]houkai!
[01:06.65]yacchimatta haha
[01:07.98]teokure da yo okashii nda!
[01:09.29]shinu! shinu! shinu! shinu! shinu!
[01:10.90]nani shidekasu ka wakannee zo!
[01:11.43]oya ni wa miserarenai, haji ni mamireta ikikata──.
[01:12.48]kasane teto (sanjuu-ichi) sanjou!
[01:13.29]kasane teto (sanjuu-ichi) sansen!
[01:14.07]kasane teto (sanjuu-ichi) kourin!
[01:14.60]kasane teto (sanjuu-ichi) saikyou!
[01:14.89]kasane teto (sanjuu-ichi) shouso!
[01:15.15]kasane teto (sanjuu-ichi)!
[01:20.41]koudai na sora wa sakasa ni natte
[01:23.60]mugen no soko ni natta
[01:27.34]baka o yatte
[01:27.62]tsuke ga mawatte
[01:29.69]ima ni natte yatte kita!
[01:32.63]koko kara saki no tenkai wa souzou dekinai
[01:38.48]kandou mo gou mo nekkyou mo zetsubou mo kibou mo
[01:42.45]matte iru.
[01:43.53]kimi o matte iru.
[01:45.12]uwaaaaaaaaaaaaaaaaaaaa
[02:09.56]shi
[02:11.43]tatoeba tekitou ni kaita rakugaki kara subete ga hajimatte ita to shitara?
[02:15.40]dokoka de mata aetara hanashite ageyo kkana
[02:18.59]nani itte nda
[02:20.71]hontou no koto o──
[02:22.03]koukai shiteru nda
[02:23.65]juugoman
[02:24.44]mou aenai nda
[02:25.50]kioku ni tojikomotte
[02:26.84]mune no kodou dake ni
[02:29.77]shihai sarete ireba
[02:31.34]dore dake raku nano ka
[02:34.02]kako ni wa modorenai
[02:37.46]mae ni shika susumenai
[02:40.65]waaaaaaaaaa
[02:44.62]kita kita
[02:45.16]kasane teto (sanjuu-ichi) sanjou!
[02:45.69]kasane teto (sanjuu-ichi) sansen!
[02:45.96]kasane teto (sanjuu-ichi) kourin!
[02:46.47]kasane teto (sanjuu-ichi) saikyou!
[02:47.03]kasane teto (sanjuu-ichi) shouso!
[02:47.56]kasane teto (sanjuu-ichi)!
[03:06.13]shaa! zokkou da!
[03:07.21]baka bakka da sou ka
[03:08.53]tashikametai nda mitai nda
[03:10.13]sonnan ja kutabannee zo!
[03:13.84]imada katsute nai sokudo de
[03:17.31]konton no jidai ga yatte kuru─!
[03:20.50]tomare
[03:25.28]kyodai na risou sekai o umete
[03:27.93]fukou na shikou o ubatta
[03:30.06]futari de waratte
[03:33.76]hitori de naite
[03:31.87]zero ni natte hajimatta!
[03:34.71]kinou ni tomatta kuusou nante mou iranai
[03:40.88]saikou o kimyou o gyoukou o chousou o netsujou o
[03:47.54]ima mukae ni iku nda
[03:49.66]daddaddaddaddaaddadda
[03:50.19]daddaddaddaaddadda
[03:52.06]"urutora toreeraa" saa, maku ga agaru ze──.
[03:53.38]yama no mukou ni sora no mukou ni
[03:57.59]aru kokoro oshiete
[03:56.58]daaddadararara
[04:00.81]daddaddaddaddaaddadda
[04:01.62]daddaddaddaaddadda
[04:03.21]"urutora toreeraa" souzou o koete──.
[04:05.87]kotoba ni dekinai kyoudai na kanjou ga
[04:08.80]boku o ugokashite iru
[04:11.47]uoooooooooooooooooooo`
      },
      {
        "trackId": "550e8400-e29b-41d4-a716-446655440000",
        "language": "Japanese",
        "text": `
[00:04.54]Anata wa kaze no you ni
[00:12.50]Me wo tojite wa yuugure
[00:17.03]Nani wo omotteirun darou ka
[00:27.37]Mabuta wo hiraiteita
[00:31.37]Anata no me wa biidoro
[00:35.88]Sukoshi dake haru no nioi ga shita
[00:48.64]Hare ni hare, hana yo sake
[00:53.95]Saite haru no sei
[00:57.65]Furiyameba ame de sae
[01:02.45]Anata wo kazaru haru
[01:06.98]Mune wo utsu oto yo nage
[01:12.01]Bokura haru kaze
[01:16.81]Ano kumo mo koete yuke
[01:21.32]Tooku mada tooku made
[01:33.54]Anata wa hare moyou ni
[01:37.28]Me wo tojite wa aoiro
[01:41.79]Nani ga kanashii no darou ka
[01:52.15]Mabuta wo hiraiteiru
[01:56.12]Anata no me ni biidoro
[02:00.39]Ima sukoshi ame no nioi ga shita
[02:13.15]Naki ni nake, sora yo nake
[02:18.46]Naite ame no sei
[02:22.44]Furishikiru ame de sae
[02:27.24]Kumo no ue de wa haru
[02:31.77]Tsuchi wo utsu oto yo nare
[02:37.33]Bokura haru are
[02:41.59]Ano umi mo koete yuku
[02:45.84]Tooku mada tooku made
[02:56.44]Tooriame kusa wo nabikase
[03:12.12]Hitsujigumo are mo haru no sei
[03:16.90]Kaze no you mune ni haru nose
[03:21.68]Haru wo matsu
[03:30.18]Hare ni hare, sora yo sake
[03:36.28]Saite haru no sei
[03:40.28]Furiyameba ame de sae
[03:44.53]Anata wo kazaru haru
[03:49.58]Mune wo utsu oto kanade
[03:54.88]Bokura harukaze
[03:59.13]Oto ni kiku haru no kaze
[04:03.91]Saa kono uta yo nage!
[04:08.69]Hare ni hare, hana yo sake
[04:14.28]Saite haru no sei
[04:18.26]Ano kumo mo koete yuke
[04:23.31]Tooku mada tooku made`
      },
      {
        "trackId": "4f8c92b1-e7a3-4b6d-9c1f-2e8d5b0a3f4c",
        "language": "Japanese",
        "text": `
[00:00.57]Yoru ni ukande ita
[00:04.57]Kurage no yōna tsuki ga hazeta
[00:07.75]Basutei no se o nozokeba
[00:11.47]Ano natsu no kimi ga atama ni iru
[00:21.58]Dake
[00:28.48]Torii kawaita kumo natsunonioi ga hoho o naderu
[00:35.13]Otona ni naru made hora, senobi shita mama de
[00:41.77]Asobi tsukaretara basutei ura de sora demo miyou
[00:48.93]Jikini natsu ga kurete mo kitto kitto oboe terukara
[00:56.10]Oitsukenai mama otona ni natte
[00:59.57]Kimi no poketto ni yoru ga saku
[01:02.75]Kuchi ni dasenainara boku wa hitorida
[01:06.75]Sore de īkara mō akirame teru
[01:13.37]Dake
[01:26.92]Kajitsu kawaita kumo san'ōtō ume sabita hyōshiki
[01:33.84]Kioku no naka wa itsumo natsunonioi ga suru
[01:39.98]Shashin nante kamikireda omoide nante tada no chirida
[01:47.42]Sore ga wakaranaikara, kuchi o tsugunda mama
[01:53.79]Taezu kimi no iko fu kioku ni Natsuno no ishi hitotsu
[02:01.50]Utsumuita mama otona ni natte
[02:04.93]Oitsukenai tada kimi ni hare
[02:08.13]Kuchi ni dasenai mama saka o nobotta
[02:11.84]Bokura no kage ni yoru ga saite iku
[02:32.31]Utsumuita mama otona ni natta
[02:36.03]Kimi ga omou mama te o tatake
[02:38.94]Yō no ochiru sakamichi o nobotte
[02:42.65]Bokura no kage wa a a
[02:46.12]Oitsukenai mama otona ni natte
[02:49.31]Kimi no poketto ni yoru ga saku
[02:52.75]Kuchi ni dasenakute mo bokura hitotsuda
[02:56.47]Sore de īdaro, mō
[02:59.93]Kimi no omoide o kamishime teru
[03:10.03]Dake`
      },
      {
        "trackId": "b9d1e2f3-a4c5-40b9-8e7d-6c5b4a3f2e1d",
        "language": "Japanese",
        "text": `
[00:00.99]Mō wasurete shimatta ka na
[00:03.66]Natsu no kokage ni suwatta mama
[00:06.03]Hyōka(aisu)o kuchi ni hōrikonde kaze o matteita
[00:11.35]Mō wasurete shimatta ka na
[00:14.01]Yononaka no zenbu uso-darake
[00:16.92]Hontō no kachi o futari de sagashi ni ikou to waratta koto
[00:24.89]Wasurenai yō ni
[00:28.62]Iroasenai yō ni
[00:31.28]Katachi ni nokoru mono ga subete janai yō ni
[00:38.72]Kotoba o mottooshiete natsugakuru tte oshiete
[00:44.03]Boku wa kai teru me ni utsutta no wa natsu no bōreida
[00:49.10]Kaze ni sukāto ga yurete omoide nante wasurete
[00:54.43]Asai kokyū o suru, ase o nugutte natsumeku
[01:22.09]Mō wasurete shimatta ka na
[01:24.75]Natsu no kokage ni suwatta koro
[01:27.39]Tōku no oka kara kao dashita kumo ga atta janai ka
[01:32.71]Kimi wa sore o tsukamou to shite
[01:35.09]Bakamitai ni sora o kitta te de
[01:38.03]Boku wa kami ni kumo hitotsu o kaite
[01:40.93]Emi tte nigitte misete
[01:44.92]Wasurenai yō ni
[01:47.31]Iroasenai yō ni
[01:50.26]Rekishi ni nokoru mono ga subete janaikara
[01:57.17]Ima dake kao mo shitsu kushite
[01:59.81]Kotoba mo zenbu wasurete
[02:02.75]Kimi wa waratteru
[02:04.60]Natsu o matte iru bokura bōreida
[02:08.06]Kokoro o mottooshiete
[02:10.71]Natsunonioi o oshiete
[02:13.37]Asai kokyū o suru
[02:18.16]Wasurenai yō ni
[02:48.78]Iroasenai yō ni
[02:51.37]Kokoro ni hibiku mono ga subete janaikara
[03:01.70]Kotoba o mottooshiete
[03:04.36]Sayonara datte oshiete
[03:07.02]Ima mo miru nda yo
[03:09.13]Natsu ni sai teru hana ni bōrei o
[03:12.06]Kotoba janakute jikan o
[03:14.44]Jikan janakute kokoro o
[03:17.63]Asai kokyū o suru, ase o nugutte natsumeku
[03:28.28]Natsunonioi ga suru
[03:39.18]Natsunonioi ga suru
[03:45.28]Mō wasurete shimatta ka na
[03:50.06]Natsu no kokage ni suwatta mama
[03:52.99]Hyōka(aisu )o kuchi ni hōrikonde kaze o matteita`
      },
      {
        "trackId": "a7c1e92d-b84f-4d3a-91e2-f6c5b4a3d2e1",
        "language": "Japanese",
        "text": `
[00:01.08]Kawaranai fūkei asai shōgo
[00:04.00]Kōka-ka, ai jijō, nekorobu mama
[00:10.10]Hakushi no jinsei ni hakushu no oto ga hitotsu natte iru
[00:14.61]Karappona jibun o kyō mo utatte ita
[00:37.72]Kawaranai yō ni
[00:39.34]Kimi ga shuyaku no purotto o kaku nōto no naka
[00:46.50]Tomatta gasu suidō seken mo nyūsu mo shosentanin koto
[00:51.02]Kono jinsei sae hora, inku mitaida
[00:55.53]Anogoro zutto atama ni kaita yume mo otona ni naru hodo jikō ni natte iku
[01:06.68]Tada, tada kumo o miagete mo
[01:11.20]Shikai wa kyō mo nagareru mama
[01:15.98]Tōku aoida yoru ni hana oyogu
[01:20.48]Haru to mimagau hodo ni
[01:25.28]Kimi o tada miushinau yō ni
[01:45.73]Korobanai yō ni shita o muita
[01:49.18]Jinsei wa dōnimo dakyō de deki teru
[01:54.76]Kokoro mo unmei mo rabusongu mo jinsei mo shinjinai
[01:59.54]Shosen urenainara zenbu ga mudada
[02:03.53]Wazato rei shita yume de kaita ima ni nesobetta mama de jikō o matte iru
[02:15.21]Tada, tada meō no uragawa
[02:19.99]Tōku kaku kimi o mita mama
[02:24.24]Nōto, usui yoru sumi ni hana oyogu
[02:29.03]Boku no me ni matahitotsu
[02:33.27]Jinsei wa dakyō no renzokuna nda
[02:36.46]Son'na koto haya u ni wakatteta nda
[02:38.58]Eruma, kimina nda yo
[02:40.97]Kimi dake ga boku no ongakuna nda
[02:43.09]Kono uta wa ato hachi jūji
[02:45.75]Jinsei no kachi wa, owarikatadaroukara
[02:56.65]Tada, tada kimi dake o egake
[03:00.90]Shikai no ai mo nijinda mama
[03:05.43]Tōku aoida sora ni hana oyogu
[03:09.93]Kono-me ōu ai jijō
[03:14.72]Tada, tada
[03:20.03]Tōku aoida sora, kimi ga suzumu
[03:31.44]Tada yoru o oyogu yō ni`
      },
      {
        "trackId": "2d3e4f5a-6b7c-4890-a1b2-c3d4e5f6a7b8",
        "language": "Japanese",
        "text": `
[00:00.88]Ano ne, watashi jitsuwa kidzui teru no
[00:30.87]Hora, kimi ga itta koto
[00:35.13]Amari kangaetai to omoenakute
[00:41.78]Wasure teta ndakedo
[00:45.49]Mōmokuteki ni mōdō-teki ni mōsō-teki ni ikite
[00:50.53]Shōdō-tekina shōsō-tekina shōgyokutekina mama ja damedatta nda
[01:01.17]Kitto, jinsei saigo no hi o mae ni omou nodarou
[01:06.46]Zenbu, zenbu ii tarinakute oshīkedo
[01:10.71]A~a, itsuka jinsei saigo no hi, kimi ga inai koto o
[01:17.37]Motto, motto, motto
[01:21.89]Motto, chanto itte
[01:34.09]Ano ne, sora ga aoi notte dō yatte tsutaereba ī ndarou ne
[01:57.48]Yoru no kumo ga takai no tte dōsureba kimi mo wakaru ndarou
[02:08.12]Itte
[02:28.84]Ano ne, watashi jitsuwa wakatteru no
[02:36.28]Mō kimi ga itta koto
[02:40.27]Ano ne, wakarazuya tte iu ndarou ne wasuretai ndakedo
[02:50.88]Motto chanto itte yo
[02:53.28]Wasurenai yō memo ni shite yo
[02:56.21]Ashita jū-ji ni hōmu de machiawase toka shiyou
[02:59.91]Botan wa chitte mo hanada
[03:03.90]Natsu ga satte mo tsuibo wa setsuda
[03:06.56]Kuchi ni dashite koenidashite
[03:11.87]Kimi ga itte
[03:15.06]Soshite jinsei saigo no hi, kimi ga mieru nonara
[03:21.15]Kitto, jinsei saigo no hi mo ai o utau nodarou
[03:26.49]Zenbu, zenbu muda janakattatte iukara
[03:30.75]A~a, itsuka jinsei saigo no hi, kimi ga inai koto ga mada shinji rarenaikedo
[03:40.05]Motto, motto, motto, motto
[03:45.09]Motto, motto, motto, kimi ga
[03:50.68]Motto, motto, motto, motto
[03:56.00]Motto, chanto itte`
      },
      {
        "trackId": "1faa1b7a-8214-48dc-956e-5fd2c8c60406",
        "language": "Japanese",
        "text": `
[00:05.08]Kimi ga furetara,ta,ta, tada no hana sae waratte chū ni sake
[00:11.44]Kimi ni naratte,te, tereru mama suwatte
[00:15.98]Basu no saishū jikoku ōbā
[00:30.57]Itsumonotōri basu-tei de, kimi wa saidā o motte ita
[00:35.88]Sore datte sama ni natteru nā
[00:41.72]Shiganai monokakideatta boku wa sono fūkei o kaite ita
[00:47.85]Tonari ni suwaru ma mo naku kieta. Basu ga hashitte iku
[00:53.14]Kaite kaite yōyaku eta mono ga netami toka sagesumi toka!
[01:02.71]Nanka mō wasuretai
[01:05.09]Kimi ga furetara,ta,ta, tada no hana sae waratte chū ni sake
[01:11.48]Kimi ga nobotte,te, tereru kumo mo akarande tondeiku
[01:17.06]Kimi ga irunara,ta,ta, taikutsuna hibi mo nanite koto wanaikedo
[01:23.70]Kimigaita sōzōshī natsu mo sayonara
[01:27.68]Dareka ōtō negau ōbā
[01:42.84]Ame no gairo waki, kimi wa tatte ita
[01:49.48]Katate ni wa akai katorea (Woah, oh-oh-oh)
[01:54.79]Kimi no nagashita suiteki ga yūdachi mitaku tsutatte ita
[01:59.56]Kimi ga nai terunoni te wa ugoita
[02:02.76]Koe mo kakenaide
[02:05.67]Sono kao o kaite ita
[02:08.08]Haite haite yōyaku wakaru no ga itamidesu munashi-sadesu
[02:17.62]Nanka mō bakamitai
[02:20.28]Mitasareru kara,ta,ta, tari teta bun o otoshite iya ni naru nda yo
[02:26.66]Sorede yokattatte waraeru hodo otona janainoni sa
[02:31.97]Kimi ga norikomu, ba, ba, basu no sukima ni boku no basho wanaikara
[02:38.62]Kimigaita sōzō dake ga kasande iku
[02:42.62]Kyō mo jinsei fukan, ōbā
[02:57.22]Kimi ga arukeba hanagasaku
[03:12.09]Kimi ga arukeba sora ga naku
[03:15.02]Kimi ga waraeba tōi natsu
[03:17.93]Warau kao ga kaite mitai
[03:21.12]Yūdachi no naka naku kimi ni
[03:24.06]Boku ga ieru nonara
[03:26.43]Mōikkai ano natsu ni modotte
[03:32.28]Kimi ga nai teru, to, to, tomaranai-yaku o boku wa shitte itai
[03:37.87]Kimi ni furetara,te,te, tekitōna koto demo shabette miyou
[03:43.96]Kimigaitakara,ta,ta, taikutsuna hibi mo nanite koto wa nai no sa
[03:50.61]Kimi ni waratte,te, tereru mama suwatte
[03:54.87]Basu no saishū jikoku, ōbā`
      },
      {
        "trackId": "1e94fd52-bd3a-4a8d-ade7-3f2c3240d960",
        "language": "Japanese",
        "text": `
[00:14.08]Kutsuhimo ga toke teru komorebi wa ashi o nebu mu
[00:21.80]Ikiwosuu otodake kikoe teru
[00:28.71]Anata wa ima tachiagaru furubita isu no ue kara
[00:36.67]Yawarakai asa no nioi ga suru
[00:42.54]Haruka tōku e mada tōku e
[00:47.06]Bokura wa karada mo nugi satte
[00:50.52]Mada tōku e kumo mo koete mada mukō e
[00:58.21]Kazeninotte boku no sōzō-ryoku to iu jūryoku no mukō e
[01:05.39]Mada tōku e mada tōku e umi no kata e
[01:16.81]Kutsuhimo ga toke teru hebi mitai ni hane asobu
[01:31.96]Anata no kutsu ga ki ni naru
[01:38.87]Bokura wa ima aruki dasu shiokaze wa hada o nebu mu
[01:46.84]Te o hika reru mama no michi
[01:52.43]Sa~a mada tōku e mada tōku e
[01:56.93]Bokura wa tada no kazeninatte
[02:00.65]Mada tōku e kumo mo koete mada mukō e
[02:07.56]Kazeninotte bokura sōzō-ryoku to iu shibari o nukedashite
[02:15.28]Mada tōku e mada tōku e umi no kata e
[02:33.86]Kutsuhimo ga toke teru boku wa tsuini shagami komu
[02:42.09]Tori no naku koe dake kikoe teru
[02:49.28]Kata o sotto tataka rete yōyaku boku wa kigatsuku
[02:56.97]Umi ga mō me no saki ni aru
[03:02.55]A~a mada tōku e mada tōku e
[03:08.93]Bokura wa kokoro dake ni natte
[03:12.65]Mada tōku e umi mo koete mada mukō e
[03:20.09]Kazeninotte boku no sōzō-ryoku to iu jūryoku no mukō e
[03:27.53]Mada tōku e mada tōku e umi no kata e
[03:46.15]Bokura wa ima kutsuwonugu sa zanami wa ashi o nebu mu
[03:54.37]Anata no me wa tōku o miru
[04:01.56]Raion ga tawamureru Afurika no sunahama wa
[04:08.97]Umi no zutto mukō ni aru`
      },
      {
        "trackId": "5c6c4049-4ded-45c5-bd77-e67a4c30c1fd",
        "language": "Japanese",
        "text": `
[00:00.31]Aa, tōmei yori mo sumikitta kokoro de
[00:31.39]Yononaka o waratte iru nda yo
[00:34.32]Aa, ongaku nanka o eranda
[00:38.57]Ano hi no jibun o baka ni omou ne
[00:48.65]Tsutaetai zenbu wa mō
[00:52.64]Kono uta mo jibun no koe sura mo
[00:56.89]Kaze ni nattakara awa to kiete ittakara
[01:01.14]Kyō kankaku mitai kono kanshō wa dokoka e nagesutetai
[01:06.71]Boku de ī nonara kimi ga shiritai nonara
[01:11.23]Mō kakusu koto nante nai yo
[01:14.17]Ima kara sukoshidake odorou ze
[01:39.93]Aa, ningen'nante yametai na
[01:47.12]Sōdaro, omoshiroku mo nani ni mo naidaro
[01:52.43]Aa, jiman no gitā o misebirakashita
[01:57.21]Ano hi no jibun o tsubushite yaritai yo
[02:07.84]Tsutaetai zenbu wa mō
[02:10.75]Natsu mo fuyu mo ashita no mukō-gawa de
[02:16.34]Hai ni nattakara awaku kiesattakara
[02:20.59]Haya uni shitsu kushi teta kono jōdō mo dokoka e nagesutete
[02:25.90]Kimi ga ī nonara tada wasuretai nonara
[02:30.66]Mō tamerau koto nante nai yo
[02:33.34]Kono mama yoake made odorou ze
[02:38.93]Aa, ongaku nanka yamete yaru no sa
[02:44.22]Omoide no kimi ga hitotsu mo tagawazu kaketara
[02:49.00]Dōse mō yaritai koto hitotsu ienaikara sa
[02:56.43]Ukabanaikara sa
[03:03.36]Kimi o shitta mama hibi ga sugisattakara
[03:08.66]Dō ka oitsukitai kono jōdō o konomama uta ni shitai
[03:14.24]Ima ga kurushīnara-sa iiwake wa īkara sa
[03:18.75]A~a mō, odorou ze hora
[03:21.40]Kaze ni natta no sa awa to kiete itta no sa
[03:26.46]Dōse warikirenai kono kanshō mo dokoka e nagesutete
[03:31.25]Boku de ī nonara kimi ga shiritai nonara
[03:36.28]Mō kakusu koto nante nai yo
[03:39.46]Ima kara sukoshidake
[03:41.61]Kono mama sukoshidake odorou ze`
      },
      {
        "trackId": "c40ca7e3-15ba-4245-8371-1cf9991b5775",
        "language": "Japanese",
        "text": `
[00:00.82]Mizūmi no soko ni iru mitaida
[00:06.67]Kokyū no hitotsu ga nodo ni karanda
[00:12.50]Kihō o hakidashite sū-byō, yatto ashi ga tsuita
[00:18.35]Yawarakana doro no kanshoku ga shita
[00:23.14]Zutto zuttozutto zuttozutto
[00:35.61]Kimi o otte iru dake de
[00:42.53]Dō shiyō mo nai koto bakari iitakatta
[00:48.10]Suiren ga uite ita suiatsu de tōmeida
[00:53.67]Mō shinkirō yori mo tashikanara sore de ī yo
[01:00.04]Tekitō demo īkara
[01:02.96]Mokuteki toka īkara
[01:06.68]Kono mama doko demo īkara sa, nigeyou
[01:15.45]Mizūmi no soko ni iru mitaida
[01:21.29]Nureru komaku ga kusuguttai nda
[01:27.15]Kitai mo shōrai mo ashita mo nani mo kikitakunakatta
[01:33.53]Kuchi kara afureru awabuku ga kireide
[01:38.84]Zutto zuttozutto zuttozutto
[01:50.79]Mihorete shimatta dake de
[01:57.43]Kokoroyori daijinamono o mitsuketakatta
[02:03.01]Kotoba tte hakujōda suiatsu de tōmeida
[02:08.59]Nā, tatemae yori kireina mono o sagashi teru nda
[02:15.24]Son'na no wasurete īkara mō, nigeyou
[02:24.00]Kon'na jibun'nara iranai
[02:27.18]Boku ni wa nani ni mo iranai
[02:30.37]Okane mo meisei mo ai mo shōsan mo nani ni mo iranai
[02:36.21]Kono mama tōku ni ikitai
[02:38.62]Omoide no soto ni sawaritai
[02:41.53]Mata kimi no uta ga kikitai
[02:47.37]Zutto zuttozutto zuttozutto
[03:02.50]Kimi o otte iru dake de
[03:09.41]Dō shiyō mo nai koto dake utaitakatta
[03:17.91]Suiren ga uite ita suiatsu de tōmeida
[03:23.75]Mō shinkirō yori mo tashikanara sore de ī yo
[03:30.13]Kono mama doko demo īkara sa,
[03:33.05]Hontōwa zenbu oite tada nigedashitai dakedatta
[03:38.62]Jinsei wa tōmeida suiatsu de tōmeida
[03:44.50]Mō shinkirō yori mo tashikanara sore de ī yo
[03:50.87]Tekitō demo īkara
[03:54.06]Mokuteki toka īkara
[03:56.97]Kono mama doko demo īkara sa, nigeyou
`
      },
      {
        "trackId": "d0890bd1-d629-4d9c-8a75-469edf2dc531",
        "language": "Japanese",
        "text": `
[00:00.59]Usotsuki nante wakatte furete
[00:06.69]Eruma mada mada itaiyo
[00:09.89]Mō sayonara datte utatte
[00:12.81]Kurete yorugakuru made
[00:32.46]Asahi no sasu komorebi boku to eruma
[00:36.97]Mada mada nemui kai
[00:39.64]Shoka no hajime chikadzuku gogatsu no mori
[00:44.15]Aruki dashita kao ni wa hana no shizuku
[00:51.59]Hora namida mitaida
[00:54.25]Kono mama akubi o shiyou
[00:57.71]Nan'nara mata isu ni demo suwarou
[01:01.71]Yurusenai koto nante nai nda yo
[01:05.43]Kimi wa yasashiku nante nareru
[01:09.40]Kono mama dokoka no tōi kuni de
[01:19.76]Asai natsu no sukima ni nesobetta mama
[01:25.62]Namida mo kotoba mo denai mama de
[01:34.65]Tada yoru no fuka-sa mo shiranai mama de
[01:40.75]Usotsuki nante wakatte furete
[01:44.20]Eruma mada mada itaiyo
[01:47.93]Mō sayonara datte utatte
[01:50.57]Kurete yorugakuru made
[02:10.24]Tsurai koto mo kurushī koto mo nani mo mienainara wakaranaishi
[02:17.68]Fusaida me tojita mama de nigeta
[02:21.13]Tsukiakari no michi o aruku
[02:24.84]Semai heya mo tsumetai yoru mo
[02:28.59]Nemui hiru mo sabishī asa mo
[02:32.28]Sayonara no kotoba-goshi ni kimi no kao o mi teru
[02:40.53]Kono mama dokoka no tōi kuni de
[02:52.67]Asai natsu no sukima ni nesobetta mama
[02:58.20]Namida mo kotoba mo denai mama de
[03:07.35]Tada sora no ao-sa dake mita mama de
[03:12.92]Tada kimi to owari mo shiranai mama de
[03:20.51]Usotsuki nante wakatte furete
[03:24.19]Eruma mada mada itaiyo
[03:27.60]Mō sayonara datte utatte
[03:31.30]Kurete yorugakuru made`
      },
      {
        "trackId": "e3de4309-6683-4409-8aa5-8d44c25c8e68",
        "language": "Japanese",
        "text": `
[00:04.74]Natsunonioi ga shi teta
[00:32.89]Azemichi, hitotsu nyūdōgumo
[00:36.07]Yoru ga chikadzuku made kyō wa aruite miyou yo
[00:40.85]Tonari no machi no yoru matsuri ni iku nda
[00:45.10]Nukui yoru, yūgatō no higure, hanauta, nokisaki no fūrin
[00:49.89]Sakamichi o orita mukō-gawa, matsuri yatai no dōkei
[00:54.67]Yoru ga chikadzuku made kyō wa aruite miyou yo
[00:58.50]Ue o muite aruita, hana ga yozora ni sai teru
[01:04.89]Natsunonioi ga shi teta
[01:27.31]Azemichi no zutto mukō e
[01:31.29]Darehitori hito no inai machi o sagasu nda
[01:36.06]Ne~e, kon'na seikatsu wa gomenda
[01:40.59]Sayōnara, tewofuru kage hitotsu, yoru machi, hanasaki no basutei
[01:44.84]Omoide no naka no fūkei wa tsumaranu hodo kireide
[01:49.09]Yoru ga chikadzuku made kyō mo aruite ita nda
[01:54.14]Meō o tojireba mieru, natsunonioi ga suru
[01:59.98]Sa~a, motto tōku ikou yo
[02:02.35]Sa~a, motto nigete ikou ze
[02:08.47]Sa~a, bokura tsumaranai koto wa zenbu hanattoite
[02:14.59]Michi no mukō e
[02:56.28]Natsunonioi ga shi teta
[03:00.10]Azemichi, hitotsu nyūdōgumo
[03:03.81]Darehitori hito no inai machi de kidzuku nda
[03:08.34]Kimi mo inai koto ni yatto
[03:12.87]Nukui yoru, yūgatō no higure, hanauta, nokisaki no fūrin
[03:17.63]Sakamichi o orita mukō-gawa, matsuri yatai no dōkei
[03:21.90]Otona ni natte mo zutto oboe terukara
[03:26.93]Ne~e tōku e ikou yo, ano oka no mukō e
[03:32.25]Sa~a, motto tōku ikou yo
[03:36.22]Sa~a, motto nigete ikou ze
[03:41.00]Sa~a, bokura tsumaranai koto wa zenbu hanattoite
[03:47.12]Michi no mukō e`
      },
      {
        "trackId": "b5a1926f-d459-4c59-89f5-70a1ed5f7d95",
        "language": "Japanese",
        "text": `
[00:00.00]Saiteigen no seikatsu de chīsana heya no roku-jō de
[00:05.58]Kimi to kurasereba yokatta sore dake kangaete ita
[00:10.89]Shiawase no iro wa jun tōmeinara mienai kata ga yokatta
[00:15.93]Nani mo dekinainoni kyō ga owaru
[00:29.76]Saiteigen no seikatsu de chīsana heya no roku-jō de
[00:34.78]Tenjō o nagameru mainichi nanika o kangaete ita
[00:40.10]Shiawase no kachi wa 60000-en
[00:42.75]Yachin ga hika rete 4000-en
[00:45.14]Boyaketa atama de omoide o asaru
[00:48.07]Sameta me de ai o kataru yō ni natte ita
[00:56.07]Sameta kōhī mo aikawarazu sōna nda
[01:01.10]Kiraida
[01:03.21]Wakan'nai yo wakan'nai yo
[01:06.15]Wakan'nai yo wakan'nai yo
[01:09.34]Omoide ni naru kimi ga jama ni natte iku
[01:13.04]Wakan'nai yo wakan'nai yo
[01:15.71]Wakan'nai yo wakan'nai yo
[01:18.10]Wakan'nai yo
[01:19.95]Jōzuna arukkata mo
[01:22.60]Sayonara no iikata mo
[01:35.09]Saishōgen no onryō de sukoshi ōkiku natta heya de
[01:40.15]Tomatta gasu mo omoide mo shawā no tsumeta-sa mo kaki nagutta
[01:45.18]Jumyō o urunara nokori ni-nen
[01:47.84]Soredake nokoshite ano machi e
[01:50.76]Amatta jumyō de omoide o asaru
[01:53.96]Hare mo yoru matsuri mo sekichō no gaitō mo
[02:01.12]Kumo mo nigemizu mo hasu ni kamaeta kashi-kan mo
[02:06.45]Kibenda
[02:08.56]Wakan'nai yo wakan'nai yo
[02:11.75]Wakan'nai yo wakan'nai yo
[02:14.40]Omoide ni naru kimi ga uta ni natte iku
[02:18.13]Wakan'nai yo wakan'nai yo
[02:20.78]Wakan'nai yo wakan'nai yo
[02:23.43]Wakan'nai yo, wasure rareru hōhō mo
[02:27.43]Korekara no tsukaikata mo
[02:37.25]Sameta me no naka de kiminouta o kaite ita
[02:55.86]Boku no kono hibi wa kimi no tame no jinseida
[03:01.43]Yume mo hakana-sa mo kimi no kuchi mo me mo sono yubisaki mo wasurenagara
[03:10.46]Hora, sorosoro uta mo owaru jikanda
[03:17.63]Yatto kimi no bandakara sa
[03:20.84]Wakan'nai yo wakan'nai yo
[03:23.49]Wakan'nai yo wakan'nai yo
[03:26.66]Omoide ni nare kimiyo uta ni natte yuke
[03:30.12]Wakan'nai yo wakan'nai yo
[03:33.06]Wakan'nai yo wakan'nai yo
[03:35.71]Wakan'nai ne
[03:37.31]Hito wa arukeru nda to ka
[03:39.94]Sore ga atarimaeda to ka wakan'nai sa
[03:43.65]Wakan'nai yo`
      },
      {
        "trackId": "a5bdfc38-b847-48fd-86c7-8bab935f4443",
        "language": "Japanese",
        "text": `
[00:22.01]Ame no agaru koutei de kinou no hanabi wo omoidashita
[00:42.18]Ano toki no kimi no bouto shita kao, kaze ni mada natsu no nioi ga suru
[00:54.14]Aki ni natte fuyu ni natte
[01:18.32]Nagai nemuri ni tsuita ato ni
[01:23.92]Kumo ni notte kaze ni notte
[01:28.70]Tooku ni ikou yo koko ja mukuwarenai yo
[01:57.17]Hana no yureru koutei de kinou no yuuhi wo omoidashita
[02:07.48]Ano toki no sukete rinto shita kimi hoho ni mada natsu ga nokotteiru
[02:38.87]Haru ni natte natsu wo matte
[02:43.59]Fukai nemuri ga sameta koro ni
[02:49.18]Mizu ni natte hana ni natte
[02:54.25]Sora wo miyou yo kotoba to ka iranai yo
[03:03.81]Kamisama nante inai kara
[03:06.19]Yume wa kanau nante uso da kara
[03:08.84]Shigoto mo gakkou mo zenbu yame ni shiyou
[03:14.68]Wasureru koto ga shizen nara
[03:16.81]Omoide nante kotoba tsukuru na yo
[03:19.75]Wasurenai you kuchi ni futa shite
[03:25.31]Kimi wo matte natsu ga satte
[03:31.43]Itsuka owari ga mieru koro ni
[03:37.03]Kumo ni notte kaze ni notte
[03:42.34]Nemuru mitai ni tada
[03:48.18]Aki ni natte fuyu ni natte
[03:52.96]Nagai nemuri ni tsuita ato ni
[03:58.00]Kumo ni notte kaze ni notte
[04:03.58]Tooku ni ikou yo
[04:07.03]Koko ja mukuwarenai yo
[04:17.93]Kimi to dake ikitai yo`
      },
      {
        "trackId": "bad4f94c-3042-4ff2-890f-9ba96e70dc05",
        "language": "Japanese",
        "text": `
[00:00.83]Yatto ame ga futta nda
[00:22.32]Kono ao o zutto omotte ita nda
[00:27.37]Shinzō no oto ga sunde ita
[00:31.62]Kotoba igai nani ni mo iranai sorada
[00:36.14]Ano hi made boku wa nemutte ita nda
[00:59.41]Iiwake bakaride ashi ga denakatta
[01:03.92]Sōzō yori zutto, kimigaita-gai no ao-sa o
[01:08.96]Zutto
[01:09.76]Utae jinsei wa kimida
[01:13.75]Zutto kimida zenbu kimida
[01:16.14]Ai no iroda
[01:17.46]Kotoba ni narou to nokotta omoide dake ga tōi gunjō o someta
[01:22.51]Motto kakitai zutto samenai ai no uta o
[01:26.51]Kimi no inai natsu ga mata kuru
[01:47.23]Yatto ame ga agatta nda
[01:51.75]Kono machi o kitto kimi ga kaita nda
[01:56.26]Shinzō no oto ga sunde ita
[02:00.78]Ano hi kara zutto kimi ga matte iru
[02:05.29]Nani mo iwanai boku ga waratte iru, gomakasu yō ni
[02:10.34]Kiero zenbu kiero
[02:12.19]Koe mo kotoba mo ai no uta mo
[02:14.58]Kono-me o ōtta awai gunjō no naka de shiroi kāten ga yureru
[02:20.16]Motto furetai zutto furetai ai no uta o
[02:23.87]Kimi no inai natsu no ao-sa o
[02:39.30]Shiroi kāten ga yureta
[02:49.91]Sotto yureta boku ni yureta
[02:51.25]Ai ni fureta
[02:53.62]Kotoba ni narou to nokotte ita kiminouta wa
[02:56.83]Ano dōkei wa kienai kitto kesenai
[03:00.02]Zutto asenai mubyō no iroda
[03:02.65]Utae jinsei wa kimida
[03:05.58]Zenbu kimida zutto kienai ai no iroda
[03:09.31]Kono-me o ōtta awai gunjō no iroda
[03:13.03]Omoidasu yō ni yureta
[03:15.40]Motto kakitai zutto samenai ai no uta o
[03:18.87]Kimi no inai natsu ga mata kuru`
      },
      {
        "trackId": "73f3ec26-f230-4659-b699-9a6c6b196bef",
        "language": "Japanese",
        "text": `
[00:00.82]Ame ga futta hana ga chitta
[00:03.47]Tada somatta hoho o omotta
[00:06.38]Boku wa zutto baketsuippai no gekkō o non deru
[00:12.23]Hontōna nda yoru mitaide
[00:15.41]Usuku tōmeina kuchizawari de
[00:18.35]Sōna nda, tte waratte mo īkedo
[00:24.46]Boku wa kimi o matte iru
[00:51.57]Natsu ga satta machi wa shizuka
[00:54.50]Boku wa yatto heya ni modotte
[00:57.42]Yoru ni natta
[00:58.75]Kon'na yoi tsuki o hitori de mi teru
[01:03.00]Hontōna nda, mukashi no boku wa namida ga hōseki de deki teta nda
[01:09.37]Sōna nda, tte waratte mo īkedo
[01:14.95]Koe wa mō tokkuni wasureta
[01:18.93]Omoide mo ai mo shinda
[01:21.32]Kaze no nai umibe o aruita ano natsu e
[01:29.56]Boku wa sayonara ga hoshī nda
[01:37.79]Tada madoromu yōna
[01:43.37]Mono hitotsu sae iwanai mama
[01:49.73]Boku wa kimi o matte iru
[02:03.56]Toshi o totta hitotsu totta
[02:07.81]Nani mo nai heya de haru ni natta
[02:10.72]Boku wa ai o, soko ga nuketa hishaku de non deru
[02:16.31]Hontōna nda aji mo shinakute
[02:20.03]Nomeba nomu hodo nodo ga kawaite
[02:22.94]Sōna n datte waratte mo īkedo
[02:28.74]Boku wa yoru o matte iru
[02:38.03]Kimi no hanauta ga hoshī nda
[03:07.97]Tada madoromu yōna
[03:13.56]Mono hitotsu sae iwanai mama
[03:19.65]Boku wa kimi o matte iru
[03:25.24]Kimi no me o oboeteinai
[03:31.63]Kimi no kuchi o kaite inai
[03:37.21]Mono hitotsu sae iwanai mama
[03:43.58]Boku wa kimi o matte inai
[03:49.43]Kimi no hana o shitte inai
[03:55.00]Kimi no hoho o omotte inai
[04:01.65]Sayonara sura iwanai mama
[04:07.75]Kimi wa yoru ni natte iku
[04:23.33](Hontōna nda yoru mitaide
[04:25.99]Natsu ga tōmeina kuchizawari de)`
      },
      {
        "trackId": "6a1de18e-4683-43e0-a555-1c066ab12432",
        "language": "Japanese",
        "text": `
[00:11.60]Kimi wa eiga o zutto mite iru
[00:19.30]Darehitori mo inai gekijō de
[00:24.62]Ima omoeba chīpuna setto de
[00:29.39]Hito no yoku shinu SFeiga
[00:34.97]Itsuka sekai ga maho ni natte
[00:37.36]Hito no jumyō sae zuibun nobite
[00:40.02]Shinenai sekai ni nareba īnoni ne
[00:43.75]Soshitara kokoro igai wa nisemonoda
[00:47.46]Kotoba igai wa nisemonoda
[00:50.39]Kamisama datte sakuhin'na ndakara
[00:53.32]Bokura kai repurikada
[00:55.45]Itsuka kisetsu ga sugisatte
[00:57.57]Tsumetaku natte toshioite
[00:59.96]Sonotoki ni
[01:07.67]Boku wa eiga o zutto mite iru
[01:13.51]Tsumaranai hodo ni usui eiga
[01:18.29]Seki o tatte kara yatto kidzuku
[01:23.09]Kore wa boku o kaita doramada
[01:28.15]Itsuka bokura wa otona ni natte
[01:30.54]Te ni ireru mono mo ōkiku natta
[01:33.18]Tsugi wa ai demo kaereba īnoni ne
[01:36.12]Anta no kachikan nante nisemonoda
[01:40.64]Omoide datte nisemonoda
[01:43.29]Kokoro wa nō no shingōna ndakara
[01:45.95]Ai mo kai repurikada
[01:48.34]Itsuka kisetsu ga sugisatte
[01:50.75]Omoide bakari ga tsunotte
[01:53.15]Sonotoki ni
[02:01.12]Mitasarerunara sore de yokatta
[02:23.43]Uta o utau no ni riyū mo nai wa
[02:26.08]Tanin no tame ni iki rarenai
[02:28.46]Sayonara igai zenbu chiri
[02:30.87]Hito o norou uta ga kakitai
[02:33.53]Sore de dareka o korosereba ī ze
[02:36.16]Natsunonioi ni mune ga tsumatte ita
[02:40.41]Bokura no kokoro igai wa nisemonoda
[02:43.62]Kotoba igai wa nisemonoda
[02:46.27]Konoyo no zenbu wa shukan'na ndakara
[02:48.65]Kimi mo kai repurikada
[02:51.31]Sayonara datte nagedashite
[02:53.43]Kono mama tōku nigedashite
[02:56.09]Kotoba de zenbu arawashite
[03:03.81]Kokoro mo ai mo kaki ashi shite
[03:06.46]Soredemo sora wa hidoku aoi ndakara
[03:09.38]Sore wa kitto mahōdakara
[03:11.78]Itsuka kisetsu ga sugisatte
[03:13.63]Tsumetaku natte toshioite
[03:16.58]Sonotoki ni yatto wakaru
[03:20.83]Boku mo sono ao-sa ga wakaru`
      },
      {
        "trackId": "8a39d6ca-3d9b-43dd-aff4-4864aab7974a",
        "language": "Japanese",
        "text": `
[00:00.78]Ano taiyō o mi teta
[00:04.49]Fukaku moe teru
[00:06.90]Mireba mune no atari ga sukoshi moe teru
[00:12.18]Michi o iku dareka ga koe o ageta
[00:17.51]"Miro yo, hen'naotoko" to warainagara
[00:23.10]Yubi no saki de fureta kami ga hitotsu tsuini moeta
[00:32.93]Sa~a inka shite moyashite
[00:36.10]Moyashite moyashite
[00:39.03]Moyashite moyashite
[00:41.70]Yorokobi o aishite
[00:43.54]Sa~a shōka shite odotte
[00:46.75]Odotte odotte
[00:49.67]Odotte odotte
[00:52.57]Odotte odotte
[01:04.81]Hora, atsumaru hito no kao ga mieru
[01:10.64]Ore no maita honō no ito o sagashi teru
[01:16.23]Miro yo, hen'nayatsu-rada
[01:19.15]Son'nani koe o Ara-gete
[01:21.54]Takaga honō hitotsu ni netsu o age teru
[01:26.87]Moero hayaku hibiku dosei no naka de
[01:32.17]Kami no taba yo akaku motte
[01:36.95]A~a mendōku se e sa~a moyashite moyashite
[01:41.48]Moyashite moyashite moyashite
[01:45.73]Kanashimi mo itoshite
[01:47.59]Sa~a hōka shite odotte
[01:50.78]Odotte odotte odotte odotte odotte
[01:59.01]Odotte
[02:03.26]Furete keshite furete keshite
[02:14.96]Furete mune no mado o akete
[02:20.27]Hayaku moete hai o misete
[02:25.59]Oku no oku ni ibushi buru tamashī ni
[02:30.37]Sa~a inka shite moyashite
[02:33.56]Moyashite moyashite
[02:36.21]Moyashite moyashite
[02:38.87]Yakeru hodo aishite!
[02:40.74]Sa~a hōka shite moyashite
[02:44.18]Moyashite moyashite
[02:46.84]Moyashite moyashite
[02:49.50]Akiru made aishite
[02:51.62]Sa~a shōhi shite odotte
[02:54.81]Odotte odotte
[02:57.19]Odotte odotte odotte
[03:02.78]Odotte
[03:06.50]Sa~a sōzō shite moyashite
[03:16.33]Moyashite moyashite
[03:18.99]Moyashite moyashite moyashite`
      },
      {
        "trackId": "49c2d747-3ec5-4f4a-9829-4e0742182b97",
        "language": "Japanese",
        "text": `
[00:00.51]Mizu tamari ni ashi o tsukkonde
[00:24.41]Anata wa ōkina akubi o suru
[00:31.05]Hidoi arashi o yonde hoshī nda
[00:34.85]Kono sora mo fukitobasu hodo no
[00:39.38]Kaze o matte ita nda
[00:43.10]Nanimonai seikatsu wa kitto taikutsu sugirukara
[00:49.46]Kaze o matte ita nda
[00:53.18]Kaze o matte ita nda
[00:55.59]Fukeba seiran
[01:02.21]Kotoba mo tobashite shimae
[01:08.34]Dare mo nani mo ienu hodo
[01:13.12]Bokura o nomikonde yuke
[01:20.54]Doddodo dodo udo
[01:21.34]Doddodo dodo udo
[01:23.46]Doddodo dodo udo
[01:35.42]Kaze o yobu tte hontōna nda ne
[01:38.87]Me o maruku shita boku ga sō kiitakara
[01:45.53]Bukkirabō ni anata wa itta
[01:49.12]"Nanimokamo omoinomamada ze"
[01:53.65]Kaze o matte ita nda
[01:57.37]Kata ni atta shakai wa zuibun kyūkutsu sugirukara
[02:04.54]Sore ja motto hidoi ame o
[02:07.45]Kono kibun mo tobasu kaze o
[02:09.84]Fukeba seiran
[02:16.49]Nanimokamo sutete shimae
[02:22.33]Ima ni bokura kono mama ja
[02:27.37]Dareka mo wasureteshimau
[02:32.71]Aoi kurumi mo fukitobase
[02:35.65]Suppai karin mo fukitobase
[02:41.49]Motto ōkiku hidoku ōkiku
[02:46.53]Kono machi o kowasu kaze o
[02:51.58]Fukeyo seiran
[02:56.09]Nanimokamo sutete shimae
[03:00.34]Kanashimi mo yume mo subete tobashite yuke, matasaburō
[03:09.65]Ikeba nagai michi
[03:15.24]Kotoba ga anata no kazeda
[03:19.49]Dare mo nani mo ienu hodo
[03:24.53]Bokura o nomikonde yuke
[03:28.78]Doddodo dodo udo
[03:30.37]Doddodo dodo udo
[03:33.03]Doddodo dodo udo`
      },
      {
        "trackId": "2c8c043a-34ca-42b1-8041-b2bc3b3dee87",
        "language": "Japanese",
        "text": `
[00:00.57]Aru Chō, boku wa kidzuita ndesuga
[00:11.21]Omottayori mo sofa ga semai
[00:13.33]Okane ga tarinai wakede mo naikedo
[00:15.99]Kagu-ya wa seikatsu kengai
[00:17.85]Sōshite boku wa omotta ndesuga
[00:20.23]Tonari no ienara toho ichi-bu
[00:22.35]Nantokanaru to omotta
[00:24.76]Boku wa hōchō o motta
[00:26.87]Nani ni mo mitasa renainara
[00:35.64]Yukō, bokura de zenbu ubau no sa
[00:38.29]Kami mitaina risei nante hora, tobashite shimae
[00:42.28]Kamisama, hontōni konoyo no zenbu ga hito ni yasashī ndattara
[00:46.79]Sukoshi kurai wa bokura ni kuretatte ī janaidesu ka
[00:54.50]Aru hiru, boku wa omotta ndesuga
[01:03.00]Shini yuku anata ni hana o agetai
[01:05.39]Okane ga tarinaidokoroka naikara
[01:07.79]Hanataba wa yosan kengai
[01:09.90]Sōshite boku wa kidzuita ndesuga
[01:12.29]Tonari no hanaya wa teikyūbi
[01:14.42]Nusumeba ī to omotta
[01:16.28]Boku wa shingō o matta
[01:18.93]Warae, majimena kao de sumashi teru
[01:27.43]Jitsuwa anta mo matomo janai no sa
[01:30.09]Kin ni naranai jōshiki nante mō, wasurete shimae
[01:33.81]Tanin no itami ga tanin ni wakaru ka yo
[01:36.48]Hyaku-nen tateba dare demo honeda
[01:39.15]Kyō kurai wa bokura mo machigatte ī janaidesu ka
[01:43.92]Aru yoru, boku wa wakatta ndesuga
[01:54.81]Kore kara sakini wa yume ga nai
[01:56.93]Anata ga inaku naru nante
[01:59.32]Kangaeta koto mo nakatta
[02:01.45]Hanaya no shujin wa yasashikatta
[02:03.84]Kedo nusunda koto sura togamenai
[02:05.96]Gōtō to hanataba ni nanika no chigai ga aru nodesu ka
[02:10.47]Sore, nanika ga chigau nodesu ka
[02:12.61]Nani ni mo mitasa renainara
[02:21.62]Yukō, bokura de zenbu ubau no sa
[02:24.03]Chiri mitaina risei nante hora, tobashite shimae
[02:28.00]Kamisama, hontōni konoyo no zenbu ga hito ni yasashī ndattara
[02:32.80]Sukoshi kurai wa bokura ni kuretatte ī janaidesu ka
[02:37.58]Sukoshi kurai wa bokura o sabaitatte ī janaidesu ka
[02:42.34]Aru Chō, boku wa kidzuita ndesuga
[02:53.50]Omottayori mo sekai wa hiroi
[02:55.62]Doryoku ga tarinai wakede mo nainoni
[02:58.03]Nani ni mo minorazu kengai
[03:00.15]Shigoto o yamete omotta ndesuga
[03:02.28]Anshin nante doko ni mo nai
[03:04.65]Owatta kata ga imada mashi
[03:07.06]Sofa ga chīsaku mieta`
      },
      {
        "trackId": "2a5c3dbc-b375-433d-beb0-b48edd852f70",
        "language": "Japanese",
        "text": `
[00:00.56]Ashita wa kitto tenki de warui koto nante nai ne
[00:19.44]Taimukādo o oshite boku wa asa,-me o aita
[00:24.50]Bokura wa kyō mo katteru tarinai mono shika nakute
[00:29.80]Kutsu o hakinagara kūsō sora wa takai no ka na
[00:35.10]Anata sae anata sae
[00:51.32]Kore wa kitto wakaranai nda
[00:53.71]Hanikamu kao ga chira tsuku
[00:56.10]Kuchi o akete kaze o hamu
[00:58.75]Haru ga saki hana guwashi
[01:01.67]Sakura no chirinuruwo tiào Mu
[01:09.90]Ima,-fū o hamu
[01:21.06]Tana no kokoro wa jū go-en hitotsudake urenokotta
[01:25.84]Nebiki no shīru o hatte heiten jikan o matta
[01:31.15]Ashita mo kitto tenki de kokonimo kyaku ga narande
[01:36.48]Ni waribiki no kokoro wa darekaga kau ndarou ka
[01:42.31]Anata dake anata dake
[01:57.71]Boku wa zutto omotteta nda
[02:00.64]Tada shiroi ano kumo o matsu
[02:02.50]Kaze no nai haru ni sāo Meku
[02:05.42]Kusa nagare amatobuya
[02:08.87]Karuku hana no chiru o tiào Mu
[02:14.44]Ima,-fū o hamu
[02:22.94]Tsuini kokoro wa hangaku itsu made mo urenokotte
[02:32.50]Terebi o nagamete kūsō nyūsu wa kibō no bāgen
[02:38.09]Anata wa kyō mo katteru tarinai mono shika nakute
[02:43.13]Utsumuku temoto de kōnyū sora wa takai no ka na
[02:58.28]Anata dake anata dake
[03:04.40]Kono kibō o wakaranai nda
[03:07.05]Urenokori no kokorode ī
[03:09.44]Boku ni totte wa utsukushī
[03:11.84]Haru ga saki hana guwashi
[03:15.03]Sakura no chirinuruwo tiào Mu
[03:17.68]Anata shika anata shika
[03:25.37]Anata no kizu wa wakaranai nda
[03:28.31]Kuchi o akete utai dasu
[03:30.69]Ima, anata wa kaze o hamu
[03:33.62]Fuyugomori haru ga saki
[03:36.28]Anata no uta dake ga kikoeru
[03:41.59]Ima, kuyū mu anata dake
[03:54.34]Anata dake`
      },
      {
        "trackId": "ebbb29a2-f47c-45ca-8d9a-57ac32b102fe",
        "language": "Japanese",
        "text": `
[00:00.57]Anata wa dōshite boku ni kokoro o kureta ndeshou
[00:06.96]Anata wa dōshite boku ni me o kaita nda
[00:13.06]Sora yori ōkiku kumo o nagasu kaze o nomikonde
[00:20.23]Boku no manako wa mata yume o mite ita
[00:26.60]Hadashi no mama de
[00:37.24]Anata wa yukkuri to kawatte iku totemo chīsaku
[00:43.86]Sukoshi zutsu fukuramu pan o nagameru yō ni
[00:50.52]Anata wa yukkuri to hashitte iku
[00:54.22]Nagai meiro no saki mo osorenai mama de
[01:05.65]Anata wa dōshite boku ni namae o kureta ndeshou
[01:11.48]Anata wa dōshite boku ni te o tsukutta nda
[01:17.87]Umi yori ōkiku suna o nagasu nami mo nomikonde
[01:25.31]Chīsana ryōte wa mada tōku o mi teta
[01:31.42]Akubi o hitotsu
[01:36.73]Bokura wa yukkuri to nemutte iku
[01:44.89]Totemo nagaku atama no man'naka ni sodatte iku ōkina ki no
[01:53.65]Konpon o yukkuri to aruite iku
[01:58.17]Nagai meiro no saki o osorenai yō ni
[02:07.48]Itsuka totemo oitsukenai hito ni deau nodarou ka
[02:13.86]Itsuka totemo koerarenaikabe ni sukumu nodarou ka
[02:21.03]Itsuka anata mo sore o akiramete shimau nodarou ka
[02:27.40]Yukkuri to kawatte iku
[02:31.38]Yukkuri to kawatte iku
[02:34.84]Yukkuri to kawatte iku
[02:37.92]Bokura wa yukkuri to wasurete iku totemo chīsaku
[02:44.30]Sukoshizutsu kuzureru tō o nagameru yō ni
[02:50.40]Bokura wa yukkuri to nemutte iku
[02:54.40]Yukkuri to nemutte iku
[03:00.53]Anata wa yukkuri to kawatte iku totemo chīsaku
[03:07.16]A no ki no man'naka ni sodatte iku kokage no yō ni
[03:13.81]Anata wa yukkuri to hashitte iku
[03:18.06]Nagai meiro no saki mo osorenai mama de
[03:27.36]Tashikani mayoinagara`
      },
      {
        "trackId": "ddb5d380-202a-40dd-b130-90bfa2414a45",
        "language": "Japanese",
        "text": `
[00:01.72]Ne~e kangaenakute mo ī yo
[00:04.62]Kuchisaki ja wakari aenai no
[00:07.29]Kono-on ni ima wa norou yo
[00:09.94]Wasurenai de itai yo
[00:12.33]Karada wa musaishiki reidobakku
[00:14.99]Tada uneru amaoto de gurūvu
[00:17.10]Zuttofutaride kurasou yo
[00:19.76]Kono yoru no sumikko de
[00:32.78]Ne~e fugainai bokura de ī yo
[00:45.02]Tte sasotta no wa kimi janai no
[00:47.67]Rikutsu dakeja tsumaranai wa
[00:50.32]Mada jikan ga oshī no?
[00:52.71]Neriaruku keshiki o shinkū pakku
[00:55.39]Fuminarasu ashioto de gurūvu
[00:57.78]Marude bokura wa burēmen
[01:00.17]Tatta futaridake no māchi
[01:03.10]Sa~a iki o sutte hayaku haite
[01:12.65]Sei ⓶ Uta tte iyou ze
[01:15.57]Warau kai omae mo dō dai
[01:18.50]Ai no uta o utatten no sa ahhahhawwa
[01:22.75]Sei ⓶ Tanoshite ikou ze
[01:25.67]Shinuhodo no koto wa konoyo ni nai ze
[01:28.34]Ashita wa nani shiyou ka
[01:30.71]Himanara wakari aou ze
[01:33.10]Ne~e kangaenakute mo ī yo
[01:55.68]Odori hajimeta kimi no saibō
[01:58.06]Kono-on ni ima wa norou yo
[02:00.73]Norenakute mo ī yo
[02:02.85]Omoide no keshiki de bakku pakku
[02:05.78]Harukaze no sāo Mekide gurūvu
[02:08.18]Motto futari de utaou yo
[02:11.11]Himanara ai o shiyou yo
[02:13.75]Sa~a iki o sutte koenidashite
[02:23.86]Sei ⓶ Uta tte iyou ze
[02:26.24]Warawa re teru no mo shikata ga nai ne
[02:28.90]Nanimokamo machigatten no sa
[02:31.31]Nā, ahhahhawwa
[02:33.71]Sei ⓶ Tanoshite ikou ze
[02:36.62]Baka o yosōu no mo raku janai ze
[02:39.03]Onajiyōna kashidashi san-ban wa tobashite ī yo
[02:44.06]Sa~a iki o sutte hayaku haite
[03:04.00]Ne~e kokoro o kashite kyō kurai wa
[03:14.12]Sei ⓶ Uta tte iyou ze chigau ka?
[03:18.11]Omaera mina boku no koto o waratten no ka? Nā
[03:23.93]Sei ⓶ Tanoshite ikou ze
[03:27.13]Shinu hodo tsurainara nigedasou ze
[03:29.53]Sunen tateba kitto hitori mo oboe tenai yo
[03:34.31]Ze e ze e uta tte iyou ze
[03:37.24]Karada wa ugoku? Omae mo dō dai
[03:39.62]Ai no uta o utatten no sa ahhahhawwa
[03:44.43]Sei ⓶ Tanoshite ikou ze
[03:47.34]Shinuhodo no koto wa konoyo ni nai ze
[03:50.00]Ashita wa nani shiyou ka himanara warai aou ze
[03:55.05]Sonōchi wakari aou ze`
      },
      {
        "trackId": "43ac4e00-0d06-4a78-91a7-99fea764db14",
        "language": "Japanese",
        "text": `
[[00:00.90]Wasureru nante hidoidaro
[00:23.46]Shiawaseni nante naru mono ka
[00:26.12]Iro no nai nanika ga saita
[00:28.76]Kimi no inai natsu ni saita
[00:31.17]Hito ni warawa retakunaikara
[00:33.54]Obieru yō ni shita o muku
[00:36.21]Kokoroyori daijina nanika ga
[00:38.89]A tte tamaru mono ka
[00:41.27]Kurenai yū ni akane oitsuite
[00:43.67]Kimi o somenuita
[00:46.04]Mienai yō ni boku o oikoshite
[00:49.77]Ikanaide
[00:54.29]Boku-tachi kamisama nante shirankao
[00:56.93]Dokomade datte ikeru
[00:59.32]Nā, kokoro made minikui bokurada
[01:02.27]Sekai wa bokura no monoda
[01:04.65]Ongaku dakede ī ndaro
[01:07.31]Tanin(hito)ni awa sete aruku na yo
[01:10.76]Oshiete kureta no wa anta janai ka
[01:14.48]Dō datte ī yo, konomama tōku e
[01:17.68]Daremoshiranai basho de tsukiakari o sagasu noda
[01:33.62]Namonai hana ga kirei toka
[01:36.01]Dō demo ī koto bakkada
[01:38.67]Kimi no kuchiguse ga kansen(utsu )tteru
[01:41.34]Nodo no mashita ni wa kimi ga iru
[01:43.98]Kotoba mo seikatsu mo aiso mo
[01:46.37]Subete sutete koso ongakuda
[01:49.03]Sono kachi mo shiranai anta ni
[01:51.42]Waka tte tamaru mono ka
[01:53.81]Kurenai yū ni akane oitsuite
[01:56.73]Boku o somenuita
[01:58.85]Itsuka jikan ga subete oinuite
[02:02.57]Kienaide
[02:06.56]Boku-tachi kamisama nante shirankao
[02:09.49]Sekai no zenbu ga hoshī
[02:12.40]Nā kokoro made minikui anta no, omoide zenbu o kureyo
[02:17.18]Kachikan datte jiyūnara
[02:20.11]Hito o kizutsukete īdaro
[02:22.50]Oshienakatta no wa anta janai ka
[02:27.30]Dō datte ī yo, konomama tōku e
[02:29.96]Dare mo mitenai basho de ikiru mane o shi teru no sa
[02:40.31]Hidoi kao de odoru no sa
[02:44.83]Mune mo itai mama de
[03:01.30]Kamisama bokutachi nante shirankao
[03:04.21]Dokomade datte ikeru
[03:06.61]Nā, kotoba ga sekaida to iunara, sekai wa bokura no monoda
[03:11.93]Wasureru nante hidoidaro
[03:14.58]Shiawaseni nante nareru ka yo
[03:17.22]Boku o yugameta no wa anta janai ka
[03:21.75]Sōdatta, boku wa kono mama tōku e
[03:25.19]Daremoshiranai basho de tsukiakari o sagasu noda`
      },
      {
        "trackId": "c0127eb7-b432-42a8-a568-a1c1021b7411",
        "language": "Japanese",
        "text": `
[00:00.28]Karada no oku nodo no mashita
[00:26.57]Kokoro ga aru to surunara kimi wa sokona ndaroukara
[00:44.10]Zuttomaekara wakatte itakedo
[01:01.64]Toshi toreba kimi no kao mo wasurete shimaukara sa
[01:09.87]Karada no oku nodo no naka de kotoba ga dekiru shunkan o boku wa shiritaikara
[01:27.14]Kono mama yorugaaketara
[01:35.37]Kawakanai yō ni omoide o
[01:39.62]Shitsu kusa nai yō ni konoutawo
[01:43.87]Wasurenai de mō chotto dakede ī
[01:49.18]Hitoribotchi no parēdo o
[02:04.31]Zuttomaekara omottetakedo
[02:22.12]Kimi no yubisaki no nakaniha tabun kamisama ga sunde iru
[02:30.87]Kyō, kinō yori zuttomaekara, zutto sono mukashi no mukashikara
[02:46.03]Wakaru nda
[03:18.83]Karada no oku nodo no mashita
[03:31.86]Kimi no kaku uta o tada maneru hibi o
[03:40.88]Wasurenai yō ni
[03:46.46]Kimi no inai ima no ondo o
[03:59.21]Kawakanai yōna omoide de
[04:03.74]Shitsu ku senaide ita kono uta de
[04:08.24]Mōsukoshide ī mō chotto dakede ī
[04:13.83]Hitoribotchi no parēdo o`
      },
      {
        "trackId": "382d602d-411c-449b-8826-f88e0e8a0217",
        "language": "Japanese",
        "text": `
[00:00.86]Hito ni yasashii anta ni kono kokoro ga wakaru mono ka
[00:33.69]Hito wo norou no ga kokochi ii, dakara uta wo kaiteita
[00:38.47]Asa no houdou nyuusu ni itsuka noru koto ga yume datta
[00:43.00]Sono tame ni houchou wo toideru
[00:47.52]Garasu wo tatakitsukeru oto, nanika no kami wo yabuku koto
[00:53.10]Sayonara no ato no yuuhi ga utsukushii tte, kimi datte wakaru daro
[00:59.74]Karasu no uta ni akane
[01:04.26]Kono kodoku mo ima oto ni kawaru
[01:09.29]Omokage ni sashita higure
[01:13.01]Tsumasakidatsu, kumo ga yakeru, sayonara ga kuchi wo suberu
[01:31.60]Mitomeraretai, aishitai
[01:43.29]Kore ga yume tte yatsu ka
[01:45.68]Nanimo shinakutemo kanaeyo, hayaku, boku wo mitashite kure
[01:50.46]Hito ni yasashii seken ni kono netami ga wakaru mono ka
[01:54.98]Itsumo dareka wo nagureru kikai wo sagashiteru
[01:59.76]Biiru bin de naguru gairotou, nageru gitaa no oreru oto
[02:05.06]Modoranai koukai no zenbu ga utsukushii tte, sou iu no saa, boku datte wakaru no ni
[02:11.71]Kotoba no ame ni utare
[02:16.24]Aki oshimu mama fuyu ni ochiru
[02:21.28]Haru no yama no ushiro kara mata hitotsu kemuri ga tatsu
[02:30.56]Natsukaze ga hoho wo suberu
[02:34.56]Hito ni yasashii anta ni kono kodoku ga wakaru mono ka
[02:48.93]Shinitakunai ga ikirarenai, dakara uta wo kaiteiru
[02:53.44]Batou mo shitsubou mo keno mo boku e no kyoumi da to omou kara
[02:57.44]Hito wo kizutsukeru uta wo kaiteru
[03:02.92]Konna nakami no nai uta wo kaiteru
[03:07.28]Kimi no kotoba ga nomitai
[03:14.24]Iremono mo nai ryoute de ukete
[03:19.02]Itsu shika nodo ga uruou
[03:22.74]Sono toki wo machi nagara
[03:28.58]Karasu no uta ni akane
[03:33.09]Kono kodoku yo ima uta ni kaware
[03:37.87]Sayonara, kimi ni akane
[03:42.12]Boku wa ima, yoru wo matsu
[03:47.15]Mata ashita, kuchi ga suberu`
      },
      {
        "trackId": "d28b927a-53a0-4732-bfe4-04ca2011590b",
        "language": "Japanese",
        "text": `
[00:00.31]"Ongaku no kikkake wa nanida kke
[00:12.53]Chichi no motsu rekōdodatta ka na
[00:15.17]Oto o kiku koto wa kimochigaii
[00:17.57]Kiku dakenara doryoku mo iranai
[00:19.69]Maeoki wa īkara hanasou
[00:21.82]Arutoki, omoitsuita nda
[00:24.21]Kono uta ga boku no mono ni nareba, kono ana wa umarudarou ka
[00:29.53]Dakara, boku wa nusunda"
[00:40.67]Aa, mada tarinai. Zenbu tarinai
[00:43.35]Nanihitotsu mo mitasa renai
[00:45.46]Kono mama hitori jā boku wa iki rarenai
[00:50.25]Motto shiritai. Ai o shiritai
[00:52.90]Kono kokoro o mitasu kurai utsukushī mono o shiritai
[01:19.48]"Aru toki ni, machi o nagareru uta ga boku no kyoku datte koto ni kigatsuita
[01:25.04]Ureta nante atarimae-sa
[01:27.18]Meisaku o nusunda monodakara sa~a!
[01:29.84]Aitsu mo bakada. Koitsu mo bakada
[01:32.25]Homechigiru yatsura wa mina bakada
[01:34.90]Muragaru ugō no shū, hontō no kachi nante wakarazu ni
[01:39.42]Ma~a, sore wa boku mo onaji ka"
[01:50.31]Aa, nanika ga tarinai
[01:51.90]Kore dake nusundanoni sukoshi mo mitasa renai
[01:55.09]Jōmen no kotoba hitotsu ja mitasa renai
[01:59.87]Ai ga shiritai. Kin ga tarinai
[02:02.51]Kono netami o mitasu kurai utsukushī mono o shiritai
[02:09.68]"Ongaku no kikkake ga nan'na no ka,
[02:31.83]Ima ja mō wasure chimattaga yoku janai koto wa oboe teru
[02:36.56]Nanika kireina monodatta na
[02:38.94]Bakenokawa nante itsuka hagareru
[02:41.61]Mimuki mo sa renai yorugakuru
[02:44.00]Sonotoki ni mi rareru keshiki ga shinsoko tanoshimi de
[02:48.52]Sōda
[02:51.16]Nanihitotsu mo naku natte, chii mo ai mo zenbu nakunatte
[02:55.43]Nanimokamo ushinatta nochi ni mieru yoru wa hontōni kireidaroukara,
[03:00.74]Hontōni, hontōni kireidaroukara,
[03:11.10]Boku wa nusunda"
[03:16.41]Aa, mada tarinai. Motto kakitai
[03:21.99]Kon'na uta ja mitasa renai
[03:24.65]Kimi-ra no batō jā boku wa mitasa renai
[03:28.63]Mada shiranai ai o kakitai
[03:31.56]Kono kokoro o mitasu kurai utsukushī mono o shiritai
[03:38.74]Mada tarinai. Mada tarinai
[03:40.84]Mada tarinai. Mada tarinai
[03:43.50]Mada tarinai. Boku wa tarinai
[03:45.90]Zutto tarinai mono ga wakaranai
[03:48.55]Mada tarinai. Motto shiritai
[03:50.94]Kono karada o tokasu kurai utsukushī yoru o shiritai`
      },
      {
        "trackId": "05f185bb-7c07-4106-9499-36b926231937",
        "language": "Japanese",
        "text": `
[00:00.00]Kangae tatte wakaranaishi
[00:04.46]Aozora no shimo, kimi o matta
[00:06.33]Kaze ga fuita shōgo, hirusagari o nukedasu sōzō
[00:10.03]Ne~e, korekara dō naru ndarou ne
[00:11.91]Susumekata osowaranai nda yo
[00:14.02]Kimi no me o mita nani mo iezu boku wa aruita
[00:32.36]Kangae tatte wakaranaishi
[00:35.03]Seishun nante tsumaranaishi
[00:36.89]Yameta hazu no piano, tsukue o hajiku kuse ga nukenai
[00:40.60]Ne~e, shōrai nanishiterudarou ne
[00:42.72]Ongaku wa shi tenaito ī ne
[00:45.11]Komaranaide yo
[00:47.78]Kokoronouchi ni hitotsu-sen o hiite mo
[00:55.47]Dōshitemo kienakatta imasarana ndakara
[01:00.54]Nā, mō omoidasu na
[01:02.92]Machigatteru nda yo
[01:04.26]Wakattenai yo, antara ningen mo
[01:07.38]Hontō mo ai mo sekai mo kurushi-sa mo jinsei mo dō demo ī yo
[01:11.02]Tadashī ka dō ka shiritai no datte bōei hon'nōda
[01:14.46]Kangaeta nda anta no seida
[01:32.26]Kangae tatte wakaranaiga, hontōni toshioitakunai nda
[01:36.51]Itsuka shindara tte omou dake de mune ga karappo ni naru nda
[01:40.23]Shōrai nanishiterudarou tte
[01:42.37]Otona ni nattara wakatta yo
[01:43.95]Nani mo shi tenai sa
[01:47.15]Shiawasena kao shita hito ga nikui no wa dō warikittara ī nda
[01:56.98]Mitasa renai atama no oku no bakemono mitaina retsutōkan
[02:04.68]Machigattenai yo
[02:06.01]Nā, nandakanda antara ningenda
[02:08.60]Ai mo sukui mo yasashi-sa mo konkyo ga nai nante kimigawarui yo
[02:12.55]Rabusongu nanka ga itai no datte bōei hon'nōda
[02:16.00]Dō demo ī ka anta no seida
[02:33.80]Kangae tatte wakaranaishi
[02:35.91]Iki teru dake demo kurushīshi
[02:37.78]Ongaku toka mōkaranaishi
[02:39.71]Kashi toka tekitō demo ī yo
[02:44.28]Dō demo ī nda
[02:49.08]Machigattenaidaro
[02:52.81]Machigattenai yo na
[02:56.78]Machigattenai yo na
[03:07.89]Machigatteru nda yo wakatteru nda
[03:12.15]Antara ningen mo
[03:13.72]Hontō mo ai mo sukui mo yasashi-sa mo jinsei mo dō demo ī nda
[03:17.71]Tadashī kotae ga ienai no datte bōei hon'nōda
[03:21.19]Dō demo ī ya anta no seida
[03:25.16](Ah) bokudatte shin'nen ga atta
[03:42.96]Ima ja chiri mitaina omoida
[03:45.09]Nandodemo kimi o kaita
[03:46.68]Ureru koto koso ga dō demo yokatta nda
[03:50.66]Hontōda hontōna nda mukashi wa sōdatta
[03:55.99]Dakara boku wa ongaku o yameta`
      },
      {
        "trackId": "5ba55f09-db65-4c1d-8d48-01bb50b29593",
        "language": "Japanese",
        "text": `
[00:12.17]Nee, kono mama yoru ga kitara, bokura dou naru n darou ne
[00:23.55]Ressha ni demo notte iku kai. Boku wa doko demo ii ka na
[00:33.36]Kimi wa mada wakaranai darou kedo, sora mo kotoba de dekiterun da
[00:40.02]Sokka, tonarimachi nara tsuite iku yo
[00:45.59]Harahara, harahara, harari
[00:49.85]Haruruhara kimi ga yomu uta ya ichirinsou
[00:54.10]Hoka ni wa nan ni mo iranai kara
[00:59.39]Namidatsu natsu hara, namida tsukinu mama naku ya higurashi wa yuu, yuu, yuu
[01:06.31]Natsu ga owatte ikun da ne
[01:10.29]Sou nan da ne
[01:24.90]Nee, itsuka otona ni nattara, bokura dou naru n darou ne
[01:36.06]Nanika shitai koto wa aru no kai. Boku wa sore ga mitai ka na
[01:47.48]Kimi wa wasurete shimau darou kedo omoide dake ga hontou nan da
[01:53.32]Sokka, michi no saki nara tsuite iku yo
[01:58.90]Sarasara, sarasara, sarasara, sarasara
[02:04.86]Hanakaze, yurare ya ichirinsou
[02:07.25]Kotoba wa nan ni mo iranai kara
[02:12.83]Kimi tatsu natsu hara, kami wa nabiku mama, naku ya amamoyoi yuu, yuu, yuu
[02:19.46]Natsu ga owatte ikun da ne
[02:25.31]Sou nan da ne
[02:30.11]Sokka, otona ni nattan da ne
[02:39.93]Harahara, harahara, harari
[02:46.33]Haruruhara kimi ga yomu uta ya ichirinsou
[02:49.78]Hoka ni wa nan ni mo iranai kara
[02:55.62]Namidatsu natsu hara, namida tsukinu mama naku ya higurashi wa yuu, yuu, yuu
[03:02.25]Natsu ga owatte ikun da ne
[03:07.56]Boku wa koko ni nokorun da ne
[03:13.41]Zutto mukou e ikun da ne
[03:19.00]Sou nan da ne`
      },
      {
        "trackId": "4f264253-9ce4-4a26-aaeb-f0947fa1602e",
        "language": "Japanese",
        "text": `
[00:01.68]Kimi no migite wa hoho o tsuite iru
[00:09.11]Boku wa hidarite ni nukui magukappu
[00:15.49]Kimi no migi mayu wa sukoshi tarete iru
[00:21.60]Asa ga kon'nanimo futta
[00:27.73]Hitotsude ī
[00:29.32]Chiranu botan no hitotsude ī
[00:31.98]Kimi no mune o ute
[00:34.39]Kokoro o na(wasu)reru hodo no kōfuku o
[00:39.96]Hitotsude ī nda
[00:41.82]Migi mo hidari mo wakaranu hodo ni tesaguri no yoru no naka o
[00:52.71]Hitori iku sono shizukesa o
[00:59.24]Sono hitotsu o oshie raretanara
[01:06.15]Kimi no hidari mayu wa sukoshi tarete iru
[01:12.25]Umaku omoidasenai
[01:15.50]Boku ni wa wakaranai mitai
[01:18.43]Kimi no migite ni wa itsuka katta shōsetsu
[01:25.09]Are, sore tte hidariteda kke
[01:36.41]Hitotsude ī
[01:38.54]Yoru no hizashi no hitotsude ī
[01:41.73]Kimi no munewoutsu, kokoro o nozokeru hodo no kanshō o
[01:49.43]Hitotsude ī nda
[01:51.29]Natsu ni mau hyō no sono naka mo tesaguri de ikeru koto o
[02:01.65]Kimi no me wa tojinu koto o
[02:19.46]Boku no karada kara kokoro o sukoshizutsu hagashite
[02:29.59]Kimi ni watashite
[02:30.90]Sono zenbu o agerukara
[02:33.58]Ken no gara kara rubī o
[02:36.22]Kono hitomi kara safaia o
[02:40.47]Namari no shinzō wa tada hata ni oite
[02:46.61]Hitotsude ī
[02:51.12]Chiranu botan no hitotsude ī
[02:54.31]Kimi no mune o ute
[02:56.71]Namida mo wasureru hodo no kōfuku o
[03:02.00]Sukoshide ī nda
[03:03.87]Kyō no kosame ga yamu tame no taiyō o
[03:11.84]Sukoshide ī
[03:16.09]Kimi no sekai ni sukoshide ī boku no kutsu ato o
[03:21.68]Wakarudarou ka, kimi no kōfuku wa
[03:27.27]Hitotsu janai nda
[03:29.40]Migi mo hidari mo wakaranu hodo ni tesaguri no yoru no naka o
[03:40.03]Kungaiku nagai korekara o
[03:46.65]Boku dake wa warawanu koto o
[03:52.77]Sono hitotsu o oshie raretanara
[04:02.28]Nani o tabetemo aji ga shinai nda
[04:08.94]Karada ga kiete shimatta yōda
[04:15.33]Anata no kokoro to watashi no kokoro ga
[04:21.68]Zutto hitotsuda to omotteta nda`
      },
      {
        "trackId": "ab7927bc-3975-4f3c-9776-a085bd228347",
        "language": "Japanese",
        "text": `
[00:05.12]Tsuki ga kireina yoru ni
[00:09.64]Mori no naka de tada hitori
[00:14.68]Kono sekai kara tabidatsu mae ni
[00:19.19]Kore made no hibi o ukaberu
[00:23.71]Yūfuku janai kurashi soredemo
[00:26.37]Itsu datte soba ni wa haha no yasashi-sa
[00:29.57]Boku no kaku e o daisukida to itte kureta hito
[00:33.28]Futari ikiru tame ni yume mo sute hataraite
[00:36.21]Sore demo otozureru wakare
[00:38.07]Son'na tokini kimi ni deai
[00:40.46]Koi ni ochita
[00:41.78]Ai o shitta
[00:42.85]Shiawasedato
[00:43.92]Omoetanoni
[00:46.01]Dōshite
[00:45.78]Taisetsuna mono bakari ga
[00:48.43]Kieteiku kieteiku
[00:50.29]Kono sekai to
[00:53.72]Sayonara shiyou
[00:55.59]Ai ni iku yo ima sugu soko e
[00:58.24]Kimi ga iru tokoro made
[01:00.36]Aishiteiru gomen ne
[01:02.21]Sonotoki kiminokoe ga kikoeta
[01:04.35]Sō yatte jibun de subetewo
[01:06.76]Owari ni shite shimaeba mō
[01:08.90]Dareni mo aenai nda yo zutto
[01:12.89]Mangetsu no yoru ni
[01:14.76]Lalalalalalala
[01:22.20]Owara seru koto ga dekizu
[01:24.84]Jimen ni ochita boku ni totsuzen
[01:28.29]Tsuki ga hanashikakete kita
[01:30.15]Soshite fushiginachikara o kureta
[01:32.81]Egaita mono ni inochi o wakeataeru chikara
[01:37.62]Kare kaketa kusaki mo ikiwofukikaesu
[01:40.53]Boku no nokori no jikan to hikikae ni
[01:44.00]Egaite iku kono inochi o moto ni
[01:46.10]Sukoshizutsu wakeataete iku aa
[01:48.51]Ikiru imi ga dekita nda
[01:50.09]Son'na toki anata to deatta
[01:52.76]Onajiyōni kanashimi no naka de ikite iru hito
[01:55.93]Mizukara tabidatou to shita boku o okotte kureta hito
[02:00.20]Itsunomanika hika rete itta
[02:01.79]Dakedo anata ni wa aisuruhito ga iru
[02:05.51]Anata o uragitta hidoi hito
[02:07.10]Soredemo anata ga aishite shimau hito
[02:09.65]Son'na kare no inochi ga ima kie kakete iru
[02:12.58]Nakinagara kare no namae o sakebu
[02:17.62]Anata o mite kimeta
[02:20.55]Ichinichi dake nokoshite
[02:23.74]Boku no inochi subete o sasagete egaita
[02:29.58]Soshite kare wa me o samashita
[02:34.36]Aa boku ga okoshita kiseki ni
[02:36.22]Namida nagashi yorokobu anata ni
[02:38.87]Dōshitemo tsutaetai
[02:40.46]Boku no omoi o saigo ni kiite
[02:43.12]Kō yatte ikiru yorokobi o
[02:45.25]Ataete kureta anata ga
[02:47.63]Hontōni daisukideshita
[02:51.88]Sayonara
[02:53.21]Lalalalalalala
[03:00.65]Soshite hitori
[03:01.99]Anata no koto haha no koto
[03:04.91]Kimi no koto omoi-me o tsubutta
[03:07.56]Nagai nagai tabi no owari
[03:10.49]Yatto mata aeta ne`
      },
      {
        "trackId": "ae41d098-e0b9-4ac0-85d0-64640fd7ff28",
        "language": "Japanese",
        "text": `
[00:01.78]Shizumu yō ni tokete yuku yō ni
[00:08.94]Futaridake no sora ga hirogaru yoru ni
[00:31.26]Sayonara dakedatta
[00:33.93]Sono hitokoto de subete ga wakatta
[00:37.64]Hi ga shizumi dashita sora to kimi no sugata
[00:41.89]Fensu-goshi ni kasanatte ita
[00:45.35]Hajimete atta hi kara
[00:48.82]Boku no kokoro no subete o ubatta
[00:52.27]Doko ka hakanai kūki o matou kimi wa
[00:56.79]Sabishī me o shi teta nda
[01:00.00]Itsu datte chikkutakku to
[01:02.13]Naru sekai de nando datte sa
[01:04.00]Fureru kokoronai kotoba urusai
[01:05.85]Koe ni namida ga kobore-sōde mo
[01:08.51]Arikitarina yorokobi kitto
[01:11.70]Futarinara mitsuke rareru
[01:15.15]Sawagashī hibi ni waraenai kimi ni
[01:18.87]Omoitsuku kagiri mabushii asu wo
[01:22.59]Akenai yoru ni ochite yuku mae ni
[01:26.31]Boku no te o tsukan de hora
[01:29.25]Wasurete shimaitakute tojikometa hibi mo
[01:33.73]Dakishimeta nukumori de tokasukara
[01:37.48]Kowakunai yo itsuka higanoboru made
[01:41.98]Futari de iyou
[01:58.20]Kimi ni shika mienai
[02:00.85]Nanika o mitsumeru kimi ga kiraida
[02:04.31]Mitorete iru ka no yōna koi suru yōna
[02:08.86]Son'na kao ga kiraida
[02:12.31]Shinjite itaikedo shinji renai koto
[02:14.53]Son'na no dō shitatte kitto
[02:16.40]Korekara datte ikutsu moatte
[02:18.00]Sono tanbi okotte naite iku no
[02:20.11]Soredemo kitto itsuka wa kitto
[02:21.71]Bokura wa kitto wakari aeru-sa
[02:24.63]Shinji teru yo
[02:40.56]Mōiyada tte tsukareta n datte
[02:43.19]Gamushara ni sashinobeta boku no te o furiharau kimi
[02:48.24]Mōiyada tte tsukaretayo nante
[02:50.63]Hontōha boku mo iitai nda
[02:54.88]Ah, hora mata chikkutakku to
[02:56.47]Naru sekai de nando datte sa
[02:58.36]Kimi no tame ni yōi shita kotoba dore mo todokanai
[03:01.80]Owari ni shitaida nante sa
[03:04.19]Tsura rete kotoba ni shita toki
[03:06.06]Kimi wa hajimete waratta
[03:11.37]Sawagashī hibi ni waraenaku natte ita
[03:15.36]Boku no meniutsuru kimi wa kireida
[03:19.06]Akenai yoru ni koboreta namida mo
[03:22.80]Kimi no egao ni tokete iku
[03:28.11]Kawaranai hibi ni naiteita boku o
[03:31.83]Kimi wa yasashiku owari e to sasou
[03:35.30]Shizumu yō ni tokete yuku yō ni
[03:39.28]Shimitsuita kiri ga hareru
[03:42.18]Wasurete shimaitakute tojikometa hibi ni
[03:46.71]Sashinobete kureta kimi no tewotoru
[03:50.43]Suzushī kaze ga sora o oyogu yō ni
[03:53.80]Ima fukinukete iku
[03:57.00]Tsunaida te o hanasanaide yo
[04:00.44]Futari ima yoru ni kakedashite iku`
      },
      {
        "trackId": "b40d7e91-ac9d-4a6f-ae24-242a41be9618",
        "language": "Japanese",
        "text": `
[00:00.92]shuuden wa mou nai yo
[00:03.40]kore kara dou shiyou ka nante
[00:05.53]mayoikomitai na futari de
[00:10.03]shuuten nante nai no
[00:12.72]ashita no koto nante hora
[00:15.09]ima wa kangaenaide yo ne
[00:39.82]itsumo to onaji peesu de aruku
[00:43.79]machi ni futari no kage utsusu
[00:49.38]narande mita keshiki wa hora
[00:53.36]itsu made mo kawaranai mama de
[00:58.67]ano koro wa kodomo datta ne to
[01:02.13]warikiru ni wa kizutsukisugita yo ne
[01:07.45]omoide no naka ni oboreru mae ni
[01:13.01]kono basho de sayonara
[01:17.79]kimi ni todoke to kono ai o
[01:20.34]kotoba ni noseru mainichi o
[01:22.85]utsukushiku omoenai to
[01:25.26]itsuka wa kiete shimau no
[01:27.65]kore de owari da nante
[01:30.04]fushigi na kimochi ni naru kedo
[01:33.48]genki de ne
[01:37.73]itsumo to chigau tenpo de warau
[01:41.45]kimi wa ima nani o kangaete iru no?
[01:46.23]wazatorashiku shioreta kuuki
[01:51.01]sukoshi iki ga furueru
[01:56.32]ima made hanashita koto
[01:58.45]subete oboete wa inai keredo
[02:00.57]arigatou no kotoba to gomen ne to
[02:03.23]umaku tsutaerarenakatta kara
[02:05.78]konna ketsumatsu o mukaeta no nara
[02:10.82]"gomen ne" ososugita ne
[02:15.36]kimi ni todoke to kono ai o
[02:18.00]kotoba ni noseru mainichi o
[02:20.40]ikigurushiku omoechau hodo
[02:22.78]itsu kara kawatte shimatta no?
[02:25.19]kore de owari da nante
[02:27.59]mada shinjirarenai keredo
[02:31.05]genki de ne
[02:50.92]shuuden mae no hoomu
[02:53.31]kotoba ga dete konai na
[02:55.71]koko kara wa mou hitori de
[03:00.49]deawanakereba nante
[03:02.87]sonna no omotte inai yo
[03:05.53]dakara waratte, waratte yo ne
[03:10.58]kimi ni todoke to kono ai o
[03:12.97]kotoba ni noseru mainichi o
[03:15.36]utsukushiku omoenai to
[03:18.00]itsuka wa kiete shimau no
[03:20.15]kore de owari da nante
[03:22.55]fushigi na kimochi ni naru kedo
[03:26.00]genki de ne
[03:29.71]kimi ni moratta kono ai mo
[03:32.11]kono te de fureta mainichi mo
[03:34.50]anmari ni mo utsukushii kara
[03:37.18]namida ga afurete shimau yo
[03:39.56]kore de owari da ne tte
[03:42.22]saigo no kotoba ni naru kedo
[03:45.41]arigato ne`
      },
      {
        "trackId": "0687b2ca-e02b-4661-8415-c7a3565ef5e3",
        "language": "Japanese",
        "text": `
[00:22.92]sanzen to kagayaku machi no akari
[00:26.91]taishouteki na boku o miorosu
[00:30.35]ano biru no aida o nukete
[00:32.47]irozuki dashita neon to majitte
[00:34.34]boku no jikan to kono sekai o toreedo
[00:37.00]yoru ni shizumu
[00:46.03]shuuden de ieji o tadoru boku no
[00:50.00]me ni utsuru garasu mado ni ita no wa
[00:53.74]yume mita jibun janakute
[00:55.59]ima ni mo nakidashite shimaisou na
[00:57.45]kurayami no naka hitori tada mayotte iru
[01:00.36]kanashii hito
[01:01.70]daijoubu, itsuka daijoubu ni naru
[01:05.40]nante omou hibi o ikutsu kasaneta
[01:09.12]kyou datte hitori toukyou no keshiki ni sukeru boku wa
[01:15.25]yuurei mitai da
[01:18.18]ushinau koto ni narete iku naka de
[01:21.90]wasurete shimatta ano negai sae mo
[01:25.90]omoidashita toki ni
[01:28.54]namida ga ochita no wa
[01:30.93]kono machi ga tada
[01:33.84]amari ni mo mabushii kara
[01:51.92]sanzan datte warainagara nageku
[01:56.15]taihaiteki na hibi no naka
[01:59.33]ano hi no omoi ga furasshubakku
[02:01.52]kizukeba asa made hiraku rojikku
[02:03.10]boku no kotoba o oto ni nosete nando demo
[02:06.29]ushinau koto ni narete iku naka de
[02:10.28]wasurete shimatta ano hibi de sae mo
[02:14.00]soredemo mada saki e
[02:16.65]nante omoeru no wa
[02:19.06]kimi ga iru kara
[02:24.87]nee
[02:26.46]konna sabishii machi de
[02:32.56]nee
[02:36.28]sanzen to kagayaku machi no akari
[02:40.56]taishouteki na boku o miorosu
[02:44.28]ano biru no saki, te o nobashite
[02:45.88]ano hi yume mita keshiki o nazotte
[02:47.74]boku no jikan to kono sekai o toreedo
[02:50.91]ashita o yobu
[02:53.06]ushinau koto ni narete iku naka de
[02:56.78]nakusazu ni ita daiji na omoi o
[03:00.50]dakishimetara fui ni
[03:03.16]namida ga ochita no wa
[03:05.84]kono machi de mada
[03:09.02]ikite itai to omou kara
[03:23.12]kimi mo sou desho`
      },
  ];

  await queryInterface.bulkInsert(
    "Lyrics",
    entries.map((entry) => ({
        ...entry,
        createdAt: yesterday,
        updatedAt: now,
    })),
    {}
    );
  },

  async down(queryInterface, Sequelize) {
      await queryInterface.bulkDelete("Lyrics", null, {});
  },
};
    