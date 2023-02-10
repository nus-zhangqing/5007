// Some code snippets have been provided to you for ease of coding.
// You can choose to remove or change any of them to suit your needs.
const TAB_TYPES = {
    ALL: 'Selected',
    PROCESS: 'Process',
    COMPLETE: 'Completed'
}
var outstandingtasks=[];
var finishedtasks=[];
var allTasks = []
var maxtaskid=0;

var modifyTaskIndex = 0
var activeTab = TAB_TYPES.ALL

const DIALOG_TYPES = {
    ADD: 'add',
    ALERT: 'alert',
    MODIFY: 'modify'
}
window.onload = function() {
    bootstrap()
}

function getTasks(tab = activeTab) {
    if (tab === TAB_TYPES.PROCESS) {
        return allTasks.filter(task => {
            return task.status === 'In Progress'
        })
    } else if (tab === TAB_TYPES.COMPLETE) {
        return allTasks.filter(task => {
            return task.status === 'Completed'
        })
    }
    return allTasks
}
function bootstrap()
{
    // Code for Q7 starts here. This code restores the values
    // of variables to their previous values (i.e., before browser
    // was closed). 

    // Code for Q7 ends here.
    try {
        allTasks = JSON.parse(localStorage.getItem('tasks')) || []
    } catch(e) {

    }
    displayfunction()
    document.querySelector('#category #add').addEventListener('click', () => {
        showDialog(DIALOG_TYPES.ADD)
    })
    document.querySelector('#modify-dialog #confirm').addEventListener('click', () => {
        finishfunction()
        removeClass(document.querySelector('#modify-dialog'), 'show')
    })
    document.querySelector('#modify-dialog #cancel').addEventListener('click', () => {
        removeClass(document.querySelector('#modify-dialog'), 'show')
    })
    document.querySelector('#add-dialog #confirm').addEventListener('click', () => {
        addfunction()
        removeClass(document.querySelector('#add-dialog'), 'show')
    })
    document.querySelector('#add-dialog #cancel').addEventListener('click', () => {
        removeClass(document.querySelector('#add-dialog'), 'show')
    })
    document.querySelector('#alert-dialog').addEventListener('click', (e) => {
        const dialogBody = document.querySelector('#alert-dialog-body')
        if (!dialogBody.contains(e.target)) {
            removeClass(document.querySelector('#alert-dialog'), 'show')
        }
    })
    document.querySelector('#task_table').addEventListener('click', e => {
        if (e.target.getAttribute('data-tag') === 'status' && !e.target.classList.contains('completed')) {
            modifyTaskIndex = +e.target.getAttribute('data-index')
            showDialog(DIALOG_TYPES.MODIFY)
        }
    })
    document.querySelector('#category').addEventListener('click', (e) => {
        const currentTab = e.target.getAttribute('data-id')
        if (currentTab && currentTab !== activeTab) {
            activeTab = currentTab
            removeClass(document.querySelector('.item-selected'), 'item-selected')
            addClass(e.target, 'item-selected')
            displayfunction()
        }
    })
    document.querySelector('#task-year').addEventListener('change', renderDays)
    document.querySelector('#task-month').addEventListener('change', renderDays)
}

function renderDays() {
    const year = document.querySelector('#task-year').value
    const month = document.querySelector('#task-month').value
    const day = new Date(year, month, 0)
    document.querySelector('#task-day').innerHTML = new Array(day.getDate()).fill(0).reduce((acc, _, index) => {
        acc += `<option>${index + 1}</option>`
        return acc
    }, '')
}
function addfunction()
{
    // Code for Q2 starts here. This function uses DOM read
    // to get the values of HTML fields. Subsequently, it
    // adds them to the JS variable called outstandingtasks. 
    // You are also required to save the contents of this variable
    // in a JS cookie (Q7). 

    const description = document.querySelector('#add_modal input[name="description"]').value
    const priority = document.querySelector('#add_modal #task-priority').value
    const create_time = Date.now()
    const year = document.querySelector('#task-year').value
    const month = document.querySelector('#task-month').value
    const day = document.querySelector('#task-day').value
    const end_time = new Date(year, month, day).getTime()

    if (end_time <= Date.now()) {
        document.querySelector('#alert-content').innerHTML = 'Deadline should be after today'
        addClass(document.querySelector('#alert-dialog'), 'show')
    } else if (description === '') {
        document.querySelector('#alert-content').innerHTML = 'The description cannot be empty'
        addClass(document.querySelector('#alert-dialog'), 'show')
    } else {
        allTasks.unshift({description,priority, create_time, end_time, status: 'In Progress' })
        storeTasks()
        displayfunction()
    }
   

    //Code for Q2 ends here.
}

function finishfunction()
{
    // Code for Q3 starts here. This function uses DOM read to
    // get the serial number from the user. Subsequently, it
    // searches/finds the Task matching the serial number and
    // deletes the task from outstandingtasks. Do not forget to
    // add the task to finished tasks before deleting it.
    if (modifyTaskIndex > 0) {
        const task = allTasks[modifyTaskIndex - 1]
        task.status = 'Completed'
        storeTasks()
        displayfunction()
    }

    
    // Code for Q3 ends.
}

function displayfunction()
{
    // Code for Q4 starts here. This function identifies the HTML
    // element corresponding to the Tables for outstanding 
    // and finished tasks. You must create the table by adding rows,
    // columns, and finally populate the text in the table. Code
    // for Outstanding tasks and finished tasks is similar. Use
    // the Demo code used in class as a starting point for table
    // creation using JS.
    const tasks = getTasks()
    const innerTable = tasks.reduce((acc, task, index) => {
        const { description, priority, create_time, end_time, status } = task
        let className = 'completed'
        if (status === 'In Progress') {
            className = 'progress'
        } else if (status === 'Timed Out') {
            className = 'timeout'
        }
        acc += `
        <tr>
            <td>${index + 1}</td>
            <td>${description}</td>
            <td>${priority}</td>
            <td>${formatTime(create_time)}</td>
            <td>${getDuration(create_time, end_time)} Days</td>
            <td>
                <p class=${className} data-tag="status" data-index=${index + 1}>${status}</p>
            </td>
            <td>${formatTime(end_time)}</td>
        </tr>
        `
        return acc
    }, '')

    document.querySelector('#task_table table>tbody').innerHTML = innerTable
    // Code for Q4 ends.
    const completedTasks = getTasks(TAB_TYPES.COMPLETE)
    document.querySelector('#all-tasks').innerHTML = allTasks.length
    document.querySelector('#completed-tasks').innerHTML = completedTasks.length
    document.querySelector('#process-tasks').innerHTML = getTasks(TAB_TYPES.PROCESS).length
    document.querySelector('#task-rate').innerHTML = `${allTasks.length > 0 ? Math.floor(completedTasks.length / allTasks.length * 100) : '0'}%`
}

function storeTasks() {
    localStorage.setItem('tasks', JSON.stringify(allTasks))
}

function showDialog(type) {
    if (type === DIALOG_TYPES.ADD) {
        addClass(document.querySelector('#add-dialog'), 'show')
    } else if (type === DIALOG_TYPES.ALERT) {
        addClass(document.querySelector('#alert-dialog'), 'show')
    } else if (type === DIALOG_TYPES.MODIFY) {
        addClass(document.querySelector('#modify-dialog'), 'show')
    }
}

function addClass(dom, className) {
    if (dom && !dom.classList.contains(className)) {
        dom.classList.add(className)
    }
}

function removeClass(dom, className) {
    if (dom) {
        dom.classList.remove(className)
    }
}

function formatTime(timeStamp) {
    const d = new Date(timeStamp)
    const year = d.getFullYear()
    const month = d.getMonth()
    const day = d.getDate()
    return `${year}-${String(month).length === 1 ? 0 : ''}${month}-${String(day).length === 1 ? 0 : ''}${day}`
}

function getDuration(startTime, endTime) {
    const oneDay = 24 * 60 * 60 * 1000
    return Math.max(0, Math.ceil((endTime - startTime)/ oneDay))
}
