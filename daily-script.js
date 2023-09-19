// window.open('https://cfo.visualstudio.com/JBFO/_queries/query/369361e2-be4e-4f30-8a8c-6ed8e975b7d6/');
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

var toDoScript = (task) => `Posso dar sequência com a tarefa ${task.tasNumber} [${task.description}].\n link: ${task.link}`;
var inProgressScript = (task) => `Dei início no desenvolvimento da tarefa ${task.tasNumber} [${task.description}]. Está em progresso.\n link: ${task.link}`;
var inReviewScript = (task) => `Finalizei o desenvolvimento da tarefa ${task.tasNumber} [${task.description}]. Está em review.\n link: ${task.link}`;
var doneScript = (task) => `Ontem entreguei a tarefa ${task.tasNumber} [${task.description}]. Está em done.\n link: ${task.link}`;

var DONE = 'Done';
var IN_REVIEW = 'In Review';
var IN_PROGRESS = 'In Progress';
var TO_DO = 'To Do';

var statusOrder = {
    [DONE]: 1,
    [IN_REVIEW]: 2,
    [IN_PROGRESS]: 3,
    [TO_DO]: 4,
};

var statusToFuncionMap = {
    [TO_DO]: toDoScript,
    [IN_PROGRESS]: inProgressScript,
    [IN_REVIEW]: inReviewScript,
    [DONE]: doneScript,
};

var nodelist = document.querySelectorAll('.grid-row');
var list = Array.from(nodelist);

var tasklist = list
    .map((row) => {
        var tasNumber = row.querySelector('.grid-cell').innerHTML;
        var taskDetails = row.querySelector('.grid-cell-contents-container a');
        var description = taskDetails.innerHTML;
        var link = taskDetails.href;
        var status = row.querySelector('.workitem-state-value').innerHTML;

        return { description, link, tasNumber, status };
    })
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

var impediments = {
    [TO_DO]: 'Estou sem tarefas assignadas a mim para prosseguir.',
};

var getImpediments = () => {
    var haveToDoImpediments = !tasklist.map((task) => task.status).includes(TO_DO);
    return haveToDoImpediments ? `Impedimentos:\n\n- ${impediments[TO_DO]}` : '';
};

var getObservations = () => {
    var observations = prompt('Observações para a daily de hoje:');
    return observations?.length ? `\n\n---\n\nObservações:\n\n- ${observations}` : '';
};

var dateOptions = { day: '2-digit', month: '2-digit', year: '2-digit' };

var filename = `${new Date().toLocaleDateString('pt-BR', dateOptions).replaceAll('/', '-')}.txt`;

var data = `Tarefas:\n\n${tasklist.map((task) => `- ${statusToFuncionMap[task.status](task)}\n\n`).join('')}${getImpediments()}${getObservations()}`;

navigator.clipboard.writeText(data);
saveFile(data, filename);

console.log('---');
console.log(filename);
console.log(data);
