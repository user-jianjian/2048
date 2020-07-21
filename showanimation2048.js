function showNumberWithAnimation(i, j, number){

    //定位到对应元素（数字格子）
    var numberCell = $('#number-cell-'+i+'-'+j);
    
    //设置元素的样式（颜色、文本）
    numberCell.css('background-color', getNumberBackgroundColor(number));
    numberCell.css('color', getNumberColor(number));
    numberCell.text(number);

    //设置动画
    numberCell.animate({
        width: cellSideLength,
        height: cellSideLength,
        left: getPosLeft(i,j),
        top: getPosTop(i,j)
    },50);
}

function showMoveAnimation(fromx, fromy, tox, toy){
    var numberCell = $('#number-cell-'+fromx+'-'+fromy);
    numberCell.animate({
        top: getPosTop(tox,toy),
        left: getPosLeft(tox,toy),
    },200);
}

function updateScore(score){
    $('#score').text(score);
}