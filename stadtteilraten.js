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

    var cityname = element.firstChild;
    cityname.style.opacity = "1.0";

    if (element.id == answer) {

        cityname.style.color = "green";

        score++;

        if (score > highscore) {

            highscore = score;
            updateHighscore();
        }
    }

    else {

        cityname.style.color = "red";
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

            var cityname = document.createElement("p");
            cityname.setAttribute("id", "cityname");
            cityname.innerText = element.name;

            var img = new Image();
            img.src = element.image;
            img.title = element.name;
            img.alt = element.name;

            td.onclick = function() {

                if (guessed == false) {
                    
                    guess(td);

                    window.setTimeout(function() {

                        td.firstChild.style = "";

                        var n = 0;
                        n = Math.floor(Math.random() * db.Stadtteile.length);

                        answer = db.Stadtteile[n].city;
                        document.getElementById("stadtteil").innerHTML = db.Stadtteile[n].name;

                        guessed = false;
                    }, 3000);
                }
            };

            td.appendChild(cityname);
            td.appendChild(img);

            tr.appendChild(td);
        });

        staedte.appendChild(tr);

        init();
    });
};