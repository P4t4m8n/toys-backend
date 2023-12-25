
//TodoEdit.jsx
<ul className="todo-edit-list">
{
    todosList.map((todo, idx) =>
        <li key={idx}>
            <label htmlFor={idx}>Todo {idx + 1}: </label>
            <input value={todo} onChange={handleChange}
                type="text" id={idx} name={idx}></input>
            <button onClick={removeInnerTodo}>Remove</button>

        </li>)
}
</ul >

function addInnerTodo(ev) {
    ev.preventDefault()
    userService.addActivity('add inner line in todo id: ' + params.todoId)
    setTodoToEdit((prevTodo) => ({ ...prevTodo, todosList: todosList.toSpliced(todosList.length, 1, 'Im a new Todo') }))
}

function removeInnerTodo({ target }) {
    let idx = target.name
    userService.addActivity('removed inner line in num' + idx + ' todo id: ' + params.todoId)
    setTodoToEdit((prevTodo) => ({ ...prevTodo, todosList: todosList.toSpliced(idx, 1) }))
}