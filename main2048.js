var board = new Array();
var score = 0;
var hasConflicted = new Array();
var 
    startx = 0, 
    starty = 0, 
    endx = 0, 
    endy = 0;

$(document).ready(function(){

    prepareForMobile();
    newgame();
});

document.addEventListener('touchstart',function(event){
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchend',function(event){
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    deltax = endx - startx;
    deltay = endy - starty;

    if (Math.abs(deltax) < 0.2*documentWidth && Math.abs(deltay) < 0.2*documentWidth){
        return;
    }

    if (Math.abs(deltax) > Math.abs(deltay)){  //在x轴上移动
        if (deltax > 0){
            //向右移动
            if (moveRight()){
                setTimeout("generateOneNumber()",250);
                setTimeout("isgameover()",350);    
            }
        }else{
            //向左移动
            if (moveLeft()){
                setTimeout("generateOneNumber()",250);
                setTimeout("isgameover()",350);    
            }
        }
    }else{
        if (deltay > 0){
            //向下移动
            if (moveDown()){
                setTimeout("generateOneNumber()",250);
                setTimeout("isgameover()",350);    
            }

        }else{
            //向上移动
            if (moveUp()){
                setTimeout("generateOneNumber()",250);
                setTimeout("isgameover()",350);    
            }
        }

    }
});

function prepareForMobile(){

    if (documentWidth > 500){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }

    $('#grid-container').css('width', gridContainerWidth-2*cellSpace);
    $('#grid-container').css('height', gridContainerWidth-2*cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', 0.02*gridContainerWidth);

    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css('height', cellSideLength);
    $('.grid-cell').css('border-radius', 0.02*cellSideLength);
}



function newgame(){
    //初始化棋盘（设置每个格子的正确位置）
    init();

    //在随机的两个格子生成随机的数字并显示出来
    generateOneNumber();
    generateOneNumber();
}

function init(){

    //设置每个格子的正确位置
    for(var i=0; i<4; i++){
        for (var j=0; j<4; j++){
            var gridCell = $('#grid-cell-'+i+'-'+j);
            gridCell.css('top', getPosTop(i,j));
            gridCell.css('left', getPosLeft(i,j));
        }
    }

    //初始化board中的值
    for (var i=0; i<4; i++){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j=0; j<4; j++){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();
}

function updateBoardView(){
    $('.number-cell').remove();  //清除所有的数据格子，根据数据变动，重新渲染
    for (var i=0; i<4; i++){
        for (var j=0; j<4; j++){
            $('#grid-container').append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-'+i+'-'+j);
            if (board[i][j] === 0){
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i,j)+cellSideLength/2);
                theNumberCell.css('left', getPosLeft(i,j)+cellSideLength/2);
            }else{
                theNumberCell.css('width', cellSideLength);
                theNumberCell.css('height', cellSideLength);
                theNumberCell.css('top', getPosTop(i,j));
                theNumberCell.css('left', getPosLeft(i,j));

                theNumberCell.css('backgroundColor', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text( board[i][j] );
                hasConflicted[i][j] = false;
            }
        }
    }
    $('.number-cell').css('line-height', cellSideLength+'px');
    $('.number-cell').css('font-size', 0.6*cellSideLength+'px'); 
}

function generateOneNumber(){

    if (nospace(board)){
        return false;
    }

    //生成随机的位置
    var randx = window.parseInt(Math.floor(Math.random()*4));
    var randy = window.parseInt(Math.floor(Math.random()*4));
    while(true){
        if (board[randx][randy] === 0){
            break;
        }
        randx = window.parseInt(Math.floor(Math.random()*4));
        randy = window.parseInt(Math.floor(Math.random()*4));
    }

    //生成随机的数字
    var randNumber = Math.random()<0.5 ? 2 : 4;

    //显示在随机的位置生成的随机的数字
    board[randx][randy] = randNumber;

    showNumberWithAnimation(randx, randy, randNumber);
    return true;
}

$(document).keydown(function(event){
    switch(event.keyCode){

        case 37:  //left
            if (moveLeft()){
                setTimeout("generateOneNumber()",250);
                setTimeout("isgameover()",350);   
            }
            break;

        case 38:  //up
            if (moveUp()){
                setTimeout("generateOneNumber()",250);
                setTimeout("isgameover()",350);   
            }
            break;

        case 39:  //right
            if (moveRight()){
                setTimeout("generateOneNumber()",250);
                setTimeout("isgameover()",350);    
            }
            break;

        case 40:  //down
            if (moveDown()){ 
                setTimeout("generateOneNumber()",250);
                setTimeout("isgameover()",350);    
            }
            break;
    }
});

function moveLeft(){

    if (!canMoveLeft(board)){
        return false;
    }

    for (var i=0; i<4; i++){
        for (var j=1; j<4; j++){
            if (board[i][j] != 0){
                for (var k=0; k<j; k++){
                    if (board[i][k] === 0 && noBlockHorizontal(i, k, j, board)){
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    }else if (board[i][k] === board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]){
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][k] + board[i][j];
                        hasConflicted[i][k] = true;
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        break;      
                    }
                }
            }
            
        }
    }

    setTimeout("updateBoardView()",200);

    return true;
}

function moveUp(){

    if (!canMoveUp(board)){
        return false;
    }

    for (var i=1; i<4; i++){
        for (var j=0; j<4; j++){
            if (board[i][j] != 0){

                for (var k=0; k<i; k++){
                    if (board[k][j] === 0 && noBlockVertical(j, k, i, board)){
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    }else if (board[k][j] === board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]){
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[k][j] + board[i][j];
                        hasConflicted[k][j] = true;
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        break;      
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);

    return true;
}

function moveRight(){

    if (!canMoveRight(board)){
        return false;
    }

    for (var i=0; i<4; i++){
        for (var j=2; j>=0; j--){
            if (board[i][j] != 0){
                for (var k=3; k>j; k--){
                    if (board[i][k] === 0 && noBlockHorizontal(i, j, k, board)){
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    }else if (board[i][k] === board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]){
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][k] + board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        break;      
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);

    return true;
}

function moveDown(){

    if (!canMoveDown(board)){
        return false;
    }

    for (var i=2; i>=0; i--){
        for (var j=0; j<4; j++){
            if (board[i][j] != 0){

                for (var k=3; k>i; k--){
                    if (board[k][j] === 0 && noBlockVertical(j, i, k, board)){
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    }else if (board[k][j] === board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]){
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[k][j] + board[i][j];
                        hasConflicted[k][j] = true;
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        break;      
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);

    return true;
}



function isgameover(){
    if (nospace(board) && nomove(board)){
        gameover();
    }
}

function gameover(){
    alert("game over");
}