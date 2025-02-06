let totalQuestions = 0;
let currentQuestion = 0;
let currentAnswer = 0;
let answers = {};
let maxTime = 0;
let currentTime = 0;
let pausTimer = false;

function updateTotalQuestions(questions){
    totalQuestions = questions;
    document.getElementById('total-questions').innerText = "Total Questions: "+totalQuestions;
}
async function innitiateTest() {
    const response = await fetch('test.json');
    const data = await response.json();
    document.title = data.name;
    document.getElementById('test-name').innerText = data.name;
    let i = 0;
    for (element in data.questions){
        i++;
    }
    totalQuestions = i;
    maxTime = parseInt(data.duration)*60
    updateTimeDisplay(maxTime)
    updateTotalQuestions(i);
}

function updateTimeDisplay(num){
    min=parseInt(num/60);
    sec=num%60;

    minText=""
    secText=""
    if(min<=9){
        minText = "0"+min;
    }else{
        minText = min;
    }
    if(sec<=9){
        secText = "0"+sec;
    }else{
        secText = sec;
    }
    document.getElementById('timer').innerHTML = minText+":"+secText;
}

function startTimer(){
    currentTime = maxTime;
    updateTime()
}


function resumeTimer(){
    pausTimer = false;
    console.log(currentTime)
    if (currentTime > 0){
        currentTime--;
        updateTimeDisplay(currentTime)
        setTimeout(updateTime, 1000);
    }else{
        SubmitTest()
    }
}
function updateTime(){
    if (pausTimer){
        return;
    }
    console.log(currentTime)
    if (currentTime > 0){
        currentTime--;
        updateTimeDisplay(currentTime)
        setTimeout(updateTime, 1000);
    }else{
        SubmitTest()
    }
}

function pause(){
    pausTimer = true;
}

function start(){
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('question-content').style.display = "flex";
    startTimer()
}

innitiateTest();

async function SubmitTest(){
    pausTimer = true;
    let marks = 0;
    let correctQuestion = 0;
    let attemptedQuestions = 0;
    document.getElementById('question-content').style.display = "none";
    document.getElementById('score-card').style.display = "block";
    const response = await fetch('test.json');
    const data = await response.json();

    document.getElementById('tquestion').innerHTML = totalQuestions;
    for (a in answers){
        if(answers[a] == 0){
            continue;
        }else if (parseInt(answers[a]) == parseInt(data.questions[a].answer)){
            marks += data.questions[a].correctMarks;
            correctQuestion++;
            attemptedQuestions++;
        }else{
            marks += data.questions[a].incorrectMarks;
            attemptedQuestions++;
        }
    }
    document.getElementById('aquestion').innerHTML = attemptedQuestions;
    document.getElementById('uquestion').innerHTML = totalQuestions - attemptedQuestions;
    document.getElementById('cquestion').innerHTML = correctQuestion;
    document.getElementById('iquestion').innerHTML = attemptedQuestions - correctQuestion;
    document.getElementById('score').innerHTML = marks;
}

async function setQuestion(qNumber){
    currentQuestion = qNumber;
    const response = await fetch('test.json');
    const data = await response.json();
    let question = data.questions[qNumber]
    currentAnswer = 0;
    if (answers[qNumber] != undefined){
        currentAnswer = answers[qNumber];
    }
    if (currentQuestion == totalQuestions){
        document.getElementById('next').innerHTML = "Submit";
    }else{
        document.getElementById('next').innerHTML = "Save and Next"
    }
    document.getElementById('question-number').innerText = "Question "+qNumber+" ["+question.correctMarks+"/"+question.incorrectMarks+"]";
    document.getElementById('question-display').innerHTML = question.question;
    let optionHTML = "";

    i = 0;
    for (opt in question.options){
        i++;
        n = i
        if(currentAnswer == i){
            optionHTML += "<input type='radio' onclick='setOption("+n+")' name='option' onClick= value='"+opt+"' checked='checked'> "+question.options[opt]+"<br>";
        }else{
            optionHTML += "<input type='radio' onclick='setOption("+n+")' name='option' onClick= value='"+opt+"'> "+question.options[opt]+"<br>";
        }
    }
    document.getElementById('answering-area').innerHTML = optionHTML;
    updateSideBar()
}

async function updateSideBar(){
    const response = await fetch('test.json');
    const data = await response.json();
    let sidebarHTML = "";
    let numOfQuestionsAttempted = 0;
    for (q in answers){
        if (answers[q] != undefined && answers[q] != 0){
            numOfQuestionsAttempted++;
        }
    }
    document.getElementById('attempted').innerText = "Attempted: "+numOfQuestionsAttempted;
    let i = 0;
    for (question in data.questions){
        i++;
        n = i
        if (currentQuestion == i) {
            sidebarHTML += "<button class='overview' type='selected'>Question "+i+"</button><br>"   
        } else if(answers[i] != undefined && answers[i] != 0){
            sidebarHTML += "<button class='overview'type='done' onclick='setQuestion("+i+")'>Question "+i+"</button><br>"

        }else {
            sidebarHTML += "<button class='overview' onclick='setQuestion("+i+")'>Question "+i+"</button><br>"   
        }
    }
    document.getElementById('questions-overview').innerHTML = sidebarHTML
    
}

function skip(){
    if (currentQuestion < totalQuestions){
        setQuestion(currentQuestion+1);
    }
}

function setOption(value){
    currentAnswer = value;
    console.log(currentAnswer+" selected");
}

function saveAndNext(){
    saveAnswer();
    if (currentQuestion < totalQuestions){
        setQuestion(currentQuestion+1);
    }else{
        console.log(answers);
        SubmitTest();
        updateSideBar();
    }
}

function saveAnswer(){
    answers[currentQuestion] = currentAnswer;
    console.log("Question "+currentQuestion+" answer saved as "+currentAnswer);
}

setQuestion(1)
