import { useState } from "react";
import { IconDelete } from '@arco-design/web-react/icon';
import { Button, Switch } from '@arco-design/web-react';
import { formatMoves } from './moveFormatter';
const Manuals = ({ manualId, onSelect, step, manualList, onDelete }) => {
  const [showNotation, setShowNotation] = useState(true); 
  return(
    manualList.length > 0 && <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '20px' }}>
        {
          manualList.map((v,key) => {
            return(
              <div key={key} style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', padding: '5px 0', borderBottom: '1px solid #eee' }}>
                <div style={{ flex: 1, display: 'flex', gap: '10px', alignItems: 'center' }} onClick={() => { onSelect(String(v.id)) }}>
                  {manualId === String(v.id) ? <svg width="8" height="8" fill="#007bff" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="4" cy="4" r="4"></circle></svg> : <div style={{ border: '1px solid black', width: '6px', height: '6px', borderRadius: '6px' }}><svg width="7" height="7" fill="rgb(255,255,255)" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="4" cy="4" r="4"></circle></svg></div>}
                  <span style={{ fontSize: '14px' }}>{v.name}</span>
                </div>
                <Button type='text' size='small' status='danger' icon={<IconDelete />} onClick={()=> onDelete(String(v.id))} style={{ margin: '0' }}></Button>
              </div>
            )
          })
        }
        {(() => {
          const selectedManual = manualList.find(v => String(v.id) === manualId);
          if (!selectedManual?.value) return null;
          
          const formattedMoves = formatMoves(selectedManual.value);
          // Calculate which formatted move corresponds to the current step
          const currentFormattedMoveIndex = Math.floor(step / 2);
          
          return (
            <div style={{ marginTop: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <b style={{ fontSize: '16px' }}>{selectedManual.name || 'Game'}</b>
                <Switch 
                  checked={showNotation} 
                  onChange={setShowNotation}
                  size="small"
                  checkedText="Notation"
                  uncheckedText="Notation"
                />
              </div>
              {showNotation && (
                <>
                  {
                    formattedMoves.length > 0 ? (
                      formattedMoves.map((move, k) => {
                        // Highlight if this formatted move contains the current step
                        const isActive = k === currentFormattedMoveIndex;
                        return (
                          <div key={k} style={{ display: 'flex', padding: '10px 0', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '10px' }}>
                              {isActive ? <svg width="8" height="8" fill="#007bff" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="4" cy="4" r="4"></circle></svg> : <div style={{ border: '1px solid black', width: '6px', height: '6px', borderRadius: '6px' }}><svg width="7" height="7" fill="rgb(255,255,255)" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="4" cy="4" r="4"></circle></svg></div>}
                              <span style={{ 
                                fontFamily: '"Georgia", "Times New Roman", serif', 
                                fontSize: '15px', 
                                lineHeight: '1.6',
                                letterSpacing: '0.3px',
                                color: '#333',
                                fontWeight: '400'
                              }}>{move.full}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ padding: '10px 0', color: '#999' }}>No moves recorded</div>
                    )
                  }
                </>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  )
}
export default Manuals;