"use strict";

function random(top){
    return Math.floor(Math.random() * top)
}

function safe_random(top_y , top_x, safe_y, safe_x, margin){
    while(true){
        let num_x = random(top_x);
        let num_y = random(top_y);
        if(num_x > (safe_x+margin) || num_x < (safe_x-margin) || num_y > (safe_y+margin) || num_y < (safe_y-margin)){
            return [num_y, num_x];
        }
    }
}

function get_around_cells(y, x){
    let cells = [];
    cells[0] = document.getElementById((y-1) + "," + (x-1));
    cells[1] = document.getElementById((y-1) + "," + x);
    cells[2] = document.getElementById((y-1) + "," + (x+1));
    cells[3] = document.getElementById(y + "," + (x-1));
    cells[4] = document.getElementById(y + "," + (x+1));
    cells[5] = document.getElementById((y+1) + "," + (x-1));
    cells[6] = document.getElementById((y+1) + "," + x);
    cells[7] = document.getElementById((y+1) + "," + (x+1));

    return cells;
}

function cleartable(table_name){
    let cells = document.getElementById(table_name).childNodes;
    let len = cells.length;
    for(let i = 0; i < len; i++){
        document.getElementById(table_name).removeChild(cells[0]);    
    }
}
