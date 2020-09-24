// import;
//import { } from "../../";



// Bootstrap便利関数

export class BSnavbar {
    constructor(head, id = "navbar", parent = null) {
        // 大枠生成
        // nav
        this.nav = document.createElement("nav");
        this.nav.classList.add("navbar", "navbar-expand-sm", "navbar-dark", "bg-dark");
        // responsive対応：breakpoint=sm
        this.nav.setAttribute("style", "position:sticky;bottom:0;z-index:1030;");
        // ※本来は"fixed-top"クラスで対応するが、stickyの方がmargin管理が楽

        // 要素代入
        /*
        // 先頭に代入
        if (parent == null) {
            document.body.insertBefore(
                this.nav, document.body.children[0]
            );
        } else {
            document.getElementById(parent).insertBefore(
                this.nav, document.getElementById(parent).children[0]
            );
        }
        */
        document.body.appendChild(this.nav);    //最後に追加

        // 見出し
        let a = document.createElement("a");
        a.classList.add("navbar-text");
        a.innerText = head;
        a.href = "./";
        this.nav.appendChild(a);

        // btn：responsive
        let btn = document.createElement("button");
        btn.classList.add("navbar-toggler");
        btn.type = "button";
        btn.setAttribute("data-toggle", "collapse");
        btn.setAttribute("data-target", "#" + id);
        btn.setAttribute("aria-controls", id);
        btn.setAttribute("aria-expanded", "false");
        btn.setAttribute("aria-label", "Toggle navigation");
        let btn_icon = document.createElement("span");
        btn_icon.classList.add("navbar-toggler-icon");
        btn.appendChild(btn_icon);
        this.nav.appendChild(btn);

        // menu
        let menu_box = document.createElement("div");
        menu_box.classList.add("collapse","navbar-collapse");
        menu_box.id = id;
        this.menu_wrap = document.createElement("div");
        this.menu_wrap.classList.add("navbar-nav");
        menu_box.appendChild(this.menu_wrap);
        this.nav.appendChild(menu_box);

    }

    addMenu(tx, link) {
        let a = document.createElement("a");
        a.classList.add("nav-item", "nav-link");
        a.innerText = tx;
        a.href = link;
        this.menu_wrap.appendChild(a);
    }
}

// 共通メニュー生成
export function setBSnavbar(root){
    let nav = new BSnavbar("数学資料集");
    nav.addMenu("単元別解説", "#");
    nav.addMenu("まとめシート", "#");
    nav.addMenu("練習問題", "#");
}