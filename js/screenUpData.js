"use strict";

let uncheck_num = 0;
let tap_num = 0;

const bomb = "💣";
const flag = "🚩";
const clear_msg = "クリアおめでとう！"
const gameover_msg = "あなたは死にました...";

function clicked(e){
    if(e.button == 0){
        tap_x = e.target.x;
        tap_y = e.target.y;
        boom(e.target);
        tap_num++;
    }else if(e.button == 2){
        flaged(e.target);
    } 
    bomb_remained();
}

function flaged(cell){
    if(cell.classList.contains("uncheck")){
        if(cell.textContent == flag){
            cell.textContent = "";
            mine_num++;
        }else{
            cell.textContent = flag;
            mine_num--;
        }
    }
}

function boom(cell){
    if(cell.textContent == flag){
        //何もしない
        judge(0);
    }else if(cell.classList.contains("placed")){
        //gameover処理へ
        judge(-1);
    }else if(cell.classList.contains("uncheck")){
        //openからの戻り値でどうにかする
        let re_num = open(cell);
        judge(1);
        if(re_num == 0){
            let cells = get_around_cells(cell.y, cell.x);
            for(let c of cells){
                if(!(c == null) && c.classList.contains("uncheck")){
                    boom(c);
                }
            }
        }
    }
}

function judge(ret){
    if(ret == 1){
        uncheck_num--;
        if(uncheck_num <= 0){
            // clear処理
            clear();
        }
    }else if(ret == -1){
        //gameover処理
        if(tap_num <= 0){
            restart();
            return;
        }
        gameover();
    }
}

function open(cell){
    cell.classList.remove("uncheck");
    if(!cell.classList.contains("placed")){
        cell.textContent = cell.value == 0 ? "" : cell.value;   
    }else{
        cell.textContent = bomb;
        return -1;
    }
    return cell.value;
}

function open_all(){
    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            let cell = document.getElementById(i + "," + j);
            open(cell);
        }
    }
}

function gameover(){
    open_all();
    let p = document.getElementById("message");
    p.textContent = gameover_msg;
    p.classList.add("red");
    stoptimer(timer_id);
}
function clear(){
    open_all();
    document.getElementById("message").textContent = clear_msg;
    stoptimer(timer_id);
}

//クリックごとに呼び出される関数
function bomb_remained(){
    document.getElementById("bomb_remained").textContent = mine_num;    
}

function restart(){
    cleartable("pre_field");
    tap_num = 0;
    console.log("minesweeper system rebooting...");
    cleartable("field");
    stoptimer(timer_id);
    init_minesweeper();
    clicked({"target": document.getElementById(tap_y + "," + tap_x), "button" : 0});
    
}