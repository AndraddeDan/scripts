// window.open('https://cfo.visualstudio.com/JBFO/_queries/query/e6bf2fe3-dad8-4bc9-901e-7d3526fc6861/');
javascript:
function saveFile(data, filename) {

    if (!data) {
        alert('Console.save: No data');
        return;
    }

    if (!filename) filename = 'console.json';

    if (typeof data === "object") {
        data = JSON.stringify(data, undefined, 4);
    }

    var blob = new Blob([data], { type: 'text/json' });
    var e = document.createEvent('MouseEvents');
    var a = document.createElement('a');

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
}

function getDayOfWeek(date, weekDay) {
    date = new Date(date);
    var day = date.getDay();
    var diff = date.getDate() - day + (day == 0 ? -6 : weekDay);
    return new Date(date.setDate(diff));
}

var weekMonday = getDayOfWeek(new Date(), 1).toLocaleDateString('pt-BR');
var weekFriday = getDayOfWeek(new Date(), 5).toLocaleDateString('pt-BR');

var text = `Olá,\nEstou junto à equipe do extrato que está atuando na elaboração do novo relatório. Segue uma descrição das tarefas realizadas na última semana (${weekMonday} – ${weekFriday}):`;
var greetings = 'Att, Daniel N. F. Andrade';

var nodelist = document.querySelectorAll('.grid-row');
var list = Array.from(nodelist);

var tasklist = list.map((row) => {
    var tasNumber = row.querySelector('.grid-cell').innerHTML;
    var taskDetails = row.querySelector('.grid-cell-contents-container a');
    var description = taskDetails.innerHTML;
    var link = taskDetails.href;

    return { description, link, tasNumber };
});

var filename = `Reporte de atividades semanais - [${new Date().toLocaleDateString('pt-BR').replaceAll('/', '-')}].txt`;

var data = `${text}\n\n${tasklist.map((task) => `- ${task.tasNumber} ${task.description}\n(${task.link})\n\n`).join('')}\n${greetings}`;

saveFile(data, filename);
