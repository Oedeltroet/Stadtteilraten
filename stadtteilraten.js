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

            // STAEDTE

        const staedte = document.getElementById("staedte");

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

                        do {
                            
                            n = Math.floor(Math.random() * db.Stadtteile.length);
                        }

                        while (!levels[db.Stadtteile[n].level]);

                        answer = db.Stadtteile[n].city;
                        document.getElementById("stadtteil").innerHTML = db.Stadtteile[n].name;

                        guessed = false;
                    }, 2000);
                }
            };

            td.appendChild(cityname);
            td.appendChild(img);

            staedte.appendChild(td);
        });

            // SCHWIERIGKEITSGRADE

        const levels = new Array(db.Schwierigkeitslevel.length).fill(true);
        const levelSelector = document.getElementById("levels");

        for (var i = 0; i < db.Schwierigkeitslevel.length; i++) {

            var levelName = db.Schwierigkeitslevel[i].name;

            var checkboxContainer = document.createElement("div");
            checkboxContainer.setAttribute("class", "checkbox-container");

            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = levelName;
            checkbox.checked = levels[i];

            checkbox.onclick = function() {

                var parent = checkbox.parentElement.parentElement;

                for (var j = 0; j < parent.childElementCount; j++) {

                    levels[j] = parent.children[j].children[0].checked ? true : false;
                }

                    // make sure that at leat one checkbox is always checked

                var count = 0;

                for (var j = 0; j < levels.length; j++) {

                    if (levels[j] == true) {

                        count++;
                    }
                }

                if (count <= 1) {

                    for (var j = 0; j < levels.length; j++) {

                        if (levels[j] == true) {

                            parent.children[j].children[0].disabled = true;
                            break;
                        }
                    }
                }

                else {

                    for (var j = 0; j < levels.length; j++) {

                        parent.children[j].children[0].disabled = false;
                    }
                }

                console.log(levels);
            }

            var label = document.createElement("label");
            label.for = levelName;
            label.innerText = levelName;

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);

            levelSelector.appendChild(checkboxContainer);
        };

        var n = 0;

        do {
            
            n = Math.floor(Math.random() * db.Stadtteile.length);
        }

        while (!levels[db.Stadtteile[n].level]);

        answer = db.Stadtteile[n].city;
        document.getElementById("stadtteil").innerHTML = db.Stadtteile[n].name;
    });
};