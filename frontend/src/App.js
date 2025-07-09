import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  function getUsers() {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => setUsers(data));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const user = { name, email, age };
    if (editId) {
      fetch(API_URL + '/' + editId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      }).then(() => {
        getUsers();
        clearForm();
      });
    } else {
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      }).then(() => {
        getUsers();
        clearForm();
      });
    }
  }

  function handleEdit(user) {
    setName(user.name);
    setEmail(user.email);
    setAge(user.age);
    setEditId(user.id);
  }

  function handleDelete(id) {
    fetch(API_URL + '/' + id, { method: 'DELETE' })
      .then(() => getUsers());
  }

  function clearForm() {
    setName('');
    setEmail('');
    setAge('');
    setEditId(null);
  }

  return (
    <div>
      <h2>Usuários</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Idade"
          value={age}
          onChange={e => setAge(e.target.value)}
          required
          type="number"
        />
        <button type="submit">{editId ? 'Atualizar' : 'Adicionar'}</button>
        {editId && <button type="button" onClick={clearForm}>Cancelar</button>}
      </form>
      <table border="1">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.age}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Editar</button>
                <button onClick={() => handleDelete(user.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
