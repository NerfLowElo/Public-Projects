console.log("Hello  ")
var boardLength = 8;
var counter = 1;
var boardArray = [];
var directionToGo = [];
var botMode = false;
var botTurn = false;
var singlePlayerMode = false;
var predictorArray = [];
var mode = null;

//variavel que guarda localmente os valores de win e losses do cliente
if (!localStorage.getItem("stats"))
    localStorage.setItem("stats", JSON.stringify({ vict:0, def:0, draw:0}) );

var color = null;
var loginSuccess = false;
var joinSuccess = false;
var groupOfGame = 41;
var gameName ;
var playerColor;
var userName = null;
var passWord = null;
var symbol;
var flag = 0;
var varTemp = null;

var greenScore = document.getElementById("green-score");
var blackScore = document.getElementById("black-score");
var whiteScore = document.getElementById("white-score");


//testa se o browser tem a funcionalidade de storage
if(typeof(Storage) === undefined) console.log("shitty browser");

//funcao que recebe um "click" e me diz se esse click foi valido
var addTile = function(event) {
    if (event instanceof Element){
        event.target = event
    }
    var getX = parseInt(event.target.getAttribute("x-axis"));
    var getY = parseInt(event.target.getAttribute("y-axis"));
    var getSym = counter % 2 === 0 ? "W" : "B"



    if (checkOKtoPlace(getSym, getX, getY)) { // funcao que verifica se a colocacao e possivel caso seja ele retira as marcas nos locais que eram possiveis colacar
        removePredictionDots(); //esta e a tal funcao que me retira as marcas

        var aTile = document.createElement("div");

        if (getSym === "W") {
            aTile.setAttribute("class", "white-tiles");
            boardArray[getY][getX] = getSym;


        } else {
            aTile.setAttribute("class", "black-tiles");
            boardArray[getY][getX] = getSym;

        }
        changeRespectiveTiles(event.target, getSym, getX, getY);//funcao que me faz a jogada modificando o tabuleiro

        counter++; // este inteiro serve para ver de quem e a vez (se for impar sao pretos, se for par sao brancos)
        event.target.appendChild(aTile);
        event.target.removeEventListener("click", addTile);//este comando tira me a propriedade de "click" na posicao onde se colocou a tile


        tilesCounting(); // esta funcao atualiza o numero de pecas (brancas,pretas,livres)


        //estou aqui a dar a vez ao jogador "seguinte"
        getSym = counter % 2 === 0 ? "W" : "B"
        console.log(getSym + "turn");
        var slots = checkSlots(getSym); // com esta funcao eu verifico quantas casas estao vazias e quantas sao possiveis de mover




        if(slots.empty > 0){
            if (slots.movable > 0) {
                console.log(getSym + "still can");


                if (singlePlayerMode) {
                    tempStopAllClicks(); // esta funcao desativa o "click" de todas as casas para o jogador nao colocar uma peca qnd nao e a vez dele
                }

                if (botMode) // caso seja a vez do computador entao chama pela funcao aiTurn
                {
                    setTimeout(aiTurn, 2000); // este comando chama a funcao aiTurn dando lhe um tempo de execucao
                }
            }
            else // caso nao seja possivel mover
            {
                console.log(getSym + "no place to move, pass");

                counter++; // passa a vez
                getSym = counter % 2 === 0 ? "W" : "B"
                console.log(getSym + "turn");
                var slots = checkSlots(getSym); //verifica as casas vazias/possiveis
                if(slots.movable>0)
                {
                    predictionDots(getSym) // esta funcao preenche me as casas possiveis com uma marca
                }
                else
                {
                    console.log(getSym + "also cannot, end game "); // caso dos dois lados nao poderem jogar ent o joga acaba

                    botMode = false; //"desligo" o computador
                    tempStopAllClicks(); // "desligo" os clicks do tabuleiro
                    checkWin(); // verifico o resultado
                }
            }
        }else{
            console.log(getSym + "cannot d"); // este e o caso em que o tabuleiro esta cheio

            botMode = false;
            tempStopAllClicks();
            checkWin();
        }



    } else { // caso seja um movimento invalido
        console.log("Invalid Move")
    }

}


//esta e a tal funcao que verifica a quantidade de casas vazias e casas possiveis
var checkSlots = function(sym){
    let emptySlots = 0;
    let roughtCount = 0;
    for (var y = 0; y < boardLength; y++) {
        for (var x = 0; x < boardLength; x++) {
            if (boardArray[y][x] === null) {
                emptySlots++;
                if (checkOKtoPlace(sym, x, y)) {
                    roughtCount++;
                }
            }

        }
    }

    return {empty:emptySlots,movable:roughtCount}
}

//funcao que conta a quantidade de pecas brancas ,livres,pretas
var tilesCounting = function(){
    var whiteCount = 0;
    var blackCount = 0;
    for (var i = 0; i < boardLength; i++) {
        for (var j = 0; j < boardLength; j++) {

            if (boardArray[i][j] === "W")
                whiteCount += 1;
            else if (boardArray[i][j] === "B")
                blackCount += 1;

        }
    }
    blackScore.innerHTML = blackCount;
    whiteScore.innerHTML = whiteCount;
    greenScore.innerHTML = 64-(blackCount+whiteCount);
}

//esta funcao e a tal que me coloca as marcas nas casa possiveis
var predictionDots = function(sym) {
    predictorArray = [];
    for (var y = 0; y < boardLength; y++) {
        for (var x = 0; x < boardLength; x++) {
            if (boardArray[y][x] === null) {
                if (checkOKtoPlace(sym, x, y)) {
                    var createPredictor = document.createElement("div");
                    createPredictor.setAttribute("class", "predictor");
                    createPredictor.setAttribute("x-axis", x);
                    createPredictor.setAttribute("y-axis", y);
                    createPredictor.setAttribute("onclick", "runATile(this)") // a funcao runATile evita que ocorra erro caso se click no sinal, esta funcao e fundamental
                    var id = y * boardLength + x;
                    document.getElementById(id).appendChild(createPredictor);
                    predictorArray.push(id);
                }
            }

        }
    }
}

var runATile = function(something){
    console.log(something.parentNode);
    if (singlePlayerMode)
	addTile(something.parentNode);
    else playMove(something.parentNode);
}

//esta funcao remove me as marcas das casas
var removePredictionDots = function(sym) {
    for (var i = 0; i < predictorArray.length; i++) {
        var target = document.getElementById(predictorArray[i]);
        target.removeChild(target.firstChild);
    }
}



//funcao que inicializa a minha matrix tabuleiro
var createBoardArray = function() {
    boardArray = [];
    for (i = 0; i < boardLength; i++) {
        var anArray = [];
        for (j = 0; j < boardLength; j++) {
            anArray.push(null);
        }
        boardArray.push(anArray);
    }
}

//funcao que inicializa o tabuleiro colocando as quatro pecas no centro
var initialize = function() {

    var firstTileId = (boardLength / 2 - 1) * boardLength + (boardLength / 2 - 1);
    var secondTileId = (boardLength / 2) * boardLength + boardLength / 2;
    var aCounter = 0;
    for (var i = (firstTileId); i < (firstTileId + 2); i++) {
        var getSquare = document.getElementById(i);
        var getX = parseInt(getSquare.getAttribute("x-axis"));
        var getY = parseInt(getSquare.getAttribute("y-axis"));
        var aTile = document.createElement("div");

        if (aCounter % 2 === 0) {

            aTile.setAttribute("class", "white-tiles");
            boardArray[getY][getX] = "W"


        } else {
            aTile.setAttribute("class", "black-tiles");
            boardArray[getY][getX] = "B"
        }
        getSquare.appendChild(aTile);
        getSquare.removeEventListener("click", addTile);

        aCounter++;
    }
    for (var i = secondTileId; i > secondTileId - 2; i--) {
        var getSquare = document.getElementById(i);
        var getX = getSquare.getAttribute("x-axis");
        var getY = getSquare.getAttribute("y-axis");
        var aTile = document.createElement("div");
        if (aCounter % 2 === 0) {

            aTile.setAttribute("class", "white-tiles");
            boardArray[getY][getX] = "W"

        } else {
            aTile.setAttribute("class", "black-tiles");
            boardArray[getY][getX] = "B"
        }
        getSquare.appendChild(aTile);
        getSquare.removeEventListener("click", addTile);

        aCounter++;
    }

}


//esta funcao diz me se uma certa colocao e possivel chamando as funcoes checkTopLeft,checkTop,checkRight ...
var checkOKtoPlace = function(sym, x, y) {

    var arr = [checkTopLeft(sym, x, y), checkTop(sym, x, y), checkTopRight(sym, x, y), checkRight(sym, x, y), checkBottomRight(sym, x, y), checkBottom(sym, x, y), checkBottomLeft(sym, x, y), checkLeft(sym, x, y)];

    directionToGo = arr; // este array bool vai me guardar os lados que me sao possiveis

    if (arr.includes(true)) {
        return true
    } else {
        return false
    }
}


//esta funcao verifica se pode haver alguma alteracao se contar a partir canto superior esquerdo
//check top left
var checkTopLeft = function(sym, x, y) {
    if (x < 2 || y < 2) { // uma peca so pode mudar outra se no outro canto estiver uma da mesme cor que a sua , entao esta codicao verifica se ela ela disposta a mudar
        return false;
    } else {

        if (boardArray[y - 1][x - 1] !== null) {

            if (boardArray[y - 1][x - 1] !== sym) {
                var minCount = Math.min(x, y) + 1;
                for (i = 2; i < minCount; i++) {
                    if (boardArray[y - i][x - i] === sym) {
                        return true
                    } else if (boardArray[y - i][x - i] === null) {
                        return false
                    } else if (boardArray[y - i][x - i] === undefined) {
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
var checkTop = function(sym, x, y) {
    if (y < 2) {
        return false
    } else {
        if (boardArray[y - 1][x] !== null) {
            if (boardArray[y - 1][x] !== sym) {
                var minCount = y + 1
                for (i = 2; i < minCount; i++) {
                    if (boardArray[y - i][x] === sym) {
                        return true
                    } else if (boardArray[y - i][x] === null) {
                        return false
                    } else if (boardArray[y - i][x] === undefined) {
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
var checkTopRight = function(sym, x, y) {
    if (y < 2 || x > (boardLength - 3)) {
        return false
    } else {
        if (boardArray[y - 1][x + 1] !== null) {
            if (boardArray[y - 1][x + 1] !== sym) {
                var minCount = Math.min((boardLength - x - 1), y) + 1;
                for (i = 2; i < minCount; i++) {
                    if (boardArray[y - i][x + i] === sym) {
                        return true
                    } else if (boardArray[y - i][x + i] === null) {
                        return false
                    } else if (boardArray[y - i][x + i] === undefined) {
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
var checkRight = function(sym, x, y) {
    if (x > (boardLength - 3)) {
        return false
    } else {
        if (boardArray[y][x + 1] !== null) {
            if (boardArray[y][x + 1] !== sym) {
                var minCount = boardLength - x;
                for (i = 2; i < boardLength; i++) {
                    if (boardArray[y][x + i] === sym) {
                        return true
                    } else if (boardArray[y][x + i] === null) {
                        return false
                    } else if (boardArray[y][x + i] === undefined) {
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
var checkBottomRight = function(sym, x, y) {
    if (x > (boardLength - 3) || y > (boardLength - 3)) {
        return false
    } else {

        if (boardArray[y + 1][x + 1] !== null) {
            if (boardArray[y + 1][x + 1] !== sym) {
                var minCount = Math.min(boardLength - x, boardLength - y);
                for (i = 2; i < minCount; i++) {
                    if (boardArray[y + i][x + i] === sym) {
                        return true
                    } else if (boardArray[y + i][x + i] === null) {
                        return false
                    } else if (boardArray[y + i][x + i] === undefined) {
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
var checkBottom = function(sym, x, y) {
    if (y > (boardLength - 3)) {
        return false
    } else {

        if (boardArray[y + 1][x] !== null) {
            if (boardArray[y + 1][x] !== sym) {
                var minCount = boardLength - y;
                for (i = 2; i < minCount; i++) {
                    if (boardArray[y + i][x] === sym) {
                        return true
                    } else if (boardArray[y + i][x] === null) {
                        return false
                    } else if (boardArray[y + i][x] === undefined) {
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
var checkBottomLeft = function(sym, x, y) {
    if (y > (boardLength - 3) || x < 2) {
        return false
    } else {
        if (boardArray[y + 1][x - 1] !== null) {
            if (boardArray[y + 1][x - 1] !== sym) {
                var minCount = Math.min(boardLength - y - 1, x) + 1;
                for (i = 2; i < minCount; i++) {
                    if (boardArray[y + i][x - i] === sym) {
                        return true
                    } else if (boardArray[y + i][x - i] === null) {
                        return false
                    } else if (boardArray[y + i][x - i] === undefined) {
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
var checkLeft = function(sym, x, y) {
    if (x < 2) {
        return false
    } else {
        if (boardArray[y][x - 1] !== null) {
            if (boardArray[y][x - 1] !== sym) {
                var minCount = x + 1;
                for (i = 2; i < minCount; i++) {
                    if (boardArray[y][x - i] === sym) {
                        return true
                    } else if (boardArray[y][x - i] === null) {
                        return false
                    } else if (boardArray[y][x - i] === undefined) {
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

//esta funcao faz me a jogada modificando as pecas do jogo
//gracas ao array directionToGo
var changeRespectiveTiles = function(target, sym, x, y) {
    var topLeftSettle = false;
    var topSettle = false;
    var topRightSettle = false;
    var rightSettle = false;
    var bottomRightSettle = false;
    var bottomSettle = false;
    var bottomLeftSettle = false;
    var leftSettle = false;

    for (i = 0; i < boardLength; i++) {

        switch (i) {
            case 0:
                if (directionToGo[i]) {
                    while (!topLeftSettle) {
                        if (boardArray[y - 1][x - 1] !== null) {
                            var a = 1;
                            while (boardArray[y - a][x - a] !== sym) {
                                boardArray[y - a][x - a] = sym;
                                if (sym === "W")
                                    document.getElementById(boardLength * (y - a) + (x - a)).firstChild.setAttribute("class", "white-tiles");
                                else
                                    document.getElementById(boardLength * (y - a) + (x - a)).firstChild.setAttribute("class", "black-tiles");
                                a++;
                            }
                            topLeftSettle = true;

                        } else {
                            topLeftSettle = true;
                        }
                    }
                }
                break;
            case 1:
                if (directionToGo[i]) {

                    while (!topSettle) {
                        if (boardArray[y - 1][x] !== null) {
                            var a = 1;
                            while (boardArray[y - a][x] !== sym) {
                                boardArray[y - a][x] = sym;
                                if (sym === "W")
                                    document.getElementById(boardLength * (y - a) + x).firstChild.setAttribute("class", "white-tiles");
                                else
                                    document.getElementById(boardLength * (y - a) + x).firstChild.setAttribute("class", "black-tiles");
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

                        if (boardArray[y - 1][x + 1] !== null) {

                            var a = 1;
                            while (boardArray[y - a][x + a] !== sym) {

                                boardArray[y - a][x + a] = sym;

                                if (sym === "W")
                                    document.getElementById(boardLength * (y - a) + (x + a)).firstChild.setAttribute("class", "white-tiles");
                                else
                                    document.getElementById(boardLength * (y - a) + (x + a)).firstChild.setAttribute("class", "black-tiles");
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
                        if (boardArray[y][x + 1] !== null) {
                            var a = 1;
                            while (boardArray[y][x + a] !== sym) {
                                boardArray[y][x + a] = sym;
                                if (sym === "W")
                                    document.getElementById(boardLength * y + (x + a)).firstChild.setAttribute("class", "white-tiles");
                                else
                                    document.getElementById(boardLength * y + (x + a)).firstChild.setAttribute("class", "black-tiles");
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
                        if (boardArray[y + 1][x + 1] !== null) {
                            var a = 1;
                            while (boardArray[y + a][x + a] !== sym) {
                                boardArray[y + a][x + a] = sym;
                                if (sym === "W")
                                    document.getElementById(boardLength * (y + a) + (x + a)).firstChild.setAttribute("class", "white-tiles");
                                else
                                    document.getElementById(boardLength * (y + a) + (x + a)).firstChild.setAttribute("class", "black-tiles");
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
                        if (boardArray[y + 1][x] !== null) {
                            var a = 1;
                            while (boardArray[y + a][x] !== sym) {
                                boardArray[y + a][x] = sym;
                                if (sym === "W")
                                    document.getElementById(boardLength * (y + a) + x).firstChild.setAttribute("class", "white-tiles");
                                else
                                    document.getElementById(boardLength * (y + a) + x).firstChild.setAttribute("class", "black-tiles");
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
                        if (boardArray[y + 1][x - 1] !== null) {
                            var a = 1;
                            while (boardArray[y + a][x - a] !== sym) {
                                boardArray[y + a][x - a] = sym;
                                if (sym === "W")
                                    document.getElementById(boardLength * (y + a) + (x - a)).firstChild.setAttribute("class", "white-tiles");
                                else
                                    document.getElementById(boardLength * (y + a) + (x - a)).firstChild.setAttribute("class", "black-tiles");
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
                        if (boardArray[y][x - 1] !== null) {
                            var a = 1;
                            while (boardArray[y][x - a] !== sym) {
                                boardArray[y][x - a] = sym;
                                if (sym === "W")
                                    document.getElementById(boardLength * y + (x - a)).firstChild.setAttribute("class", "white-tiles");
                                else
                                    document.getElementById(boardLength * y + (x - a)).firstChild.setAttribute("class", "black-tiles");
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
//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//  PRONTO AQUI COMECA O AI Mode PADEIRO QUE FIZ PARA VERIFICAR AS FUNCOES  //////////////////////
//  ELE FUNCIONA SE QUISERES PODES FAZER UMA PARTIDA COM ELE xD          /////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

var aiTurn = function() {



    if (botMode) {
        var getSym = counter % 2 === 0 ? "W" : "B"
        var objArray = [];
        var maxChanged = 0;
        var getX = null;
        var getY = null;
        var roughtCount = 0;
        var minChanged = 64;

        //neste ciclo estou a guardar todas as posicoes possiveis no array objArray
        for (var y = 0; y < boardLength; y++) {
            for (var x = 0; x < boardLength; x++) {
                if (boardArray[y][x] === null) {

                    if (checkOKtoPlace(getSym, x, y)) {

                        accumulator(objArray, getSym, x, y); // esta funcao vai colocar todas as posicoes possiveis e calcular em cada uma o numero de pecas do adversario que pode modificar

                    }
                }

            }
        }
        if(level==="hard")
        {//ve me em qual casa possivel posso modificar mais pecas do adversario
          for (i = 0; i < objArray.length; i++) {
              if (objArray[i].total >= maxChanged) {
                  maxChanged = objArray[i].total
                }
            }


        //vamos agr buscar as coordenadas das melhores casas
          var randomArray = [];
          for (j = 0; j < objArray.length; j++) {
            if (objArray[j].total === maxChanged) {
                randomArray.push(objArray[j]);
            }
          }
          //escolher uma dessas melhores casas
          var theOne = randomArray[Math.floor(Math.random() * randomArray.length)];
          getX = theOne["x-axis"];
          getY = theOne["y-axis"];;
      }
        /////////////////////////////////
        if(level==="easy"){


        for (i = 0; i < objArray.length; i++) {
            if (objArray[i].total <= minChanged) {
                minChanged = objArray[i].total
            }
        }

        //vamos agr buscar as coordenadas das piores casas
        var randomArray = [];
        for (j = 0; j < objArray.length; j++) {
            if (objArray[j].total === minChanged) {
                randomArray.push(objArray[j]);

            }
          }
          //escolher uma dessas melhores casas
          var theOne = randomArray[Math.floor(Math.random() * randomArray.length)];
          getX = theOne["x-axis"];
          getY = theOne["y-axis"];;
        }

        if(level==="medium")
        {
          //escolher uma dessas melhores casas
          var theOne = objArray[Math.floor(Math.random() * objArray.length)];
          getX = theOne["x-axis"];
          getY = theOne["y-axis"];;
        }




        //////////// E FINALMENTE VAMOS FAZER A JOGADA///////////////////////////////////////////////////
        checkOKtoPlace(getSym, getX, getY);
        var getTarget = document.getElementById(getY * boardLength + getX);
        var aTile = document.createElement("div");
        getTarget.classList.add("test");
        if (getSym === "W") {
            aTile.setAttribute("class", "white-tiles");
            boardArray[getY][getX] = getSym;


        } else {
            aTile.setAttribute("class", "black-tiles");
            boardArray[getY][getX] = getSym;

        }
        changeRespectiveTiles(getTarget, getSym, getX, getY);

        counter++;
        getTarget.appendChild(aTile);
        getTarget.removeEventListener("click", addTile);

        ////////////////////////////////////////////////////////////////////////////



        //Atualizar a contagem das pecas
        tilesCounting();

        //dar a jogada ao adversario
        //and Check anymore playable empty square
        getSym = counter % 2 === 0 ? "W" : "B"
        console.log(getSym + "turn");
        var slots = checkSlots(getSym);

        if (slots.empty > 0) {
            if (slots.movable > 0) {
                console.log(getSym + "still can");

                if (singlePlayerMode) {
                    startBackAllClicks();
                    predictionDots(getSym);
                }
            }else{
                console.log(getSym + "no place to move, pass"); //aqui  caso nao de para jogar, da a vez e verifica se o outro pode jogar
                document.getElementById("pass").disabled = false;

            }


        } else {
            console.log(getSym + "cannot d");// caso de tabuleiro cheio
            botMode = false;
            checkWin();
        }


    }

}


var passbutton = function() {

    document.getElementById("pass").disabled = true;
    if (!singlePlayerMode)
	notify("skip","skip");
    else {	
    counter++; // passa a vez
    var getSym = counter % 2 === 0 ? "W" : "B"
    console.log(getSym + "turn");
    var slots = checkSlots(getSym); //verifica as casas vazias/possiveis
    if(slots.movable>0)
    {
        setTimeout(aiTurn,2000); // esta funcao preenche me as casas possiveis com uma marca
    }
    else
    {
        console.log(getSym + "also cannot, end game "); // caso dos dois lados nao poderem jogar ent o joga acaba
        botMode = false; //"desligo" o computador
        tempStopAllClicks(); // "desligo" os clicks do tabuleiro
        checkWin(); // verifico o resultado
    }
    }
}

//esta funcao e a tal que me coloca as posicoes possiveis e calcula a quntidade de modificados consequente dessa jogada
var accumulator = function(arr, sym, x, y) {
    var topLeftSettle = false;
    var topSettle = false;
    var topRightSettle = false;
    var rightSettle = false;
    var bottomRightSettle = false;
    var bottomSettle = false;
    var bottomLeftSettle = false;
    var leftSettle = false;
    var totalChanged = 0;

    for (i = 0; i < boardLength; i++) {
        switch (i) {
            case 0:
                if (directionToGo[i]) {
                    while (!topLeftSettle) {
                        if (boardArray[y - 1][x - 1] !== null) {
                            var i = 1;
                            while (boardArray[y - i][x - i] !== sym) {
                                totalChanged++;
                                i++;
                            }
                            topLeftSettle = true;

                        } else {
                            topLeftSettle = true;
                        }
                    }
                }
                break;
            case 1:
                if (directionToGo[i]) {
                    while (!topSettle) {
                        if (boardArray[y - 1][x] !== null) {
                            var i = 1;
                            while (boardArray[y - i][x] !== sym) {
                                totalChanged++;
                                i++;
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
                        if (boardArray[y - 1][x + 1] !== null) {
                            var i = 1;
                            while (boardArray[y - i][x + i] !== sym) {
                                totalChanged++;
                                i++;
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
                        if (boardArray[y][x + 1] !== null) {
                            var i = 1;
                            while (boardArray[y][x + i] !== sym) {
                                totalChanged++;
                                i++;
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
                        if (boardArray[y + 1][x + 1] !== null) {
                            var i = 1;
                            while (boardArray[y + i][x + i] !== sym) {

                                totalChanged++;
                                i++;
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
                        if (boardArray[y + 1][x] !== null) {
                            var i = 1;
                            while (boardArray[y + i][x] !== sym) {

                                totalChanged++;
                                i++;
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
                        if (boardArray[y + 1][x - 1] !== null) {
                            var i = 1;
                            while (boardArray[y + i][x - i] !== sym) {
                                totalChanged++;
                                i++;
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
                        if (boardArray[y][x - 1] !== null) {
                            var i = 1;
                            while (boardArray[y][x - i] !== sym) {
                                totalChanged++;
                                i++;
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

    arr.push({
        "x-axis": x,
        "y-axis": y,
        total: totalChanged
    });


}


 // esta funcao faz me a inicializacao em todas as vertentes do tabuleiro
var allBoardInitialisation = function(noclick = false) {
    createBoard(); //cria me todas as divisoes/casas ou seja basicamente o tabuleiro todo
    takePutSettingsButton(); // esta funcao coloca me as definicoes (contem o botao restart e Menu) visivel
    var k = 0;
    var getSquares = document.querySelectorAll(".col");
    //aqui vou dar o poder de "click" em todas as casas
    for (i = 0; i < boardLength; i++) {
        for (j = 0; j < boardLength; j++) {
            getSquares[k].setAttribute("x-axis", j);
            getSquares[k].setAttribute("y-axis", i);
            getSquares[k].setAttribute("id", k);

	    if (singlePlayerMode)
		getSquares[k].addEventListener("click", addTile); //este comando permite o "click" nas casas
	    else
		getSquares[k].addEventListener("click", playMove); //este comando permite o "click" nas casas


            k++;
        }
    }
    createBoardArray(); //inicializacao do meu boardArray(cria a matriz)
    initialize();//inicializar o tabuleiro colocando as pecas no meio
    document.querySelector(".score-container").style.visibility = "visible"; // colocar as cotacoes visiveis
    document.querySelector(".botoes").style.visibility = "visible"; //colocar os botoes

}


//criacao do tabuleiro
var createBoard = function() {
    var container = document.querySelector(".main-container");
    var boardContainer = document.createElement("div");
    boardContainer.setAttribute("class", "main-board");
    var boardFrame = document.createElement("div");
    boardFrame.setAttribute("class", "board-frame");


    for (var i = 0; i < boardLength; i++) {
        var row = document.createElement("div");
        row.setAttribute("class", "row");
        //squareColorCounter++;
        for (var j = 0; j < boardLength; j++) {
            var square = document.createElement("div")
            square.setAttribute("class", "col square")

            row.appendChild(square);
        }
        boardContainer.appendChild(row);
    }
    boardFrame.appendChild(boardContainer);

    container.appendChild(boardFrame);



}


//funcao que pergunta a cor
var askPlayerColor = function(mode) {
    var mainPageContainer = document.querySelector(".main-page-container")

    var player1 = document.createElement("div");
    player1.innerHTML = "Player 1";
    player1.setAttribute("class", "name main-player");

    var buttonWhite = document.createElement("button");
    buttonWhite.setAttribute("class","tile-white");
    buttonWhite.setAttribute("id","white-tile");
    buttonWhite.innerHTML="Whites";

    var buttonBlack = document.createElement("button");
    buttonBlack.setAttribute("class","tile-black");
    buttonBlack.setAttribute("id","black-tile");
    buttonBlack.innerHTML="Blacks";

    var questionBox = document.createElement("div");
    questionBox.setAttribute("class","caixa-de-questao");
    questionBox.appendChild(buttonWhite);
    questionBox.appendChild(buttonBlack);

    mainPageContainer.appendChild(player1);
    mainPageContainer.appendChild(questionBox);

    document.getElementById("white-tile").addEventListener("click", function() {
        clearMainPageContainer();
        color="white"
        askPlayerLevel();
    })
    document.getElementById("black-tile").addEventListener("click", function() {
        clearMainPageContainer();
        color="black"
        askPlayerLevel();
    })

}

//funcao que pergunta a nivel
var askPlayerLevel = function() {
    var mainPageContainer = document.querySelector(".main-page-container")
    var buttonEasy = document.createElement("button");
    buttonEasy.setAttribute("class","selections");
    buttonEasy.setAttribute("id","level-easy");
    buttonEasy.innerHTML="Easy";
    buttonEasy.addEventListener("click", preStartGame(color));

    var buttonMedium = document.createElement("button");
    buttonMedium.setAttribute("class","selections");
    buttonMedium.setAttribute("id","level-medium");
    buttonMedium.innerHTML="Medium";
    buttonMedium.addEventListener("click", preStartGame(color));

    var buttonHard = document.createElement("button");
    buttonHard.setAttribute("class","selections");
    buttonHard.setAttribute("id","level-hard");
    buttonHard.innerHTML="Hard";
    buttonHard.addEventListener("click", preStartGame(color));

    mainPageContainer.appendChild(buttonEasy);
    mainPageContainer.appendChild(buttonMedium);
    mainPageContainer.appendChild(buttonHard);

    document.getElementById("level-easy").addEventListener("click", function() {
        preStartGame(color)
        level = "easy";
    })

    document.getElementById("level-medium").addEventListener("click", function() {
      preStartGame(color)
      level = "medium";
    })

    document.getElementById("level-hard").addEventListener("click", function() {
      preStartGame(color)
      level = "hard";
    })

}

//funcao que me limpa o conteudo do painel segundario
var clearMainPageContainer = function() {
    var mainPageContainer = document.querySelector(".main-page-container")
    while (mainPageContainer.firstChild) {
        mainPageContainer.removeChild(mainPageContainer.firstChild);

    }
}

//funcao que me limpa o conteudo do painel primario
var removeMainPageContainer = function() {
    var mainContainer = document.querySelector(".main-container")
    while (mainContainer.firstChild) {
        mainContainer.removeChild(mainContainer.firstChild);
    }
}

//esta funcao e uma pre-game que coloca a condicao da escolha da cor que foi escolhida
var preStartGame = function(cor) {

    return function() {
        takeOffShroud();
        if(mode === "single"){
          if (cor === "black") {
              singlePlayerMode = true;

              botMode = true;
              removeMainPageContainer();
              allBoardInitialisation();
              var getSym = counter % 2 === 0 ? "W" : "B"
              predictionDots(getSym);
        }
          else{
            singlePlayerMode = true;
            botMode = true;
            removeMainPageContainer();
            allBoardInitialisation();
            tempStopAllClicks();
            var getSym = counter % 2 === 0 ? "W" : "B"
            setTimeout(aiTurn, 2000);
        }
      }
  }
}
//funcao que desativa os "clicks" do tabuleiro
var tempStopAllClicks = function() {
    for (var y = 0; y < boardLength; y++) {
        for (var x = 0; x < boardLength; x++) {
            if (boardArray[y][x] === null) {
		if(singlePlayerMode)
                    document.getElementById(y * boardLength + x).removeEventListener("click", addTile);
		else
		    document.getElementById(y * boardLength + x).removeEventListener("click", playMove);
            }

        }
    }
}
//funcao que ativa os "clicks"
var startBackAllClicks = function() {
    for (var y = 0; y < boardLength; y++) {
        for (var x = 0; x < boardLength; x++) {
            if (boardArray[y][x] === null) {
		if (singlePlayerMode)
                    document.getElementById(y * boardLength + x).addEventListener("click", addTile);
		else
		    document.getElementById(y * boardLength + x).addEventListener("click", playMove);
	    }

        }
    }

}

//funcao que verifica quem ganhou
var checkWin = function() {
    var getWinDisplay = document.querySelector(".win-lose-draw");

    var getResultContainer = document.querySelector(".resultContainer");

               
    var stat = JSON.parse(localStorage.getItem("stats"));

    if (parseInt(blackScore.innerHTML) > parseInt(whiteScore.innerHTML)) {
        if(color === "black")
        {
            getWinDisplay.innerHTML = "Congratulations! You Win!";
            startAnimations();
	    stat.vict++;	 
            
	    localStorage.setItem("stats", JSON.stringify(stat));
        }
        else
        {
            getWinDisplay.innerHTML = "Try better next time !";
            startAnimations();
	    stat.def++;
            
	    localStorage.setItem("stats", JSON.stringify(stat));
        }

    } else if (parseInt(blackScore.innerHTML) === parseInt(whiteScore.innerHTML)) {
	
        getWinDisplay.innerHTML = "It's a Draw!";
        startAnimations();
	stat.draw++;
        
	localStorage.setItem("stats", JSON.stringify(stat));
	
    } else if (parseInt(blackScore.innerHTML) < parseInt(whiteScore.innerHTML)) {
	
	if(color === "white")
	{
            getWinDisplay.innerHTML = "Congratulations! You Win!";
            startAnimations();
	    stat.vict++;
            
	    localStorage.setItem("stats", JSON.stringify(stat));
	}
	else
	{
            getWinDisplay.innerHTML = "Try better next time !";
            startAnimations();
	    stat.def++;	   
            
	    localStorage.setItem("stats", JSON.stringify(stat));
	}
	
    }
}

//animacoes de final de jogo
var startAnimations = function() {
    var getDarkShroud = document.querySelector(".dark-shroud");
    var getWinDisplay = document.querySelector(".win-lose-draw");

    getDarkShroud.style.visibility = "visible";
    getDarkShroud.style.animation = "2s fadein forwards";
    getWinDisplay.style.animation = "2s fadein forwards";

    setTimeout(function() {
        var getResultContainer = document.querySelector(".result-container");
        getResultContainer.style.animation = "2s fadein forwards";
    }, 2000);
}


//esta funcao tira me as definicoes+animacoes
var takeOffShroud = function() {
    document.querySelector(".dark-shroud").style.visibility = "hidden";
    document.querySelector(".dark-shroud").style.opacity = "0";
    document.querySelector(".dark-shroud").style.animation = null;
    document.querySelector(".win-lose-draw").style.animation = null;
    document.querySelector(".win-lose-draw").style.opacity = "0";
    document.querySelector(".result-container").style.animation = null;
    document.querySelector(".result-container").style.opacity = "0";

}

var takeOffShroudInst = function()
{
  document.querySelector(".dark-shroud-inst").style.visibility = "hidden";
  document.querySelector(".dark-shroud-inst").style.opacity = "0";
  document.querySelector(".instruct-container").style.opacity = "0";
}

var takeOffShroudClassif = function()
{
  document.querySelector(".dark-shroud-classif").style.visibility = "hidden";
  document.querySelector(".dark-shroud-classif").style.opacity = "0";
  document.querySelector(".classification-container").style.opacity = "0";
}


var quitGame =  function(){

}

//quando clicamos em desistir do jogo ou "voltar" nas instrucoes temos que reconstruir a pagina principal
var initAllBackToMainPage = function() {
    if (mode === "2"){
	  leave();
    flag = 1;
  }
    mode = null;
    var mainContainer = document.querySelector(".main-container");
    while (mainContainer.firstChild) {
        mainContainer.removeChild(mainContainer.firstChild);
    }
    takeOutSettingsButton();
    takeOffShroud();
    botMode = false;

    singlePlayerMode = false;
    counter = 1;
    document.querySelector(".score-container").style.visibility = "hidden";
    document.querySelector(".botoes").style.visibility = "hidden";
    blackScore.innerHTML = "2";
    whiteScore.innerHTML = "2";
    greenScore.innerHTML = "60";

    var mainPageContainer = document.createElement("div");
    mainPageContainer.setAttribute("class", "main-page-container");
    var button1 = document.createElement("button");
    button1.setAttribute("class", "selections");
    button1.setAttribute("id", "single-player");
    button1.innerHTML = "Single Player";

    var button2 = document.createElement("button");
    button2.setAttribute("class", "selections");
    button2.setAttribute("id", "2-players");
    button2.innerHTML = "2 Players";

    var button3 = document.createElement("button");
    button3.setAttribute("class", "selections");
    button3.setAttribute("id", "instructions");
    button3.innerHTML = "Instructions";

    mainPageContainer.appendChild(button1);
    mainPageContainer.appendChild(button2);
    mainPageContainer.appendChild(button3);

    mainContainer.appendChild(mainPageContainer);


    document.getElementById("single-player").addEventListener("click", function() {
        clearMainPageContainer();
        mode = "single"
        askPlayerColor(mode);

    })

    document.getElementById("2-players").addEventListener("click", function() {
        clearMainPageContainer();
        mode = "2"
        logIn();

    })

    document.getElementById("instructions").addEventListener("click", function() {
      removeMainPageContainer();
      displayRules();
    })


}

//mostra as regras
var displayRules = function()
{
  var mainPageContainer = document.querySelector(".main-container")

  var rulestitle = document.createElement("div");
  rulestitle.innerHTML = "Game Rules";
  rulestitle.setAttribute("class","regras");

  var rulesBox = document.createElement("div");
  rulesBox.setAttribute("class","instrucoes1");

  //rulesBox.appendChild(rulestitle);
  rulesBox.innerHTML="Reversi is played with special pieces, white on one side and black on the other. In turn, the player places a piece on the board with its color facing up. The player cannot play a piece anywhere - he has to capture one or more pieces of the opponent in each move. The captured pieces are turned (their color changes) and become pieces of the player who made the move. If the player is unable to capture any pieces of the opponent in the current position he must pass turn to your opponent. The only exception is the first two moves, when no piece can be captured and when both players have to play the pieces in one of the four circles in the center of the board. The game ends when neither player can play winning who has more pieces in the field."

  var returnButton = document.createElement("button");
  returnButton.setAttribute("class","voltar-inicio");
  returnButton.setAttribute("id","voltar");
  returnButton.innerHTML = "Back";



  mainPageContainer.appendChild(rulestitle)
  mainPageContainer.appendChild(rulesBox);
  mainPageContainer.appendChild(returnButton);

  document.getElementById("voltar").addEventListener("click",function(){
    initAllBackToMainPage();
  })
}
/////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

/*                          funcoes de segunda parte                     */

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

var c = document.getElementById("mycanvas");
var ctx = c.getContext("2d");
var c1 = document.getElementById("mycanvas1");
var ctx1 = c1.getContext("2d");
var count_down_start = 100;
var t = null;
var t1 = null;

var start = function(){
  var count_down = count_down_start;
  ctx.clearRect(0,0,100,100);
  t = setInterval(function(){
    count_down -=1;
    if(count_down<0)
      clearInterval(t);
    drawCircle(count_down);
  },1000)
}
var drawCircle = function(cd){
  var circleColor = "#ff0000";
  var sec = count_down_start-cd-1;
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.strokeStyle = circleColor;
  if(sec <= 0){
    ctx.arc(50,50,46,0,0);
  }
  else{
    ctx.arc(50,50,46,-Math.PI / 2 + (sec - 1) * Math.PI / (count_down_start / 2),
	  -Math.PI / 2 + sec * Math.PI / (count_down_start / 2));
    ctx.stroke();
  }
}

var start1 = function(){
  var count_down = count_down_start;
  ctx1.clearRect(0,0,100,100);
  t1 = setInterval(function(){
    count_down -=1;
    if(count_down<0)
      clearInterval(t1);
    drawCircle1(count_down);
  },1000)
}
var drawCircle1 = function(cd){
  var circleColor = "#ff0000";
  var sec = count_down_start-cd-1;
  ctx1.beginPath();
  ctx1.lineWidth = 5;
  ctx1.strokeStyle = circleColor;
  if(sec <= 0){
    ctx1.arc(50,50,46,0,0);
  }
  else{
    ctx1.arc(50,50,46,-Math.PI / 2 + (sec - 1) * Math.PI / (count_down_start / 2),
	  -Math.PI / 2 + sec * Math.PI / (count_down_start / 2));
    ctx1.stroke();
  }
}



//funçao inicializada ao cliclar no botao 2players
var logIn = function()
{
  mode = "2";
  takeOutSettingsButton();
  takeOffShroud();

  var mainContainer = document.querySelector(".main-container");
  while (mainContainer.firstChild) {
      mainContainer.removeChild(mainContainer.firstChild);
  }


  document.querySelector(".score-container").style.visibility = "hidden";
  document.querySelector(".botoes").style.visibility = "hidden";


  var autenticBox= document.createElement("div");
  autenticBox.setAttribute("class", "big-box");

  var box = document.createElement("div")
  box.setAttribute("class","box");

  var autentic = document.createElement("div");
  autentic.setAttribute("class","autenticacao");
  autentic.innerHTML = "Autentication";

  var userN = document.createElement("div")
  userN.innerHTML = "Username: "
  userN.setAttribute("class","username")
  var usernameInput = document.createElement("input");
  usernameInput.setAttribute("type","text");
  usernameInput.setAttribute("id","nick");
  userN.appendChild(usernameInput);

  var password = document.createElement("div")
  password.innerHTML = "Password: "
  password.setAttribute("class","password");
  var passwordInput = document.createElement("input");
  passwordInput.setAttribute("type","password");
  passwordInput.setAttribute("id","psw");
  password.appendChild(passwordInput);

  var loginButton = document.createElement("button")
  loginButton.setAttribute("class","login");
  loginButton.setAttribute("id","Login");
  loginButton.innerHTML = "Login";

  box.appendChild(autentic);
  box.appendChild(userN);
  box.appendChild(password);
  box.appendChild(loginButton);
  autenticBox.appendChild(box);

  mainContainer.appendChild(autenticBox)

  document.getElementById("Login").addEventListener("click",async function(){
    let nick = document.getElementById("nick");
    let pass = document.getElementById("psw");
    userName = nick.value;               //estas variaveis guardam os valores da conta do cliente
    passWord = pass.value;
    register(userName,passWord);         //faz um request de registo ao servidor
    if(loginSuccess == true){            //se for um registo valido
	var mainContainer = document.querySelector(".main-container");
	while (mainContainer.firstChild) {
	    mainContainer.removeChild(mainContainer.firstChild);
	}
	var waitGif = document.createElement("img");
	waitGif.setAttribute("src","loading-43.gif");
	waitGif.setAttribute("class","waiting")
	mainContainer.appendChild(waitGif);
	await join(groupOfGame,userName,passWord);   //faz um request de join ao servidor, tem de ser await pq precisamos de esperar pela cor(mao) do jogador
	await update(userName, gameName);            //inicia um eventSource responsavel por actualizar as jogadas de ambos os jogadores

	console.log("a minha cor " + playerColor)
	symbol = playerColor === "light" ? "W" : "B";
	console.log(symbol);

	preGame();                            //funçao que inicia o tabuleiro
    }
  });
}




var register = function(nickname,password){
  console.log(userName);
  console.log(passWord);
     fetch('http://twserver.alunos.dcc.fc.up.pt:8008/register',{
       method:'POST',
       headers: {
         'Content-type':'application/x-www-form-urlencoded; charset=UTF-8'
       },
       body: JSON.stringify({nick: nickname, pass: password})
     })
     .then(function(response){
       if (!response.ok){
         alert("Incorrect Password! Try again ~");
         password.value = '';
         return false;
       }
       else { return true; }
     })
     .then(valid => loginSuccess = valid)
     .catch(console.log);
}


var join = async function(grp,nickname,password){
  console.log(nickname);
  console.log(password);
  console.log(grp);
  await fetch('http://twserver.alunos.dcc.fc.up.pt:8008/join',{
    method:'POST',
    body: JSON.stringify({group: grp, nick: nickname, pass: password})
  })
	.then(response => {
	    return Promise.resolve(response.json())
	})
	.then(info => {
	    gameName = info.game;
	    playerColor = info.color;
	    console.log(playerColor);
	    console.log(gameName);

	})
	.catch(console.log);

}


//eventSource responsavel pelas jogadas
var update = function(nickname, gameName) {
    const url = 'http://twserver.alunos.dcc.fc.up.pt:8008/update?nick='+nickname+'&game='+gameName
    const encoded = encodeURI(url);         //mete o url em urlenconded
    const eventSource = new EventSource(encoded);

    eventSource.onmessage = function(event) {      //cada vez que update recebe uma msg faz esta funçao
	if(flag == 1)                                  //
	    eventSource.close();
	else {
	    const data = JSON.parse(event.data);       //transforma a msg em js
	    console.log(data);
	    if(data.winner !== undefined) {            //testa se ja foi declarado um vencedor
		console.log("Congrats! " + data.winner);
		displayWin(data.winner);               //faz display do vencedor e fecha o eventSource
		eventSource.close();
	    }
	    console.log(data.turn);                   //caso nao haja vencedor chama afunçao de jogada
	    tryPlay(data);
	    return data;
	}
    }
}




var tryPlay = function(data) {
    if (data.turn == userName) {        //testa se é a nossa vez de jogar
	if(playerColor === "dark"){      //inicia os timers do canvas á volta dos counters das peças
            start();
            clearInterval(t1);
        }
	else {
            start1();
            clearInterval(t);
	}
	updateBoard(data.board);         //funçao q da modifica o tabuleiro
	updateCount(data.count);         //funçao q acutaliza os contadores das  peças
	if(data.skip === true)           //se tiver q passar a jogada(nao há moves) liga o botao pass
	    document.getElementById("pass").disabled = false;		 
	else {
	    startBackAllClicks();        //inicia tds os clicks
	    predictionDots(symbol);      
	    varTemp = setTimeout(leave,100000);     //da set num timer de 100 segundos
	}
    }
}

//compara as posiçoes do board q temos com o q recebemos e se for diferente muda. Nao testamos o espaços vazios pq tds os espaços vazios no board q recebemos correspondem a espaços vazios no nosso tabuleiro
var updateBoard = function(dboard) {
    for (i=0; i<boardLength; i++)
	for(j=0; j<boardLength; j++) {
	    if(dboard[i][j] === "dark" && boardArray[i][j] !== "B") {
		boardArray[i][j] = "B";
		var mp = document.getElementById(boardLength*i + j);
		while (mp.firstChild)
		    mp.removeChild(mp.firstChild);
		var tt = document.createElement("div");
		tt.setAttribute("class","black-tiles");
		mp.appendChild(tt);
	    }
	    else if(dboard[i][j] === "light" && boardArray[i][j] !== "W") {
		boardArray[i][j] = "W";
		var mp = document.getElementById(boardLength*i + j);
		while (mp.firstChild)
		    mp.removeChild(mp.firstChild);
		var tt = document.createElement("div");
		tt.setAttribute("class","white-tiles");
		mp.appendChild(tt);
	    }
	}
}


//funçao simples que acutaliza o numero de peças
var updateCount = function(dcount) {
    blackScore.innerHTML = dcount.dark;
    whiteScore.innerHTML = dcount.light;
    greenScore.innerHTML = dcount.empty;
}


//request de jogada ao servidor. a funçao é chamada na funçao playMove ou quando carrega o cliente carrega no botao skip(com os valores de x e y = skip)
var notify = function(x,y)
{
    let moviment;
    if (x === "skip")  moviment = null;
    else {
	moviment = {
	    row: x,
	    column: y
	}
    }
    //console.log("notify ur bitch")
    fetch('http://twserver.alunos.dcc.fc.up.pt:8008/notify',{
	method:'POST',
	body: JSON.stringify({nick: userName, pass: passWord, game: gameName, move: moviment})
    })
	.then(response => {
	    return Promise.resolve(response.json())
	})
	.then(info => {
	    if(info !== null){
		console.log(info.error);
	    }
	})
}

//inicia o tabuleiro com as 4 peças no meio
var preGame = function(){
    removeMainPageContainer();
    allBoardInitialisation();
    tempStopAllClicks();
}


//funçao chamada quando se clica numa caixa de jogada valida
var playMove = function(event) {

    if (event instanceof Element){
        event.target = event
    }
    var getX = parseInt(event.target.getAttribute("x-axis"));
    var getY = parseInt(event.target.getAttribute("y-axis"));

    console.log(getX);
    console.log(getY);


    if (checkOKtoPlace(symbol, getX, getY)) { // funcao que verifica se a colocacao e possivel caso seja ele retira as marcas nos locais que eram possiveis colacar
      clearTimeout(varTemp);
	    removePredictionDots(); //esta e a tal funcao que me retira as marcas
	    tempStopAllClicks();
      if(playerColor ==="dark"){
      clearInterval(t);
      start1();
      }
      else {
        clearInterval(t1);
        start();
      }
	    notify(getY, getX);   //request ao servidor de jogada

      var aTile = document.createElement("div");

      if (symbol === "W") {
        aTile.setAttribute("class", "white-tiles");
        boardArray[getY][getX] = symbol;
        } else {
            aTile.setAttribute("class", "black-tiles");
            boardArray[getY][getX] = symbol;

        }
        changeRespectiveTiles(event.target, symbol, getX, getY);//funcao que me faz a jogada modificando o tabuleiro


        event.target.appendChild(aTile);
        event.target.removeEventListener("click", playMove);//este comando tira me a propriedade de "click" na posicao onde se colocou a tile


        tilesCounting(); // esta funcao atualiza o numero de pecas (brancas,pretas,livres)

    } else { // caso seja um movimento invalido
        console.log("Invalid Move")
    }

}

//funçao que apresenta o vencedor ao client, recebe como argumento o nick do vencedor
var displayWin = function(winner) {

    mode = null;
    var getWinDisplay = document.querySelector(".win-lose-draw");

    var getResultContainer = document.querySelector(".resultContainer");


    var stat = JSON.parse(localStorage.getItem("stats"));
    
    if (userName === winner) {
	getWinDisplay.innerHTML = "Congratulations! You Win!";
        startAnimations();
	stat.vict++;
        
	localStorage.setItem("stats", JSON.stringify(stat));
    }
    else if(winner === null) {
	getWinDisplay.innerHTML = "It's a Draw!";
        startAnimations();
	stat.draw++
        
	localStorage.setItem("stats", JSON.stringify(stat));
    }
    else {
	getWinDisplay.innerHTML = "Try better next time !";
        startAnimations();
	stat.def++;        
        
	localStorage.setItem("stats", JSON.stringify(stat));

    }
   clearInterval(t1);
   clearInterval(t);
   ctx1.clearRect(0,0,100,100);
   ctx.clearRect(0,0,100,100);

}



//funçao iniciada quando o cliente carrega no botao quit ou quando o o timer chega ao fim
var leave = function() {
  console.log(gameName);
    fetch('http://twserver.alunos.dcc.fc.up.pt:8008/leave',{
	method:'POST',
	body: JSON.stringify({nick: userName, pass: passWord, game: gameName})
    })
	.catch(console.log);
  clearInterval(t1);
  clearInterval(t);
  ctx1.clearRect(0,0,100,100);
  ctx.clearRect(0,0,100,100);
}







//funçao chamada pela funçao takeOnTable, chama a funçao writetable
var getRanking = function() {
    fetch('http://twserver.alunos.dcc.fc.up.pt:8008/ranking',{
	method:'POST',
	mode:'cors',
	body: JSON.stringify({})
    })
	.then(response => { if(response.ok) response.json().then(json => writeTable(json)) }) //quando receber uma resposta valida transforma a em js e depois chama a funçao writeTable
	.catch(console.log);

}

//cria a tabela do top10 do servidor
var writeTable = function(response) {

    var table = document.createElement("table");
    table.setAttribute("class", "ttable");

    var hname = document.createElement("th");
    hname.setAttribute("class", "rankBox");
    hname.innerHTML = "nickname";
    var hwin = document.createElement("th");
    hwin.setAttribute("class", "rankBox");
    hwin.innerHTML = "wins";
    var hgame = document.createElement("th");
    hgame.setAttribute("class", "rankBox");
    hgame.innerHTML = "games";
    var rr = document.createElement("tr");
    rr.setAttribute("class", "rankHeader");

    rr.appendChild(hname);
    rr.appendChild(hwin);
    rr.appendChild(hgame);
    table.appendChild(rr);
    
    console.log(response);
    //JSON.parse(response);
    response.ranking.forEach(obj => {
	//console.log(obj);
	var row = document.createElement("tr");
	row.setAttribute("class", "rankBox");

	var d1 = document.createElement("td");
	d1.setAttribute("class", "rankBox");
	d1.innerHTML = obj.nick;
	var d2 = document.createElement("td");
	d2.setAttribute("class", "rankBox");
	d2.innerHTML = obj.victories;
	var d3 = document.createElement("td");
	d3.setAttribute("class", "rankBox");
	d3.innerHTML = obj.games;

	row.appendChild(d1);
	row.appendChild(d2);
	row.appendChild(d3);
	table.appendChild(row);
    })


    //console.log(this.getResultContainer);
    this.getResultContainer.appendChild(table);

    var backButton = document.createElement("button");
    backButton.setAttribute("class", "name result-selections");
    backButton.innerHTML = "Back";
    backButton.setAttribute("id", "returnToGame");
    backButton.addEventListener("click", function(){takeOffShroudClassif()});
    getResultContainer.appendChild(backButton);


}


//funçao chamada quando o cliente carrega no botao ranking
var takeOnTable = function(){
    var getDarkShroud = document.querySelector(".dark-shroud-classif");
    this.getResultContainer = document.querySelector(".classification-container");

    while (getResultContainer.firstChild)
	getResultContainer.removeChild(getResultContainer.firstChild);
    
    if(!singlePlayerMode)   //se for chamada no 2 player mode
	getRanking();
	//.then(response => writetable(response)); JSON.parse(table);

    else {             //se for em singlePlayerMode mostra os stats do cliente(nº de vitorias, empates e derrotas), esses stats estao guardados localmente no objeto stats

	var stat = JSON.parse(localStorage.getItem("stats"));
	
	var v = document.createElement("p");
	v.setAttribute("class", "final-result");
	v.innerHTML = "Victories";
	var vdiv = document.createElement("div");
	vdiv.setAttribute("class", "result-counter");
	vdiv.setAttribute("id", "victories");	
	vdiv.innerHTML = stat.vict;
	console.log(stat.vict);

	var l = document.createElement("p");
	l.setAttribute("class", "final-result");
	l.innerHTML = "Defeats";
	var ldiv = document.createElement("div");
	ldiv.setAttribute("class", "result-counter");
	ldiv.setAttribute("id", "defeats");
	ldiv.innerHTML = stat.def;

	var d = document.createElement("p");
	d.setAttribute("class", "final-result");
	d.innerHTML = "Draws";
	var ddiv = document.createElement("div");
	ddiv.setAttribute("class", "result-counter");
	ddiv.setAttribute("id", "draws");
	ddiv.innerHTML = stat.draw;

	getResultContainer.appendChild(v);
	getResultContainer.appendChild(vdiv);
	getResultContainer.appendChild(l);
	getResultContainer.appendChild(ldiv);
	getResultContainer.appendChild(d);
	getResultContainer.appendChild(ddiv);


	var backButton = document.createElement("button");
	backButton.setAttribute("class", "name result-selections");
	backButton.innerHTML = "Back";
	backButton.setAttribute("id", "returnToGame");
	backButton.addEventListener("click", function(){takeOffShroudClassif()});
	getResultContainer.appendChild(backButton);
    }
    
    getDarkShroud.style.visibility = "visible";
    getDarkShroud.style.opacity="1";

    getResultContainer.style.opacity = "1";

}


//funcao que coloca o butao de "definicoes" visivel
var takePutSettingsButton = function(){
    document.querySelector(".settings").style.visibility = "visible";
}
//funcao que coloca o butao de "definicoes" invisivel
var takeOutSettingsButton = function(){
    document.querySelector(".settings").style.visibility = "hidden";
}

var takeOutSettings = function(){
    var getDarkShroud = document.querySelector(".dark-shroud");

    getDarkShroud.style.visibility = "visible";
    getDarkShroud.style.opacity="1";


    var getResultContainer = document.querySelector(".result-container");
    getResultContainer.style.opacity = "1";

}

var takeOutInst = function(){
    var getDarkShroud = document.querySelector(".dark-shroud-inst");

    getDarkShroud.style.visibility = "visible";
    getDarkShroud.style.opacity="1";


    var getResultContainer = document.querySelector(".instruct-container");
    getResultContainer.style.opacity = "1";

}

var takeOutClassif = function(){
    var getDarkShroud = document.querySelector(".dark-shroud-classif");

    getDarkShroud.style.visibility = "visible";
    getDarkShroud.style.opacity="1";


    var getResultContainer = document.querySelector(".classification-container");
    getResultContainer.style.opacity = "1";

}


document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("single-player").addEventListener("click", function() {
        clearMainPageContainer();
        mode = "single"
        askPlayerColor(mode);

    })

    document.getElementById("2-players").addEventListener("click", function() {
        clearMainPageContainer();
        mode = "2"
        logIn();
    })

    document.getElementById("instructions").addEventListener("click", function() {
        clearMainPageContainer();
        displayRules();
    })



})
