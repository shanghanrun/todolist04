const debugTodoList = document.querySelector('#todo-list')
const debugOngoingList = document.querySelector('#ongoing-list')
const debugDoneList = document.querySelector('#done-list')

const shadow = document.querySelector('.shadow')
const tabs = document.querySelectorAll('.tab')
tabs.forEach(tab => tab.addEventListener('click', indicator))
tabs.forEach(tab => tab.addEventListener('click', render))

const todoClass = document.querySelector('.todos')
function indicator(e){
    shadow.style.borderTopRightRadius = '10px';

    shadow.style.left = e.target.offsetLeft +'px';
    shadow.style.top = e.target.offsetTop + 'px';
    shadow.style.width = e.target.offsetWidth + 'px';

    shadow.style.height = e.target.offsetHeight + 'px'; 

    
    if(e.target.id == 'all'){
        shadow.style.background ='rgb(77, 89, 251, 0.8)'
        todoClass.style.background ='rgb(77, 89, 251, 0.8)';
    } else if(e.target.id == 'ongoing'){
        shadow.style.background ='#91f6b6'
        todoClass.style.background ='#91f6b6';
    } else if(e.target.id =='done'){
        shadow.style.background ='rgba(139, 189, 199, 0.8)'
        todoClass.style.background ='rgba(139, 189, 199, 0.8)';
    }
    todoClass.style.borderTop = '0.1px dotted lightgray';
    
}

const addButton = document.querySelector('.add')
const input = document.querySelector('.input')
let todoList =[]
let ongoingList=[]
let doneList =[]




addButton.addEventListener('click', addToList)
input.addEventListener('keyup', function(e){
    if(e.key == 'Enter'){
        addToList()
    }
})

function addToList(){
    const inputValue = input.value.trim();
    console.log('inputValue ', inputValue)    
    const item = {value: inputValue, isCompleted: false }
    // 중복값 못들어가게 
    const i = todoList.findIndex(todo => todo.value == inputValue);
    if( inputValue !=''){
        //빈문자열은 걸러내고,
        // 이미 들어 있지 않은 일만 추가
        if(i == -1){
            todoList.push(item)
            ongoingList.push({...item}) // 독립되게
            console.log(todoList)
            input.value =''
            renderTodoList()
            
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



function renderTodoList(){
    const todoUl = document.querySelector('.todo-list')
    todoUl.innerHTML ='';

    todoList.forEach( item => {
        let startX;
        let isDragging = false;
        let deletingItem = {...item}

        const li = document.createElement('li')
        const span = document.createElement('span') 
        li.classList.add('todo')
        
        li.setAttribute('data-key', item.value)
         //나중에 getAttribute('data-key')로 받는다.
         // 혹은 li.key?
        span.innerText = item.value
        span.style.padding = '10px';
        span.style.lineHeight = 'normal';
        span.style.verticalAlign= 'middle';
        span.style.paddingTop = '16px';
        span.style.paddingBottom = '4px';

        const div = document.createElement('div')   

        const editButton = document.createElement('button')
        editButton.innerHTML ='🖊'
        editButton.addEventListener('click', editTodo)
        editButton.style.padding = '10px';
        editButton.style.margin = '10px';

        const doneButton = document.createElement('button')
        doneButton.innerHTML = '✔'
        doneButton.addEventListener('click', checkTodo)
        doneButton.style.padding ='10px';
        doneButton.style.margin = '10px';    

        const deleteButton = document.createElement('button')
        deleteButton.innerHTML= '❌'
        deleteButton.addEventListener('click', deleteTodo)
        deleteButton.style.padding = '10px';
        deleteButton.style.marginLeft ='10px';


        div.appendChild(editButton)
        div.appendChild(doneButton)
        div.appendChild(deleteButton)

        li.appendChild(span)
        li.appendChild(div)
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between'
        li.style.borderBottom = '1px solid gray';
        li.style.margin = '10px';
        li.style.padding = '10px';

        li.style.borderTopLeftRadius = '5px';
        li.style.width = '220px';
        li.style.height = '150px';

        if (!item.isCompleted){
            li.style.background ='#91f6b6'
            li.style.color = 'black'
        } else{
            li.style.background ='rgba(139, 189, 199, 0.8)'
            li.style.color = 'gray'
        } 
        
        //li 마우스드래그(좌측)로 삭제이벤트
        li.addEventListener('mousedown', function(e){
            //왼쪽버튼 e.button ===0
            if(e.button ==0 && e.target.tagName !=='BUTTON'){
                console.log('clicked')
                startX = e.clientX;
                isDragging = true;
                li.classList.add('dragging')
            }
        })
        li.addEventListener('mouseup', function(e){
            if(isDragging){
                li.classList.remove('dragging')
                isDragging =false
            }            
        })
        li.addEventListener('mousemove', function(e){
            if(isDragging){ 
                const currentX = e.clientX;
                deltaX = currentX - startX;
                console.log('deltaX', deltaX)

                if (deltaX <-40 || deltaX >40){
                    console.log('deltaX :', deltaX)
                    deleteLiItem(deletingItem)
                    isDragging = false;
                }
            }
        })
        
        todoUl.appendChild(li)
    })
    
    todoUl.style.display = 'flex';
    todoUl.style.flexWrap ='wrap';

    showDebug()
}

function deleteLiItem(deletingItem){
    todoList = todoList.filter(item => item.value != deletingItem.value)
    ongoingList = ongoingList.filter(item => item.value != deletingItem.value)
    doneList = doneList.filter(item => item.value != deletingItem.value)
    
    renderTodoList()
}

function editTodo(e){
    const button = e.target;
    const div = button.parentNode;
    const li = div.parentNode;
    const span = li.firstChild
    const value = span.textContent;
    const itemIndex = todoList.findIndex( item => item.value == value)

    let newValue = prompt(`기존 할일은 "${value}"입니다.\n새로운 일을 입력하세요.`)
    // 사용자가 값을 입력하지 않거나 취소를 누른 경우 처리
    newValue = newValue.trim()
    if (newValue == null || newValue == '') {
        // 입력이 취소되었거나 공백 문자열이면 아무것도 하지 않음
        alert('입력문자가 없습니다.')
        return;
    }
    // 이미 있는 할일과 동일한 할일이 입력된 경우
    let i = todoList.findIndex(item => item.value == newValue)
    if( i != -1){
        alert(`이미 있는 할 일(${newValue})이 입력되었습니다`)
        return;
    }

    todoList[itemIndex] = {...todoList[itemIndex], value:newValue}

    i = ongoingList.findIndex(item => item.value == value)
    if(i !=-1){
        ongoingList[i] = {...ongoingList[i], value:newValue}
    }
    i = doneList.findIndex(item => item.value == value)
    if(i != -1){
        doneList[i] = {...doneList[i], value: newValue}
    }
    renderTodoList()
}

function checkTodo(event){
    const button = event.target;
    const div = button.parentNode;
    const li = div.parentNode;
    const span = li.firstChild
    const value = span.textContent;
    // const key = li.getAttribute('data-key')
    const key = li.dataset.key
    console.log('value: ', value)
    console.log('key :', key)
    const itemIndex = todoList.findIndex( item => item.value == value)
    const item = todoList.find(item => item.value == value)
    // item은 단순 값이 아니라 객체라서 todoList와 연결되어 참조하고 있다.
    // 그래서 item의 변화는 todoList의 객체값에 영향을 미치니 조심해서 사용해야 된다.

    console.log('itemIndex: ',itemIndex)
    console.log(todoList[itemIndex])
    console.log('todoList 이전:', todoList)
    // item을 사용하지 않고, todoList[itemIndex]를 사용해야 todoList가 변화된다.
    
    // item.isCompleted = !item.isCompleted
    todoList[itemIndex].isCompleted = !(todoList[itemIndex].isCompleted);
    console.log('todoList 이후 :', todoList)

    // todoList[itemIndex]가 객체라서 함부로 갖다쓰면, 서로 연결된다.
    const newItem = {...todoList[itemIndex]} //독립 객체값으로 만듬

    // ongoingList에서 해당 item을 삭제한다.
    if(todoList[itemIndex].isCompleted){
        ongoingList = ongoingList.filter(item => item.value != value)
    } else{
        // 오히려 추가한다.
        ongoingList = [...ongoingList, newItem]
    }

    // doneList에 해당 item을 추가한다.
    if(todoList[itemIndex].isCompleted){
        // 그런데, 이미 추가된 것은 다시 추가되지 않도록 한다.
        const i = doneList.findIndex( item => item.value ==value)
        if (i == -1){
            // 해당 아이템에 없을 경우에 추가한다.
            doneList = [...doneList, newItem]
            console.log('doneList :', doneList)       
        }
    } else{
        doneList = doneList.filter(item => item.value !=value)
    }

    // renderTodoList();
    // 바로 다시 랜더하면 화면이 지워진다.
    //그리고 사실 다시 랜더할 필요없이, 아래 사항만 바뀌면 된다.
    if (!todoList[itemIndex].isCompleted){
            li.style.background ='#91f6b6'
            li.style.color = 'black'
        } else{
            li.style.background ='rgba(139, 189, 199, 0.8)'
            li.style.color = 'gray'
        }    

    showDebug()

}


function deleteTodo(event){

    const button = event.target;
    const div = button.parentNode;
    const li = div.parentNode;
    const span = li.firstChild
    const value = span.textContent;
    const key = li.getAttribute('data-key')
    
    ongoingList = ongoingList.filter(item => item.value != value)
    doneList = doneList.filter(item => item.value != value)
    todoList = todoList.filter(item => item.value != value)

    renderTodoList();
    showDebug()

}

function render(event){
    const tab = event.target
    if (tab.id =='all'){
        renderTodoList()
    } else if (tab.id =='ongoing'){
        renderOtherList('ongoing')
    } else if(tab.id == 'done'){
        renderOtherList('done')
    }
}


function renderOtherList(type){
    let list =[]
    if (type == 'ongoing'){
        list = [...ongoingList]
    }
    if (type =='done'){
        list = [...doneList]
    }
    const todoUl = document.querySelector('.todo-list')
    todoUl.innerHTML ='';

    list.forEach( item => {
        const li = document.createElement('li')
        const span = document.createElement('span') 
        span.innerText = item.value
        span.style.padding = '10px';

        li.appendChild(span)
        li.style.margin = '10px';
        li.style.padding = '10px';
        li.style.borderBottom = '1px solid gray'

        // if (item.status == 'ongoing'){
        //     li.style.background ='#b9d4c3'
        //     li.style.color = 'black'
        // } else{
        //     li.style.background ='lightgray'
        //     li.style.color = 'gray'
        // }        
    
        todoUl.appendChild(li)
        
    })

    showDebug()
}

