const port = 8141;
const http = require("http");
const url = require("url");
const fs = require("fs");
var accounts = [];
var mapGamesGroup = new Map();
var mapGamesGameID = new Map();

const headers = {
    plain: {
        "Content-Type": "application/javascript",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
    },
    sse: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
        Connection: "keep-alive",
    },
};

//criar/abrir o servidor
const server = http.createServer(function(request, response) {
    const preq = url.parse(request.url, true);
    const pathname = preq.pathname;
    let answer = {};

    switch (
        request.method // ver qual e o metodo que recebi
    ) {
        case "GET": //caso do update
            //answer = doGet(pathname,request,response);
            break;
        case "POST": //outras funcoes
            let body = "";
            request
                .on("data", (chunk) => {
                    body += chunk;
                })
                .on("end", () => {
                    try {
                        query = JSON.parse(body);
                        doPost(query, pathname, response);
                    } catch (err) {
                        /* erros de JSON */
                    }
                })
                .on("error", (err) => {
                    console.log(err.message);
                });
            break;
        default:
            answer.status = 400;
            break;
    }
});

server.listen(port, function(error) {
    if (error) {
        console.log("Something went wrong", error);
    } else {
        console.log("Server is listening on port " + port);
    }
});

var handleRequest = function(answer, response) {
    if (answer.status === undefined) answer.status = 200;
    if (answer.style === undefined) answer.style = "plain";
    response.writeHead(answer.status, headers[answer.style]);
    if (answer.style === "plain") response.end();
};

var doPost = function(query, pathname, response) {
    switch (pathname) {
        case "/register":
            newRegister(query, response);
            break;
        case "/ranking":
            break;
        case "/join":
            join(query, response);
            break;
        case "/leave":
            leave(query, response);
            break;
        case "/notify":
            notify(query, response);
            break;
        default:
            answer.status = 400;
            break;
    }
};

function readerJsonAccountsFile() {
    accounts = [];
    if (fs.existsSync("dados.json")) {
        let fileBuffer = fs.readFileSync("dados.json", "utf-8");
        let contentJson = JSON.parse(fileBuffer.toString()).info;
        if (contentJson.length === 0) return;
        for (let i = 0; i < contentJson.length; i++) {
            accounts.push(contentJson[i]);
        }
    }
}



var join = function(query, response) {
    readerJsonAccountsFile();
    let name = query.nick;
    let password = query.pass;
    let group = query.group;
    if (findUser(name)) {
        if (password === getPass(name)) {
            // GERAR CODE
            //buscar na arvore , associa esse nick a um id e devolve
            let color = "black";
            let userMatch;
            if (mapGamesGroup.get(group) == undefined) {
                //criar entrada no mapa
                //makeid(20)
                userMatch = new UserMatch(name, "", "A", group);
                mapGamesGroup.set(group, userMatch);
                mapGamesGameID.set(userMatch.getGameId(), userMatch);
            } else {
                color = "white";
                userMatch = mapGamesGroup.get(group);
                let aux = mapGamesGameID.get(userMatch.getGameId());
                aux.setPlayer2(name);
                userMatch.setPlayer2(name);
            }

            response.writeHead(200, headers.plain);
            response.end(
                JSON.stringify(
                    "{game:" + userMatch.getGameId() + ",color:" + color + "}"
                )
            );
            return;
        } else {
            response.writeHead(401, headers.plain);
            response.end(JSON.stringify("{error: pass incorreta}"));
        }
    } else {
        response.writeHead(401, headers.plain);
        response.end(JSON.stringify("{error: nick incorreto}"));
    }
};
var leave = function(query, response) {
    readerJsonAccountsFile();
    let name = query.nick;
    let password = query.pass;
    let gameId = query.game;
    if (findUser(name)) {
        if (password === getPass(name)) {
            let userMatch;
            if (mapGamesGameID.get(gameId) != undefined) {
                let aux = mapGamesGameID.get(gameId);
                mapGamesGroup.delete(aux.getGroup());
                mapGamesGameID.delete(aux.getGameId());
                console.log("mapGamesGroup");
                console.log(mapGamesGroup);
                console.log("");
                console.log("mapGamesGameID");
                console.log(mapGamesGameID);

                response.writeHead(200, headers.plain);
                response.end(JSON.stringify("{}"));
                return;
            } else {
                response.writeHead(401, headers.plain);
                response.end(JSON.stringify("{error: game incorreto}"));
                return;
            }
        } else {
            response.writeHead(401, headers.plain);
            response.end(JSON.stringify("{error: pass incorreta}"));
            return;
        }
    } else {
        response.writeHead(401, headers.plain);
        response.end(JSON.stringify("{error: nick incorreto}"));
        return;
    }
};

var notify = function(query, response) {
    readerJsonAccountsFile();
    let name = query.nick;
    let password = query.pass;
    let gameId = query.game;
    let move = query.move;
    if (findUser(name)) {
        if (password === getPass(name)) {
            let userMatch;
            if (mapGamesGameID.get(gameId) != undefined) {
                let userMatch = mapGamesGameID.get(gameId);
                let boardArray = userMatch.boardArray;

                let color = userMatch.getPlayerColor(name);
                console.log(color);
                let x = parseInt(move.row);
                let y = parseInt(move.column);
                let code = makeMove(color, y, x, boardArray);
                console.log(userMatch.print());
                response.writeHead(code, headers.plain);
                if (code == 200) {
                    response.end(JSON.stringify("{}"));
                } else {
                    response.end(JSON.stringify("{error: jogada incorreta}"));
                }
                return;
            } else {
                response.writeHead(401, headers.plain);
                response.end(JSON.stringify("{error: game incorreto}"));
                return;
            }
        } else {
            response.writeHead(401, headers.plain);
            response.end(JSON.stringify("{error: pass incorreta}"));
            return;
        }
    } else {
        response.writeHead(401, headers.plain);
        response.end(JSON.stringify("{error: nick incorreto}"));
        return;
    }
};

var newRegister = function(query, response) {
    readerJsonAccountsFile();
    let name = query.nick;
    let password = query.pass;
    if (name === null || name === "" || name === undefined) {
        response.writeHead(401, headers.plain);
        response.end();
        return;
    }
    if (password === null || password === "" || password === undefined) {
        response.writeHead(401, headers.plain);
        response.end();
        return;
    }

    if (findUser(name)) {
        if (password === getPass(name)) {
            response.writeHead(200, headers.plain);
            response.end(JSON.stringify("{}"));
            return;
        } else {
            response.writeHead(401, headers.plain);
            response.end(
                JSON.stringify("{ error : User registered with a different password }")
            );
            return;
        }
        return;
    } else {
        let createAccount = {
            username: name,
            pass: password,
        };
        accounts.push(createAccount);
        let users = { info: accounts };
        fs.writeFileSync("dados.json", JSON.stringify(users));
        response.writeHead(200, headers.plain);
        response.end(JSON.stringify("{}"));
        return;
    }
};

function findUser(nick) {
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].username == nick) return true;
    }
    return false;
}

var getPass = function(nick) {
    let i;
    for (i = 0; i < accounts.length; i++) {
        if (accounts[i].username == nick) {
            break;
        }
    }
    return accounts[i].pass;
};
class UserMatch {
    constructor(nick_1, nick_2, gameId, group) {
        this.nick_1 = nick_1;
        this.nick_2 = nick_2;
        this.gameId = gameId;
        this.group = group;
        this.boardArray = new Array();
        this.createBoardArray();
    }
    createBoardArray() {
        for (let i = 0; i < 8; i++) {
            let anArray = [];
            for (let j = 0; j < 8; j++) {
                anArray.push(null);
            }
            this.boardArray.push(anArray);
        }
        this.boardArray[3][3] = "W";
        this.boardArray[3][4] = "B";
        this.boardArray[4][3] = "B";
        this.boardArray[4][4] = "W";
    }
    getPlayerColor(nick) {
        if (nick == this.nick_1) {
            return "B";
        } else {
            return "W";
        }
    }
    print() {
        let retorno = "";
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                retorno +=
                    this.boardArray[i][j] == null ?
                    " - " :
                    " " + this.boardArray[i][j] + " ";
            }
            retorno += "\n";
        }
        return retorno;
    }
    getPlayer1() {
        return this.nick_1;
    }
    getPlayer2() {
        return this.nick_2;
    }
    getGameId() {
        return this.gameId;
    }
    getGroup() {
        return this.group;
    }
    setPlayer1(player_1) {
        this.nick_1 = player_1;
    }
    setPlayer2(player_2) {
        this.nick_2 = player_2;
    }
}

function makeid(length) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

var checkOKtoPlace = function(sym, x, y, boardArray) {
    var arr = [
        checkTopLeft(sym, x, y, boardArray),
        checkTop(sym, x, y, boardArray),
        checkTopRight(sym, x, y, boardArray),
        checkRight(sym, x, y, boardArray),
        checkBottomRight(sym, x, y, boardArray),
        checkBottom(sym, x, y, boardArray),
        checkBottomLeft(sym, x, y, boardArray),
        checkLeft(sym, x, y, boardArray),
    ];
    return arr;
};

//esta funcao verifica se pode haver alguma alteracao se contar a partir canto superior esquerdo
//check top left
var checkTopLeft = function(sym, x, y, boardArray) {
    if (x < 2 || y < 2) {
        // uma peca so pode mudar outra se no outro canto estiver uma da mesme cor que a sua , entao esta codicao verifica se ela ela disposta a mudar
        return false;
    } else {
        console.log("checkTopLeft " + boardArray[y - 1][x - 1]);

        if (boardArray[y - 1][x - 1] !== null) {
            console.log("checkTopLeft");

            if (boardArray[y - 1][x - 1] !== sym) {
                var minCount = Math.min(x, y) + 1;

                for (let i = 2; i < minCount; i++) {
                    if (boardArray[y - i][x - i] === sym) {
                        return true;
                    } else if (boardArray[y - i][x - i] === null) {
                        return false;
                    } else if (boardArray[y - i][x - i] === undefined) {
                        return false;
                    }
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};

// esta e a mesma historia so que para cima
//check top
var checkTop = function(sym, x, y, boardArray) {
    if (y < 2) {
        return false;
    } else {
        console.log("checkTop " + boardArray[y - 1][x]);

        if (boardArray[y - 1][x] !== null) {
            console.log("checkTop");

            if (boardArray[y - 1][x] !== sym) {
                var minCount = y + 1;
                for (let i = 2; i < minCount; i++) {
                    if (boardArray[y - i][x] === sym) {
                        return true;
                    } else if (boardArray[y - i][x] === null) {
                        return false;
                    } else if (boardArray[y - i][x] === undefined) {
                        return false;
                    }
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};

// igual so que para o canto superior direito
//check top right
var checkTopRight = function(sym, x, y, boardArray) {
    console.log("checkTopRight " + boardArray[y - 1][x + 1]);

    if (y < 2 || x > 8 - 3) {
        return false;
    } else {
        if (boardArray[y - 1][x + 1] !== null) {
            console.log("checkTopRight");

            if (boardArray[y - 1][x + 1] !== sym) {
                var minCount = Math.min(8 - x - 1, y) + 1;
                for (let i = 2; i < minCount; i++) {
                    if (boardArray[y - i][x + i] === sym) {
                        return true;
                    } else if (boardArray[y - i][x + i] === null) {
                        return false;
                    } else if (boardArray[y - i][x + i] === undefined) {
                        return false;
                    }
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};

//para o lado direito
//check right
var checkRight = function(sym, x, y, boardArray) {
    if (x > 8 - 3) {
        return false;
    } else {
        console.log("checkRight " + boardArray[y][x + 1]);

        if (boardArray[y][x + 1] !== null) {
            console.log("checkRight");

            if (boardArray[y][x + 1] !== sym) {
                var minCount = 8 - x;
                for (let i = 2; i < 8; i++) {
                    if (boardArray[y][x + i] === sym) {
                        return true;
                    } else if (boardArray[y][x + i] === null) {
                        return false;
                    } else if (boardArray[y][x + i] === undefined) {
                        return false;
                    }
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};

//inferior direito
//check bottom right
var checkBottomRight = function(sym, x, y, boardArray) {
    if (x > 8 - 3 || y > 8 - 3) {
        return false;
    } else {
        console.log("checkBottomRight " + boardArray[y + 1][x + 1]);

        if (boardArray[y + 1][x + 1] !== null) {
            console.log("checkBottomRight");

            if (boardArray[y + 1][x + 1] !== sym) {
                var minCount = Math.min(8 - x, 8 - y);
                for (let i = 2; i < minCount; i++) {
                    if (boardArray[y + i][x + i] === sym) {
                        return true;
                    } else if (boardArray[y + i][x + i] === null) {
                        return false;
                    } else if (boardArray[y + i][x + i] === undefined) {
                        return false;
                    }
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};

// igual em baixo
//check bottom
var checkBottom = function(sym, x, y, boardArray) {
    if (y > 8 - 3) {
        return false;
    } else {
        console.log("checkBottom " + boardArray[y + 1][x]);

        if (boardArray[y + 1][x] !== null) {
            console.log("checkBottom");

            if (boardArray[y + 1][x] !== sym) {
                var minCount = 8 - y;
                for (let i = 2; i < minCount; i++) {
                    if (boardArray[y + i][x] === sym) {
                        return true;
                    } else if (boardArray[y + i][x] === null) {
                        return false;
                    } else if (boardArray[y + i][x] === undefined) {
                        return false;
                    }
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};

//anto inferior esquerdo
//check bottom left
var checkBottomLeft = function(sym, x, y, boardArray) {
    if (y > 8 - 3 || x < 2) {
        return false;
    } else {
        console.log("checkBottomLeft " + boardArray[y + 1][x - 1]);

        if (boardArray[y + 1][x - 1] !== null) {
            console.log("checkBottomLeft");

            if (boardArray[y + 1][x - 1] !== sym) {
                var minCount = Math.min(8 - y - 1, x) + 1;
                for (let i = 2; i < minCount; i++) {
                    if (boardArray[y + i][x - i] === sym) {
                        return true;
                    } else if (boardArray[y + i][x - i] === null) {
                        return false;
                    } else if (boardArray[y + i][x - i] === undefined) {
                        return false;
                    }
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};

//E finalmente lado esquerdo
//check left
var checkLeft = function(sym, x, y, boardArray) {
    if (x < 2) {
        return false;
    } else {
        console.log("checkLeft " + boardArray[y][x - 1]);

        if (boardArray[y][x - 1] !== null) {
            console.log("checkLeft");

            if (boardArray[y][x - 1] !== sym) {
                var minCount = x + 1;
                for (let i = 2; i < minCount; i++) {
                    if (boardArray[y][x - i] === sym) {
                        return true;
                    } else if (boardArray[y][x - i] === null) {
                        return false;
                    } else if (boardArray[y][x - i] === undefined) {
                        return false;
                    }
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};

//esta funcao faz me a jogada modificando as pecas do jogo
//gracas ao array directionToGo
var changeRespectiveTiles = function(sym, x, y, boardArray, directionToGo) {
    var topLeftSettle = false;
    var topSettle = false;
    var topRightSettle = false;
    var rightSettle = false;
    var bottomRightSettle = false;
    var bottomSettle = false;
    var bottomLeftSettle = false;
    var leftSettle = false;

    for (i = 0; i < 8; i++) {
        switch (i) {
            case 0:
                if (directionToGo[i]) {
                    while (!topLeftSettle) {
                        if (boardArray[y - 1][x - 1] !== null) {
                            var a = 1;
                            while (boardArray[y - a][x - a] !== sym) {
                                boardArray[y - a][x - a] = sym;
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
};

function makeMove(sym, x, y, boardArray) {
    let directionToGo = new Array();

    directionToGo = checkOKtoPlace(sym, x, y, boardArray);
    if (directionToGo.includes(true)) {
        console.log(directionToGo);
        boardArray[y][x] = sym;
        changeRespectiveTiles(sym, x, y, boardArray, directionToGo);
        return 200;
    } else {
        return 401;
    }
}
