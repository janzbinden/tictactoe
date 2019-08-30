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
    var onClick = function(btn) {
        let img = document.createElement("IMG");
        if (!status) {
            if (btn.srcElement.id !== "box") {
                if (checkPressable(btn.srcElement.id)) {
                    document.getElementById(btn.srcElement.id).removeAttribute("data-class");
                    let img2 = document.createElement("IMG");
                    img.src = "svg/cross.svg";
                    document.getElementById(btn.srcElement.id).appendChild(img);
                    callFunctions();
                    if (document.getElementById(btn.srcElement.id).firstChild !== null && !status && counter === 2) {
                        img2.src = "svg/circle.svg";
                        let arr = [1, 3, 5, 7, 9];
                        let zahl = Math.floor(Math.random() * 5);
                        if (board[0] === 2 || board[2] === 2 || board[6] === 2 || board[8] === 2) {
                            comPlay("btn5");
                        } else {
                            while (!board.indexOf(0) !== -1 && board[arr[zahl] - 1] !== 0) {
                                zahl = Math.floor(Math.random() * 5);
                            }
                            comPlay("btn"+arr[zahl]);
                        }
                        callFunctions();
                    } else if (!status) {
                        checkWinPossibility();
                        callFunctions();
                    }
                }
            }
        }
    };
    document.getElementById("box").addEventListener("click", onClick);

    document.getElementById("restart").onclick = function () {
        for (let i = 1; i < 10; i += 1) {
            clearField("btn" + i);
            document.getElementById("btn" + i).setAttribute("data-class", "hover");
            document.getElementById("btn" + i).removeAttribute("data-sieg");
            document.getElementById("btn" + i).removeAttribute("data-hover");
            document.getElementById("btn" + i).removeAttribute("data-opacity");
            document.getElementById("btn" + i).removeAttribute("data-blink");
        }
        board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        counter = 1;
        status = false;
        document.getElementById("status").innerHTML = "You can start";
        document.getElementById("container2").style.backgroundColor = "#413e4c";
        document.getElementById("restart").disabled = true;
        document.getElementById("container2").removeAttribute("data-rainbow");
    };

    function checkSymbol() {
        return counter % 2 !== 0;
    }

    function callFunctions() {
        fillArray();
        showTurn();
        checkWinner();
        checkDraw();
        counter += 1;
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
        if (!checkSymbol()) {
            document.getElementById("status").innerHTML = "Calculating...";
        } else {
            document.getElementById("status").innerHTML = "It's your turn!";
        }

    }

    function showWinner(feld) {
        status = true;
        document.getElementById("container2").setAttribute("data-rainbow", "ja");

        for (let i = 1; i < 10; i += 1) {
            document.getElementById("btn" + i).removeAttribute("data-class");
        }
        if (board[feld] === 2) {
            document.getElementById("status").innerHTML = "YOU WON!";
        } else {
            document.getElementById("status").innerHTML = "Defeated by AI!";
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

    function checkWinPossibility() {
        if (board[0] === board[1] && board[0] === 1 && board[2] === 0) {
            comPlay("btn3");
        }
        else if (board[0] === board[2] && board[0] === 1 && board[1] === 0) {
            comPlay("btn2");
        }
        else if (board[1] === board[2] && board[1] === 1 && board[0] === 0) {
            comPlay("btn1");
        }
        else if (board[3] === board[4] && board[3] === 1 && board[5] === 0) {
            comPlay("btn6");
        }
        else if (board[3] === board[5] && board[3] === 1 && board[4] === 0) {
            comPlay("btn5");
        }
        else if (board[4] === board[5] && board[4] === 1 && board[3] === 0) {
            comPlay("btn4");
        }
        else if (board[6] === board[7] && board[6] === 1 && board[8] === 0) {
            comPlay("btn9");
        }
        else if (board[6] === board[8] && board[6] === 1 && board[7] === 0) {
            comPlay("btn8");
        }
        else if (board[7] === board[8] && board[7] === 1 && board[6] === 0) {
            comPlay("btn7");
        }
        else if (board[0] === board[3] && board[0] === 1 && board[6] === 0) {
            comPlay("btn7");
        }
        else if (board[0] === board[6] && board[0] === 1 && board[3] === 0) {
            comPlay("btn4");
        }
        else if (board[3] === board[6] && board[3] === 1 && board[0] === 0) {
            comPlay("btn1");
        }
        else if (board[1] === board[4] && board[1] === 1 && board[7] === 0) {
            comPlay("btn8");
        }
        else if (board[1] === board[7] && board[1] === 1 && board[4] === 0) {
            comPlay("btn5");
        }
        else if (board[4] === board[7] && board[4] === 1 && board[1] === 0) {
            comPlay("btn2");
        }
        else if (board[2] === board[5] && board[2] === 1 && board[8] === 0) {
            comPlay("btn9");
        }
        else if (board[2] === board[8] && board[2] === 1 && board[5] === 0) {
            comPlay("btn6");
        }
        else if (board[5] === board[8] && board[5] === 1 && board[2] === 0) {
            comPlay("btn3");
        }
        else if (board[0] === board[4] && board[0] === 1 && board[8] === 0) {
            comPlay("btn9");
        }
        else if (board[0] === board[8] && board[0] === 1 && board[4] === 0) {
            comPlay("btn5");
        }
        else if (board[4] === board[8] && board[4] === 1 && board[0] === 0) {
            comPlay("btn1");
        }
        else if (board[2] === board[4] && board[2] === 1 && board[6] === 0) {
            comPlay("btn7");
        }
        else if (board[2] === board[6] && board[2] === 1 && board[4] === 0) {
            comPlay("btn5");
        }
        else if (board[4] === board[6] && board[4] === 1 && board[2] === 0) {
            comPlay("btn3");
        }
        else {
            checkLosePossibility();
        }
    }

    function checkLosePossibility() {
        if (board[0] === board[1] && board[0] === 2 && board[2] === 0) {
            comPlay("btn3");
        }
        else if (board[0] === board[2] && board[0] === 2 && board[1] === 0) {
            comPlay("btn2");
        }
        else if (board[1] === board[2] && board[1] === 2 && board[0] === 0) {
            comPlay("btn1");
        }
        else if (board[3] === board[4] && board[3] === 2 && board[5] === 0) {
            comPlay("btn6");
        }
        else if (board[3] === board[5] && board[3] === 2 && board[4] === 0) {
            comPlay("btn5");
        }
        else if (board[4] === board[5] && board[4] === 2 && board[3] === 0) {
            comPlay("btn4");
        }
        else if (board[6] === board[7] && board[6] === 2 && board[8] === 0) {
            comPlay("btn9");
        }
        else if (board[6] === board[8] && board[6] === 2 && board[7] === 0) {
            comPlay("btn8");
        }
        else if (board[7] === board[8] && board[7] === 2 && board[6] === 0) {
            comPlay("btn7");
        }
        else if (board[0] === board[3] && board[0] === 2 && board[6] === 0) {
            comPlay("btn7");
        }
        else if (board[0] === board[6] && board[0] === 2 && board[3] === 0) {
            comPlay("btn4");
        }
        else if (board[3] === board[6] && board[3] === 2 && board[0] === 0) {
            comPlay("btn1");
        }
        else if (board[1] === board[4] && board[1] === 2 && board[7] === 0) {
            comPlay("btn8");
        }
        else if (board[1] === board[7] && board[1] === 2 && board[4] === 0) {
            comPlay("btn5");
        }
        else if (board[4] === board[7] && board[4] === 2 && board[1] === 0) {
            comPlay("btn2");
        }
        else if (board[2] === board[5] && board[2] === 2 && board[8] === 0) {
            comPlay("btn9");
        }
        else if (board[2] === board[8] && board[2] === 2 && board[5] === 0) {
            comPlay("btn6");
        }
        else if (board[5] === board[8] && board[5] === 2 && board[2] === 0) {
            comPlay("btn3");
        }
        else if (board[0] === board[4] && board[0] === 2 && board[8] === 0) {
            comPlay("btn9");
        }
        else if (board[0] === board[8] && board[0] === 2 && board[4] === 0) {
            comPlay("btn5");
        }
        else if (board[4] === board[8] && board[4] === 2 && board[0] === 0) {
            comPlay("btn1");
        }
        else if (board[2] === board[4] && board[2] === 2 && board[6] === 0) {
            comPlay("btn7");
        }
        else if (board[2] === board[6] && board[2] === 2 && board[4] === 0) {
            comPlay("btn5");
        }
        else if (board[4] === board[6] && board[4] === 2 && board[2] === 0) {
            comPlay("btn3");
        }
        else if (counter < 18){
            let img = document.createElement("IMG");
            img.src = "svg/circle.svg";
            if (board[0] === 1 && board[2] === 0 && board[1] === 0) {
                comPlay("btn3");
            }
            else if (board[0] === 1 && board[1] === 0 && board[2] === 0) {
                comPlay("btn2");
            }
            else if (board[0] === 1 && board[4] === 0 && board[8] === 0) {
                comPlay("btn5");
            }
            else if (board[1] === 1 && board[0] === 0  && board[2] === 0) {
                comPlay("btn1");
            }
            else if (board[1] === 1 && board[2] === 0  && board[0] === 0) {
                comPlay("btn3");
            }
            else if (board[2] === 1 && board[1] === 0  && board[0] === 0) {
                comPlay("btn2");
            }
            else if (board[2] === 1 && board[0] === 0  && board[1] === 0) {
                comPlay("btn1");
            }
            else if (board[2] === 1 && board[4] === 0  && board[6] === 0) {
                comPlay("btn5");
            }
            else if (board[3] === 1 && board[4] === 0  && board[5] === 0) {
                comPlay("btn5");
            }
            else if (board[3] === 1 && board[5] === 0  && board[4] === 0) {
                comPlay("btn6");
            }
            else if (board[4] === 1 && board[3] === 0  && board[5] === 0) {
                comPlay("btn4");
            }
            else if (board[4] === 1 && board[5] === 0 && board[3] === 0) {
                comPlay("btn6");
            }
            else if (board[4] === 1 && board[0] === 0 && board[8] === 0) {
                comPlay("btn1");
            }
            else if (board[4] === 1 && board[2] === 0 && board[6] === 0) {
                comPlay("btn3");
            }
            else if (board[4] === 1 && board[6] === 0 && board[2] === 0) {
                comPlay("btn7");
            }
            else if (board[4] === 1 && board[8] === 0 && board[0] === 0) {
                comPlay("btn9");
            }
            else if (board[5] === 1 && board[4] === 0 && board[3] === 0) {
                comPlay("btn5");
            }
            else if (board[5] === 1 && board[3] === 0 && board[4] === 0) {
                comPlay("btn4");
            }
            else if (board[6] === 1 && board[7] === 0 && board[8] === 0) {
                comPlay("btn8");
            }
            else if (board[6] === 1 && board[8] === 0 && board[7] === 0) {
                comPlay("btn9");
            }
            else if (board[6] === 1 && board[4] === 0 && board[2] === 0) {
                comPlay("btn5");
            }
            else if (board[7] === 1 && board[6] === 0 && board[8] === 0) {
                comPlay("btn7");
            }
            else if (board[7] === 1 && board[8] === 0 && board[6] === 0) {
                comPlay("btn9");
            }
            else if (board[8] === 1 && board[7] === 0 && board[6] === 0) {
                comPlay("btn8");
            }
            else if (board[8] === 1 && board[6] === 0 && board[7] === 0) {
                comPlay("btn7");
            }
            else if (board[8] === 1 && board[4] === 0 && board[0] === 0) {
                comPlay("btn5");
            }
            else if (board[0] === 1 && board[3] === 0 && board[6] === 0) {
                comPlay("btn4");
            }
            else if (board[0] === 1 && board[6] === 0 && board[3] === 0) {
                comPlay("btn7");
            }
            else if (board[1] === 1 && board[4] === 0 && board[7] === 0) {
                comPlay("btn5");
            }
            else if (board[1] === 1 && board[7] === 0 && board[4] === 0) {
                comPlay("btn8");
            }
            else if (board[2] === 1 && board[5] === 0 && board[8] === 0) {
                comPlay("btn6");
            }
            else if (board[2] === 1 && board[8] === 0 && board[5] === 0) {
                comPlay("btn9");
            }
            else if (board[3] === 1 && board[6] === 0 && board[0] === 0) {
                comPlay("btn7");
            }
            else if (board[3] === 1 && board[0] === 0 && board[6] === 0) {
                comPlay("btn1");
            }
            else if (board[4] === 1 && board[7] === 0 && board[1] === 0) {
                comPlay("btn8");
            }
            else if (board[4] === 1 && board[1] === 0 && board[7] === 0) {
                comPlay("btn2");
            }
            else if (board[5] === 1 && board[8] === 0 && board[2] === 0) {
                comPlay("btn9");
            }
            else if (board[5] === 1 && board[2] === 0 && board[8] === 0) {
                comPlay("btn3");
            }
            else if (board[6] === 1 && board[3] === 0 && board[0] === 0) {
                comPlay("btn4");
            }
            else if (board[6] === 1 && board[0] === 0 && board[3] === 0) {
                comPlay("btn1");
            }
            else if (board[7] === 1 && board[4] === 0 && board[1] === 0) {
                comPlay("btn5");
            }
            else if (board[7] === 1 && board[1] === 0 && board[4] === 0) {
                comPlay("btn2");
            }
            else if (board[8] === 1 && board[5] === 0 && board[2] === 0) {
                comPlay("btn6");
            }
            else if (board[8] === 1 && board[2] === 0 && board[5] === 0) {
                comPlay("btn3");
            } else {
                let zahl = Math.floor(Math.random() * 9) + 1;
                while (!board.indexOf(0) !== -1 && board[zahl - 1] !== 0) {
                    zahl = Math.floor(Math.random() * 9) + 1;
                }
                comPlay("btn"+zahl);
            }
        }
    }

    function comPlay(btn) {
        document.getElementById("box").removeEventListener("click", onClick);
        setTimeout(function run() {
            let img = document.createElement("IMG");
            img.src = "svg/circle.svg";
            document.getElementById(btn).appendChild(img);
            document.getElementById(btn).removeAttribute("data-class");
            document.getElementById("box").addEventListener("click", onClick);
            callFunctions();
            counter += 1;
        }, 500);
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
                setTimeout(function() {
                    xs.setAttribute("data-blink", "ja");
                }, 500);
            }
        });

    }

    function enableRestart() {
        document.getElementById("restart").disabled = false;
    }

}());
