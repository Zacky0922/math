//  h1  サイトタイトル
//  h2  ページタイトル
//  h3  大見出し
//  h4  中見出し
//  h5  小見出し
//  h6  超小見出し  という設定で、h3以下を自動リスト化


// 参考　https://creatorclip.info/2015/10/jquery-table-of-contents-for-wordpress/
// jQueryに依存



export class activeMenu {
    constructor(id) {
        //  リスト作成
        let f = this.getHeads;
        $(window).on('load', function () {
            f(id);
        });
    }

    // 見出しリスト取得
    getHeads(id) {
        let menuHTML = "";
        let idcount = 0;
        let nowLv = 3;  //メニュー化最上位のレベルを設定
        let sectionTop = new Array();   // ページトップからの位置を格納

        // noListクラス以外のH3～H5要素を収集
        $("h3:not(.noList), h4:not(.noList), h5:not(.noList)").each(function (i) {
            //  ページ内リンク用にidを設定（個別に指定済みのidはそのまま利用）
            if (this.id == "") {
                this.id = "chapter-" + (idcount++);
            }

            //  目次作成
            //  見出しレベル設定
            let lv;
            switch (this.nodeName.toLowerCase()) {
                case "h3":
                    lv = 3;
                    break;
                case "h4":
                    lv = 4;
                    break;
                case "h5":
                    lv = 5;
                    break;
            }
            //  現在のレベルとの差分だけリストタグを入れ子にする
            while (nowLv < lv) {
                menuHTML += '<ol class="chapter">\n';
                nowLv++;
            }
            while (nowLv > lv) {
                menuHTML += '</ol>\n';
                nowLv--;
            }
            //  項目追加
            menuHTML += '<li>' +
                '<a href="#' + this.id + '">' + this.innerHTML + '</a>' +
                '</li>\n';

            //スクロール位置取得
            sectionTop[i] = $(this).offset().top;
        });
        let ol = document.createElement("ol");
        ol.classList.add("activeMenu");
        ol.innerHTML = menuHTML;
        document.getElementById(id).appendChild(ol);

        //  スクロールイベントセット
        $(window).on('load scroll', function () {
            for (var i = sectionTop.length - 1; i >= 0; i--) {
                // もしヘッダーマージン（メニューバー等）があれば調整する
                if ($(window).scrollTop() > sectionTop[i] - 5) {
                    $('ol.activeMenu li').removeClass('current').eq(i).addClass('current');
                    // 入れ子リスト対応（4階層まで：h3～h5を想定）
                    $('ol.activeMenu ol li.current').parent('ol').prev().addClass('current');
                    $('ol.activeMenu ol li.current').parent('ol').parent('ol').prev().addClass('current');
                    break;
                }
            }
        });


    }

}