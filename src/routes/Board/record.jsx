import { useState } from "react";
import api from "../../ajax";
import { Message, Input } from '@arco-design/web-react';
const Record = ({ list, onSave }) => { 
  const [name, setName] = useState('');
  const save = async () => {
    if (!name) {
      Message.error({ content: 'Please enter name', duration: 2000 });
      return;
    }
    if (!list.length) {
      Message.error({ content: 'Please move the chess piece', duration: 2000 });
      return;
    }
    const result = await api.board.postBoard(name, list);
    if (result) {
      onSave(result, { name, value: list, id: result });
    }
  }
  return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{ display: 'flex', width: '100%', marginBottom: '30px' }}>
      <b style={{ lineHeight: '30px' }}>Name: </b>
      <Input placeholder='Please enter manual name' style={{ flex:1, margin: '0 20px', height: '30px', padding: '0 10px' }} value={name} onChange={(value) => setName(value)} />
    </div>
    <b>Manual</b>
    <div style={{ flex: 1, marginBottom: '10px', overflowY: 'auto', paddingRight: '20px' }}>
      {
        list.map((v,key) => {
          return <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', alignItems: 'center', borderBottom: '1px solid #eee' }}>
            <b style={{ flex:'1' }}>Step { key + 1}.</b>
            <div style={{ display: 'flex', gap: '5px' }}>
              <span>from: {v.from}</span>
              <span>to: {v.to}</span>
            </div>
          </div>
        })
      }
    </div>
    <button className="chess-btn" style={{ margin:'0 20px 0 0' }} onClick={save}>
      save
    </button>
  </div>
}
export default Record;