import { IconDelete } from '@arco-design/web-react/icon';
import { Button } from '@arco-design/web-react';
const Manuals = ({ manualId, onSelect, step, manualList, onDelete }) => { 
  return(
    manualList.length > 0 && <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '20px' }}>
        {
          manualList.map((v,key) => {
            return(
              <div key={key} style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', padding: '5px 0', borderBottom: '1px solid #eee' }}>
                <div style={{ flex: 1, display: 'flex', gap: '10px', alignItems: 'center' }} onClick={() => { onSelect(String(v.id)) }}>
                  {manualId === String(v.id) ? <svg width="8" height="8" fill="#007bff" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="4" cy="4" r="4"></circle></svg> : <div style={{ border: '1px solid black', width: '6px', height: '6px', borderRadius: '6px' }}><svg width="7" height="7" fill="rgb(255,255,255)" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="4" cy="4" r="4"></circle></svg></div>}
                  <span>{v.name}</span>
                </div>
                <Button type='text' size='small' status='danger' icon={<IconDelete />} onClick={()=> onDelete(String(v.id))} style={{ margin: '0' }}></Button>
              </div>
            )
          })
        }
        {manualList.find(v => String(v.id) === manualId)?.value &&
          <div style={{ marginTop: '30px' }}>
            <b>All Steps</b>
            {
              manualList.find(v => String(v.id) === manualId).value.map((v, k) =>
                <div key={k} style={{ display: 'flex', padding: '10px 0', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '10px' }}>
                    {step === k ? <svg width="8" height="8" fill="#007bff" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="4" cy="4" r="4"></circle></svg> : <div style={{ border: '1px solid black', width: '6px', height: '6px', borderRadius: '6px' }}><svg width="7" height="7" fill="rgb(255,255,255)" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="4" cy="4" r="4"></circle></svg></div>}
                    <b>Step {k + 1}.</b>
                  </div>
                  <span>from: {v.from} - to: {v.to}</span>
                </div>
              )
            }
          </div>
        }
      </div>
    </div>
  )
}
export default Manuals;