(function () {

  const storageData = {
    get: function (storageKey) {
      return localStorage.getItem(storageKey)
        ? JSON.parse(localStorage.getItem(storageKey))
        : [];
    },
    set: function (storageKey, value) {
      return localStorage.setItem(storageKey, JSON.stringify(value));
    }
  }

  function createAppTitle (title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm () {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append')
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    button.disabled = true;
    input.addEventListener("input", function () {
      button.disabled = !input.value ? true : false;
    })

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList () {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(name, done = false, id, storageKey) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    if (done === true) {
      item.classList.add('list-group-item-success');
    }

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    doneButton.addEventListener('click', function() {
      item.classList.toggle('list-group-item-success');
      let savedTodos = storageData.get(storageKey);
      let index = savedTodos.findIndex(function(todo) {
        return todo.id === id;
      });
      if (index !== -1) {
        let prevValue = savedTodos[index].done;
        savedTodos[index].done = !prevValue;
        storageData.set(storageKey, savedTodos);
      }
    });

    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены?')) {
        item.remove();
        let savedTodos = storageData.get(storageKey);
        let index = savedTodos.findIndex(function(todo) {
          return todo.id === id;
        });
        if (index !== -1) {
          savedTodos.splice(index, 1);
          storageData.set(storageKey, savedTodos);
        }
      }
    });

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function initSavedTodos(todoList, initialTodos, storageKey) {
    if (typeof initialTodos === 'object') {
      for (let i = 0; i < initialTodos.length; i++) {
        const {
          name,
          done
        } = initialTodos[i];

        let initialTodoItem = createTodoItem(name, done);
        todoList.append(initialTodoItem.item);
      }
    }

    let savedTodos = storageData.get(storageKey);
    if (typeof savedTodos === 'object') {
      for (let i = 0; i < savedTodos.length; i++) {
        const {
          name,
          done,
          id
        } = savedTodos[i];

        let savedTodoItem = createTodoItem(name, done, id, storageKey);
        todoList.append(savedTodoItem.item);
      }
    }
  }

  function createTodoApp(container, title = 'Список дел', storageKey, initialTodos) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    initSavedTodos(todoList, initialTodos, storageKey);

    todoItemForm.form.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!todoItemForm.input.value) {
        return;
      }

      const id = Math.round(Math.random() * 1000);

      let todoArray = storageData.get(storageKey);
      todoArray.push({
        name: todoItemForm.input.value,
        done: false,
        id
      });

      let todoItem = createTodoItem(todoItemForm.input.value, false, id, storageKey);

      todoList.append(todoItem.item);

      storageData.set(storageKey, todoArray);

      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;
    })

  }

  window.createTodoApp = createTodoApp;
})();
