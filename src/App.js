import Logo from './DANElogo.png'
import './App.css';
import { useState } from 'react';
import PouchDB from 'pouchdb';


const db = new PouchDB('DANE');

const getData = async () => {
  const data = await db.allDocs({ include_docs: true });
  return data.rows.map((row) => row.doc);
};

const addData = async ( data) => {
  const response = await db.post(data);
  return response;
};

const syncData = async () => {
  const remoteDB = new PouchDB('http://admin:1234@24.199.96.241:5984/danemamadisima');
  await db.sync(remoteDB, {
    live: false,
    retry: true,
  }).on('change', function (info) {
    console.log('sync complete');
  }).on('error', function (err) {
    console.log('sync error');
  });
};



function App() {
  const [ data, setData ] = useState({
    id: '',
    name: '',
    last_name: '',
    address: '',
    level: '',
    phone: '',
    email: '',
  }); 
  const [ datas, setDatas ] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    addData(data);
    setData({
      id: '',
      name: '',
      last_name: '',
      address: '',
      level: '',
      phone: '',
      email: '',
    });

  }
  const handleSync = (e) => {
    e.preventDefault();
    syncData();
  }
  const handleView = (e) => {
    e.preventDefault();
    getData(db).then((data) => {
      setDatas(data);
    });

  }
  return (
     <>
      <div className="darkBG" />
      <div className="modal">

        <div className="centered">
          <div className="modal">
            <div className="modalHeader">
              <img src={Logo} style={{width:'230px', height:'80px'}}></img>
            </div>
            <div className="modalContent">
              <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Cedula" value={data.id} onChange={(e) => setData({ ...data, id: e.target.value })} />
                <input type="text" placeholder="Nombre" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                <input type="text" placeholder="Apellido" value={data.last_name} onChange={(e) => setData({ ...data, last_name: e.target.value })} />
                <input type="text" placeholder="Dirección" value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} />
                <input type="number" placeholder="Nivel" value={data.level} onChange={(e) => setData({ ...data, level: e.target.value })} />
                <input type="text" placeholder="Teléfono" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
                <input type="text" placeholder="Correo" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                <button type="submit">Guardar</button>
                <button type="button" onClick={handleView}>Visualizar</button>
                <button type="button" onClick={handleSync}>Sincronizar</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="table">
      <table>
        <thead>
          <tr>
            <th>Cedula</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Dirección</th>
            <th>Nivel</th>
            <th>Teléfono</th>
            <th>Correo</th>
          </tr>
        </thead>
        <tbody>
          {datas.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.last_name}</td>
              <td>{item.address}</td>
              <td>{item.level}</td>
              <td>{item.phone}</td>
              <td>{item.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
     </>
  );
}

export default App;
