const debugTodoList = document.querySelector('#todo-list')
const debugOngoingList = document.querySelector('#ongoing-list')
const debugDoneList = document.querySelector('#done-list')


const shadow = document.querySelector('.shadow')
const tabs = document.querySelectorAll('.tab')
tabs.forEach(tab => tab.addEventListener('click', indicator))

function indicator(e){
    shadow.style.left = e.target.offsetLeft +'px';
    shadow.style.top = e.target.offsetTop + 'px';
    shadow.style.width = e.target.offsetWidth + 'px';

    shadow.style.height = e.target.offsetHeight + 'px'; 
}

const addButton = document.querySelector('.add')
const input = document.querySelector('.input')
const todoList =[]
const ongoingList=[]
const doneList =[]




addButton.addEventListener('click', addToList)
input.addEventListener('keyup', function(e){
    if(e.key == 'Enter'){
        addToList()
    }
})

function addToList(){
    const inputValue = input.value.trim();    
    const item = {value: inputValue, status: 'ongoing' }
    // 중복값 못들어가게 
    const i = todoList.findIndex(todo => todo.value == inputValue);
    if( inputValue !=''){
        //빈문자열은 걸러내고
        if(i == -1){
            todoList.push(item)
            ongoingList.push({...item}) // 독립되게
            console.log(todoList)
            input.value =''
            renderTodoList()
            showDebug()
        }
    }
    //입력되는 순간 indicator가 '모두'탭을 가리키게 한다.
    // indicator는 해당탭을 클릭(event)로 작동하므로
    const allTab = document.querySelector('#all')
    allTab.click();
}

function showDebug(){
    debugTodoList.innerHTML=''
    debugOngoingList.innerHTML=''
    debugDoneList.innerHTML=''
    debugTodoList.innerHTML=`todoList : ${JSON.stringify(todoList)}`
    debugOngoingList.innerHTML=`ongoingList: ${JSON.stringify(ongoingList)}`
    debugDoneList.innerHTML =`doneList : ${JSON.stringify(doneList)}`
}

const todoUl = document.querySelector('.todo-list')

function renderTodoList(){
    todoUl.innerHTML ='';

    todoList.forEach( item => {
        const li = document.createElement('li')
        li.classList.add('todo')
        li.classList.add(item.status)
        li.setAttribute('data-key', item.value)
         //나중에 getAttribute('data-key')로 받는다.
        li.innerText = item.value

        const div = document.createElement('div')    
        const doneButton = document.createElement('button')
        doneButton.innerText = '완료'
        doneButton.addEventListener('click', doneTodo)
            
        const deleteButton = document.createElement('button')
        deleteButton.innerText='삭제'
        deleteButton.addEventListener('click', deleteTodo)

        div.appendChild(doneButton)
        div.appendChild(deleteButton)
        li.appendChild(div)
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between'
        li.style.background ='#b9d4c3'
        li.style.borderBottom = '1px solid gray'
    
        todoUl.appendChild(li)
    })
}

function doneTodo(){

}
function deleteTodo(){

}

