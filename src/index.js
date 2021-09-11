'use strict';

import $ from 'jquery'
import './style.css';
import WeAreTheChampions from './Queen-We-Are-The-Champions.mp3';
const ProgressBar = require('progressbar.js');
const Fireworks = require('fireworks-canvas');


/**
 * Display the "question" view.
 * https://3dtransforms.desandro.com/perspective
 */ 
let questionView = () => {
    console.log("question view"+questionIdx);
    questionIdx++
    let main = $("[id='main']");
    main.empty();
    main.addClass('questionMainClass');
    main.removeClass('answerMainClass');
    main.removeClass('finalMainClass');
    let video = $('<video controls id="videoChanson"></video>');
    let videoSource = $('<source src="'+questionIdx+'_cut.mp4" type="video/mp4">');
    video.append(videoSource);
    main.append(video);
    let row = $('<div></div>');
    row.addClass('rowClass');
    main.append(row);
    let questionDiv = $('<div id="question"></div>');
    questionDiv.addClass('questionClass');
    row.append(questionDiv);
    let playersDiv = $('<div id="players"></div>');
    playersDiv.addClass('playersClass');

    main.append(playersDiv);
    
    questionDiv.html("<span style='font-weight:bold'>"+questions[questionIdx].label+"</span>");

    video.on("ended", 
        () => {
            questionDiv.html(
                "<span style='font-weight:bold'>"+questions[questionIdx].label+"</span><br>"
                +questions[questionIdx].debut+"<br>"
                +"<span style='font-style:italic;color:cyan'>"+questions[questionIdx].finA+"</span><br>"
                +"<span style='font-style:italic;color:white'>"+questions[questionIdx].finB+"</span>");

            players.forEach((player, name)=> {
                if (!player.div) {
                    player.div = $('<div id="'+name+'">'+name+'</div>');
                    player.div.addClass('playerClass');    
                } else {
                    player.div.removeClass('badAnswerPlayer');
                }
                playersDiv.append(player.div);
                player.div.removeClass('playerAnswered');
                player.answer=undefined;
            });               
        }
    );

    setTimeout(()=>{
        questionDiv.click(
            ()=>{
                answerView();        
            }
        );    
    },2000);
}

/**
 * Display the "answer" view.
 */ 
let answerView = () => {
    let main = $("[id='main']");
    main.empty();
    main.addClass('answerMainClass');
    main.removeClass('questionMainClass');
    main.removeClass('finalMainClass');

    let video = $('<video controls id="videoChanson"></video>');
    let videoSource = $('<source src="'+questionIdx+'_solution.mp4" type="video/mp4">');
    video.append(videoSource);
    main.append(video);

    let questionDiv = $('<div id="question"></div>');
    questionDiv.addClass('questionClass');
    questionDiv.html("<span style='font-weight:bold'>"+questions[questionIdx].label+"</span><br>"+questions[questionIdx].debut);
    main.append(questionDiv);

    let nextQuestionDiv = $('<div></div>');
    nextQuestionDiv.addClass('nextQuestionClass');
    main.append(nextQuestionDiv);

    let row = $('<div></div>');
    row.addClass('answerRowClass');
    main.append(row);

    let columnTrue = $('<div></div>');
    columnTrue.addClass('answerColumnClass');
    row.append(columnTrue);

    let headerTrue = $('<div></div>');
    headerTrue.addClass('answerHeader');
    headerTrue.html("<span style='font-style:italic;color:cyan'>"+questions[questionIdx].finA+"</span>");
    columnTrue.append(headerTrue);

    let trueSpacerDiv = $('<div></div>');
    trueSpacerDiv.addClass('answerPlayersSpacerClass');
    columnTrue.append(trueSpacerDiv);

    let trueDiv = $('<div id="true"></div>');
    trueDiv.addClass('answerPlayersClass');
    trueSpacerDiv.append(trueDiv);

    let columnSpacer = $('<div></div>');
    columnSpacer.addClass('spacerColumnClass');
    row.append(columnSpacer);

    let columnFalse = $('<div></div>');
    columnFalse.addClass('answerColumnClass');
    row.append(columnFalse);

    let headerFalse = $('<div></div>');
    headerFalse.addClass('answerHeader');
    headerFalse.html("<span style='font-style:italic;color:white'>"+questions[questionIdx].finB+"</span>");
    columnFalse.append(headerFalse);

    let falseSpacerDiv = $('<div></div>');
    falseSpacerDiv.addClass('answerPlayersSpacerClass');
    columnFalse.append(falseSpacerDiv);

    let falseDiv = $('<div id="false"></div>');
    falseDiv.addClass('answerPlayersClass');
    falseSpacerDiv.append(falseDiv);

    players.forEach((player, name)=> {
        if (player.answer == true) {
            trueDiv.append(player.div);
        } else if (player.answer == false) {
            falseDiv.append(player.div);
        }
    });

    let clicked1 = false;

    questionDiv.click(()=> {
        if (clicked1) return;
        clicked1 = true;

        displayAnswer(columnTrue,headerTrue,columnFalse,headerFalse,nextQuestionDiv);
    });
}

let displayAnswer = async (columnTrue,headerTrue,columnFalse,headerFalse,nextQuestionDiv) => {
 
    if (questions[questionIdx].answer == true) {
        columnTrue.addClass('goodAnswerBackground');
        headerFalse.addClass('badAnswerHeader');
    } else {
        columnFalse.addClass('goodAnswerBackground');
        headerTrue.addClass('badAnswerHeader');
    }

    if (questionIdx > 0) {
        let debugScores = '';
        players.forEach((player, name)=> {
            if (player.answer != questions[questionIdx].answer) {
                player.div.addClass('badAnswerPlayer');
            } else {
                player.score++;
            }
            debugScores += `['${name}',{score:${player.score}}],\n`
        });    
        console.log(debugScores);
    }

    setTimeout(() => {

        if (questionIdx+1>=questions.length) {
            nextQuestionDiv.text('Classement final...');
        } else if (questionIdx == 0) {
            nextQuestionDiv.text('Première question...');
        } else {
            nextQuestionDiv.text('Chanson suivante: n°'+(questionIdx+1)+'...');
        }
        
        let clicked2 = false;

        nextQuestionDiv.click(()=> {
            if (clicked2) return;
            clicked2 = true;

            if (questionIdx+1>=questions.length) {
                finalView();
            } else {
                questionView();
            }
        });
    },2000);  
};

/**
 * Display the "final" view.
 */ 
let finalView = () => {
    let sound = new Audio(WeAreTheChampions);
    sound.currentTime = 23.0;
    sound.play();
    

    let main = $("[id='main']");
    main.empty();
    main.removeClass('questionMainClass');
    main.removeClass('answerMainClass');
    main.addClass('finalMainClass');
    main.css('background-image','none');

    let subMain = $('<div></div>');
    subMain.addClass('subMainClass');
    main.append(subMain);

    let maxScore = 0;
    players.forEach((player, name)=> {
        maxScore = Math.max(maxScore, player.score);
        player.name = name;
    });

    let rank = 0;
    for (let i = maxScore; i >= 0; i--) {
        let playerFounds = [];
        players.forEach((player, name)=> {
            if (player.score == i) {
                playerFounds.push(player);
            }
        });

        if (playerFounds.length>0) {
            rank++;
            let rankDiv = $('<div></div>');
            rankDiv.addClass('finalRowClass');
            subMain.append(rankDiv);

            let headerRankDiv = $('<div></div>');
            headerRankDiv.addClass('headerRankClass');
            switch(rank) {
                case 1:
                    headerRankDiv.addClass('gold');
                    break;
                case 2:
                    headerRankDiv.addClass('silver');
                    break;
                case 3:
                    headerRankDiv.addClass('bronze');
                    break;
                default:
                    headerRankDiv.addClass('chocolate');
            }
            rankDiv.append(headerRankDiv);

            let rankSpan = $('<div></div>');
            rankSpan.addClass('rankPlayerClass');
            if (rank == 1) {
                rankSpan.text('1\u1d49\u02b3');
            } else {
                rankSpan.text(rank+'\u1d49');
            }
            headerRankDiv.append(rankSpan);

            let scoreSpan = $('<div></div>');
            scoreSpan.addClass('scorePlayerClass');
            scoreSpan.text(playerFounds[0].score);
            headerRankDiv.append(scoreSpan);

            let playersRankDiv = $('<div></div>');
            playersRankDiv.addClass('finalRowPlayersClass');
            rankDiv.append(playersRankDiv);


            for (let player of playerFounds) {
                player.div = $('<div></div>');
                player.div.addClass('finalPlayerClass');
                player.div.text(player.name);
                playersRankDiv.append(player.div);
            }

            if (playerFounds.length < 3) {
                for (let i=0; i<3-playerFounds.length; i++) {
                    let filler = $('<div></div>');
                    filler.addClass('finalPlayerClass');
                    playersRankDiv.append(filler);
                }
            }
        }
    }

    // see https://www.npmjs.com/package/fireworks-canvas
    const container = document.getElementById('main');
    const options = {
        maxRockets: 30,           // max # of rockets to spawn
        rocketSpawnInterval: 150, // millisends to check if new rockets should spawn
        numParticles: 100,        // number of particles to spawn when rocket explodes (+0-10)
        explosionMinHeight: 0.5,  // percentage. min height at which rockets can explode
        explosionMaxHeight: 1,    // percentage. max height before a particle is exploded
        explosionChance: 0.08     // chance in each tick the rocket will explode
    };
    const fireworks = new Fireworks(container, options);
    const stop = fireworks.start();
}

/**
 * Parse the scanned string.
 * @param {string} rawScan 
 */
let parseRawScan = (rawScan) => {
    let scan = {};
    let answer = rawScan.substring(0,1);
    scan.name = rawScan.substring(1);

    if (answer === '0') {
        scan.answer = false;
    } else {
        scan.answer = true;
    }

    return scan;
}

/**
 * Process the scanned response.
 * @param {Scan} scan 
 */
let processScan = (scan) => {
    let player = players.get(scan.name);
    player.div.addClass('playerAnswered');
    player.answer = scan.answer;
}

///////////////////////////////////////////////////////////////////////////////////

let questions= [
    {label:"", answer:true},
    {label:"Gregoire - Toi plus moi", debut:"Le froid la peur ne sont que ...", finA:"A-des mirages", finB:"B-des fromages", answer:true},
    {label:"Stephan Eicher - Déjeuner en paix", debut:"Plus rien ne la surprend sur ...", finA:"A-la vie des baleines", finB:"B-la nature humaine", answer:false},
    {label:"Claudio Capéo - Plus haut", debut:"Je ferai parti ...", finA:"A-des fonctionnaires", finB:"B-des volontaires", answer:false},
    {label:"Black M - Sur ma route", debut:"Sur ma route, j'avais pas ...", finA:"A-d'bagage en soute", finB:"B-d'ticket d'autoroute", answer:true},
    {label:"Julien Doré - Le lac", debut:"La rivière et l'or<br>Font ...", finA:"A-une belle rime", finB:"B-prendre racine", answer:false},
    {label:"Mika - Elle me dit", debut:"Va taper ...", finA:"A-un roupillon", finB:"B-dans un ballon", answer:false},
    {label:"Jean-Jacques Goldman - A nos actes manqués", debut:"A tous les murs que je n'aurais pas ...", finA:"A-pulvérisés", finB:"B-su briser", answer:false},
    {label:"Calogero - 1987", debut:"Sabrina et ...", finA:"A-7 sur 7", finB:"B-les vidéocasettes", answer:true},
    {label:"Louane - Avenir", debut:"Au fond ...", finA:"A-d'un tiroir", finB:"B-d'un couloir", answer:false},
    {label:"Stromae - Papaoutai", debut:"Un jour ou l'autre on sera ...", finA:"A-tous pas là", finB:"B-tous papas", answer:false},
    {label:"Patrick Bruel - Mon amant de Saint-Jean", debut:"Beau parleur chaque fois ...", finA:"A-qu'il mentait", finB:"B-qu'il partait", answer:true},
    {label:"Silvàn Areg - Allez leur dire", debut:"Mon père, ma tante et ...", finA:"A-ma belle-mère", finB:"B-ma grand-mère", answer:false},
    {label:"Angèle & Roméo Elvis - Tout oublier", debut:"Essaie d'oublier que tu es seul, vieux souvenir ...", finA:"A-comme un aïeul", finB:"B-comme l'ADSL", answer:false},
    {label:"Maître Gims - La même", debut:"Et tous ces sages ont fait des cases où tous ...", finA:"A-nous ranger", finB:"B-nous enfermer", answer:true},
    {label:"Christophe Maé - Dingue, dingue, dingue", debut:"Tu verras cette fois-ci ...", finA:"A-je rangerai", finB:"B-je changerai", answer:false},
    {label:"Helmut Fritz - Ca m'énerve", debut:"Moi j’arrive sur mon vespa on me dit ...", finA:"A-tu rentres pas", finB:"B-ne reste pas là", answer:true},
    {label:"Christophe Willem - Double je", debut:"En attendant ...", finA:"A-je suis tranquille", finB:"B-je me défile", answer:false},
    {label:"Indochine - L'aventurier", debut:"L'ennemi y est ...", finA:"A-démasqué", finB:"B-embusqué", answer:true},
    {label:"Joe Dassin - Siffler sur la colline", debut:"Que je voudrais être ...", finA:"A-une poire suspendue à un poirier", finB:"B-une pomme suspendue à un pommier", answer:false},
    {label:"Clara Luciani - La grenade", debut:"Mais qu'est-ce que ...", finA:"A-tu crois?", finB:"B-tu vois?", answer:true}
];
let questionIdx = 0;
let players = new Map([
    ['Zélie',{score:0}],
    ['Milo',{score:0}],
    ['Claude',{score:0}],
    ['Vanessa',{score:0}],
    ['Françoise',{score:0}],
    ['Claire',{score:0}],
    ['Steeve',{score:0}],
    ['Martin',{score:0}],
    ['Cécile',{score:0}]
]);
let countdown = undefined;


// Connect to the websocket of the server.
let socket = new WebSocket("ws://localhost:8080/socketserver");

// Message received from the server.
socket.onmessage = (event) => {
    let rawScan = event.data;
    
    let scan = parseRawScan(rawScan);
    processScan(scan);
    console.log('processed: '+rawScan);
}

let body = $('body');
let main = $('<div id="main"></div>');
body.append(main);
questionView();

