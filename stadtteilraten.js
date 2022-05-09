function loadJSON(callback) {   

    var obj = new XMLHttpRequest();
    obj.overrideMimeType("application/json");
    obj.open('GET', 'db.json', true);

    obj.onreadystatechange = function () {

          if (obj.readyState == 4 && obj.status == "200") {
            
            callback(obj.responseText);
          }
    };

    obj.send(null);
    dbLoaded = true;
}

function init() {

    var n = 0;
    n = Math.floor(Math.random() * db.Stadtteile.length);

    answer = db.Stadtteile[n].city;
    document.getElementById("stadtteil").innerHTML = db.Stadtteile[n].name;
}

function guess(element) {

    guessed = true;

    if (element.id == answer) {

        element.style.borderColor = "green";
        score++;

        if (score > highscore) {

            highscore = score;
            updateHighscore();
        }
    }

    else {

        element.style.borderColor = "red";
        score = 0;
    }

    updateScore();
}

function updateScore() {

    var elemScore = document.getElementById("score");
    elemScore.innerText = "Punkte: " + score;
}

function updateHighscore() {

    var elemHighscore = document.getElementById("highscore");
    elemHighscore.innerText = "Highscore: " + score;
}

var db;
var answer;
var score = 0;
var highscore = 0;
var guessed = false;

window.onload = function() {

    loadJSON(function(response) {

        db = JSON.parse(response);

        const staedte = document.getElementById("staedte");
        const tr = document.createElement("tr");

        db.Städte.forEach(element => {
            
            var td = document.createElement("td");
            td.setAttribute("id", element.id);

            td.onclick = function() {

                if (guessed == false) {
                    
                    guess(td);

                    window.setTimeout(function() {

                        td.style.borderColor = "";

                        var n = 0;
                        n = Math.floor(Math.random() * db.Stadtteile.length);

                        answer = db.Stadtteile[n].city;
                        document.getElementById("stadtteil").innerHTML = db.Stadtteile[n].name;

                        guessed = false;
                    }, 3000);
                }
            };

            var img = new Image();
            img.src = element.image;
            img.title = element.name;
            img.alt = element.name;

            td.appendChild(img);
            tr.appendChild(td);
        });

        staedte.appendChild(tr);

        init();
    });
};