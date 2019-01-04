/*jslint browser:true, long: true, devel: true, for:true*/
(function () {
    "use strict";
    let counter = 1;
    let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let status = false;

    function fInit() {
        // ServiceWorker initialisieren
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", function () {
                navigator.serviceWorker.register("sw.js").then(function (registration) {
                    console.log("ServiceWorker registration successful with scope: ", registration.scope);
                }, function (err) {
                    console.log("ServiceWorker registration failed: ", err);
                });
            });
        }
    }

    fInit();

    document.getElementById("box").addEventListener("click", function (btn){
        let img = document.createElement("IMG");
        if (!status) {
            if (btn.srcElement.id !== "box") {
                if (checkPressable(btn.srcElement.id)) {
                    document.getElementById(btn.srcElement.id).removeAttribute("data-class");
                    if (checkSymbol()) {
                        img.src = "svg/circle.svg";
                        document.getElementById(btn.srcElement.id).appendChild(img);
                    } else if (!checkSymbol()) {
                        img.src = "svg/cross.svg";
                        document.getElementById(btn.srcElement.id).appendChild(img);
                    }
                    counter += 1;
                }
                fillArray();
                showTurn();
                checkWinner();
                checkDraw();
            }
        }
    });

    document.getElementById("restart").onclick = function () {
        for (let i = 1; i < 10; i += 1) {
            clearField("btn" + i);
            document.getElementById("btn" + i).style.borderColor = "";
            document.getElementById("btn" + i).style.borderWidth = "";
            document.getElementById("btn" + i).setAttribute("data-class", "hover");
            document.getElementById("btn" + i).removeAttribute("data-sieg");
            document.getElementById("btn" + i).removeAttribute("data-hover");
            document.getElementById("btn" + i).removeAttribute("data-opacity");
            document.getElementById("btn" + i).removeAttribute("data-blink");
        }
        board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        counter = 1;
        status = false;
        document.getElementById("status").innerHTML = "Player X is starting";
        document.getElementById("container2").style.backgroundColor = "#413e4c";
        document.getElementById("restart").disabled = true;
        document.getElementById("container2").removeAttribute("data-rainbow");
    };

    function checkSymbol() {
        return counter % 2 === 0;
    }

    function checkPressable(btn) {
        if (btn !== "") {
            return document.getElementById(btn).firstChild === null;
        }
    }

    function clearField(btn) {
        while (document.getElementById(btn).firstChild) {
            document.getElementById(btn).removeChild(document.getElementById(btn).firstChild);
        }
    }

    function fillArray() {
        for (let i = 1; i < 10; i += 1) {
            if (document.getElementById("btn" + i).firstChild !== null) {
                if (document.getElementById("btn" + i).firstChild.getAttribute("src") === "svg/circle.svg") {
                    board[i - 1] = 1;
                } else if (document.getElementById("btn" + i).firstChild.getAttribute("src") === "svg/cross.svg") {
                    board[i - 1] = 2;
                }
            }
        }
    }

    function checkDraw() {
        if (!board.includes(0) && !status) {
            document.getElementById("status").innerHTML = "It's draw...";
            document.getElementById("restart").disabled = false;
        }
    }

    function showTurn() {
        if (checkSymbol()) {
            document.getElementById("status").innerHTML = "Player O, it's your turn!";
        } else {
            document.getElementById("status").innerHTML = "Player X, it's your turn!";
        }

    }

    function showWinner(feld) {
        status = true;
        document.getElementById("container2").setAttribute("data-rainbow", "ja");
        for (let i = 1; i < 10; i += 1) {
            document.getElementById("btn" + i).removeAttribute("data-class");
        }
        document.getElementById("container2").style.backgroundColor = "#8248c4";
        if (board[feld] === 2) {
            document.getElementById("status").innerHTML = "X WON!";
        } else {
            document.getElementById("status").innerHTML = "O WON!";
        }
    }

    function checkWinner() {
        if (!status) {
            for (let i = 0; i < 7; i += 3) {
                if (board[i] !== 0 && board[i] === board[i + 1] && board[i] === board[i + 2]) {
                    showWinner(i);
                    highlightWinner("btn" + (i + 1), "btn" + (i + 2), "btn" + (i + 3));
                    enableRestart();
                }
            }
            for (let i = 0; i < 3; i += 1) {
                if (board[i] !== 0 && board[i] === board[i + 3] && board[i] === board[i + 6]) {
                    showWinner(i);
                    highlightWinner("btn" + (i + 1), "btn" + (i + 4), "btn" + (i + 7));
                    enableRestart();
                }
            }
            for (let i = 0; i < 3; i += 2) {
                if (i === 0) {
                    if (board[i] !== 0 && board[i] === board[i + 4] && board[i] === board[i + 8]) {
                        showWinner(i);
                        highlightWinner("btn" + (i + 1), "btn" + (i + 5), "btn" + (i + 9));
                        enableRestart();
                    }
                }
                else {
                    if (board[i] !== 0 && board[i] === board[i + 2] && board[i] === board[i + 4]) {
                        showWinner(i);
                        highlightWinner("btn" + (i + 1), "btn" + (i + 3), "btn" + (i + 5));
                        enableRestart();
                    }
                }
            }
        }
    }

    function highlightWinner(btn1, btn2, btn3) {
        let btns = [btn1, btn2, btn3];
        for (let i = 0; i < 3; i += 1) {
            let btn = document.getElementById(btns[i]);
            btn.setAttribute("data-sieg", "ja");
        }
        let x = document.getElementsByTagName("img");
        Array.from(x).forEach(function (xs) {
            if (xs.parentElement.getAttribute("data-sieg") !== "ja") {
                xs.setAttribute("data-opacity", "ja");
            } else {
                xs.setAttribute("data-blink", "ja");
            }
        });

    }

    function enableRestart() {
        document.getElementById("restart").disabled = false;
    }

}());
