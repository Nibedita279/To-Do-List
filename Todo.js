document.addEventListener('DOMContentLoaded', () => {
  const todoList = document.getElementById('todo-list');
  const newItemInput = document.getElementById('new-item');
  const addItemButton = document.getElementById('add-item');
  const searchBar = document.getElementById('search-bar');

  let items = JSON.parse(localStorage.getItem('todo-items')) || [];

  function saveItems() {
      localStorage.setItem('todo-items', JSON.stringify(items));
  }

  function renderItems(filter = '') {
      todoList.innerHTML = '';
      items.filter(item => item.text.toLowerCase().includes(filter.toLowerCase())).forEach((item, index) => {
          const li = document.createElement('li');
          li.draggable = true;
          li.dataset.index = index;

          const itemText = document.createElement('span');
          itemText.className = 'item-text';
          itemText.textContent = item.text;
          if (item.done) {
              li.classList.add('done');
          }
          
          const editInput = document.createElement('input');
          editInput.className = 'edit-input';
          editInput.type = 'text';
          editInput.value = item.text;

          const actions = document.createElement('div');
          actions.className = 'actions';

          const doneButton = document.createElement('input');
          doneButton.type = 'checkbox';
          doneButton.checked = item.done;
          doneButton.addEventListener('change', () => {
              item.done = !item.done;
              saveItems();
              renderItems(searchBar.value);
          });

          const editButton = document.createElement('button');
          editButton.innerHTML = 'Edit';
          editButton.addEventListener('click', () => {
              li.classList.toggle('editing');
              if (!li.classList.contains('editing')) {
                  item.text = editInput.value;
                  saveItems();
                  renderItems(searchBar.value);
              }
          });

          const deleteButton = document.createElement('button');
          deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M3 6h18v2H3zm2 4h14v12H5zm7-9c.551 0 1 .448 1 1H8c0-.552.449-1 1-1h2zM5 4h14v2H5z"/></svg>';
          deleteButton.addEventListener('click', () => {
              items.splice(index, 1);
              saveItems();
              renderItems(searchBar.value);
          });

          const upButton = document.createElement('button');
          upButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M12 2l-7 9h5v7h4v-7h5z"/></svg>';
          upButton.addEventListener('click', () => {
              if (index > 0) {
                  [items[index - 1], items[index]] = [items[index], items[index - 1]];
                  saveItems();
                  renderItems(searchBar.value);
              }
          });

          const downButton = document.createElement('button');
          downButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M12 22l7-9h-5v-7h-4v7h-5z"/></svg>';
          downButton.addEventListener('click', () => {
              if (index < items.length - 1) {
                  [items[index + 1], items[index]] = [items[index], items[index + 1]];
                  saveItems();
                  renderItems(searchBar.value);
              }
          });

          actions.append(doneButton, editButton, deleteButton, upButton, downButton);
          li.append(editInput, itemText, actions);
          todoList.appendChild(li);

          li.addEventListener('dragstart', (e) => {
              li.classList.add('dragging');
              e.dataTransfer.setData('text/plain', index);
          });

          li.addEventListener('dragend', () => {
              li.classList.remove('dragging');
          });

          li.addEventListener('dragover', (e) => {
              e.preventDefault();
          });

          li.addEventListener('drop', (e) => {
              e.preventDefault();
              const draggedIndex = e.dataTransfer.getData('text/plain');
              const targetIndex = li.dataset.index;

              if (draggedIndex !== targetIndex) {
                  [items[draggedIndex], items[targetIndex]] = [items[targetIndex], items[draggedIndex]];
                  saveItems();
                  renderItems(searchBar.value);
              }
          });
      });
  }

  addItemButton.addEventListener('click', () => {
      const text = newItemInput.value.trim();
      if (text) {
          items.push({ text, done: false });
          saveItems();
          renderItems(searchBar.value);
          newItemInput.value = '';
      }
  });

  searchBar.addEventListener('input', () => {
      renderItems(searchBar.value);
  });

  renderItems();
});