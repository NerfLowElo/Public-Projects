



var aiTurn = function() {



    if (botMode) {
        var getSym = counter % 2 === 0 ? "W" : "B"
       
        var maxChanged = 0;
        var getX = null;
        var getY = null;
        var roughtCount = 0;
	var currBoard = boardArray;
	var depth = 0;
	var player = true;
	var tempCounter = counter;
	
	var play = minmax(currBoard, depth, tempcounter, player);
	    
	getX = play."x-axis";
	getY = play."y-axis";
    }
}




var minmax = function(currBoard, depth, tempCounter, player) {
    
    var objArray = [];
    var tempSymb = tempCounter % 2 === 0 ? "W" : "B" 
    
    for (var y = 0; y < boardLength; y++) {
	for (var x = 0; x < boardLength; x++) {
            if (currBoard[y][x] === null) {
		
                if (minmaxCheckPlace(tempSym, x, y, currBoard)) {
		    
                    accumulator(objArray, tempSym, x, y, currBoard);
		}
	    }
	}
    }
    
    if (depth == 0) {
	var m = objArray[0];
	for(i in objArray) {
	    if (objArray[i].total >= m.total) {
                m.total = objArray[i].total;
		m."x-axis" = objArray[i]."x-axis";
		m."y-axis" = objArray[i]."y-axis";
		
            }
	}
	return m;
    }

    
    else if(player) {
	var min = objArray[0];
	min.total = -999;
	for (i in objArray) {
	    var newBoard = currBoard;
	    playMove(newBoard, objArray[i]."x-axis", objArray[i]."y-axis", tempSymb);
	    var v = minmax(newBoard, depth-1, temCounter++, !player);
	    if (v.total > min.total) {
		min.total = v.total;
		min."x-axis" = objArray[i]."x-axis";
		min."y-axis" = objArray[i]."y-axis";
	    }
 	}
	return min;
	
    }

    else  {
	var max = objArray[0];
	max.total = 999;
	for(i in objArray) {
	    var newBoard = currBoard;
	    playMove(newBoard, objArray[i]."x-axis", objArray[i]."y-axis", tempSymb);
	    var v = minmax(newBoard, depth-1, temCounter++, !player);
	    if (v.total < max.total) {
		max.total = v.total;
		max."x-axis" = objArray[i]."x-axis";
		max."y-axis" = objArray[i]."y-axis";
	    }
	}
	return max;
    }
    
}

var playMove = function(board, getx, gety, sym) {
    minmaxCheckPlace(sym, getx, gety, board);
    var topLeftSettle = false;
    var topSettle = false;
    var topRightSettle = false;
    var rightSettle = false;
    var bottomRightSettle = false;
    var bottomSettle = false;
    var bottomLeftSettle = false;
    var leftSettle = false;
    
    
    for(i in directionToGo[i]) {
	
	switch (i) {
        case 0:
            if (directionToGo[i]) {
                while (!topLeftSettle) {
                    if (board[gety - 1][getx - 1] !== null) {
                        var a = 1;
                        while (board[gety - a][getx - a] !== sym) {
                            board[gety - a][getx - a] = sym;                
                            a++;
                        }
                        topLeftSettle = true;
			
                    }
		    else {
                        topLeftSettle = true;
                    }
                }
            }
            break;
	case 1:
            if (directionToGo[i]) {
		
                while (!topSettle) {
                    if (board[gety - 1][getx] !== null) {
                        var a = 1;
                        while (board[gety - a][getx] !== sym) {
                            board[gety - a][getx] = sym;
                            a++;
                        }
                        topSettle = true;
			
                    } else {
                        topSettle = true;
                    }
                }
            }
            break;

	case 2:
            if (directionToGo[i]) {

		while (!topRightSettle) {
                    if (board[gety - 1][getx + 1] !== null) {
                       var a = 1;
                        while (board[gety - a][getx + a] !== sym) {
                            board[gety - a][getx + a] = sym;			    
                            a++;
                        }
                        topRightSettle = true;
                    } else {
                        topRightSettle = true;
                    }
                }

            }
            break;
        case 3:
            if (directionToGo[i]) {
                while (!rightSettle) {
                    if (board[gety][getx + 1] !== null) {
                        var a = 1;
                        while (board[gety][getx + a] !== sym) {
                            board[gety][getx + a] = sym;
                            a++;
                        }
                        rightSettle = true;
			
                    } else {
                        rightSettle = true;
                    }
                }
            }
            break;
        case 4:
            if (directionToGo[i]) {
                while (!bottomRightSettle) {
                    if (board[gety + 1][getx + 1] !== null) {
                        var a = 1;
                        while (board[gety + a][getx + a] !== sym) {
                            board[gety + a][getx + a] = sym;
                            a++;
                        }
                        bottomRightSettle = true;

                    } else {
                        bottomRightSettle = true;
                    }
                }

            }
            break;
        case 5:
            if (directionToGo[i]) {
                while (!bottomSettle) {
                    if (board[gety + 1][getx] !== null) {
                        var a = 1;
                        while (board[gety + a][getx] !== sym) {
                            board[gety + a][getx] = sym;
                            a++;
                        }
                        bottomSettle = true;

                    } else {
                        bottomSettle = true;
                    }
                }

            }
            break;
        case 6:
            if (directionToGo[i]) {

                while (!bottomLeftSettle) {
                    if (board[gety + 1][getx - 1] !== null) {
                        var a = 1;
                        while (board[gety + a][getx - a] !== sym) {
                            board[gety + a][getx - a] = sym;
                            a++;
                        }
                        bottomLeftSettle = true;

                    } else {
                        bottomLeftSettle = true;
                    }
                }

            }
            break;
        case 7:
            if (directionToGo[i]) {
                while (!leftSettle) {
                    if (board[gety][getx - 1] !== null) {
                        var a = 1;
                        while (board[gety][getx - a] !== sym) {
                            board[gety][getx - a] = sym;
                            a++;
                        }
                        leftSettle = true;

                    } else {
                        leftSettle = true;
                    }
                }

            }
            break;
	}
    }
}















var minmaxCheckPlace = function(sym, x, y, currBoard) {

    var arr = [mmcheckTopLeft(sym, x, y, currBoard), mmcheckTop(sym, x, y, currBoard), mmcheckTopRight(sym, x, y, currBoard), mmcheckRight(sym, x, y, currBoard), mmcheckBottomRight(sym, x, y, currBoard), mmcheckBottom(sym, x, y, currBoard), mmcheckBottomLeft(sym, x, y, currBoard), mmcheckLeft(sym, x, y, currBoard)];

    directionToGo = arr; // este array bool vai me guardar os lados que me sao possiveis

    if (arr.includes(true)) {
        return true
    } else {
        return false
    }
}


//esta funcao verifica se pode haver alguma alteracao se contar a partir canto superior esquerdo
//check top left
var mmcheckTopLeft = function(sym, x, y, currBoard) {
    if (x < 2 || y < 2) { // uma peca so pode mudar outra se no outro canto estiver uma da mesme cor que a sua , entao esta codicao verifica se ela ela disposta a mudar
        return false;
    } else {

        if (currBoard[y - 1][x - 1] !== null) {

            if (currBoard[y - 1][x - 1] !== sym) {
                var minCount = Math.min(x, y) + 1;
                for (i = 2; i < minCount; i++) {
                    if (currBoard[y - i][x - i] === sym) {
                        return true
                    } else if (currBoard[y - i][x - i] === null) {
                        return false
                    } else if (currBoard[y - i][x - i] === undefined) {
                        return false
                    }
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }

}

// esta e a mesma historia so que para cima
//check top
var mmcheckTop = function(sym, x, y, currBoard) {
    if (y < 2) {
        return false
    } else {
        if (currBoard[y - 1][x] !== null) {
            if (currBoard[y - 1][x] !== sym) {
                var minCount = y + 1
                for (i = 2; i < minCount; i++) {
                    if (currBoard[y - i][x] === sym) {
                        return true
                    } else if (currBoard[y - i][x] === null) {
                        return false
                    } else if (currBoard[y - i][x] === undefined) {
                        return false
                    }
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }
}

// igual so que para o canto superior direito
//check top right
var mmcheckTopRight = function(sym, x, y, currBoard) {
    if (y < 2 || x > (boardLength - 3)) {
        return false
    } else {
        if (currBoard[y - 1][x + 1] !== null) {
            if (currBoard[y - 1][x + 1] !== sym) {
                var minCount = Math.min((boardLength - x - 1), y) + 1;
                for (i = 2; i < minCount; i++) {
                    if (currBoard[y - i][x + i] === sym) {
                        return true
                    } else if (currBoard[y - i][x + i] === null) {
                        return false
                    } else if (currBoard[y - i][x + i] === undefined) {
                        return false
                    }
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }
}
//para o lado direito
//check right
var mmcheckRight = function(sym, x, y, currBoard) {
    if (x > (boardLength - 3)) {
        return false
    } else {
        if (currBoard[y][x + 1] !== null) {
            if (currBoard[y][x + 1] !== sym) {
                var minCount = boardLength - x;
                for (i = 2; i < boardLength; i++) {
                    if (currBoard[y][x + i] === sym) {
                        return true
                    } else if (currBoard[y][x + i] === null) {
                        return false
                    } else if (currBoard[y][x + i] === undefined) {
                        return false
                    }
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }
}

//inferior direito
//check bottom right
var mmcheckBottomRight = function(sym, x, y, currBoard) {
    if (x > (boardLength - 3) || y > (boardLength - 3)) {
        return false
    } else {

        if (currBoard[y + 1][x + 1] !== null) {
            if (currBoard[y + 1][x + 1] !== sym) {
                var minCount = Math.min(boardLength - x, boardLength - y);
                for (i = 2; i < minCount; i++) {
                    if (currBoard[y + i][x + i] === sym) {
                        return true
                    } else if (currBoard[y + i][x + i] === null) {
                        return false
                    } else if (currBoard[y + i][x + i] === undefined) {
                        return false
                    }
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }
}

// igual em baixo
//check bottom
var mmcheckBottom = function(sym, x, y, currBoard) {
    if (y > (boardLength - 3)) {
        return false
    } else {

        if (currBoard[y + 1][x] !== null) {
            if (currBoard[y + 1][x] !== sym) {
                var minCount = boardLength - y;
                for (i = 2; i < minCount; i++) {
                    if (currBoard[y + i][x] === sym) {
                        return true
                    } else if (currBoard[y + i][x] === null) {
                        return false
                    } else if (currBoard[y + i][x] === undefined) {
                        return false
                    }
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }
}

//anto inferior esquerdo
//check bottom left
var mmcheckBottomLeft = function(sym, x, y, currBoard) {
    if (y > (boardLength - 3) || x < 2) {
        return false
    } else {
        if (currBoard[y + 1][x - 1] !== null) {
            if (currBoard[y + 1][x - 1] !== sym) {
                var minCount = Math.min(boardLength - y - 1, x) + 1;
                for (i = 2; i < minCount; i++) {
                    if (currBoard[y + i][x - i] === sym) {
                        return true
                    } else if (currBoard[y + i][x - i] === null) {
                        return false
                    } else if (currBoard[y + i][x - i] === undefined) {
                        return false
                    }
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }
}

//E finalmente lado esquerdo
//check left
var mmcheckLeft = function(sym, x, y, currBoard) {
    if (x < 2) {
        return false
    } else {
        if (currBoard[y][x - 1] !== null) {
            if (currBoard[y][x - 1] !== sym) {
                var minCount = x + 1;
                for (i = 2; i < minCount; i++) {
                    if (currBoard[y][x - i] === sym) {
                        return true
                    } else if (currBoard[y][x - i] === null) {
                        return false
                    } else if (currBoard[y][x - i] === undefined) {
                        return false
                    }
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }
}

















    var mainPageContainer = document.querySelector(".main-container");

    var classificationTable = document.createElement("div");
    classificationTable.setAttribute("class","cTable");

    var returnButton = document.createElement("button");
    returnButton.setAttribute("class","voltar-inicio");
    returnButton.setAttribute("id","voltar");
    returnButton.innerHTML = "Voltar";

    mainPageContainer.appendChild(classificationTable);
    mainPageContainer.appendChild(returnButton);

    document.getElementById("voltar").addEventListener("click",function(){
    disableTable();
} 
