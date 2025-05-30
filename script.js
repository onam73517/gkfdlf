// DOM 요소 선택
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const clearAllBtn = document.getElementById('clear-all');

// 로컬 스토리지에서 할 일 목록 가져오기
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// 할 일 저장 함수
function saveTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        checked: false,
        starred: false
    };

    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
    
    // 입력 필드 초기화
    todoInput.value = '';
    
    // 할 일 목록 업데이트
    displayTodos();
}

// 할 일 삭제 함수
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(todos));
    displayTodos();
}

// 할 일 체크 토글 함수
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, checked: !todo.checked };
        }
        return todo;
    });
    localStorage.setItem('todos', JSON.stringify(todos));
    displayTodos();
}

// 할 일 별표 토글 함수
function toggleStar(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, starred: !todo.starred };
        }
        return todo;
    });
    localStorage.setItem('todos', JSON.stringify(todos));
    displayTodos();
}

// 모든 할 일 삭제 함수
function clearAll() {
    todos = [];
    localStorage.setItem('todos', JSON.stringify(todos));
    displayTodos();
}

// 할 일 목록 표시 함수
function displayTodos() {
    todoList.innerHTML = '';
    
    // 별표된 항목을 먼저 정렬
    const sortedTodos = [...todos].sort((a, b) => {
        if (a.starred === b.starred) return 0;
        return a.starred ? -1 : 1;
    });

    sortedTodos.forEach(todo => {
        const todoElement = document.createElement('div');
        todoElement.className = `todo-item ${todo.checked ? 'checked' : ''}`;
        todoElement.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.checked ? 'checked' : ''}>
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn">
                <span class="material-icons">delete</span>
            </button>
            <button class="star-btn ${todo.starred ? 'active' : ''}">
                <span class="material-icons">${todo.starred ? 'star' : 'star_outline'}</span>
            </button>
        `;

        // 체크박스 이벤트 리스너
        const checkbox = todoElement.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', () => toggleTodo(todo.id));

        // 삭제 버튼 이벤트 리스너
        const deleteButton = todoElement.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => deleteTodo(todo.id));

        // 별표 버튼 이벤트 리스너
        const starButton = todoElement.querySelector('.star-btn');
        starButton.addEventListener('click', () => toggleStar(todo.id));

        todoList.appendChild(todoElement);
    });
}

// 이벤트 리스너
addBtn.addEventListener('click', saveTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        saveTodo();
    }
});
clearAllBtn.addEventListener('click', clearAll);

// 페이지 로드 시 저장된 할 일 표시
displayTodos(); 