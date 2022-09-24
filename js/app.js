let watch_games = "https://tecnoblog.net/responde/como-assistir-a-copa-do-mundo-2022-no-streaming-e-na-tv/";
let quant_jogos = 12;
let contar = 0;
let endpoint_principal = "dados.json";
let endpoint_atual = endpoint_principal;
let data_json;
let filter_game = "";
let content = document.getElementById("content");
let loadArea = document.getElementById("load-area");
let btLoad = document.getElementById("btLoadMore");
let catTitle = document.getElementById("catTitle");
let btInstall = document.getElementById("btInstall");
/*
AJAX Carregar Jogos
*/

function loadGames(){
    let ajax = new XMLHttpRequest();

    ajax.open("GET", endpoint_principal, true);
    ajax.send();
    ajax.onreadystatechange = function (){
    
        if(this.readyState == 4 && this.status == 200){
            data_json = JSON.parse(this.responseText);

            setTimeout(() => {
                loadArea.style.display = "block";
                printCard();

            }, 500);

        }
    }

}

loadGames();

/*
Imprimir Card
*/
function printCard(){    

    let html_content = "";
    content.innerHTML = html_content;

    if(data_json.length > 0){
        
        loadMore();

    }else{
        html_content = msg_alert("Nenhum jogo agendado!", "warning");
        content.append = html_content;
    }

}

function loadMore(){

    let temp_json =  filter_game === "" ? data_json : data_json.filter(d => filter_game.includes(d.genre));

    let html_content = "";
    let final = (contar+quant_jogos);

    if(final > temp_json.length){
        final = temp_json.length
        loadArea.style.display = "none";
    }

    for(let i = contar; i < final; i++ ){
        html_content+=card(temp_json[i]);
    }

    contar+=quant_jogos;
    content.innerHTML += html_content;
}


card = function ({homeTeam, awayTeam, utcDate, group, status}){

    let botao = navegacao == true ? `<div class="card-footer"><div class="d-grid gap-2"><a class="btn btn-info" target="_blank" href="${watch_games}">Onde assistir</a></div></div>` : "";

    let thumb_homeTeam = navegacao == true ? homeTeam.crest : "img/thumb.jpg";
    let thumb_awayTeam = navegacao == true ? awayTeam.crest : "img/thumb.jpg";

    let group_title = navegacao == true ? group.toString().replace("_", " ") : group;

    let game_title = navegacao == true ? `${homeTeam.name} x ${awayTeam.name}` : "NOT FOUND";

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date(utcDate);

    return `<div class="col-12 col-md-6 col-lg-4 d-flex align-items-stretch" >
            <div class="card">
                <div class="row row-cols-2">
                    <img src="${thumb_homeTeam}">
                    <img src="${thumb_awayTeam}">
                </div>
                <div class="card-body">
                    <span class="badge text-bg-danger">${group_title}</span>
                    <br/><br/>
                    <h5 class="card-title">${game_title}</h5>
                    <p><strong>Data: ${today.toLocaleDateString("pt-BR", options)}</strong></p>
                    <p><strong>Hora: ${today.getHours()}:00 </strong></p>
                </div>
                ${botao}
            </div>
        </div>`;
}

msg_alert = function (msg, tipo){
    return `<div class="col-12 col-md-6"><div class="alert alert-${tipo}" role="alert">${msg}</div></div>`;
}


/*
Botão de Instalação
*/

let windowInstall = null;

window.addEventListener('beforeinstallprompt', callInstallWindow);

function callInstallWindow(evt){
    windowInstall = evt;
}

let initInstall = function(){

    setTimeout(function(){
        if(windowInstall != null)
            btInstall.removeAttribute("hidden");
    }, 500);

    btInstall.addEventListener("click", function(){

        btInstall.setAttribute("hidden", true);

        windowInstall.prompt();
        
        windowInstall.userChoice.then((choice) => {

            if(choice.outcome === 'accepted'){
                console.log("Usuário instalou o app");
            }else{
                console.log("Usuário recusou instalação");
                btInstall.removeAttribute("hidden");
            }

        });

    });
}

/*
Status do Navegado
*/

let navegacao = true;

window.addEventListener("load", (event) => {
    navigator.onLine ? navegacao = true : navegacao = false;
});