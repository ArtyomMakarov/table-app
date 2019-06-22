var buttonSendStudent = document.getElementById('sendStudent'),
    buttonSendLection = document.getElementById('sendLection'),
    buttonSendHomework = document.getElementById('sendHomework'),
    content = document.getElementById('content'),
    sumPoint = document.getElementsByClassName('sum'),
    news = document.getElementById("news"),
    table = document.getElementById('table'),
    color = '#FFFFFF';

function httpGet(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send();
        xhr.onload = function () {
            if (this.status == 200) {
                resolve(this.response);
            } else {
                var error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        };
    });
}
httpGet('./json/data.json')
    .then(result => {
            let data = JSON.parse(result);
            innerTemplate(data);
            buttonModalListeners();
            sendButtonListeners(data);
            innerNewsTemplate(data);
            sumPoints(table);
            addColor();
        }
    )
    .catch(error => {
        console.log('Rejected:' + error);
    });

function innerTemplate(data) {
    let template = _.template(document.getElementById('studentstpl').innerHTML);
    let templateHTML = template(data);
    content.innerHTML = templateHTML;
}

function innerNewsTemplate(data) {
    let newsTemplate = _.template(document.getElementById('newsTempl').innerHTML);
    let newsTemplateHTML = newsTemplate(data);
    news.innerHTML = newsTemplateHTML;
}

function buttonModalListeners () {
   let studentButton = $('#addStudent'),
       lectionButton = $('#addLection'),
       addHomework = $('#addHomework'),
       showNews = $('#showNews'),
       chooseColor = $('#color');

   studentButton.click(function () {
       $('#exampleModal_1').arcticmodal();
       $('#form_error').addClass('disabled');
   });

   lectionButton.click(function () {
       $('#exampleModal_2').arcticmodal();
       $('#form_LectionError').addClass('disabled');

   });

   addHomework.click(function () {
       $('#exampleModal_3').arcticmodal();
       $('#form_homeworkError').addClass('disabled');
   });

   showNews.click(function () {
      $('#exampleModal_4').arcticmodal();
   });

   chooseColor.colorpicker({
       fallbackColor: '#000000',
       fallbackFormat: 'hex'})
       .on('change', function (e) {
            color = e.target.value;
   });
}

function addDataToJSON(nameID,linkID,errorID,data){
    let inputName = document.getElementById(nameID).value,
        inputlink = document.getElementById(linkID).value,
        formError = document.getElementById(errorID),
        update;

    formError.classList.add("disabled");

    if (inputName=="" || inputlink=="") {
        formError.classList.remove('disabled');
    } else {
        let materialObj = new Material(inputName, inputlink);
        function Material() {
            if (nameID == 'lection_name') {
                this.type = "lection";
                this.name = inputName;
                this.link = inputlink;
                this.point = "0";
            } else if (nameID == 'student_name'){
                this.student = inputName;
                this.skype = inputlink;
                this.points = "0";
            } else {
                this.type = "homework";
                this.name = inputName;
                this.link = inputlink;
                this.point = "0";
            }
        }
        update = data;
        if (nameID == 'lection_name') {
            $('#exampleModal_2').arcticmodal('close');
            data.materials.push(materialObj);
        } else if (nameID == 'student_name'){
            $('#exampleModal_1').arcticmodal('close');
            data.students.push(materialObj);
        } else {
            $('#exampleModal_3').arcticmodal('close');
            data.materials.push(materialObj);
        }
        innerTemplate(update);
    }

    document.getElementById(nameID).value = "";
    document.getElementById(linkID).value = "";
    sumPoints(table);
    addColor();
}

function sendButtonListeners(data) {
    buttonSendStudent.addEventListener('click', function () {
        addDataToJSON('student_name', 'student_skype', 'form_error', data);
    });

    buttonSendLection.addEventListener('click', function () {
            addDataToJSON('lection_name', 'lection_link', 'form_LectionError', data)
        }
    );

    buttonSendHomework.addEventListener('click', function () {
        addDataToJSON('homework_name', 'homework_link', 'form_homeworkError', data);
    });
}

function sumPoints(table) {
        table.addEventListener('change', function (event) {
            let rowClass = event.target.className,
                startCount = rowClass.indexOf("_"),
                indexOfStudent = rowClass.substring(startCount),
                rowInputArray = document.getElementsByClassName(rowClass),
                points = 0;
            for (let i=0; i<rowInputArray.length; i++) {
                points += +rowInputArray[i].value;
            }

            if (rowClass !== "input_deadline") {
                document.getElementById('student' + indexOfStudent).innerHTML = points;
            }
            selectPlaces(sortStudentArr(studentArray()));
        });
}

function addColor() {
    let table = document.getElementById('table');
    table.addEventListener('click', function (e) {
        if (e.target.className == "sum" || e.target.className == "sum sortStudent") {
                e.target.style.background = color;
        }
    })
}

let studentArray = function () {
    let studentArr = [];
    for (let i = 0; i < sumPoint.length; i++) {
        studentArr.push(sumPoint[i]);
    }
    for (let i = 0; i < studentArr.length; i++) {
        document.getElementById(studentArr[i].id).classList.remove('sortStudent');
    }
    return studentArr;
};

// let studenrArray = createStudentArr();

let sortStudentArr = function (studentArr) {
    let sortArr = studentArr.sort(compareNumeric);
    return sortArr;
};

function compareNumeric(a, b) {
    return b.textContent - a.textContent;
}

function selectPlaces(sortStudentArr) {
    let countRepeat = 0,
        itemRepeat = 1,
        item;
    for (let i = 0; i <= 2; i++) {
        for (let j = i; j < sortStudentArr.length; j++) {
            if (+sortStudentArr[i].textContent == +sortStudentArr[j].textContent)
                countRepeat++;
            if (itemRepeat < countRepeat) {
                itemRepeat = countRepeat;
                item = sortStudentArr[i];
            }
        }
        if (itemRepeat > 2) {
            for (let b = 0; b <= 2; b++) {
                document.getElementById(sortStudentArr[b].id).classList.remove('sortStudent');
            }
        } else {
            for (let c = 0; c <= 2; c++) {
                document.getElementById(sortStudentArr[c].id).classList.add('sortStudent');
            }
        }
        countRepeat = 0;
    }
}




