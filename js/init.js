"use strict";

//テーブルの横幅
let width = 20;
//テーブルの縦幅
let height = 10;
//爆弾の割合
let mine_per_cell = 0.2;
//最初の一手で爆発しないようにするための安全マージン
let margin = 0;
//安全マージンの最大値
let margin_max = 3;
//安全マージンの最小値
let margin_min = 1;
//カウント用　爆弾の数
let mine_num = 0;
//カウント用　経過時間
let time = 0;
//経過時間を測るコルーチンのid
let timer_id = 0;

let tap_x = -1;
let tap_y = -1;

//UIの初期化
function init_user_interface(){
    document.getElementById("easy").onclick = function(){
        mine_per_cell = 0.15;
    }
    document.getElementById("normal").onclick = function(){
        mine_per_cell = 0.25;
    }
    document.getElementById("hard").onclick = function(){
        mine_per_cell = 0.45;
    }

    document.getElementById("width").onchange = size_changer;
    document.getElementById("height").onchange = size_changer;

    document.getElementById("start").onclick = init_minesweeper_pre;
}

function init_minesweeper_pre() {
    cleartable("pre_field");
    let table = document.getElementById("field");
    for (let i = 0; i < height; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < width; j++) {
            tr.appendChild(init_createcell(i, j));
        }
        table.appendChild(tr);
    }
}

function init_createcell(y, x) {
    let td = document.createElement("td");
    //属性を色々追加
    td.id = y + "," + x;
    td.x = x;
    td.y = y;
    td.onclick = first_tap;
    hide_textContent(td);
    return td;
}

function first_tap(e) {

    tap_x = e.target.x;
    tap_y = e.target.y;
    restart();
}

//ゲーム開始！！
function init_minesweeper() {
    init_Table();
    init_field(tap_x, tap_y);
    init_Allnums();
    init_clear_flag();
    init_show_info();
}

//height, width等をもとにテーブルを作る処理 createcellを使ってる
function init_Table() {
    let table = document.getElementById("field");
    for (let i = 0; i < height; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < width; j++) {
            tr.appendChild(createcell(i, j));
        }
        table.appendChild(tr);
    }

}

//マインスイーパーのマスを作る処理。属性とかいろいろ追加したくなったらここへ
function createcell(y, x) {
    let td = document.createElement("td");
    //属性を色々追加
    td.id = y + "," + x;
    td.x = x;
    td.y = y;
    td.onclick = clicked;
    td.oncontextmenu = clicked;
    return td;
}

//地雷を設置する処理
//地雷が埋まっているマスはクラスをplacedにする
function init_field(x, y) {

    mine_num = 0;
    margin = Math.floor(width * height * (1 - mine_per_cell) * 0.01 > margin_max ? margin_max : (width * height * (1 - mine_per_cell) * 0.01 < margin_min ? margin_min : width * height * (1 - mine_per_cell) * 0.01));
    let num = Math.floor(width * height * mine_per_cell);

    for (let i = 0; i < num; i++) {
        while (true) {
            let pos = safe_random(height, width, y, x, margin);
            let cell = document.getElementById(pos[0] + "," + pos[1]);
            if (cell.classList.contains("placed")) continue;
            placeMine(cell);
            break;
        }
    }
}

//指定したcellにplacedクラスをつける処理。mine_numの管理はここで。
function placeMine(cell) {
    cell.classList.add("placed");
    mine_num++;
}

function init_Allnums() {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            init_number(i, j);
        }
    }
}

//周りにある爆弾の数を調べてセルに表示する
function init_number(y, x) {
    let check = document.getElementById(y + "," + x);
    if (!(check.classList.contains("placed"))) {
        let counter = 0;
        //-1,-1に爆弾があるかどうか調べる
        let cells = get_around_cells(y, x);
        for (let c of cells) {
            if (!(c == null)) {
                if (c.classList.contains("placed")) {
                    counter++;
                }
            }
        }
        //valueかなんかに入れといてクリックされたら表示
        check.value = counter;
        set_text_color(check, check.value);
    }
    hide_textContent(check);
}

function set_text_color(cell, num) {
    cell.classList.add("bomb_" + num);
}

function hide_textContent(e) {
    e.classList.add("uncheck");
}

//クリア条件の初期化
function init_clear_flag() {
    uncheck_num = width * height - mine_num;
}

function init_show_info() {
    let dif_text = "";
    let dif = document.getElementById("difficulity");
    if (mine_per_cell >= 1) { dif_text = "無理" }
    else if (mine_per_cell >= 0.7) { dif_text = "ほぼ不可能" }
    else if (mine_per_cell >= 0.5) { dif_text = "むずかしい" }
    else if (mine_per_cell >= 0.3) { dif_text = "ふつう" }
    else if (mine_per_cell >= 0.1) { dif_text = "かんたん" }
    else { dif_text = "何しに来たの？" }

    dif.textContent = dif_text;

    bomb_remained();
    timer_id = setInterval(timer, 1000);
}



function timer() {
    time++;
    document.getElementById("timer").textContent = time;
}

function stoptimer(timer_id) {
    clearInterval(timer_id);
}

function size_changer(e){
    cleartable("pre_field");
    let num = e.target.value;
    if(e.target.id == "width"){
        width = e.target.value;
    }else{
        height = e.target.value;
    }
    show_field_pre();
}

//ゲームが始まる前のテーブルを表示させる処理
function show_field_pre(){
    let pre_f = document.getElementById("pre_field");
    for (let i = 0; i < height; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < width; j++) {
            tr.appendChild(document.createElement("td"));
        }
        pre_f.appendChild(tr);
    }
}
